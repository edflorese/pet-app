import { useState, useEffect, useMemo } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import { ChatDocument, UserItemInfo } from "@/models/Chats";
import { useUser } from "@clerk/clerk-expo";
import { useDebounce } from "@/hooks/useDebounce";

export const useInbox = () => {
  const { user } = useUser();
  const [userList, setUserList] = useState<ChatDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);

  const debouncedHandleSearch = useDebounce((text: string) => {
    setDebouncedQuery(text);
  }, 300);

  // Function to listen for changes in the last message of a specific chat
  const subscribeToLastMessage = (
    chatId: string,
    callback: (lastMessage?: { text: string; createdAt: string }) => void
  ) => {
    const messagesRef = collection(db, "Chat", chatId, "Messages");
    const lastMessageQuery = query(
      messagesRef,
      orderBy("createdAt", "desc"),
      limit(1)
    );

    return onSnapshot(lastMessageQuery, (snapshot) => {
      if (!snapshot.empty) {
        const messageData = snapshot.docs[0].data();
        callback({
          text: messageData.text,
          createdAt: messageData.createdAt.toDate().toISOString(),
        });
      } else {
        callback(undefined);
      }
    });
  };

  useEffect(() => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    setLoader(true);
    const userEmail = user.primaryEmailAddress.emailAddress;

    // Query to get all chats the user is part of
    const chatQuery = query(
      collection(db, "Chat"),
      where("userIds", "array-contains", userEmail)
    );

    // Listen for changes in the list of chats
    const unsubscribeChats = onSnapshot(chatQuery, (snapshot) => {
      const chatsMap = new Map<string, ChatDocument>();
      const messageSubscriptions: (() => void)[] = [];

      snapshot.docs.forEach((doc) => {
        const chatData = doc.data() as ChatDocument;
        chatsMap.set(doc.id, {
          ...chatData,
          id: doc.id,
          lastMessage: undefined,
        });

        // Subscribe to the latest message in each chat
        const unsubscribeMessages = subscribeToLastMessage(
          doc.id,
          (lastMessage) => {
            if (lastMessage) {
              const updatedChat = chatsMap.get(doc.id);
              if (updatedChat) {
                chatsMap.set(doc.id, {
                  ...updatedChat,
                  lastMessage,
                });

                // Update the chat list sorted by the latest message
                const sortedChats = Array.from(chatsMap.values()).sort(
                  (a, b) => {
                    const dateA = a.lastMessage
                      ? new Date(a.lastMessage.createdAt)
                      : new Date(0);
                    const dateB = b.lastMessage
                      ? new Date(b.lastMessage.createdAt)
                      : new Date(0);
                    return dateB.getTime() - dateA.getTime();
                  }
                );

                setUserList(sortedChats);
              }
            }
          }
        );

        messageSubscriptions.push(unsubscribeMessages);
      });

      setLoader(false);

      // Cleanup function for message subscriptions
      return () => {
        messageSubscriptions.forEach((unsubscribe) => unsubscribe());
      };
    });

    // Cleanup function for the main subscription
    return () => {
      unsubscribeChats();
    };
  }, [user?.primaryEmailAddress?.emailAddress]);

  const mappedUserList = useMemo(() => {
    if (!user?.primaryEmailAddress?.emailAddress) return [];

    return userList.reduce<UserItemInfo[]>((acc, record) => {
      const otherUser = record.users?.find(
        (u) => u.email !== user.primaryEmailAddress?.emailAddress
      );

      if (otherUser) {
        acc.push({
          docId: record.id,
          ...otherUser,
          lastMessage: record.lastMessage,
        });
      }

      return acc;
    }, []);
  }, [user?.primaryEmailAddress?.emailAddress, userList]);

  const filteredList = useMemo(() => {
    const lowercaseQuery = debouncedQuery.toLowerCase().trim();
    if (!lowercaseQuery) return mappedUserList;

    return mappedUserList.filter((item) =>
      item.name.toLowerCase().includes(lowercaseQuery)
    );
  }, [mappedUserList, debouncedQuery]);

  return {
    loader,
    searchQuery,
    filteredList,
    isEmpty: filteredList.length === 0,
    hasSearchQuery: searchQuery.trim().length > 0,
    handleSearch: (text: string) => {
      setSearchQuery(text);
      debouncedHandleSearch(text);
    },
  };
};
