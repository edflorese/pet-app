import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";

interface MenuItem {
  id: number;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  path: string;
}

export default function Profile() {
  const Menu: MenuItem[] = [
    {
      id: 1,
      name: "Add New Pet",
      icon: "add-circle",
      path: "/add-new-pet",
    },
    {
      id: 2,
      name: "Favorites",
      icon: "heart",
      path: "/(tabs)/favorite",
    },
    {
      id: 4,
      name: "Inbox",
      icon: "chatbubble",
      path: "/(tabs)/inbox",
    },
    {
      id: 5,
      name: "Logout",
      icon: "exit",
      path: "login",
    },
  ];

  const { user } = useUser();
  const router = useRouter();
  const { signOut } = useAuth();

  const onPressMenu = (item: MenuItem) => {
    if (item.name.toLowerCase() === 'logout') {
      signOut();
      return;
    }
    router.push(item.path as any);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: user?.imageUrl }}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{user?.fullName}</Text>
        <Text style={styles.userEmail}>
          {user?.primaryEmailAddress?.emailAddress}
        </Text>
      </View>

      <FlatList
        data={Menu}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onPressMenu(item)}
            style={styles.menuItem}
          >
            <Ionicons
              name={item.icon}
              size={35}
              color={Colors.PRIMARY}
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = {
  container: {
    padding: 20,
    marginTop: 20,
  },
  title: {
    fontFamily: "outfit-medium",
    fontSize: 30,
  },
  profileContainer: {
    display: "flex",
    alignItems: "center",
    marginVertical: 25,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 99,
  },
  userName: {
    fontFamily: "outfit-bold",
    fontSize: 20,
    marginTop: 6,
  },
  userEmail: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.GRAY,
  },
  menuItem: {
    marginVertical: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.WHITE,
    padding: 10,
    borderRadius: 10,
  },
  menuIcon: {
    padding: 10,
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderRadius: 10,
  },
  menuText: {
    fontFamily: "outfit",
    fontSize: 20,
  },
} as const;