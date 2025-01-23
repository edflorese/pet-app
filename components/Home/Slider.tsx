import { View, FlatList, Image, StyleSheet, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
interface SliderItem {
  imageurl: string;
}

export default function Slider() {
  const [sliderList, setSliderList] = useState<SliderItem[]>([]);

  useEffect(() => {
    GetSliders();
  }, []);

  const GetSliders = async () => {
    setSliderList([]);
    try {
      const snapshot = await getDocs(collection(db, "Sliders"));
      const items: SliderItem[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as SliderItem;
        items.push(data);
      });
      setSliderList(items);
    } catch (error) {
      console.error("Error fetching sliders:", error);
    }
  };

  return (
    <View style={{ marginTop: 15 }}>
      <FlatList
        data={sliderList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            <Image
              source={{ uri: item.imageurl }}
              style={styles.sliderImage}
              resizeMode="cover"
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sliderImage: {
    width: Dimensions.get("screen").width * 0.9,
    height: 170,
    marginRight: 15,
  },
});
