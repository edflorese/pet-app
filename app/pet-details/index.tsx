import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, useNavigation, router } from "expo-router";
import PetInfo from "@/components/PetDetails/PetInfo";
import { PetItem } from "@/models/Pets";
import PetSubInfo from "@/components/PetDetails/PetSubInfo";
import AboutPet from "@/components/PetDetails/AboutPet";
import OwnerInfo from "@/components/PetDetails/OwnerInfo";
import Colors from "@/constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";

export default function PetDetails() {
  const params = useLocalSearchParams();
  const pet: PetItem = JSON.parse(params.pet as string);
  const navigation = useNavigation();
  const { user } = useUser();

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
    });
  }, []);

  /*
  Used to initiate the chat between two users
  */ const InitiateChat = async () => {
    if (!user || !pet?.user?.email) {
      console.error("User or Pet owner is missing");
      return;
    }

    const userEmail = user?.primaryEmailAddress?.emailAddress;
    const petOwnerEmail = pet?.user?.email;

    if (!userEmail || !petOwnerEmail) {
      console.error("Email information is missing.");
      return;
    }

    const docId1 = `${userEmail}_${petOwnerEmail}`;
    const docId2 = `${petOwnerEmail}_${userEmail}`;

    try {
      const q = query(
        collection(db, "Chat"),
        where("id", "in", [docId1, docId2])
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          // console.log(doc.data());
          router.push({
            pathname: "../chat",
            params: { id: doc.id },
          });
        });
        return;
      }

      await setDoc(doc(db, "Chat", docId1), {
        id: docId1,
        users: [
          {
            email: userEmail,
            imageUrl: user?.imageUrl,
            name: user?.fullName,
          },
          {
            email: petOwnerEmail,
            imageUrl: pet?.user?.imageUrl,
            name: pet?.user?.name,
          },
        ],
      });

      router.push({
        pathname: "../chat",
        params: { id: docId1 },
      });
    } catch (error) {
      console.error("Error initiating chat:", error);
    }
  };

  return (
    <View>
      <ScrollView>
        <PetInfo pet={pet} />
        <PetSubInfo pet={pet} />
        <AboutPet pet={pet} />
        <OwnerInfo pet={pet} />
        <View style={{ height: 70 }}></View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={InitiateChat} style={styles.adoptBtn}>
          <Text style={styles.adoptText}>Adopt Me</Text>
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
  adoptText: {
    textAlign: "center",
    fontFamily: "outfit-medium",
    fontSize: 20,
  },
});
