export interface ChatMsg {
  role: "user" | "bot";
  text: string;
  timestamp?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  messages: ChatMsg[];
}
