export interface ChatUser {
  email: string;
  name: string;
}

export interface ChatDocument {
  users: ChatUser[];
}
