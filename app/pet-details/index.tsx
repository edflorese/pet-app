import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import PetInfo from "@/components/PetDetails/PetInfo";
import { PetItem } from "@/models/Pets";
import PetSubInfo from "@/components/PetDetails/PetSubInfo";
import AboutPet from "@/components/PetDetails/AboutPet";
import OwnerInfo from "@/components/PetDetails/OwnerInfo";
import Colors from "@/constants/Colors";

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
      <ScrollView>
        <PetInfo pet={pet} />

        <PetSubInfo pet={pet} />

        <AboutPet pet={pet} />

        <OwnerInfo pet={pet} />

        <View
          style={{
            height: 70,
          }}
        ></View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.adoptBtn}>
          <Text
            style={{
              textAlign: "center",
              fontFamily: "outfit-medium",
              fontSize: 20,
            }}
          >
            Adopt Me
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  adoptBtn: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
  },
  buttonContainer: {
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
});
