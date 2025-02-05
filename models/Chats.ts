export interface ChatUser {
  email: string;
  name: string;
  imageUrl: string;
}

export interface ChatDocument {
  id: string;
  users: ChatUser[];
  userIds: string[];
}

export interface UserItemInfo {
  docId: string;
  email: string;
  imageUrl: string;
  name: string;
}
