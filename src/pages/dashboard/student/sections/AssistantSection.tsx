import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import ReactMarkdown, { Components } from "react-markdown";
import {
  Send,
  Sparkles,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
} from "lucide-react";
import studentProfileService, {
  StudentProfile,
} from "@/services/student/profileService";
import AssistantService, {
  SessionItem,
  MessageItem,
} from "@/services/student/assistantService";

interface ChatBubbleProps {
  content: string;
  role: "user" | "assistant";
}

function ChatBubble({ content, role }: ChatBubbleProps) {
  return (
    <div
      className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed break-words ${
        role === "user"
          ? "bg-blue-400 text-white rounded-tr-md ml-auto"
          : "bg-gray-600 text-white rounded-tl-md mr-auto"
      }`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            if (inline) {
              // Inline code stays simple
              return (
                <code
                  className="bg-gray-600 px-1 py-0.5 rounded text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            } else {
              // Multi-line code block with syntax highlighting
              return (
                <SyntaxHighlighter
                  style={oneDark}
                  language={className?.replace("language-", "") || "text"}
                  PreTag="div"
                  {...props}
                  customStyle={{ borderRadius: "0.5rem", padding: "1rem" }}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              );
            }
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-2">
                <table className="table-auto border-collapse border border-gray-500 w-full text-sm">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="border border-gray-400 px-2 py-1 bg-gray-600 text-left">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="border border-gray-400 px-2 py-1 text-left">
                {children}
              </td>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

const AssistantSection = () => {
  const [profile, setProfile] = useState<StudentProfile>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoadingProfile(true);
        const profileData = await studentProfileService.getProfile();
        setProfile(profileData);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const userId = profile?.id;
        if (!userId) return;

        const sessionsData = await AssistantService.getSessions(userId);

        setSessions(sessionsData);
        console.log("sessions", sessionsData);

        if (sessionsData.length > 0) {
          setActiveSessionId(sessionsData[0]);
        }
      } catch (err) {
        console.error("Sessions fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [profile]);

  useEffect(() => {
    if (!activeSessionId) return;

    const fetchMessages = async () => {
      const userId = profile?.id;
      if (!userId) return;

      const msgs = await AssistantService.getSessionMessages(
        userId,
        activeSessionId,
      );

      setMessages(msgs);
    };

    fetchMessages();
  }, [activeSessionId, profile?.id]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, thinking]);

  const send = useCallback(async () => {
    if (!input.trim() || thinking) return;

    const userId = profile?.id;
    if (!userId) return;

    const userText = input.trim();

    const userMsg: MessageItem = {
      role: "user",
      content: userText,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setThinking(true);

    try {
      const res = await AssistantService.chat({
        user_id: userId,
        message: userText,
        session_id: activeSessionId ?? undefined,
      });

      setActiveSessionId(res.session_id);

      const botMsg: MessageItem = {
        role: "assistant",
        content: res.answer,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("AI chat error:", err);
    } finally {
      setThinking(false);
    }
  }, [input, thinking, activeSessionId, profile?.id]);

  const handleNewChat = useCallback(async () => {
    if (!profile?.id) return;
    const userId = profile.id;

    try {
      if (sessions.length > 0) {
        const firstSession = sessions[0];

        const sessionMessages = await AssistantService.getSessionMessages(
          userId,
          firstSession,
        );

        if (sessionMessages.length === 0) {
          setActiveSessionId(firstSession);
          setMessages([]);
          return;
        }
      }

      // Otherwise create a new session
      const newSessionId = await AssistantService.createSession(userId);

      const newSession: SessionItem = newSessionId;

      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(newSessionId);
      setMessages([]);
    } catch (err) {
      console.error("Failed to create or fetch session:", err);
    }
  }, [profile?.id, sessions]);

  const handleSelectChat = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
  }, []);

  return (
    <div className="flex w-full" style={{ height: "calc(100vh - 4rem)" }}>
      <motion.div
        animate={{ width: sidebarOpen ? 260 : 60 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="shrink-0 flex flex-col border-r border-white/[0.06] overflow-hidden relative"
      >
        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen((p) => !p)}
          className="absolute top-3 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-lg text-[#b4b4b4] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <motion.div
            animate={{ rotate: sidebarOpen ? 0 : 180 }}
            transition={{ duration: 0.2 }}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelLeftOpen className="w-4 h-4" />
            )}
          </motion.div>
        </button>

        {/* New Chat button */}
        <div className="p-2 pt-3">
          <button
            onClick={handleNewChat}
            className={`flex items-center gap-2.5 w-full rounded-xl px-3 py-2.5 text-sm font-medium text-white bg-white/10 hover:bg-white/15 transition-colors cursor-pointer ${
              sidebarOpen ? "" : "justify-center"
            }`}
            title="New Chat"
          >
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  <div className="flex items-center gap-2.5">
                    <Plus className="w-4 h-4 shrink-0" />
                    New Chat
                  </div>
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto px-2 pb-2 mt-1">
          {loading ? (
            <div className="p-4 text-center text-xs text-[#808080]">
              loading chats...
            </div>
          ) : sessions.length === 0 ? (
            sidebarOpen ? (
              <div className="p-4 text-center text-xs text-[#808080]">
                No chats yet
              </div>
            ) : null
          ) : (
            <div className="space-y-0.5">
              {sessions.map((session, index) => {
                const isActive = activeSessionId === session;

                return (
                  <motion.button
                    key={session}
                    whileHover={{ backgroundColor: "hsl(214, 32%, 94%)" }}
                    transition={{ duration: 0 }}
                    onClick={() => handleSelectChat(session)}
                    className={`group w-full text-left rounded-lg relative flex items-center gap-2.5 cursor-pointer ${
                      sidebarOpen ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"
                    } ${
                      isActive
                        ? "bg-white/[0.08] text-white"
                        : "text-[#b4b4b4] hover:bg-white/[0.05] hover:text-white"
                    }`}
                    title={`Chat ${sessions.length - index}`}
                  >
                    <MessageSquare className="w-4 h-4 shrink-0" />

                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="text-sm truncate flex-1 min-w-0 pr-6"
                        >
                          Chat {sessions.length - index}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeSessionId ? (
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
                      Hello,{" "}
                      {loadingProfile ? "..." : profile?.full_name || "Student"}{" "}
                      <span className="inline-block animate-bounce">👋</span>
                    </h2>
                    <p className="mt-3 text-lg text-muted-foreground">
                      How can I help you today?
                    </p>
                  </motion.div>
                </div>
              ) : (
                /* ── Messages list ── */
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">
                  <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                      <motion.div
                        key={`${activeSessionId}-${i}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className={`flex items-start gap-3 ${
                          msg.role === "user" ? "flex-row-reverse" : ""
                        }`}
                      >
                        {/* Avatar */}
                        {msg.role === "assistant" ? (
                          <div className="w-8 h-8 rounded-full bg-hero-gradient flex items-center justify-center shrink-0 mt-0.5">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-white">
                              {profile?.full_name.charAt(0).toUpperCase() ||
                                "Student"}
                            </span>
                          </div>
                        )}

                        {/* Chat bubble */}
                        <ChatBubble content={msg.content} role={msg.role} />
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
                  onClick={send}
                  disabled={thinking || !input.trim()}
                  className={`bg-hero-gradient shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    thinking || !input.trim()
                      ? "bg-white/10 text-[#808080] cursor-not-allowed"
                      : "bg-white text-black hover:bg-white/90"
                  }`}
                >
                  <Send className="w-4 h-4 text-white" />
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
    </div>
  );
};

export default AssistantSection;
