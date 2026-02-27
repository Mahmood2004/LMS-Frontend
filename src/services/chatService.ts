import type {
  ChatMsg,
  ChatSession,
} from "@/pages/dashboard/student/types/chat";

// ─── In-Memory Mock Database ──────────────────────────────────────────────────

let mockChats: ChatSession[] = [
  {
    id: "chat-001",
    title: "Neural networks explained simply",
    createdAt: "2026-02-25T14:30:00Z",
    messages: [
      {
        role: "bot",
        text: "Hi! I'm your course AI assistant. Ask me anything about your enrolled courses.",
        timestamp: "2026-02-25T14:30:00Z",
      },
      {
        role: "user",
        text: "Can you explain neural networks in simple terms?",
        timestamp: "2026-02-25T14:30:15Z",
      },
      {
        role: "bot",
        text: "A neural network is a computing system inspired by the brain. It consists of layers of connected nodes (neurons) that process information. Data flows through input nodes, gets processed by hidden layers, and produces output. Each connection has a weight that adjusts during training, allowing the network to learn patterns from data.",
        timestamp: "2026-02-25T14:30:17Z",
      },
      {
        role: "user",
        text: "What about backpropagation?",
        timestamp: "2026-02-25T14:31:00Z",
      },
      {
        role: "bot",
        text: "Backpropagation is the algorithm used to train neural networks. It works by: 1) Making a prediction (forward pass), 2) Calculating the error, 3) Going backwards through the network to adjust weights based on how much each contributed to the error. Think of it like getting exam results and figuring out which study habits to change.",
        timestamp: "2026-02-25T14:31:02Z",
      },
    ],
  },
  {
    id: "chat-002",
    title: "React hooks and performance",
    createdAt: "2026-02-24T09:15:00Z",
    messages: [
      {
        role: "bot",
        text: "Hi! I'm your course AI assistant. Ask me anything about your enrolled courses.",
        timestamp: "2026-02-24T09:15:00Z",
      },
      {
        role: "user",
        text: "When should I use useMemo vs useCallback in React?",
        timestamp: "2026-02-24T09:15:30Z",
      },
      {
        role: "bot",
        text: "Use `useMemo` to memoize expensive computed values — it caches the result of a calculation. Use `useCallback` to memoize function references — it caches the function itself. Both help prevent unnecessary re-renders, but only use them when you've identified a real performance issue via the React Profiler.",
        timestamp: "2026-02-24T09:15:32Z",
      },
    ],
  },
  {
    id: "chat-003",
    title: "CAP theorem and distributed systems",
    createdAt: "2026-02-22T16:45:00Z",
    messages: [
      {
        role: "bot",
        text: "Hi! I'm your course AI assistant. Ask me anything about your enrolled courses.",
        timestamp: "2026-02-22T16:45:00Z",
      },
      {
        role: "user",
        text: "What is the CAP theorem and why does it matter?",
        timestamp: "2026-02-22T16:45:20Z",
      },
      {
        role: "bot",
        text: "The CAP theorem states that a distributed system can only guarantee two of three properties simultaneously: Consistency (all nodes see the same data), Availability (every request gets a response), and Partition tolerance (system works despite network failures). Since network partitions are unavoidable in practice, you must choose between consistency and availability.",
        timestamp: "2026-02-22T16:45:22Z",
      },
      {
        role: "user",
        text: "Which do most modern systems choose?",
        timestamp: "2026-02-22T16:46:00Z",
      },
      {
        role: "bot",
        text: "Most modern systems lean towards AP (availability + partition tolerance) with eventual consistency. For example, DynamoDB and Cassandra prioritize availability, while systems like Google Spanner try to achieve strong consistency with clever engineering. The choice depends on your use case — banking needs consistency, social media can tolerate eventual consistency.",
        timestamp: "2026-02-22T16:46:02Z",
      },
    ],
  },
  {
    id: "chat-004",
    title: "Database sharding strategies overview",
    createdAt: "2026-02-20T11:00:00Z",
    messages: [
      {
        role: "bot",
        text: "Hi! I'm your course AI assistant. Ask me anything about your enrolled courses.",
        timestamp: "2026-02-20T11:00:00Z",
      },
      {
        role: "user",
        text: "Can you explain database sharding strategies from the System Design course?",
        timestamp: "2026-02-20T11:00:45Z",
      },
      {
        role: "bot",
        text: "Database sharding splits data across multiple databases. Common strategies include: 1) Hash-based sharding — distribute by hash of a key (even distribution but hard to range query), 2) Range-based sharding — split by value ranges (good for range queries but can create hotspots), 3) Geographic sharding — split by region (reduces latency). Your System Design course covers these in Week 3.",
        timestamp: "2026-02-20T11:00:47Z",
      },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function delay(ms?: number): Promise<void> {
  return new Promise((resolve) =>
    setTimeout(resolve, ms ?? 300 + Math.random() * 200),
  );
}

function generateId(): string {
  return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Mock API Functions ───────────────────────────────────────────────────────

/**
 * Fetch all chat sessions, sorted by most recent first.
 */
export async function getChats(): Promise<ChatSession[]> {
  await delay();
  return [...mockChats].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

/**
 * Fetch a single chat session by ID.
 */
export async function getChatById(id: string): Promise<ChatSession> {
  await delay();
  const chat = mockChats.find((c) => c.id === id);
  if (!chat) throw new Error(`Chat not found: ${id}`);
  return { ...chat, messages: [...chat.messages] };
}

/**
 * Create a new empty chat session.
 */
export async function createChat(): Promise<ChatSession> {
  await delay();
  const now = new Date().toISOString();
  const chat: ChatSession = {
    id: generateId(),
    title: "New Chat",
    createdAt: now,
    messages: [],
  };
  mockChats.unshift(chat);
  return { ...chat, messages: [...chat.messages] };
}

/**
 * Append a message to an existing chat session.
 */
export async function addMessage(
  chatId: string,
  message: ChatMsg,
): Promise<void> {
  await delay(150);
  const chat = mockChats.find((c) => c.id === chatId);
  if (!chat) throw new Error(`Chat not found: ${chatId}`);
  chat.messages.push({
    ...message,
    timestamp: message.timestamp ?? new Date().toISOString(),
  });
}

/**
 * Update the title of a chat session.
 */
export async function updateChatTitle(
  chatId: string,
  title: string,
): Promise<void> {
  await delay(100);
  const chat = mockChats.find((c) => c.id === chatId);
  if (!chat) throw new Error(`Chat not found: ${chatId}`);
  chat.title = title;
}

/**
 * Delete a chat session by ID.
 */
export async function deleteChat(chatId: string): Promise<void> {
  await delay();
  mockChats = mockChats.filter((c) => c.id !== chatId);
}
