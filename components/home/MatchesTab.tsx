// \frontend\components\home\MatchesTab.tsx
"use client";

import { motion } from "framer-motion";
import { Users, X } from "lucide-react";
import { Match } from "@/components/home/types";

interface MatchesTabProps {
  isDay: boolean;
  matches: Match[];
  onMatchClick: (match: Match) => void;
  onUnmatchClick: (match: Match) => void;
}

export default function MatchesTab({
  isDay,
  matches,
  onMatchClick,
  onUnmatchClick,
}: MatchesTabProps) {
  if (matches.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div
          className={`text-center p-12 sm:p-16 rounded-3xl border backdrop-blur-sm ${
            isDay
              ? "bg-white/80 border-purple-200"
              : "bg-white/10 border-purple-500/30"
          }`}
        >
          <Users
            className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 ${
              isDay ? "text-purple-600" : "text-purple-400"
            }`}
          />
          <h3
            className={`text-2xl sm:text-3xl font-bold mb-3 ${
              isDay ? "text-gray-900" : "text-white"
            }`}
          >
            No Matches Yet
          </h3>
          <p
            className={`text-base sm:text-lg ${
              isDay ? "text-gray-600" : "text-gray-300"
            }`}
          >
            Start swiping to find your perfect match!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {matches.map((match) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative rounded-2xl overflow-hidden border group ${
              isDay
                ? "bg-white border-purple-200"
                : "bg-white/10 border-purple-500/30"
            }`}
          >
            <div
              className="aspect-square cursor-pointer"
              onClick={() => onMatchClick(match)}
            >
              <img
                src={match.profilePicture}
                alt={match.firstName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end pointer-events-none">
              <div className="p-3 w-full">
                <h3 className="text-white font-bold text-lg">
                  {match.firstName} {match.lastName}, {match.age}
                </h3>
                {match.lastMessage && (
                  <p className="text-gray-300 text-sm truncate">
                    {match.lastMessage}
                  </p>
                )}
              </div>
            </div>
            {match.unreadCount > 0 && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center z-10">
                {match.unreadCount}
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUnmatchClick(match);
              }}
              className="absolute top-2 left-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-700"
              title="Unmatch"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
