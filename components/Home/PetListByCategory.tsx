import { View, FlatList } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import Category from "./Category";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import PetListItem from "./PetListItem";
import { PetItem } from "@/models/Pets";
import { useFocusEffect } from "@react-navigation/native";

export default function PetListByCategory() {
  const [petList, setPetList] = useState<PetItem[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("Dogs");

  useFocusEffect(
    useCallback(() => {
      GetPetList(selectedCategory);
    }, [selectedCategory])
  );

  const GetPetList = async (category: string) => {
    try {
      setLoader(true);
      setPetList([]);
      const q = query(
        collection(db, "Pets"),
        where("category", "==", category)
      );
      const querySnapshot = await getDocs(q);

      const pets: PetItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as PetItem;
        pets.push({ ...data, id: doc.id });
      });

      setPetList(pets);
    } catch (error) {
      console.error("Error fetching pet list:", error);
    } finally {
      setLoader(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <View>
      <Category
        category={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      <FlatList
        data={petList}
        style={{ marginTop: 10 }}
        horizontal={true}
        keyExtractor={(item) => item.id}
        refreshing={loader}
        onRefresh={() => GetPetList(selectedCategory)}
        renderItem={({ item }) => <PetListItem pet={item} />}
      />
    </View>
  );
}
