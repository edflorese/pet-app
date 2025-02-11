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
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";
import Colors from "@/constants/Colors";
import { Picker } from "@react-native-picker/picker";
import { PetFormData, Category } from "@/models/Pets";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/config/FirebaseConfig";
import FormSkeleton from "@/components/FormSkeleton";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import * as Crypto from "expo-crypto";

export default function PetForm() {
  const [image, setImage] = useState<string | undefined>(undefined);
  const navigation = useNavigation();
  const { userId } = useAuth();
  const { user } = useUser();
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

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

  const generateUUID = async () => {
    const randomBytes = await Crypto.getRandomBytesAsync(16);
    return [...randomBytes]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const handleInputChange = (
    fieldName: keyof PetFormData,
    fieldValue: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
    navigation.setOptions({ headerTitle: "Add New Pet" });
    getCategories();
  }, []);

  const getCategories = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const snapshot = await getDocs(collection(db, "Category"));
      const categories: Category[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Category;
        categories.push({ ...data, id: doc.id });
      });

      if (categories.length === 0) {
        setError("No categories found. Please try again later.");
        return;
      }

      setCategoryList(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError(
        "Failed to load categories. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const takePhoto = async () => {
    if (hasPermission === null || hasPermission === false) {
      Alert.alert("Camera access is required to take pictures.");
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  

  const uploadImage = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const imageRef = ref(storage, `/PetAdopt/${await generateUUID()}`);
      await uploadBytes(imageRef, blob);
      return await getDownloadURL(imageRef);
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!userId || !user) {
      Alert.alert("Error", "You must be logged in to add a pet");
      return;
    }

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

    if (!image) {
      Alert.alert("Error", "Please select an image for your pet");
      return;
    }

    setIsSaving(true);
    try {
      const imageUrl = await uploadImage(image);
      await addDoc(collection(db, "Pets"), {
        about: formData.about,
        address: formData.address,
        age: formData.age,
        breed: formData.breed,
        category: formData.category,
        imageUrl,
        name: formData.name,
        sex: formData.sex,
        weight: formData.weight,
        user: {
          email: user.primaryEmailAddress?.emailAddress || "",
          imageUrl: user.imageUrl,
          name: `${user.firstName} ${user.lastName}`.trim(),
        },
      });

      Alert.alert("Success", "Pet information saved successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving pet:", error);
      Alert.alert("Error", "Failed to save pet information. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <FormSkeleton />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={getCategories}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Pet for Adoption</Text>

      <Pressable onPress={takePhoto}>
        {!image ? (
          <Image
            source={require("./../../assets/images/huella.png")}
            style={styles.image}
          />
        ) : (
          <Image source={{ uri: image }} style={styles.image} />
        )}
      </Pressable>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pet name *</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(value) => handleInputChange("name", value)}
          placeholder="Enter pet name"
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
          placeholder="Enter breed"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Age *</Text>
        <TextInput
          style={styles.input}
          value={formData.age}
          onChangeText={(value) => handleInputChange("age", value)}
          keyboardType="numeric"
          placeholder="Enter age"
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
          placeholder="Enter weight"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Address *</Text>
        <TextInput
          style={styles.input}
          value={formData.address}
          onChangeText={(value) => handleInputChange("address", value)}
          placeholder="Enter address"
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
          placeholder="Tell us about your pet"
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.PRIMARY,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 7,
  },
  retryButtonText: {
    fontFamily: "outfit-medium",
    color: Colors.WHITE,
  },
});
