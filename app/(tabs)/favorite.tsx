import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useUser } from "@clerk/clerk-expo";
import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import Shared from "@/Shared/Shared";
import PetListItem from "@/components/Home/PetListItem";
import { PetItem } from "@/models/Pets";
import Colors from "@/constants/Colors";

export default function Favorite() {
  const { user } = useUser();
  const [favPetList, setFavPetList] = useState<PetItem[]>([]);
  const [loader, setLoader] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (user) fetchFavorites();
    }, [user])
  );

  const fetchFavorites = async () => {
    setLoader(true);
    try {
      const result = await Shared.GetFavList(user);
      const favorites = result?.favorites || [];
      favorites.length ? await fetchPets(favorites) : clearFavorites();
    } catch (error) {
      console.error("Error fetching favorites:", error);
      clearFavorites();
    }
    setLoader(false);
  };

  const fetchPets = async (favIds: string[]) => {
    if (!favIds?.length) return clearFavorites();

    try {
      const q = query(
        collection(db, "Pets"),
        where(documentId(), "in", favIds)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const pets = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as PetItem[];
        setFavPetList(pets);
        setIsEmpty(false);
      } else {
        clearFavorites();
      }
    } catch (error) {
      console.error("Error fetching pets:", error);
      clearFavorites();
    }
  };

  const clearFavorites = () => {
    setFavPetList([]);
    setIsEmpty(true);
  };

  const handleFavoriteChange = async (petId: string, isFavorite: boolean) => {
    if (!isFavorite) {
      setFavPetList((current) => current.filter((pet) => pet.id !== petId));
      if (favPetList.length <= 1) setIsEmpty(true);
    } else {
      try {
        const petQuery = await getDocs(
          query(collection(db, "Pets"), where(documentId(), "==", petId))
        );
        if (!petQuery.empty) {
          const petData = petQuery.docs[0].data() as PetItem;
          setFavPetList((current) => [...current, { ...petData, id: petId }]);
          setIsEmpty(false);
        }
      } catch (error) {
        console.error("Error fetching pet:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites</Text>
      {loader && (
        <ActivityIndicator
          size="large"
          color={Colors.PRIMARY}
          style={styles.loader}
        />
      )}
      {!loader && isEmpty && (
        <Text style={styles.emptyMessage}>
          No favorites found. Add some pets to your favorites!
        </Text>
      )}
      {!isEmpty && (
        <FlatList
          data={favPetList}
          keyExtractor={(item) => item.id}
          numColumns={2}
          onRefresh={fetchFavorites}
          refreshing={loader}
          renderItem={({ item }) => (
            <PetListItem pet={item} onFavoriteChange={handleFavoriteChange} />
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 20,
  },
  title: {
    fontFamily: "outfit-medium",
    fontSize: 30,
  },
  loader: {
    marginTop: 20,
  },
  emptyMessage: {
    fontFamily: "outfit",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  listContainer: {
    gap: 15,
    paddingVertical: 10,
  },
});
