import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import Colors from "@/constants/Colors";

interface CategoryItem {
  name: string;
  imageUrl: string;
}

interface CategoryProps {
  category: string;
  onCategoryChange: (category: string) => void;
}

export default function Category({
  category,
  onCategoryChange,
}: CategoryProps) {
  const [categoryList, setCategoryList] = useState<CategoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(category);

  useEffect(() => {
    GetCategories();
  }, []);

  const GetCategories = async () => {
    try {
      setCategoryList([]);
      const snapshot = await getDocs(collection(db, "Category"));
      const categories: CategoryItem[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data() as CategoryItem;
        categories.push(data);
      });

      setCategoryList(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategorySelect = (selectedCat: string) => {
    setSelectedCategory(selectedCat);
    onCategoryChange(selectedCat);
  };

  return (
    <View style={{ marginTop: 20 }}>
      <Text
        style={{
          fontFamily: "outfit-medium",
          fontSize: 20,
        }}
      >
        Category
      </Text>
      <FlatList
        data={categoryList}
        numColumns={4}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleCategorySelect(item.name)}
            style={{ flex: 1 }}
          >
            <View
              style={[
                styles.container,
                selectedCategory === item.name &&
                  styles.selectedCategotyContainer,
              ]}
            >
              <Image
                source={{ uri: item.imageUrl }}
                style={{
                  width: 40,
                  height: 40,
                }}
                resizeMode="contain"
              />
            </View>
            <Text
              style={{
                textAlign: "center",
                fontFamily: "outfit",
              }}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.LIGHT_PRIMARY,
    padding: 15,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 15,
    borderColor: Colors.PRIMARY,
    margin: 5,
  },
  selectedCategotyContainer: {
    backgroundColor: Colors.SECONDARY,
    borderColor: Colors.SECONDARY,
  },
});
