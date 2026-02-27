import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface DeleteChatModalProps {
  open: boolean;
  chatTitle: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 350 },
  },
  exit: { opacity: 0, scale: 0.9, y: 10, transition: { duration: 0.15 } },
};

const DeleteChatModal = ({
  open,
  chatTitle,
  onCancel,
  onConfirm,
}: DeleteChatModalProps) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            variants={backdropVariants}
            onClick={onCancel}
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            className="relative z-10 w-full max-w-sm mx-4 rounded-2xl bg-white border shadow-2xl p-6"
          >
            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/15 mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-black text-center">
              Delete Chat?
            </h3>

            {/* Body */}
            <p className="mt-2 text-sm text-muted-foreground text-center leading-relaxed">
              This will delete &ldquo;
              <span className="text-muted-foreground font-medium">
                {chatTitle}
              </span>
              &rdquo; permanently!
            </p>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ backgroundColor: "hsla(0, 7%, 65%, 0.35)" }}
                transition={{ duration: 0 }}
                onClick={onCancel}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-white/10 transition-colors cursor-pointer"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ backgroundColor: "hsla(0, 100%, 74%, 1.00)" }}
                transition={{ duration: 0 }}
                onClick={onConfirm}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-red-600 transition-colors cursor-pointer"
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteChatModal;
