// ============================================
// FILE: frontend/app/home/components/TabNavigation.tsx
// ============================================
"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, Users, MessageCircle } from "lucide-react";

interface TabNavigationProps {
  isDay: boolean;
  activeTab: "discover" | "matches" | "messages";
  matchesCount: number;
  unreadCount: number;
  onTabChange: (tab: "discover" | "matches" | "messages") => void;
}

export default function TabNavigation({
  isDay,
  activeTab,
  matchesCount,
  unreadCount,
  onTabChange,
}: TabNavigationProps) {
  return (
    <div className="flex justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
      <Button
        onClick={() => onTabChange("discover")}
        className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all text-sm sm:text-base ${
          activeTab === "discover"
            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            : isDay
            ? "text-gray-700 hover:bg-white/50 bg-transparent"
            : "text-gray-300 hover:bg-white/10 bg-transparent"
        }`}
      >
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">Discover</span>
      </Button>

      <Button
        onClick={() => onTabChange("matches")}
        className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all text-sm sm:text-base ${
          activeTab === "matches"
            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            : isDay
            ? "text-gray-700 hover:bg-white/50 bg-transparent"
            : "text-gray-300 hover:bg-white/10 bg-transparent"
        }`}
      >
        <Users className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">Matches</span>
        {matchesCount > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-pink-500 text-white text-xs rounded-full">
            {matchesCount}
          </span>
        )}
      </Button>

      <Button
        onClick={() => onTabChange("messages")}
        className={`relative flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all text-sm sm:text-base ${
          activeTab === "messages"
            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            : isDay
            ? "text-gray-700 hover:bg-white/50 bg-transparent"
            : "text-gray-300 hover:bg-white/10 bg-transparent"
        }`}
      >
        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">Messages</span>
        {unreadCount > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full animate-pulse">
            {unreadCount}
          </span>
        )}
      </Button>
    </div>
  );
}
