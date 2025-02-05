import { View, Text, FlatList, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import UserItem from "@/components/Inbox/UserItem";
import { ChatDocument, UserItemInfo } from "@/models/Chats";

export default function Inbox() {
  const { user } = useUser();
  const [userList, setUserList] = useState<ChatDocument[]>([]);
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      void GetUserList();
    }
  }, [user]);

  const GetUserList = async (): Promise<void> => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    setLoader(true);
    try {
      const chatQuery = query(
        collection(db, "Chat"),
        where(
          "userIds",
          "array-contains",
          user.primaryEmailAddress.emailAddress
        )
      );

      const querySnapshot = await getDocs(chatQuery);
      const newUserList: ChatDocument[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as ChatDocument;
        newUserList.push({
          ...data,
          id: doc.id,
        });
      });

      setUserList(newUserList);
    } catch (error) {
      console.error("Error fetching user list:", error);
    } finally {
      setLoader(false);
    }
  };

  const MapOtherUserList = (): UserItemInfo[] => {
    if (!user?.primaryEmailAddress?.emailAddress) return [];

    return userList.reduce<UserItemInfo[]>((list, record) => {
      const otherUser = record.users?.find(
        (u) => u.email !== user.primaryEmailAddress?.emailAddress
      );

      if (otherUser) {
        list.push({
          docId: record.id,
          ...otherUser,
        });
      }

      return list;
    }, []);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inbox</Text>
      <FlatList
        style={styles.list}
        data={MapOtherUserList()}
        refreshing={loader}
        onRefresh={GetUserList}
        keyExtractor={(item) => item.docId}
        renderItem={({ item }) => <UserItem userInfo={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 20,
  },
  title: {
    fontFamily: "outfit-medium",
    fontSize: 30,
  },
  list: {
    marginTop: 20,
  },
});
