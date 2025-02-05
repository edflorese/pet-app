import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import { UserItemInfo } from "@/models/Chats";

interface UserItemProps {
  userInfo: UserItemInfo;
}

export default function UserItem({ userInfo }: UserItemProps) {
  return (
    <Link href={`../chat?id=${userInfo.docId}`}>
      <View style={styles.container}>
        <View style={styles.userContainer}>
          <Image source={{ uri: userInfo.imageUrl }} style={styles.avatar} />
          <Text style={styles.name}>{userInfo.name}</Text>
        </View>
        <View style={styles.separator} />
      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 7,
  },
  userContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 99,
  },
  name: {
    fontFamily: "outfit",
    fontSize: 20,
  },
  separator: {
    borderWidth: 0.2,
    marginVertical: 7,
    borderColor: Colors.GRAY,
  },
});
