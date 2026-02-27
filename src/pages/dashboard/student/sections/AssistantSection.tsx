import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Square } from "lucide-react";
import { botReplies } from "../data/mockData";
import type { ChatSession, ChatMsg } from "../types/chat";
import ChatSidebar from "../components/ChatSidebar";
import DeleteChatModal from "../components/DeleteChatModal";
import {
  getChats,
  createChat,
  addMessage,
  updateChatTitle,
  deleteChat,
} from "@/services/chatService";

/* ── helpers ────────────────────────────────────────────────────── */

function generateTitle(text: string): string {
  const words = text.split(/\s+/).slice(0, 6);
  const title = words.join(" ");
  return title.length < text.length ? title + "..." : title;
}

/* ── types ───────────────────────────────────────────────────────── */

interface AssistantSectionProps {
  studentName?: string;
}

/* ── component ──────────────────────────────────────────────────── */

const AssistantSection = ({
  studentName = "Student",
}: AssistantSectionProps) => {
  /* ── state ─────────────────────────────────────────────────────── */
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const botTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;
  const messages = activeChat?.messages ?? [];

  /* ── load chats on mount ──────────────────────────────────────── */

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const existingChats = await getChats();
        if (cancelled) return;

        setChats(existingChats);

        const tempChat: ChatSession = {
          id: "temp-" + Date.now(),
          title: "New Chat",
          messages: [],
          createdAt: new Date().toISOString(),
        };

        setChats((prev) => [tempChat, ...prev]);
        setActiveChatId(tempChat.id);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* ── auto-scroll ──────────────────────────────────────────────── */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, thinking]);

  /* ── handlers ─────────────────────────────────────────────────── */

  const send = useCallback(async () => {
    if (!input.trim() || !activeChatId || thinking || saving) return;

    const userText = input.trim();
    const userMsg: ChatMsg = {
      role: "user",
      text: userText,
      timestamp: new Date().toISOString(),
    };

    setInput("");
    setTimeout(() => inputRef.current?.focus(), 0);

    setSaving(true);

    let chatIdToUse = activeChatId;

    // 1️⃣ If current chat is temporary, create a real chat first
    if (activeChatId?.startsWith("temp-")) {
      const newChat = await createChat();
      chatIdToUse = newChat.id;

      // Replace temp chat with real chat
      setChats((prev) =>
        prev.map((c) => (c.id === activeChatId ? newChat : c)),
      );
      setActiveChatId(newChat.id);
    }

    // 2️⃣ Optimistic update
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatIdToUse ? { ...c, messages: [...c.messages, userMsg] } : c,
      ),
    );

    try {
      await addMessage(chatIdToUse, userMsg);

      // Auto-title on first user message
      const chat = chats.find((c) => c.id === chatIdToUse);
      const userMessages =
        chat?.messages.filter((m) => m.role === "user") ?? [];
      if (userMessages.length === 0) {
        const newTitle = generateTitle(userText);
        await updateChatTitle(chatIdToUse, newTitle);
        setChats((prev) =>
          prev.map((c) =>
            c.id === chatIdToUse ? { ...c, title: newTitle } : c,
          ),
        );
      }
    } finally {
      setSaving(false);
    }

    // 3️⃣ Bot reply
    setThinking(true);
    botTimeoutRef.current = setTimeout(async () => {
      const botMsg: ChatMsg = {
        role: "bot",
        text: botReplies[Math.floor(Math.random() * botReplies.length)],
        timestamp: new Date().toISOString(),
      };

      setChats((prev) =>
        prev.map((c) =>
          c.id === chatIdToUse
            ? { ...c, messages: [...c.messages, botMsg] }
            : c,
        ),
      );

      try {
        await addMessage(chatIdToUse, botMsg);
      } catch {
        /* silently fail for bot reply */
      }

      setThinking(false);
      botTimeoutRef.current = null;
      inputRef.current?.focus();
    }, 1200);
  }, [activeChatId, input, thinking, saving, chats]);

  const stopGenerating = () => {
    if (botTimeoutRef.current) {
      clearTimeout(botTimeoutRef.current);
      botTimeoutRef.current = null;
    }
    setThinking(false);
  };

  const handleNewChat = useCallback(async () => {
    if (chats.length > 0) {
      const firstChat = chats[0];

      // If first chat is an empty "New Chat", do nothing
      if (firstChat.title === "New Chat" && firstChat.messages.length === 0) {
        return;
      }
    }

    const chat = await createChat();
    setChats((prev) => [chat, ...prev]);
    setActiveChatId(chat.id);
  }, [chats]);

  const handleRequestDelete = useCallback(
    (id: string) => {
      const chat = chats.find((c) => c.id === id);
      if (chat) {
        setDeleteTarget({ id: chat.id, title: chat.title });
      }
    },
    [chats],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    const { id } = deleteTarget;

    await deleteChat(id);
    setChats((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (activeChatId === id) {
        setActiveChatId(next.length > 0 ? next[0].id : null);
      }
      return next;
    });
    setDeleteTarget(null);
  }, [deleteTarget, activeChatId]);

  const handleSelectChat = useCallback((id: string) => {
    setActiveChatId(id);
  }, []);

  /* ── render ─────────────────────────────────────────────────────── */

  return (
    <div className="flex w-full" style={{ height: "calc(100vh - 4rem)" }}>
      {/* Sidebar */}
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        loading={loading}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((p) => !p)}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onRequestDelete={handleRequestDelete}
      />

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeChat ? (
          <>
            {/* Header */}
            <div className="shrink-0 border-b border-white/[0.06] px-6 py-3 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-hero-gradient flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                AI <span className="text-gradient">Research Assistant</span>
              </h1>
            </div>

            {/* Messages / Welcome */}
            <div className="flex-1 overflow-y-auto">
              {messages.length === 0 ? (
                /* ── Welcome screen ── */
                <div className="h-full flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <h2 className="text-3xl sm:text-4xl font-bold">
                      Hello, {studentName}{" "}
                      <span className="inline-block animate-bounce">👋</span>
                    </h2>
                    <p className="mt-3 text-lg text-muted-foreground">
                      How can I help you today?
                    </p>
                  </motion.div>
                </div>
              ) : (
                /* ── Messages list ── */
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-5">
                  <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                      <motion.div
                        key={`${activeChatId}-${i}`}
                        initial={{
                          opacity: 0,
                          y: 12,
                        }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className={`flex items-start gap-3 ${
                          msg.role === "user" ? "flex-row-reverse" : ""
                        }`}
                      >
                        {/* Avatar */}
                        {msg.role === "bot" ? (
                          <div className="w-8 h-8 rounded-full bg-hero-gradient flex items-center justify-center shrink-0 mt-0.5">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-white">
                              {studentName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}

                        {/* Bubble */}
                        <div
                          className={`max-w-[80%] sm:max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "bg-secondary text-foreground rounded-tr-md"
                              : "bg-secondary text-foreground rounded-tl-md"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </motion.div>
                    ))}

                    {/* Thinking indicator */}
                    {thinking && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-hero-gradient flex items-center justify-center shrink-0">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-secondary rounded-2xl rounded-tl-md px-4 py-3">
                          <div className="flex gap-1.5">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                animate={{ y: [0, -5, 0] }}
                                transition={{
                                  repeat: Infinity,
                                  delay: i * 0.15,
                                  duration: 0.6,
                                }}
                                className="w-2 h-2 rounded-full bg-muted-foreground/50"
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div ref={bottomRef} />
                </div>
              )}
            </div>

            {/* Input area */}
            <div className="shrink-0 border-t border-white/[0.06] px-4 sm:px-6 py-4">
              <div className="max-w-3xl mx-auto flex gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask about your course material..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  disabled={saving}
                  className="flex-1 bg-gray-100 text-white placeholder-[#808080] text-sm rounded-xl px-4 py-3 border border-white/[0.08] focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-colors disabled:opacity-50"
                />
                <button
                  onClick={thinking ? stopGenerating : send}
                  disabled={saving || (!thinking && !input.trim())}
                  className={`bg-hero-gradient shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    thinking
                      ? "bg-white text-black hover:bg-white/90"
                      : input.trim()
                        ? "bg-white text-black hover:bg-white/90"
                        : "bg-white/10 text-[#808080] cursor-not-allowed"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {thinking ? (
                    <Square className="w-4 h-4 text-white" />
                  ) : (
                    <Send className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* ── No chat selected / loading ── */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-3">
              <Sparkles className="w-10 h-10 mx-auto text-[#808080] opacity-40" />
              <p className="text-sm text-[#808080]">
                {loading
                  ? "Loading chats…"
                  : "Create a new chat to get started"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteChatModal
        open={deleteTarget !== null}
        chatTitle={deleteTarget?.title ?? ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default AssistantSection;
