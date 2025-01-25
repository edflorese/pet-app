import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { PetListItemProps } from "@/models/Pets";
import { CollectionReference } from "firebase/firestore";
import Colors from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function OwnerInfo({ pet }: PetListItemProps) {
  return (
    <View style={styles.container}>
        <View style={{
            display:"flex",
            flexDirection:"row",
            gap:20
        }}>
      <Image
        source={{ uri: pet?.user.imageUrl }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 99,
        }}
      />
      <View>
        <Text
          style={{
            fontFamily: "outfit-medium",
            fontSize: 17,
          }}
        >
          {pet?.user.name}
        </Text>
        <Text
          style={{
            fontFamily: "outfit",
            color: Colors.GRAY,
          }}
        >
          Pet Owner
        </Text>
      </View>
      </View>
      <Ionicons name="send-sharp" size={24} color={Colors.PRIMARY} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    paddingHorizontal: 20,
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    backgroundColor: Colors.WHITE,
    borderBlockColor:Colors.PRIMARY,
    alignItems:'center',
    justifyContent: 'space-between'
  },
});
