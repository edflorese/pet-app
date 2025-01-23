import { View, Text, Image } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";

export default function Header() {
  const { user } = useUser();
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View>
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 18,
          }}
        >
          Welcome,
        </Text>
        <Text
          style={{
            fontFamily: "outfit-medium",
            fontSize: 25,
          }}
        >
          {user?.fullName}
        </Text>
      </View>
      <Image
        source={{ uri: user?.imageUrl }}
        style={{
          width: 40,
          height: 40,
          borderRadius: 99,
        }}
      />
    </View>
  );
}
