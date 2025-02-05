import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, router } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import PetInfo from "@/components/PetDetails/PetInfo";
import PetSubInfo from "@/components/PetDetails/PetSubInfo";
import AboutPet from "@/components/PetDetails/AboutPet";
import OwnerInfo from "@/components/PetDetails/OwnerInfo";
import Colors from "@/constants/Colors";
import { PetItem } from "@/models/Pets";
import { ChatDocument, ChatUser } from "@/models/Chats";


export default function PetDetails() {
  const params = useLocalSearchParams();
  const pet: PetItem = JSON.parse(params.pet as string);
  const navigation = useNavigation();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
    });
  }, []);

  const createChatDocument = async (docId: string, userData: ChatUser, petOwnerData: ChatUser): Promise<void> => {
    try {
      const chatDoc: ChatDocument = {
        id: docId,
        users: [userData, petOwnerData],
        userIds: [userData.email, petOwnerData.email],
      };
      await setDoc(doc(db, "Chat", docId), chatDoc);
    } catch (error) {
      console.error("Error creating chat document:", error);
      throw error;
    }
  };

  const handleExistingChat = (querySnapshot: QuerySnapshot<DocumentData>): void => {
    querySnapshot.forEach((doc) => {
      router.push({
        pathname: "../chat",
        params: { id: doc.id },
      });
    });
  };

  const InitiateChat = async (): Promise<void> => {
    if (!user?.primaryEmailAddress?.emailAddress || !pet?.user?.email) {
      console.error("Missing required user information");
      return;
    }

    setIsLoading(true);
    try {
      const userEmail = user.primaryEmailAddress.emailAddress;
      const petOwnerEmail = pet.user.email;
      const docId1 = `${userEmail}_${petOwnerEmail}`;
      const docId2 = `${petOwnerEmail}_${userEmail}`;

      const chatQuery = query(
        collection(db, "Chat"),
        where("id", "in", [docId1, docId2])
      );
      
      const querySnapshot = await getDocs(chatQuery);

      if (!querySnapshot.empty) {
        handleExistingChat(querySnapshot);
        return;
      }

      const userData: ChatUser = {
        email: userEmail,
        imageUrl: user.imageUrl || "",
        name: user.fullName || "",
      };

      const petOwnerData: ChatUser = {
        email: petOwnerEmail,
        imageUrl: pet.user.imageUrl,
        name: pet.user.name,
      };

      await createChatDocument(docId1, userData, petOwnerData);

      router.push({
        pathname: "../chat",
        params: { id: docId1 },
      });
    } catch (error) {
      console.error("Error in InitiateChat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <PetInfo pet={pet} />
        <PetSubInfo pet={pet} />
        <AboutPet pet={pet} />
        <OwnerInfo pet={pet} />
        <View style={{ height: 70 }} />
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          onPress={InitiateChat} 
          style={[styles.adoptBtn, isLoading && styles.adoptBtnDisabled]}
          disabled={isLoading}
        >
          <Text style={styles.adoptText}>
            {isLoading ? "Processing..." : "Adopt Me"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  adoptBtn: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
  },
  adoptBtnDisabled: {
    opacity: 0.7,
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