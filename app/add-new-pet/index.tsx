import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import Colors from "@/constants/Colors";
import { Picker } from "@react-native-picker/picker";
import { PetFormData } from "@/models/Pets";

export default function PetForm() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState<PetFormData>({
    name: "",
    breed: "",
    age: "",
    sex: "Male",
    weight: "",
    address: "",
    about: "",
  });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Add New Pet",
    });
  }, []);

  const handleInputChange = (
    fieldName: keyof PetFormData,
    fieldValue: string
  ) => {
    setFormData((prev: PetFormData) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const handleSubmit = () => {
    // Validación básica
    const requiredFields: (keyof PetFormData)[] = [
      "name",
      "breed",
      "age",
      "sex",
      "weight",
      "address",
      "about",
    ];
    const emptyFields = requiredFields.filter((field) => !formData[field]);

    if (emptyFields.length > 0) {
      Alert.alert(
        "Error",
        `Please fill in all required fields: ${emptyFields.join(", ")}`
      );
      return;
    }

    // Aquí puedes agregar la lógica para enviar los datos
    console.log("Form Data:", formData);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Pet for Adoption</Text>

      <Image
        source={require("./../../assets/images/huella.png")}
        style={styles.image}
      />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pet name *</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(value) => handleInputChange("name", value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Breed *</Text>
        <TextInput
          style={styles.input}
          value={formData.breed}
          onChangeText={(value) => handleInputChange("breed", value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Age *</Text>
        <TextInput
          style={styles.input}
          value={formData.age}
          onChangeText={(value) => handleInputChange("age", value)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Gender *</Text>
        <Picker
          selectedValue={formData.sex}
          style={styles.input}
          onValueChange={(itemValue) => handleInputChange("sex", itemValue)}
        >
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Weight *</Text>
        <TextInput
          style={styles.input}
          value={formData.weight}
          onChangeText={(value) => handleInputChange("weight", value)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Address *</Text>
        <TextInput
          style={styles.input}
          value={formData.address}
          onChangeText={(value) => handleInputChange("address", value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>About *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.about}
          numberOfLines={5}
          multiline={true}
          onChangeText={(value) => handleInputChange("about", value)}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontFamily: "outfit-medium",
    fontSize: 20,
    marginBottom: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    marginBottom: 20,
  },
  inputContainer: {
    marginVertical: 5,
  },
  input: {
    padding: 10,
    backgroundColor: Colors.WHITE,
    borderRadius: 7,
    fontFamily: "outfit",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  label: {
    marginVertical: 5,
    fontFamily: "outfit",
  },
  button: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 7,
    marginVertical: 10,
  },
  buttonText: {
    fontFamily: "outfit-medium",
    textAlign: "center",
    color: Colors.WHITE,
  },
});
