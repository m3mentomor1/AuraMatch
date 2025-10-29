// \frontend\app\home\page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  Moon,
  Sun,
  Heart,
  X,
  MessageCircle,
  Users,
  LogOut,
  Send,
  ArrowLeft,
  MoreVertical,
  UserX,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { notificationService } from "@/lib/notifications";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface User {
  id: number;
  firstName: string;
  lastName: string | null;
  age: number;
  bio: string | null;
  profilePicture: string;
}

interface Match extends User {
  matchId: number;
  matchedAt: string;
  unreadCount: number;
  lastMessage: string | null;
  lastMessageTime: string | null;
}

interface Message {
  id: number;
  message: string;
  senderId: number;
  senderName: string;
  senderPicture: string;
  createdAt: string;
  read: boolean;
}

export default function HomePage() {
  const router = useRouter();
  const [isDay, setIsDay] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "discover" | "matches" | "messages"
  >("discover");
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showMatchPopup, setShowMatchPopup] = useState(false);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const [showUnmatchDialog, setShowUnmatchDialog] = useState(false);
  const [unmatchingUser, setUnmatchingUser] = useState<Match | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  const [lastMessageCount, setLastMessageCount] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/signin");
      return;
    }

    setCurrentUser(JSON.parse(userData));
    fetchUsers(token);
    fetchMatches(token);
    fetchUnreadCount(token);

    // Request notification permission on mount
    notificationService.requestPermission();
  }, []);

  useEffect(() => {
    if (selectedMatch && activeTab === "messages") {
      fetchMessages(selectedMatch.matchId);

      // Poll for new messages every 2 seconds
      const interval = setInterval(() => {
        fetchMessages(selectedMatch.matchId);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [selectedMatch, activeTab]);

  // Poll for unread count and matches every 5 seconds
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const interval = setInterval(() => {
      fetchUnreadCount(token);
      fetchMatches(token);
      checkForNewMessages(token);
    }, 5000);

    return () => clearInterval(interval);
  }, [lastMessageCount]);

  const checkForNewMessages = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/api/messages/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) return;

      const data = await response.json();
      const newCount = data.unreadCount;

      // If unread count increased, show notification
      if (newCount > lastMessageCount && lastMessageCount > 0) {
        // Get matches to find who sent the message
        const matchesResponse = await fetch(`${API_URL}/api/matches`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (matchesResponse.ok) {
          const matchesData = await matchesResponse.json();
          const matchWithNewMessage = matchesData.find(
            (m: Match) => m.unreadCount > 0
          );

          if (matchWithNewMessage) {
            notificationService.showMessageNotification(
              matchWithNewMessage.firstName,
              matchWithNewMessage.lastMessage || "New message",
              `${API_URL}${matchWithNewMessage.profilePicture}`
            );
          }
        }
      }

      setLastMessageCount(newCount);
    } catch (error) {
      console.error("Error checking for new messages:", error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchUsers = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/api/matches`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch matches");

      const data = await response.json();
      setMatches(data);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  const fetchUnreadCount = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/api/messages/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch unread count");

      const data = await response.json();
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const fetchMessages = async (matchId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/matches/${matchId}/messages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch messages");

      const data = await response.json();
      setMessages(data);

      // Refresh unread count and matches after marking as read
      if (token) {
        fetchUnreadCount(token);
        fetchMatches(token);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSwipe = async (direction: "left" | "right") => {
    const token = localStorage.getItem("token");
    const currentCard = users[currentIndex];

    if (!currentCard) return;

    setSwipeDirection(direction);

    // Wait for animation to complete before API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const response = await fetch(`${API_URL}/api/swipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          swipedUserId: currentCard.id,
          swipeType: direction === "right" ? "like" : "pass",
        }),
      });

      if (!response.ok) throw new Error("Failed to record swipe");

      const data = await response.json();

      if (data.isMatch) {
        setMatchedUser(currentCard);
        setShowMatchPopup(true);
        fetchMatches(token!);

        // Show notification for new match
        notificationService.showMatchNotification(
          currentCard.firstName,
          `${API_URL}${currentCard.profilePicture}`
        );
      }

      // Move to next card after animation
      setCurrentIndex(currentIndex + 1);
    } catch (error) {
      console.error("Error recording swipe:", error);
    } finally {
      setSwipeDirection(null);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedMatch || sendingMessage) return;

    const token = localStorage.getItem("token");
    const messageToSend = newMessage.trim();
    setSendingMessage(true);
    setNewMessage(""); // Clear input immediately for better UX

    try {
      const response = await fetch(
        `${API_URL}/api/matches/${selectedMatch.matchId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: messageToSend }),
        }
      );

      if (!response.ok) throw new Error("Failed to send message");

      // Immediately fetch messages to show the sent message
      await fetchMessages(selectedMatch.matchId);
    } catch (error) {
      console.error("Error sending message:", error);
      setNewMessage(messageToSend); // Restore message on error
      alert("Failed to send message. Please try again.");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleUnmatch = async () => {
    if (!unmatchingUser) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_URL}/api/matches/${unmatchingUser.matchId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to unmatch");

      // Close dialog and clear selection
      setShowUnmatchDialog(false);
      setUnmatchingUser(null);
      setSelectedMatch(null);

      // Refresh matches list
      if (token) {
        fetchMatches(token);
        fetchUnreadCount(token);
      }

      // Show success message
      alert(`You have unmatched with ${unmatchingUser.firstName}`);
    } catch (error) {
      console.error("Error unmatching:", error);
      alert("Failed to unmatch. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const toggleTheme = () => setIsDay(!isDay);

  const currentCard = users[currentIndex];

  return (
    <div
      className={`min-h-screen transition-all duration-1000 ${
        isDay
          ? "bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50"
          : "bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950"
      }`}
    >
      {/* Match Popup */}
      <AnimatePresence>
        {showMatchPopup && matchedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setShowMatchPopup(false)}
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
                  onClick={() => setShowMatchPopup(false)}
                  className="flex-1 bg-white text-purple-600 hover:bg-gray-100"
                >
                  Keep Swiping
                </Button>
                <Button
                  onClick={() => {
                    setShowMatchPopup(false);
                    setActiveTab("matches");
                  }}
                  className="flex-1 bg-white/20 text-white hover:bg-white/30"
                >
                  Send Message
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unmatch Confirmation Dialog */}
      <AnimatePresence>
        {showUnmatchDialog && unmatchingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={() => setShowUnmatchDialog(false)}
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
                  className={`mb-6 ${
                    isDay ? "text-gray-600" : "text-gray-300"
                  }`}
                >
                  This will remove your match and delete your conversation
                  history. This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowUnmatchDialog(false)}
                    className={`flex-1 ${
                      isDay
                        ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUnmatch}
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

      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute w-96 h-96 rounded-full blur-3xl opacity-20 transition-all duration-1000 ${
            isDay ? "bg-purple-400" : "bg-purple-600"
          }`}
          style={{ left: "10%", top: "20%" }}
        />
        <div
          className={`absolute w-96 h-96 rounded-full blur-3xl opacity-20 transition-all duration-1000 ${
            isDay ? "bg-pink-400" : "bg-pink-600"
          }`}
          style={{ right: "10%", bottom: "20%" }}
        />
      </div>

      {/* Header */}
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
            onClick={toggleTheme}
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
            onClick={handleLogout}
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

      {/* Main Content */}
      <div className="relative z-10 px-4 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          <Button
            onClick={() => {
              setActiveTab("discover");
              setSelectedMatch(null);
            }}
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
            onClick={() => {
              setActiveTab("matches");
              setSelectedMatch(null);
            }}
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
            {matches.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-pink-500 text-white text-xs rounded-full">
                {matches.length}
              </span>
            )}
          </Button>

          <Button
            onClick={() => {
              setActiveTab("messages");
              setSelectedMatch(null);
            }}
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

        {/* Discover Tab */}
        {activeTab === "discover" && (
          <div className="max-w-md mx-auto">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : users.length === 0 ? (
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
            ) : currentIndex >= users.length ? (
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
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCard.id}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = Math.abs(offset.x) * velocity.x;

                    if (swipe < -10000) {
                      // Swiped left - pass
                      handleSwipe("left");
                    } else if (swipe > 10000) {
                      // Swiped right - like
                      handleSwipe("right");
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
                      src={`${API_URL}${currentCard.profilePicture}`}
                      alt={currentCard.firstName}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h2 className="text-3xl sm:text-4xl font-bold mb-1">
                        {currentCard.firstName}
                        {currentCard.lastName &&
                          ` ${currentCard.lastName}`}, {currentCard.age}
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
                      onClick={() => handleSwipe("left")}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <X className="w-8 h-8 sm:w-10 sm:h-10" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleSwipe("right")}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <Heart className="w-8 h-8 sm:w-10 sm:h-10" />
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {users.length > 0 && currentIndex < users.length && (
              <div className="text-center mt-6">
                <p
                  className={`text-sm ${
                    isDay ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {currentIndex + 1} of {users.length}
                </p>
                <p
                  className={`text-xs mt-2 ${
                    isDay ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  👆 Swipe right to like, left to skip
                </p>

                {/* Browse Navigation Buttons */}
                <div className="flex justify-center gap-3 mt-4">
                  <Button
                    onClick={() =>
                      setCurrentIndex(Math.max(0, currentIndex - 1))
                    }
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
                      setCurrentIndex(
                        Math.min(users.length - 1, currentIndex + 1)
                      )
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
        )}

        {/* Matches Tab */}
        {activeTab === "matches" && (
          <div className="max-w-4xl mx-auto">
            {matches.length === 0 ? (
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
            ) : (
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
                      onClick={() => {
                        setSelectedMatch(match);
                        setActiveTab("messages");
                      }}
                    >
                      <img
                        src={`${API_URL}${match.profilePicture}`}
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
                    {/* Unmatch button - shows on hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUnmatchingUser(match);
                        setShowUnmatchDialog(true);
                      }}
                      className="absolute top-2 left-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-700"
                      title="Unmatch"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div className="max-w-4xl mx-auto">
            {!selectedMatch ? (
              // Show list of conversations
              matches.length === 0 ? (
                <div
                  className={`text-center p-12 sm:p-16 rounded-3xl border backdrop-blur-sm ${
                    isDay
                      ? "bg-white/80 border-purple-200"
                      : "bg-white/10 border-purple-500/30"
                  }`}
                >
                  <MessageCircle
                    className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 ${
                      isDay ? "text-purple-600" : "text-purple-400"
                    }`}
                  />
                  <h3
                    className={`text-2xl sm:text-3xl font-bold mb-3 ${
                      isDay ? "text-gray-900" : "text-white"
                    }`}
                  >
                    No Conversations Yet
                  </h3>
                  <p
                    className={`text-base sm:text-lg mb-6 ${
                      isDay ? "text-gray-600" : "text-gray-300"
                    }`}
                  >
                    Match with someone to start chatting
                  </p>
                  <Button
                    onClick={() => setActiveTab("discover")}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  >
                    Start Swiping
                  </Button>
                </div>
              ) : (
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
                        onClick={() => setSelectedMatch(match)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img
                              src={`${API_URL}${match.profilePicture}`}
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
                                  {new Date(
                                    match.lastMessageTime
                                  ).toLocaleDateString() ===
                                  new Date().toLocaleDateString()
                                    ? new Date(
                                        match.lastMessageTime
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })
                                    : new Date(
                                        match.lastMessageTime
                                      ).toLocaleDateString([], {
                                        month: "short",
                                        day: "numeric",
                                      })}
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
              )
            ) : (
              <div
                className={`rounded-3xl border backdrop-blur-sm overflow-hidden ${
                  isDay
                    ? "bg-white/90 border-purple-200"
                    : "bg-white/10 border-purple-500/30"
                }`}
              >
                {/* Chat Header */}
                <div
                  className={`p-4 border-b flex items-center gap-3 ${
                    isDay
                      ? "border-purple-200 bg-white/50"
                      : "border-purple-500/30 bg-white/5"
                  }`}
                >
                  <button
                    onClick={() => setSelectedMatch(null)}
                    className={`p-2 rounded-full ${
                      isDay ? "hover:bg-purple-100" : "hover:bg-white/10"
                    }`}
                  >
                    <ArrowLeft
                      className={`w-5 h-5 ${
                        isDay ? "text-gray-700" : "text-white"
                      }`}
                    />
                  </button>
                  <img
                    src={`${API_URL}${selectedMatch.profilePicture}`}
                    alt={selectedMatch.firstName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3
                      className={`font-bold ${
                        isDay ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {selectedMatch.firstName} {selectedMatch.lastName}
                    </h3>
                    <p
                      className={`text-sm ${
                        isDay ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {selectedMatch.age} years old
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setUnmatchingUser(selectedMatch);
                      setShowUnmatchDialog(true);
                    }}
                    className={`p-2 rounded-full ${
                      isDay
                        ? "hover:bg-red-100 text-red-600"
                        : "hover:bg-red-900/30 text-red-400"
                    } transition-colors`}
                    title="Unmatch"
                  >
                    <UserX className="w-5 h-5" />
                  </button>
                </div>

                {/* Messages */}
                <div className="h-96 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p
                        className={`text-center ${
                          isDay ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        No messages yet. Say hi! 👋
                      </p>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.senderId === currentUser.id
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                              msg.senderId === currentUser.id
                                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                                : isDay
                                ? "bg-gray-200 text-gray-900"
                                : "bg-white/20 text-white"
                            }`}
                          >
                            <p>{msg.message}</p>
                            <p
                              className={`text-xs mt-1 ${
                                msg.senderId === currentUser.id
                                  ? "text-white/70"
                                  : isDay
                                  ? "text-gray-600"
                                  : "text-gray-400"
                              }`}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Message Input */}
                <form
                  onSubmit={handleSendMessage}
                  className={`p-4 border-t ${
                    isDay
                      ? "border-purple-200 bg-white/50"
                      : "border-purple-500/30 bg-white/5"
                  }`}
                >
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      disabled={sendingMessage}
                      className={`flex-1 ${
                        isDay
                          ? "bg-white border-purple-200"
                          : "bg-white/10 border-purple-500/30 text-white placeholder:text-gray-400"
                      }`}
                    />
                    <Button
                      type="submit"
                      disabled={sendingMessage || !newMessage.trim()}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
