import {
  View,
  Text,
  Image,
  StyleSheet,
  Touchable,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import { PetListItemProps} from "@/models/Pets";



export default function PetListItem({ pet }: PetListItemProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "../pet-details",
          params: { pet: JSON.stringify(pet) } 
        })
      }
      style={styles.container}
    >
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
    </TouchableOpacity>
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
