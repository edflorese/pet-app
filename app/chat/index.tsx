import { View, StyleSheet } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import {
  GiftedChat,
  IMessage,
  Send,
  InputToolbar,
} from "react-native-gifted-chat";
import { ChatDocument, ChatUser } from "@/models/Chats";
import Ionicons from "@expo/vector-icons/Ionicons";

interface FirebaseMessage extends Omit<IMessage, "createdAt"> {
  createdAt: Timestamp;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useUser();

  const chatId = typeof params.id === "string" ? params.id : "";

  useEffect(() => {
    if (!chatId) return;

    void GetUserDetails();

    const messagesRef = collection(db, "Chat", chatId, "Messages");
    const messagesQuery = query(messagesRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messageData = snapshot.docs.map((doc) => {
        const data = doc.data() as FirebaseMessage;
        return {
          _id: doc.id,
          text: data.text,
          createdAt: data.createdAt.toDate(),
          user: {
            _id: data.user._id,
            name: data.user.name,
            avatar: data.user.avatar,
          },
        } as IMessage;
      });

      setMessages(messageData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId]);

  const GetUserDetails = async () => {
    if (!chatId || !user?.primaryEmailAddress?.emailAddress) return;

    try {
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
    } catch (error) {
      console.error("Error getting chat details:", error);
    }
  };

  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      if (!chatId) return;

      try {
        const messageToSend = {
          ...newMessages[0],
          createdAt: Timestamp.now(),
        };

        const messagesRef = collection(db, "Chat", chatId, "Messages");
        await addDoc(messagesRef, messageToSend);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [chatId]
  );

  const currentUser = {
    _id: user?.primaryEmailAddress?.emailAddress || "anonymous",
    name: user?.fullName || "Anonymous",
    avatar: user?.imageUrl || undefined,
  };

  const renderSend = (props: any) => {
    return (
      <Send {...props} containerStyle={styles.sendContainer}>
        <View style={styles.sendButton}>
          <Ionicons name="send" size={24} color="#007AFF" />
        </View>
      </Send>
    );
  };

  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbar}
        primaryStyle={styles.inputPrimary}
      />
    );
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => void onSend(messages)}
        user={currentUser}
        showUserAvatar
        alwaysShowSend
        renderSend={renderSend}
        renderInputToolbar={renderInputToolbar}
        timeFormat="HH:mm"
        dateFormat="LL"
        placeholder="Escribe un mensaje..."
        listViewProps={{
          style: styles.listView,
          contentContainerStyle: styles.listViewContent,
        }}
        isLoadingEarlier={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  inputToolbar: {
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  inputPrimary: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 20,
    marginTop: 5,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  sendContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginRight: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  listView: {
    backgroundColor: "#fff",
  },
  listViewContent: {
    paddingBottom: 10,
  },
});
