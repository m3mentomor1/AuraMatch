// \frontend\components\profile\ProfileHeader.tsx
"use client";

import { Sparkles, Moon, Sun } from "lucide-react";
import Link from "next/link";

interface ProfileHeaderProps {
  isDay: boolean;
  onToggleTheme: () => void;
}

export default function ProfileHeader({
  isDay,
  onToggleTheme,
}: ProfileHeaderProps) {
  return (
    <nav
      className={`relative z-20 px-6 py-6 flex justify-between items-center ${
        isDay ? "text-gray-800" : "text-white"
      }`}
    >
      <Link href="/home" className="flex items-center gap-2 text-2xl font-bold">
        <Sparkles
          className={`w-8 h-8 ${isDay ? "text-purple-600" : "text-purple-400"}`}
        />
        <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
          AuraMatch
        </span>
      </Link>

      <button
        onClick={onToggleTheme}
        className={`p-3 rounded-full transition-all flex items-center justify-center ${
          isDay
            ? "bg-white/50 hover:bg-white/70"
            : "bg-white/10 hover:bg-white/20"
        }`}
      >
        {isDay ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
      </button>
    </nav>
  );
}
