import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useUser } from "@clerk/clerk-expo";
import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import Shared from "@/Shared/Shared";
import PetListItem from "@/components/Home/PetListItem";

export default function Favorite() {
  const { user } = useUser();
  const [favIds, setFavIds] = useState<string[]>([]);
  const [favPetList, setFavPetList] = useState<any[]>([]);
  const [loader, setLoader] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  // Force load favorites
  useFocusEffect(
    useCallback(() => {
      if (user) fetchFavorites();
    }, [user])
  );

  // Get Id of favorites
  const fetchFavorites = async () => {
    setLoader(true);
    try {
      const result = await Shared.GetFavList(user);
      const favorites = result?.favorites || [];
      setFavIds(favorites);
      favorites.length ? fetchPets(favorites) : clearFavorites();
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
    setLoader(false);
  };

  // Get detail of pets
  const fetchPets = async (favIds_: string[]) => {
    if (!favIds_?.length) return clearFavorites();

    try {
      const q = query(
        collection(db, "Pets"),
        where(documentId(), "in", favIds_)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const pets = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setFavPetList(pets);
        setIsEmpty(false);
      } else {
        clearFavorites();
      }
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  const clearFavorites = () => {
    setFavPetList([]);
    setIsEmpty(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites</Text>
      {loader && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      )}
      {!loader && isEmpty && (
        <Text style={styles.emptyMessage}>
          No favorites found. Add some pets to your favorites!
        </Text>
      )}
      {!isEmpty && (
        <FlatList
          data={favPetList}
          keyExtractor={(item) => item.id}
          numColumns={2}
          onRefresh={fetchFavorites}
          refreshing={loader}
          renderItem={({ item }) => <PetListItem pet={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 20,
  },
  title: {
    fontFamily: "outfit-medium",
    fontSize: 30,
  },
  loader: {
    marginTop: 20,
  },
  emptyMessage: {
    fontFamily: "outfit",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});
