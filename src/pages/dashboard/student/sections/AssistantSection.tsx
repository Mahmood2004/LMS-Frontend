import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { courses, botReplies } from "../data/mockData";
import type { ChatMsg } from "../types";

const AssistantSection = () => {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "bot",
      text: "Hi! I'm your course AI assistant. Ask me anything about your enrolled courses.",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(courses[0].name);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: botReplies[Math.floor(Math.random() * botReplies.length)],
        },
      ]);
    }, 1200);
  };

  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
        AI <span className="text-gradient">Research Assistant</span>
      </h1>
      <p className="mt-1 text-muted-foreground">
        Ask questions about your course material.
      </p>

      {/* Course selector */}
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground">Context:</span>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="text-sm rounded-lg border border-border bg-card text-foreground px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {courses.map((c) => (
            <option key={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Chat window — responsive height */}
      <div className="mt-4 rounded-2xl bg-card border border-border shadow-card flex flex-col h-[60vh] min-h-[360px]">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {msg.role === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-hero-gradient flex items-center justify-center shrink-0">
                    <Brain className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] sm:max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-hero-gradient text-primary-foreground rounded-br-sm"
                      : "bg-secondary text-foreground rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {thinking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-end gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-hero-gradient flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="bg-secondary rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          repeat: Infinity,
                          delay: i * 0.15,
                          duration: 0.6,
                        }}
                        className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
        <div className="border-t border-border p-3 sm:p-4 flex gap-2">
          <Input
            placeholder="Ask about your course material..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            className="flex-1"
          />
          <Button
            variant="hero"
            size="icon"
            onClick={send}
            disabled={!input.trim() || thinking}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default AssistantSection;
