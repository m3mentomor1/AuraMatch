// ============================================
// FILE: frontend/app/home/components/ConversationList.tsx
// ============================================
"use client";

import { motion } from "framer-motion";
import { Match } from "@/components/home/types";

interface ConversationListProps {
  isDay: boolean;
  matches: Match[];
  onMatchSelect: (match: Match) => void;
}

export default function ConversationList({
  isDay,
  matches,
  onMatchSelect,
}: ConversationListProps) {
  return (
    <div
      className={`rounded-3xl border backdrop-blur-sm overflow-hidden ${
        isDay
          ? "bg-white/90 border-purple-200"
          : "bg-white/10 border-purple-500/30"
      }`}
    >
      <div
        className={`p-4 border-b ${
          isDay
            ? "border-purple-200 bg-white/50"
            : "border-purple-500/30 bg-white/5"
        }`}
      >
        <h3
          className={`text-xl font-bold ${
            isDay ? "text-gray-900" : "text-white"
          }`}
        >
          Your Conversations
        </h3>
      </div>
      <div className="divide-y divide-purple-500/20">
        {matches.map((match) => (
          <motion.div
            key={match.id}
            whileHover={{
              backgroundColor: isDay
                ? "rgba(147, 51, 234, 0.05)"
                : "rgba(255, 255, 255, 0.05)",
            }}
            className="p-4 cursor-pointer transition-colors"
            onClick={() => onMatchSelect(match)}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={match.profilePicture}
                  alt={match.firstName}
                  className="w-16 h-16 rounded-full object-cover"
                />
                {match.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {match.unreadCount}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4
                    className={`font-bold text-lg ${
                      isDay ? "text-gray-900" : "text-white"
                    }`}
                  >
                    {match.firstName} {match.lastName}
                  </h4>
                  {match.lastMessageTime && (
                    <span
                      className={`text-xs ${
                        isDay ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {new Date(match.lastMessageTime).toLocaleDateString() ===
                      new Date().toLocaleDateString()
                        ? new Date(match.lastMessageTime).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : new Date(match.lastMessageTime).toLocaleDateString(
                            [],
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                    </span>
                  )}
                </div>
                <p
                  className={`text-sm truncate ${
                    match.unreadCount > 0
                      ? isDay
                        ? "text-gray-900 font-semibold"
                        : "text-white font-semibold"
                      : isDay
                      ? "text-gray-600"
                      : "text-gray-400"
                  }`}
                >
                  {match.lastMessage || "Start a conversation..."}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
