// ============================================
// FILE: frontend/app/home/components/Header.tsx
// ============================================
"use client";

import { Moon, Sun, LogOut, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  isDay: boolean;
  currentUser: any;
  onToggleTheme: () => void;
  onLogout: () => void;
}

export default function Header({
  isDay,
  currentUser,
  onToggleTheme,
  onLogout,
}: HeaderProps) {
  const router = useRouter();

  return (
    <nav
      className={`relative z-20 px-4 sm:px-6 py-4 flex justify-between items-center ${
        isDay ? "text-gray-800" : "text-white"
      }`}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        {currentUser && (
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => router.push("/profile")}
              className="relative group"
            >
              <img
                src={currentUser.profilePicture}
                alt={currentUser.firstName}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-purple-500 hover:border-purple-400 transition-all cursor-pointer"
              />
              <div className="absolute inset-0 rounded-full bg-purple-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </button>
            <div className="hidden sm:block">
              <p
                className={`font-semibold text-sm sm:text-base ${
                  isDay ? "text-gray-900" : "text-white"
                }`}
              >
                {currentUser.firstName}
              </p>
              <p
                className={`text-xs ${
                  isDay ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Welcome back!
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleTheme}
          className={`p-2 sm:p-3 rounded-full transition-all flex items-center justify-center ${
            isDay
              ? "bg-white/50 hover:bg-white/70"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          {isDay ? (
            <Moon className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <Sun className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </button>

        <button
          onClick={onLogout}
          className={`p-2 sm:p-3 rounded-full transition-all flex items-center justify-center ${
            isDay
              ? "bg-white/50 hover:bg-white/70"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </nav>
  );
}
