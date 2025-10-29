// ============================================
// FILE: frontend/app/home/components/DiscoverTab.tsx
// ============================================
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, X } from "lucide-react";
import { User } from "@/app/types";

interface DiscoverTabProps {
  isDay: boolean;
  loading: boolean;
  users: User[];
  currentIndex: number;
  swipeDirection: string | null;
  onSwipe: (direction: "left" | "right") => void;
  onNavigate: (index: number) => void;
}

export default function DiscoverTab({
  isDay,
  loading,
  users,
  currentIndex,
  swipeDirection,
  onSwipe,
  onNavigate,
}: DiscoverTabProps) {
  const currentCard = users[currentIndex];

  if (loading) {
    return (
      <div className="max-w-md mx-auto">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="max-w-lg mx-auto">
        <div
          className={`text-center p-12 rounded-3xl border backdrop-blur-sm ${
            isDay
              ? "bg-white/80 border-purple-200"
              : "bg-white/10 border-purple-500/30"
          }`}
        >
          <Sparkles
            className={`w-16 h-16 mx-auto mb-4 ${
              isDay ? "text-purple-600" : "text-purple-400"
            }`}
          />
          <h3
            className={`text-2xl font-bold mb-2 ${
              isDay ? "text-gray-900" : "text-white"
            }`}
          >
            No More Users
          </h3>
          <p className={isDay ? "text-gray-600" : "text-gray-300"}>
            Check back later for new matches!
          </p>
        </div>
      </div>
    );
  }

  if (currentIndex >= users.length) {
    return (
      <div className="max-w-md mx-auto">
        <div
          className={`text-center p-12 rounded-3xl border backdrop-blur-sm ${
            isDay
              ? "bg-white/80 border-purple-200"
              : "bg-white/10 border-purple-500/30"
          }`}
        >
          <Heart
            className={`w-16 h-16 mx-auto mb-4 ${
              isDay ? "text-pink-600" : "text-pink-400"
            }`}
          />
          <h3
            className={`text-2xl font-bold mb-2 ${
              isDay ? "text-gray-900" : "text-white"
            }`}
          >
            That's Everyone!
          </h3>
          <p className={isDay ? "text-gray-600" : "text-gray-300"}>
            You've seen all available profiles. Check back later!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard.id}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = Math.abs(offset.x) * velocity.x;
            if (swipe < -10000) {
              onSwipe("left");
            } else if (swipe > 10000) {
              onSwipe("right");
            }
          }}
          initial={{ scale: 0.8, opacity: 0, rotateY: -20 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{
            x:
              swipeDirection === "left"
                ? -300
                : swipeDirection === "right"
                ? 300
                : 0,
            opacity: 0,
            scale: 0.8,
            rotate:
              swipeDirection === "left"
                ? -20
                : swipeDirection === "right"
                ? 20
                : 0,
            transition: { duration: 0.3 },
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`rounded-3xl border overflow-hidden backdrop-blur-sm shadow-2xl cursor-grab active:cursor-grabbing ${
            isDay
              ? "bg-white/90 border-purple-200"
              : "bg-white/10 border-purple-500/30"
          }`}
        >
          <div className="relative h-80 sm:h-96 overflow-hidden">
            <img
              src={currentCard.profilePicture}
              alt={currentCard.firstName}
              className="w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h2 className="text-3xl sm:text-4xl font-bold mb-1">
                {currentCard.firstName}
                {currentCard.lastName && ` ${currentCard.lastName}`},{" "}
                {currentCard.age}
              </h2>
              {currentCard.bio && (
                <p className="text-sm sm:text-base text-gray-200 line-clamp-2">
                  {currentCard.bio}
                </p>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8 flex justify-center gap-4 sm:gap-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSwipe("left")}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <X className="w-8 h-8 sm:w-10 sm:h-10" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSwipe("right")}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <Heart className="w-8 h-8 sm:w-10 sm:h-10" />
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {users.length > 0 && currentIndex < users.length && (
        <div className="text-center mt-6">
          <p className={`text-sm ${isDay ? "text-gray-600" : "text-gray-400"}`}>
            {currentIndex + 1} of {users.length}
          </p>
          <p
            className={`text-xs mt-2 ${
              isDay ? "text-gray-500" : "text-gray-500"
            }`}
          >
            👆 Swipe right to like, left to skip
          </p>

          <div className="flex justify-center gap-3 mt-4">
            <Button
              onClick={() => onNavigate(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className={`px-4 py-2 rounded-full text-sm ${
                currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
              } ${
                isDay
                  ? "bg-white text-gray-700 border border-purple-200 hover:bg-purple-50"
                  : "bg-white/10 text-white border border-purple-500/30 hover:bg-white/20"
              }`}
            >
              ← Previous
            </Button>
            <Button
              onClick={() =>
                onNavigate(Math.min(users.length - 1, currentIndex + 1))
              }
              disabled={currentIndex === users.length - 1}
              className={`px-4 py-2 rounded-full text-sm ${
                currentIndex === users.length - 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              } ${
                isDay
                  ? "bg-white text-gray-700 border border-purple-200 hover:bg-purple-50"
                  : "bg-white/10 text-white border border-purple-500/30 hover:bg-white/20"
              }`}
            >
              Next →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
