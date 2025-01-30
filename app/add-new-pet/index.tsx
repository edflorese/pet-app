import { View, Text, Image, TextInput, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
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
  const handleInputChange = (filedName: string, filedValue: string) => {
    console.log(filedName, filedValue)
  }
  return (
    <ScrollView
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
      />
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pet name *</Text>
        <TextInput style={styles.input} onChangeText={(value) => handleInputChange('name', value)} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Breed *</Text>
        <TextInput style={styles.input} onChangeText={(value) => handleInputChange('breed', value)} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Age *</Text>
        <TextInput style={styles.input} onChangeText={(value) => handleInputChange('age', value)} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Weight *</Text>
        <TextInput style={styles.input} onChangeText={(value) => handleInputChange('weight', value)} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Address *</Text>
        <TextInput style={styles.input} onChangeText={(value) => handleInputChange('address', value)} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>About *</Text>
        <TextInput style={styles.input} numberOfLines={5} multiline={true} onChangeText={(value) => handleInputChange('about', value)} />
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={{ fontFamily: 'outfit-medium', textAlign: 'center' }}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
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
  button: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 7,
    marginVertical:10
  }
});
