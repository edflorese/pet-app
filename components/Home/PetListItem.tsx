import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";

interface PetItem {
  imageUrl: string;
  name: string;
  breed: string;
  age: number;
}

interface PetListItemProps {
  pet: PetItem;
}

export default function PetListItem({ pet }: PetListItemProps) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: pet.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.name}>{pet.name}</Text>
      <View style={styles.detailContainer}>
        <Text style={styles.breed}>{pet.breed}</Text>
        <Text style={styles.age}>{pet.age} years</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginRight: 15,
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
  },
  image: {
    width: 150,
    height: 135,
    borderRadius: 10,
  },
  name: {
    fontFamily: "outfit-medium",
    fontSize: 17,
  },
  detailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  breed: {
    color: Colors.GRAY,
    fontFamily: "outfit",
  },
  age: {
    fontFamily: "outfit",
    color: Colors.PRIMARY,
    paddingHorizontal: 7,
    borderRadius: 10,
    fontSize: 11,
    backgroundColor: Colors.LIGHT_PRIMARY,
  },
});
