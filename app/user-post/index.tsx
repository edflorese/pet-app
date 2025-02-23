import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import {
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
  doc,
} from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import PetListItem from "@/components/Home/PetListItem";
import Colors from "@/constants/Colors";
import { PetItem } from "@/models/Pets";

export default function UserPost() {
  const navigation = useNavigation();
  const { user } = useUser();
  const [loader, setLoader] = useState(false);
  const [userPostList, setUserPostList] = useState<PetItem[]>([]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "User Post",
    });
    if (user?.primaryEmailAddress?.emailAddress) {
      getUserPosts();
    }
  }, [user]);

  const getUserPosts = async () => {
    try {
      setLoader(true);
      setUserPostList([]);
      const q = query(
        collection(db, "Pets"),
        where("user.email", "==", user?.primaryEmailAddress?.emailAddress)
      );
      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as PetItem[];
      setUserPostList(posts);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch posts");
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const onDeletePost = (docId: string) => {
    Alert.alert("Delete", "Do you really want to delete this post?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => deletePost(docId),
        style: "destructive",
      },
    ]);
  };

  const deletePost = async (docId: string) => {
    try {
      await deleteDoc(doc(db, "Pets", docId));
      await getUserPosts();
    } catch (error) {
      Alert.alert("Error", "Failed to delete post");
      console.error(error);
    }
  };

  const handleFavoriteChange = (petId: string, isFavorite: boolean) => {
    // No necesitamos hacer nada especial aquí ya que los posts del usuario
    // no dependen del estado de favoritos
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Pet Posts</Text>
      <FlatList
        data={userPostList}
        numColumns={2}
        refreshing={loader}
        onRefresh={getUserPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <PetListItem pet={item} onFavoriteChange={handleFavoriteChange} />
            <Pressable
              onPress={() => onDeletePost(item.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No posts found</Text>
        }
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontFamily: "outfit-medium",
    fontSize: 30,
    marginBottom: 15,
  },
  postContainer: {
    flex: 1,
    marginBottom: 15,
  },
  deleteButton: {
    backgroundColor: Colors.LIGHT_PRIMARY,
    padding: 8,
    borderRadius: 7,
    marginTop: 5,
    marginRight: 10,
  },
  buttonText: {
    fontFamily: "outfit",
    textAlign: "center",
    color: Colors.PRIMARY,
  },
  emptyText: {
    fontFamily: "outfit",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  listContainer: {
    gap: 10,
    paddingVertical: 10,
  },
});
