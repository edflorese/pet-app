import { View } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import PetInfo from "@/components/PetDetails/PetInfo";
import { PetItem } from "@/models/Pets"; 
import PetSubInfo from "@/components/PetDetails/PetSubInfo";

export default function PetDetails() {
  const params = useLocalSearchParams();
  const pet: PetItem = JSON.parse(params.pet as string);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
    });
  }, []);

  return (
    <View>

      <PetInfo pet={pet} />

      <PetSubInfo pet={pet} />

    </View>
  );
}
