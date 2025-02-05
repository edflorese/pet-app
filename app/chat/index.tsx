import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { ChatDocument, ChatUser } from "@/models/Chats";

export default function ChatScreen() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useUser();

  const chatId = typeof params.id === "string" ? params.id : "";

  useEffect(() => {
    if (!chatId) return;

    GetUserDetails();

    const messagesRef = collection(db, "Chat", chatId, "Messages");
    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const messageData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          _id: doc.id,
          text: data.text,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          user: {
            _id: data.user._id,
            name: data.user.name,
            avatar: data.user.avatar,
          },
        } as IMessage;
      });
      setMessages(messageData);
    });

    return () => unsubscribe();
  }, [chatId]);

  const GetUserDetails = async () => {
    if (!chatId || !user?.primaryEmailAddress?.emailAddress) return;

    const docRef = doc(db, "Chat", chatId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const result = docSnap.data() as ChatDocument;
      const otherUser = result?.users.find(
        (item: ChatUser) =>
          item.email !== user.primaryEmailAddress?.emailAddress
      );

      navigation.setOptions({
        headerTitle: otherUser?.name || "Chat",
      });
    } else {
      console.error("Chat not found");
    }
  };

  const onSend = async (newMessages: IMessage[]) => {
    if (!chatId) return;

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );

    const messageToSend = {
      ...newMessages[0],
      createdAt: Timestamp.now(),
    };

    const messagesRef = collection(db, "Chat", chatId, "Messages");
    await addDoc(messagesRef, messageToSend);
  };

  const currentUser = {
    _id: user?.primaryEmailAddress?.emailAddress || "anonymous",
    name: user?.fullName || "Anonymous",
    avatar: user?.imageUrl || undefined,
  };

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        showUserAvatar={true}
        user={currentUser}
      />
    </View>
  );
}
