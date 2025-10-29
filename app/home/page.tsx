// ============================================
// FILE: frontend/app/home/page.tsx
// ============================================
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { notificationService } from "@/lib/notifications";
import Header from "./components/Header";
import BackgroundOrbs from "./components/BackgroundOrbs";
import TabNavigation from "./components/TabNavigation";
import DiscoverTab from "./components/DiscoverTab";
import MatchesTab from "./components/MatchesTab";
import MessagesTab from "./components/MessagesTab";
import MatchPopup from "./components/MatchPopup";
import UnmatchDialog from "./components/UnmatchDialog";
import AgeFilterModal from "./components/AgeFilterModal";
import { User, Match, Message } from "@/app/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function HomePage() {
  const router = useRouter();
  const [isDay, setIsDay] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
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
  const [previousMatchIds, setPreviousMatchIds] = useState<Set<number>>(
    new Set()
  );
  const [previousUnreadCount, setPreviousUnreadCount] = useState<number>(0);
  const [showAgeFilter, setShowAgeFilter] = useState(false);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(100);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/signin");
      return;
    }

    const user = JSON.parse(userData);
    setCurrentUser(user);

    // Load saved age filter preferences
    const savedMinAge = localStorage.getItem("minAge");
    const savedMaxAge = localStorage.getItem("maxAge");
    if (savedMinAge) setMinAge(parseInt(savedMinAge));
    if (savedMaxAge) setMaxAge(parseInt(savedMaxAge));

    notificationService.requestPermission().then((granted) => {
      console.log("Notification permission:", granted ? "granted" : "denied");
    });

    fetchUsers(token);
    fetchMatches(token);
    fetchUnreadCount(token);
  }, []);

  useEffect(() => {
    // Filter users based on age range
    const filtered = users.filter(
      (user) => user.age >= minAge && user.age <= maxAge
    );
    setFilteredUsers(filtered);
    setCurrentIndex(0);
  }, [users, minAge, maxAge]);

  useEffect(() => {
    if (selectedMatch && activeTab === "messages") {
      fetchMessages(selectedMatch.matchId);
      const interval = setInterval(() => {
        fetchMessages(selectedMatch.matchId);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [selectedMatch, activeTab]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const interval = setInterval(() => {
      checkForNewMatches(token);
      checkForNewMessages(token);
    }, 3000);

    return () => clearInterval(interval);
  }, [previousMatchIds, previousUnreadCount]);

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

      const currentMatchIds = new Set<number>(
        data.map((m: Match) => m.matchId)
      );
      setPreviousMatchIds(currentMatchIds);
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
      setPreviousUnreadCount(data.unreadCount);
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
      if (token) {
        fetchUnreadCount(token);
        fetchMatches(token);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const checkForNewMatches = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/api/matches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return;

      const data = await response.json();
      const currentMatchIds = new Set<number>(
        data.map((m: Match) => m.matchId)
      );

      const newMatches = data.filter(
        (m: Match) => !previousMatchIds.has(m.matchId)
      );

      if (newMatches.length > 0) {
        console.log("New matches detected:", newMatches.length);
        newMatches.forEach((match: Match) => {
          console.log("Showing notification for match:", match.firstName);
          notificationService.showMatchNotification(
            match.firstName,
            match.profilePicture
          );
        });
      }

      setMatches(data);
      setPreviousMatchIds(currentMatchIds);
    } catch (error) {
      console.error("Error checking for new matches:", error);
    }
  };

  const checkForNewMessages = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/api/messages/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return;

      const data = await response.json();
      const newUnreadCount = data.unreadCount;

      if (newUnreadCount > previousUnreadCount) {
        console.log(
          "New messages detected, count increased from",
          previousUnreadCount,
          "to",
          newUnreadCount
        );

        const matchesResponse = await fetch(`${API_URL}/api/matches`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (matchesResponse.ok) {
          const matchesData = await matchesResponse.json();
          const matchesWithUnread = matchesData.filter(
            (m: Match) => m.unreadCount > 0
          );

          if (matchesWithUnread.length > 0) {
            const match = matchesWithUnread[0];
            console.log("Showing message notification for:", match.firstName);
            notificationService.showMessageNotification(
              match.firstName,
              match.lastMessage || "New message",
              match.profilePicture
            );
          }

          setMatches(matchesData);
        }
      }

      setUnreadCount(newUnreadCount);
      setPreviousUnreadCount(newUnreadCount);
    } catch (error) {
      console.error("Error checking for new messages:", error);
    }
  };

  const handleSwipe = async (direction: "left" | "right") => {
    const token = localStorage.getItem("token");
    const currentCard = filteredUsers[currentIndex];
    if (!currentCard) return;

    setSwipeDirection(direction);
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
        console.log("Match detected! Showing popup and notification");
        setMatchedUser(currentCard);
        setShowMatchPopup(true);

        notificationService.showMatchNotification(
          currentCard.firstName,
          currentCard.profilePicture
        );

        await fetchMatches(token!);
      }

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
    setNewMessage("");

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
      await fetchMessages(selectedMatch.matchId);
    } catch (error) {
      console.error("Error sending message:", error);
      setNewMessage(messageToSend);
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to unmatch");

      setShowUnmatchDialog(false);
      setUnmatchingUser(null);
      setSelectedMatch(null);

      if (token) {
        fetchMatches(token);
        fetchUnreadCount(token);
      }
      alert(`You have unmatched with ${unmatchingUser.firstName}`);
    } catch (error) {
      console.error("Error unmatching:", error);
      alert("Failed to unmatch. Please try again.");
    }
  };

  const handleApplyAgeFilter = (min: number, max: number) => {
    setMinAge(min);
    setMaxAge(max);
    localStorage.setItem("minAge", min.toString());
    localStorage.setItem("maxAge", max.toString());
    setShowAgeFilter(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const handleTabChange = (tab: "discover" | "matches" | "messages") => {
    setActiveTab(tab);
    setSelectedMatch(null);
  };

  return (
    <div
      className={`min-h-screen transition-all duration-1000 ${
        isDay
          ? "bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50"
          : "bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950"
      }`}
    >
      <MatchPopup
        show={showMatchPopup}
        matchedUser={matchedUser}
        onClose={() => setShowMatchPopup(false)}
        onSendMessage={() => {
          setShowMatchPopup(false);
          setActiveTab("matches");
        }}
      />

      <UnmatchDialog
        show={showUnmatchDialog}
        isDay={isDay}
        unmatchingUser={unmatchingUser}
        onClose={() => setShowUnmatchDialog(false)}
        onConfirm={handleUnmatch}
      />

      <AgeFilterModal
        show={showAgeFilter}
        isDay={isDay}
        minAge={minAge}
        maxAge={maxAge}
        onClose={() => setShowAgeFilter(false)}
        onApply={handleApplyAgeFilter}
      />

      <BackgroundOrbs isDay={isDay} />

      <Header
        isDay={isDay}
        currentUser={currentUser}
        onToggleTheme={() => setIsDay(!isDay)}
        onLogout={handleLogout}
      />

      <div className="relative z-10 px-4 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto">
        <TabNavigation
          isDay={isDay}
          activeTab={activeTab}
          matchesCount={matches.length}
          unreadCount={unreadCount}
          onTabChange={handleTabChange}
          onOpenFilter={() => setShowAgeFilter(true)}
          hasAgeFilter={minAge !== 18 || maxAge !== 100}
        />

        {activeTab === "discover" && (
          <DiscoverTab
            isDay={isDay}
            loading={loading}
            users={filteredUsers}
            currentIndex={currentIndex}
            swipeDirection={swipeDirection}
            onSwipe={handleSwipe}
            onNavigate={setCurrentIndex}
          />
        )}

        {activeTab === "matches" && (
          <MatchesTab
            isDay={isDay}
            matches={matches}
            onMatchClick={(match) => {
              setSelectedMatch(match);
              setActiveTab("messages");
            }}
            onUnmatchClick={(match) => {
              setUnmatchingUser(match);
              setShowUnmatchDialog(true);
            }}
          />
        )}

        {activeTab === "messages" && (
          <MessagesTab
            isDay={isDay}
            matches={matches}
            selectedMatch={selectedMatch}
            messages={messages}
            newMessage={newMessage}
            sendingMessage={sendingMessage}
            currentUserId={currentUser?.id}
            onMatchSelect={setSelectedMatch}
            onBackToList={() => setSelectedMatch(null)}
            onUnmatchClick={(match) => {
              setUnmatchingUser(match);
              setShowUnmatchDialog(true);
            }}
            onMessageChange={setNewMessage}
            onSendMessage={handleSendMessage}
            onDiscoverClick={() => setActiveTab("discover")}
            messagesEndRef={messagesEndRef}
          />
        )}
      </div>
    </div>
  );
}
