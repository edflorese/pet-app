import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function Header() {
  const { user } = useUser();
  const router = useRouter();

  
  const handleProfileManagement = () => {
    router.push("/profile");
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
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
      <Pressable onPress={handleProfileManagement}>
        <Image
          source={{ uri: user?.imageUrl }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 99,
          }}
        />
      </Pressable>
    </View>
  );
}
