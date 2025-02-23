import { View, Image, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "@/constants/Colors";
import { PetItem } from "@/models/Pets";
import MarkFav from "../MarkFav";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/FirebaseConfig";

interface PetInfoProps {
  pet: PetItem;
}

export default function PetInfo({ pet }: PetInfoProps) {
  const [imageUrl, setImageUrl] = useState<string>(pet.imageUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    refreshImageUrl();
  }, [pet.imageUrl]);

  const refreshImageUrl = async () => {
    try {
      
      const pathStartIndex = pet.imageUrl.indexOf("/o/PetAdopt/");
      if (pathStartIndex === -1) throw new Error("Invalid image path");

      const pathEndIndex = pet.imageUrl.indexOf("?");
      const filePath = pet.imageUrl.substring(pathStartIndex + 3, pathEndIndex);
      const decodedPath = decodeURIComponent(filePath);

     
      const imageRef = ref(storage, decodedPath);
      const freshUrl = await getDownloadURL(imageRef);
      setImageUrl(freshUrl);
      setError(false);
    } catch (err) {
      console.error("Error refreshing image URL:", err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {!error ? (
          <Image
            source={{
              uri: imageUrl,
              cache: "reload",
            }}
            style={styles.image}
            onError={() => setError(true)}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.errorContainer]}>
            <Text style={styles.errorText}>Unable to load image</Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View>
          <Text style={styles.name}>{pet.name}</Text>
          <Text style={styles.address}>{pet.address}</Text>
        </View>
        <MarkFav pet={pet} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  imageContainer: {
    width: "100%",
    height: 400,
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.LIGHT_PRIMARY,
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.LIGHT_PRIMARY,
  },
  errorText: {
    color: Colors.GRAY,
    fontFamily: "outfit-medium",
    fontSize: 16,
  },
  infoContainer: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  name: {
    fontFamily: "outfit-bold",
    fontSize: 27,
  },
  address: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.GRAY,
  },
});
