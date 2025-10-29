// ============================================
// FILE: frontend/app/home/components/MatchPopup.tsx
// ============================================
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface User {
  id: number;
  firstName: string;
  lastName: string | null;
  age: number;
  bio: string | null;
  profilePicture: string;
}

interface MatchPopupProps {
  show: boolean;
  matchedUser: User | null;
  onClose: () => void;
  onSendMessage: () => void;
}

export default function MatchPopup({
  show,
  matchedUser,
  onClose,
  onSendMessage,
}: MatchPopupProps) {
  return (
    <AnimatePresence>
      {show && matchedUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.5, rotate: 10 }}
            className="bg-gradient-to-br from-purple-600 to-pink-600 p-8 rounded-3xl text-white text-center max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Heart className="w-20 h-20 mx-auto mb-4 fill-current" />
            <h2 className="text-4xl font-bold mb-2">It's a Match!</h2>
            <p className="text-lg mb-6 opacity-90">
              You and {matchedUser.firstName} liked each other
            </p>
            <div className="flex gap-4">
              <Button
                onClick={onClose}
                className="flex-1 bg-white text-purple-600 hover:bg-gray-100"
              >
                Keep Swiping
              </Button>
              <Button
                onClick={onSendMessage}
                className="flex-1 bg-white/20 text-white hover:bg-white/30"
              >
                Send Message
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
