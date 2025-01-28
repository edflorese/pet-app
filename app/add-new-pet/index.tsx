import { View, Text, Image, TextInput, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "expo-router";
import Colors from "@/constants/Colors";

export default function index() {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Add New Pet",
    });
  }, []);
  const handleInputChange=(filedName:string, filedValue:string)=>{
    console.log(filedName, filedValue)
  }
  return (
    <View
      style={{
        padding: 20,
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-medium",
          fontSize: 20,
        }}
      >
        Add New Pet for Adoption
      </Text>
      <Image
        source={require("./../../assets/images/huella.png")}
        style={{
          width: 100,
          height: 100,
          borderRadius: 15,
          borderWidth: 1,
          borderColor: Colors.GRAY,
        }}
      ></Image>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pet name *</Text>
        <TextInput style={styles.input} onChangeText={(value)=>handleInputChange('name', value)}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 5,
  },
  input: {
    padding: 10,
    backgroundColor: Colors.WHITE,
    borderRadius: 7,
  },
  label: {
    marginVertical: 5,
    fontFamily: "outfit",
  },
});
