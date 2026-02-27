import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MessageSquare,
  Trash2,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import type { ChatSession } from "../types/chat";

interface ChatSidebarProps {
  chats: ChatSession[];
  activeChatId: string | null;
  loading: boolean;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onRequestDelete: (id: string) => void;
}

/* ── skeleton ───────────────────────────────────────────────────── */

const SkeletonItem = () => (
  <div className="px-3 py-3 space-y-2 animate-pulse">
    <div className="h-3.5 w-3/4 rounded bg-white/10" />
    <div className="h-2.5 w-1/2 rounded bg-white/5" />
  </div>
);

/* ── component ──────────────────────────────────────────────────── */

const ChatSidebar = ({
  chats,
  activeChatId,
  loading,
  sidebarOpen,
  onToggleSidebar,
  onSelectChat,
  onNewChat,
  onRequestDelete,
}: ChatSidebarProps) => {
  return (
    <motion.div
      animate={{ width: sidebarOpen ? 260 : 60 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="shrink-0 flex flex-col border-r border-white/[0.06] overflow-hidden relative"
    >
      {/* Toggle button */}
      <button
        onClick={onToggleSidebar}
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
          onClick={onNewChat}
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
          <div className="space-y-1">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonItem key={i} />
            ))}
          </div>
        ) : chats.length === 0 ? (
          sidebarOpen ? (
            <div className="p-4 text-center text-xs text-[#808080]">
              No chats yet
            </div>
          ) : null
        ) : (
          <div className="space-y-0.5">
            {chats.map((chat) => (
              <motion.button
                key={chat.id}
                whileHover={{ backgroundColor: "hsl(214, 32%, 94%)" }}
                transition={{ duration: 0 }}
                onClick={() => onSelectChat(chat.id)}
                className={`group w-full text-left rounded-lg relative flex items-center gap-2.5 cursor-pointer ${
                  sidebarOpen ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"
                } ${
                  activeChatId === chat.id
                    ? "bg-white/[0.08] text-white"
                    : "text-[#b4b4b4] hover:bg-white/[0.05] hover:text-white"
                }`}
                title={chat.title}
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
                      {chat.title}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Delete button — only when expanded */}
                {sidebarOpen && (
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRequestDelete(chat.id);
                    }}
                    whileHover={{ backgroundColor: "hsla(0, 100%, 74%, 1.00)" }}
                    transition={{ duration: 0 }}
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-red-500/20 text-red-500 cursor-pointer"
                    title="Delete chat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </motion.button>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatSidebar;
