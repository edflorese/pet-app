import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { PetListItemProps } from "@/models/Pets";
import Colors from "@/constants/Colors";

export default function AboutPet({ pet }: PetListItemProps) {
  const [readMore, setReadMore] = useState(true);

  if (!pet) return null;

  return (
    <View style={{ padding: 20 }}>
      <Text
        style={{
          fontFamily: "outfit-medium",
          fontSize: 20,
        }}
      >
        About {pet?.name}
      </Text>
      <Text
        numberOfLines={readMore ? 3 : undefined}
        style={{
          fontFamily: "outfit",
          fontSize: 14,
        }}
      >
        {pet?.about}
      </Text>
      {pet?.about?.length > 100 && readMore && (
        <Pressable onPress={() => setReadMore(false)}>
          <Text
            style={{
              fontFamily: "outfit-medium",
              fontSize: 14,
              color: Colors.SECONDARY,
            }}
          >
            Read More
          </Text>
        </Pressable>
      )}
    </View>
  );
}
