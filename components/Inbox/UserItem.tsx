import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import { UserItemInfo } from "@/models/Chats";

interface UserItemProps {
  userInfo: UserItemInfo;
}

export default function UserItem({ userInfo }: UserItemProps) {
  const formatTime = (timestamp: string) => {
    if (!timestamp) return "";

    const messageDate = new Date(timestamp);
    const now = new Date();

    // Reset hours to compare only the date
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Format time in 24-hour format
    const getTimeStr = (date: Date) => {
      return date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    // Format full date
    const getDateStr = (date: Date) => {
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
    };

    // Get the day of the week
    const getDayName = (date: Date) => {
      return date.toLocaleDateString("es-ES", { weekday: "long" });
    };

    // If the message is from today
    if (messageDate >= today) {
      return getTimeStr(messageDate);
    }

    // If the message is from yesterday
    if (messageDate >= yesterday) {
      return "Yesterday";
    }

    // If the message is from this week (last 7 days)
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 6);
    if (messageDate >= oneWeekAgo) {
      return getDayName(messageDate);
    }

    // If the message is older
    return getDateStr(messageDate);
  };

  return (
    <Link href={`../chat?id=${userInfo.docId}`}>
      <View style={styles.container}>
        <Image source={{ uri: userInfo.imageUrl }} style={styles.avatar} />

        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{userInfo.name}</Text>
            <Text style={styles.time}>
              {userInfo.lastMessage
                ? formatTime(userInfo.lastMessage.createdAt)
                : ""}
            </Text>
          </View>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {userInfo.lastMessage?.text ?? ""}
          </Text>
        </View>
      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.GRAY,
    backgroundColor: Colors.WHITE,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontFamily: "outfit-medium",
    color: "#000",
  },
  time: {
    fontSize: 12,
    fontFamily: "outfit",
    color: Colors.GRAY,
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: "outfit",
    color: Colors.GRAY,
    marginTop: 2,
  },
});
