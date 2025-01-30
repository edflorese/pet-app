import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import Colors from "@/constants/Colors";
import { Picker } from "@react-native-picker/picker";
import { PetFormData, Category } from "@/models/Pets";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";

export default function PetForm() {
  const navigation = useNavigation();
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<PetFormData>({
    name: "",
    breed: "",
    age: "",
    sex: "Male",
    weight: "",
    address: "",
    about: "",
    category: "",
  });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Add New Pet",
    });
    getCategories();
  }, []);

  const getCategories = async () => {
    setIsLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "Category"));
      const categories: Category[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Category;
        categories.push({ ...data, id: doc.id });
      });
      setCategoryList(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      Alert.alert("Error", "Failed to load categories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    fieldName: keyof PetFormData,
    fieldValue: string
  ) => {
    setFormData((prev: PetFormData) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const handleSubmit = async () => {
    const requiredFields: (keyof PetFormData)[] = [
      "name",
      "breed",
      "age",
      "sex",
      "weight",
      "address",
      "about",
      "category",
    ];

    const emptyFields = requiredFields.filter((field) => !formData[field]);

    if (emptyFields.length > 0) {
      Alert.alert(
        "Error",
        `Please fill in all required fields: ${emptyFields.join(", ")}`
      );
      return;
    }

    setIsSaving(true);
    try {
      // Aquí iría la lógica para guardar en Firebase
      console.log("Form Data:", formData);
      Alert.alert("Success", "Pet information saved successfully!");
      // Opcional: Limpiar el formulario o navegar a otra pantalla
    } catch (error) {
      console.error("Error saving pet:", error);
      Alert.alert("Error", "Failed to save pet information. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

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
        <Text style={styles.label}>Category *</Text>
        <Picker
          selectedValue={formData.category}
          style={styles.input}
          onValueChange={(itemValue) =>
            handleInputChange("category", itemValue)
          }
        >
          <Picker.Item label="Select a category" value="" />
          {categoryList.map((category, index) => (
            <Picker.Item
              key={index}
              label={category.name}
              value={category.name}
            />
          ))}
        </Picker>
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

      <TouchableOpacity
        style={[styles.button, isSaving && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color={Colors.WHITE} />
        ) : (
          <Text style={styles.buttonText}>Submit</Text>
        )}
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
    marginBottom: 50,
  },
  buttonText: {
    fontFamily: "outfit-medium",
    textAlign: "center",
    color: Colors.WHITE,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontFamily: "outfit",
    color: Colors.PRIMARY,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
