import { View } from "react-native";
import React from "react";
import { PetListItemProps } from "@/models/Pets";
import PetSubInfoCard from "./PetSubInfoCard";

export default function PetSubInfo({ pet }: PetListItemProps) {
  return (
    <View
      style={{
        paddingHorizontal: 20,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <PetSubInfoCard
          icon={require("@/assets/images/calendar.png")}
          title={"Age"}
          value={pet?.age+" Years"}
        />

        <PetSubInfoCard
          icon={require("@/assets/images/bone.png")}
          title={"Breed"}
          value={pet?.breed}
        />
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <PetSubInfoCard
          icon={require("@/assets/images/sex.png")}
          title={"Sex"}
          value={pet?.sex}
        />

        <PetSubInfoCard
          icon={require("@/assets/images/weight.png")}
          title={"Weight"}
          value={pet?.weight+"Kg"}
        />
      </View>
    </View>
  );
}
