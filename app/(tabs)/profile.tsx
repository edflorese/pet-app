import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

interface MenuItem {
  id: number;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  path: string;
}

export default function Profile() {
  const Menu: MenuItem[] = [
    { id: 1, name: "Add New Pet", icon: "add-circle", path: "/add-new-pet" },
    { id: 2, name: "My Post", icon: "bookmark", path: "/user-post" },
    {
      id: 3,
      name: "Time to Walk?",
      icon: "partly-sunny",
      path: "/weather-info",
    },

    {
      id: 4,
      name: "Nearby Vets",
      icon: "locate-outline",
      path: "/nearby-vets",
    },
    { id: 5, name: "Logout", icon: "exit", path: "/login" },
  ];

  const { user } = useUser();
  const router = useRouter();
  const { signOut } = useAuth();

  const onPressMenu = async (item: MenuItem) => {
    if (item.name.toLowerCase() === "logout") {
      try {
        await signOut();
        router.push(item.path as any);
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
      return;
    }
    router.push(item.path as any);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Image source={{ uri: user?.imageUrl }} style={styles.profileImage} />
          <Text style={styles.userName}>{user?.fullName}</Text>
          <Text style={styles.userEmail}>
            {user?.primaryEmailAddress?.emailAddress || "No email available"}
          </Text>
        </View>

        <FlatList
          data={Menu}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          contentContainerStyle={styles.menuList}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => onPressMenu(item)}
              style={styles.menuItem}
            >
              <Ionicons
                name={item.icon}
                size={width * 0.08}
                color={Colors.PRIMARY}
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
  container: {
    padding: width * 0.05,
    marginTop: 5,
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: 25,
  },
  profileImage: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: 99,
  },
  userName: {
    fontFamily: "outfit-bold",
    fontSize: width * 0.05,
    marginTop: 6,
  },
  userEmail: {
    fontFamily: "outfit",
    fontSize: width * 0.04,
    color: Colors.GRAY,
    textAlign: "center",
  },
  menuList: {
    paddingBottom: 20,
  },
  menuItem: {
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.WHITE,
    paddingVertical: width * 0.04,
    paddingHorizontal: width * 0.05,
    borderRadius: 12,
    gap: 12,
  },
  menuIcon: {
    padding: 10,
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderRadius: 10,
  },
  menuText: {
    fontFamily: "outfit",
    fontSize: width * 0.045,
  },
});
