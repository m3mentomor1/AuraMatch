// \frontend\components\home\ChatView.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, UserX, Send } from "lucide-react";
import { Match, Message } from "@/components/home/types";

interface ChatViewProps {
  isDay: boolean;
  selectedMatch: Match;
  messages: Message[];
  newMessage: string;
  sendingMessage: boolean;
  currentUserId: number;
  onBack: () => void;
  onUnmatch: () => void;
  onMessageChange: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChatView({
  isDay,
  selectedMatch,
  messages,
  newMessage,
  sendingMessage,
  currentUserId,
  onBack,
  onUnmatch,
  onMessageChange,
  onSendMessage,
  messagesEndRef,
}: ChatViewProps) {
  return (
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
          onClick={onBack}
          className={`p-2 rounded-full ${
            isDay ? "hover:bg-purple-100" : "hover:bg-white/10"
          }`}
        >
          <ArrowLeft
            className={`w-5 h-5 ${isDay ? "text-gray-700" : "text-white"}`}
          />
        </button>
        <img
          src={selectedMatch.profilePicture}
          alt={selectedMatch.firstName}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className={`font-bold ${isDay ? "text-gray-900" : "text-white"}`}>
            {selectedMatch.firstName} {selectedMatch.lastName}
          </h3>
          <p className={`text-sm ${isDay ? "text-gray-600" : "text-gray-400"}`}>
            {selectedMatch.age} years old
          </p>
        </div>
        <button
          onClick={onUnmatch}
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
                  msg.senderId === currentUserId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    msg.senderId === currentUserId
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : isDay
                      ? "bg-gray-200 text-gray-900"
                      : "bg-white/20 text-white"
                  }`}
                >
                  <p>{msg.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.senderId === currentUserId
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
        onSubmit={onSendMessage}
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
            onChange={(e) => onMessageChange(e.target.value)}
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
  );
}
