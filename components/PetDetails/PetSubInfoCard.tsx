import { View, Text, Image } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { PetSubInfoCardProps } from "@/models/Pets";

export default function PetSubInfoCard({
  icon,
  title,
  value,
}: PetSubInfoCardProps) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.WHITE,
        padding: 10,
        margin: 5,
        borderRadius: 8,
        gap: 10,
        flex: 1,
      }}
    >
      <Image
        source={icon}
        style={{
          width: 40,
          height: 40,
        }}
      />
      <View
        style={{
          flex: 1,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 16,
            color: Colors.GRAY,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontFamily: "outfit-medium",
            fontSize: 16,
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}
