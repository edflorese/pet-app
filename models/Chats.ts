export interface ChatUser {
  email: string;
  name: string;
  imageUrl: string;
}

export interface ChatDocument {
  id: string;
  users: ChatUser[];
  userIds: string[];
  lastMessage?: {
    text: string;
    createdAt: string;
  };
}

export interface UserItemInfo {
  docId: string;
  email: string;
  imageUrl: string;
  name: string;
  lastMessage?: {
    text: string;
    createdAt: string;
  };
}
