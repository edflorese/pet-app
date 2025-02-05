import { View, FlatList, Image, StyleSheet, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";

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
      const response = await fetch("http://192.168.1.171:3000/api/sliders");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: SliderItem[] = await response.json();
      setSliderList(data);
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
