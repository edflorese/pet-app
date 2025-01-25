import { View, Image, Text, StyleSheet } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { PetListItemProps } from "@/models/Pets";
import Ionicons from "@expo/vector-icons/Ionicons";


export default function PetInfo({ pet }: PetListItemProps) {
  if (!pet) {
    return <Text>No pet data available</Text>;
  }

  return (
    <View>
      <Image source={{ uri: pet.imageUrl }} style={styles.image} />
      <View
        style={{
          padding: 20,
          display:'flex',
          flexDirection:'row',
          justifyContent:'space-between'
        }}
      >
        <View>
          <Text
            style={{
              fontFamily: "outfit-bold",
              fontSize: 27,
            }}
          >
            {pet?.name}
          </Text>
          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 16,
              color: Colors.GRAY,
            }}
          >
            {pet?.address}
          </Text>
        </View>
        <Ionicons name="heart-outline" size={30} color="black" />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 400,
    objectFit: "cover",
  },
});
