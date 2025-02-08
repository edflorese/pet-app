import { useState, useEffect, useMemo } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
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

  const GetUserList = async (): Promise<void> => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    setLoader(true);
    try {
      const chatQuery = query(
        collection(db, "Chat"),
        where("userIds", "array-contains", user.primaryEmailAddress.emailAddress)
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

  useEffect(() => {
    if (user) {
      void GetUserList();
    }
  }, [user]);

  return {
    loader,
    searchQuery,
    filteredList,
    isEmpty: filteredList.length === 0,
    hasSearchQuery: searchQuery.trim().length > 0,
    GetUserList,
    handleSearch: (text: string) => {
      setSearchQuery(text);
      debouncedHandleSearch(text);
    },
  };
};
