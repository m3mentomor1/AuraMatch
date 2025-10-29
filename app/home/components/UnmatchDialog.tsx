// ============================================
// FILE: frontend/app/home/components/UnmatchDialog.tsx
// ============================================
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";

interface Match {
  id: number;
  firstName: string;
  matchId: number;
}

interface UnmatchDialogProps {
  show: boolean;
  isDay: boolean;
  unmatchingUser: Match | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function UnmatchDialog({
  show,
  isDay,
  unmatchingUser,
  onClose,
  onConfirm,
}: UnmatchDialogProps) {
  return (
    <AnimatePresence>
      {show && unmatchingUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`max-w-md w-full p-6 rounded-3xl ${
              isDay
                ? "bg-white border border-purple-200"
                : "bg-gray-900 border border-purple-500/30"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <UserX
                className={`w-16 h-16 mx-auto mb-4 ${
                  isDay ? "text-red-600" : "text-red-400"
                }`}
              />
              <h3
                className={`text-2xl font-bold mb-2 ${
                  isDay ? "text-gray-900" : "text-white"
                }`}
              >
                Unmatch with {unmatchingUser.firstName}?
              </h3>
              <p
                className={`mb-6 ${isDay ? "text-gray-600" : "text-gray-300"}`}
              >
                This will remove your match and delete your conversation
                history. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={onClose}
                  className={`flex-1 ${
                    isDay
                      ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  Cancel
                </Button>
                <Button
                  onClick={onConfirm}
                  className="flex-1 bg-red-600 text-white hover:bg-red-700"
                >
                  Unmatch
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
