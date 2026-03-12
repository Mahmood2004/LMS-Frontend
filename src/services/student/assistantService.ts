import aiApi from "@/lib/aiApi";

// Types
export interface NewSessionRequest {
  user_id: string;
}

export interface NewSessionResponse {
  session_id: string;
}

export interface ChatRequest {
  user_id: string;
  message: string;
  session_id?: string;
}

export interface ChatSource {
  content: string;
  course?: string;
}

export interface ChatResponse {
  answer: string;
  session_id: string;
  sources: ChatSource[];
}

export type SessionItem = string;

export interface SessionListResponse {
  sessions: string[];
}

export interface MessageItem {
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface SessionMessagesResponse {
  messages: MessageItem[];
}

const AssistantService = {
  // Create a new chat session
  createSession: async (userId: string): Promise<string> => {
    const res = await aiApi.post<NewSessionResponse>("/ai/sessions/new", {
      user_id: userId,
    });

    return res.data.session_id;
  },

  // Send message to AI assistant
  chat: async (payload: ChatRequest): Promise<ChatResponse> => {
    const res = await aiApi.post<ChatResponse>("/ai/chat", payload);
    return res.data;
  },

  // Get all chat sessions for a user
  getSessions: async (userId: string): Promise<SessionItem[]> => {
    const res = await aiApi.get<SessionListResponse>(`/ai/sessions/${userId}`);

    return res.data.sessions;
  },

  // Get all messages inside a session
  getSessionMessages: async (
    userId: string,
    sessionId: string,
  ): Promise<MessageItem[]> => {
    const res = await aiApi.get<SessionMessagesResponse>(
      `/ai/sessions/${userId}/${sessionId}`,
    );

    return res.data.messages;
  },
};

export default AssistantService;
