// \frontend\components\home\MessagesTab.tsx
"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConversationList from "./ConversationList";
import ChatView from "./ChatView";
import { Match, Message } from "@/components/home/types";

interface MessagesTabProps {
  isDay: boolean;
  matches: Match[];
  selectedMatch: Match | null;
  messages: Message[];
  newMessage: string;
  sendingMessage: boolean;
  currentUserId: number;
  onMatchSelect: (match: Match) => void;
  onBackToList: () => void;
  onUnmatchClick: (match: Match) => void;
  onMessageChange: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onDiscoverClick: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function MessagesTab({
  isDay,
  matches,
  selectedMatch,
  messages,
  newMessage,
  sendingMessage,
  currentUserId,
  onMatchSelect,
  onBackToList,
  onUnmatchClick,
  onMessageChange,
  onSendMessage,
  onDiscoverClick,
  messagesEndRef,
}: MessagesTabProps) {
  if (matches.length === 0) {
    return (
      <div className="max-w-md mx-auto">
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
            No Matches Yet
          </h3>
          <p className={`mb-6 ${isDay ? "text-gray-600" : "text-gray-300"}`}>
            Start swiping to find people to chat with!
          </p>
          <Button
            onClick={onDiscoverClick}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
          >
            Start Discovering
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {selectedMatch ? (
        <ChatView
          isDay={isDay}
          selectedMatch={selectedMatch}
          messages={messages}
          newMessage={newMessage}
          sendingMessage={sendingMessage}
          currentUserId={currentUserId}
          onBack={onBackToList}
          onUnmatch={() => onUnmatchClick(selectedMatch)}
          onMessageChange={onMessageChange}
          onSendMessage={onSendMessage}
          messagesEndRef={messagesEndRef}
        />
      ) : (
        <ConversationList
          isDay={isDay}
          matches={matches}
          onMatchSelect={onMatchSelect}
        />
      )}
    </div>
  );
}
