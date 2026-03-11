export type ChatMsg = {
  role: "user" | "bot";
  text: string;
  timestamp?: string;
};

export type { ChatSession } from "./types/chat";

export type ChatHistory = {
  userId: string;
  messages: ChatMsg[];
  updatedAt: string;
};
