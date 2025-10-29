// ============================================
// FILE: frontend/app/types/index.ts
// ============================================

export interface User {
  id: number;
  firstName: string;
  lastName: string | null;
  age: number;
  bio: string | null;
  profilePicture: string;
  email?: string;
}

export interface Match {
  id: number;
  firstName: string;
  lastName: string | null;
  age: number;
  bio: string | null;
  profilePicture: string;
  matchId: number;
  matchedAt: string;
  unreadCount: number;
  lastMessage: string | null;
  lastMessageTime: string | null;
}

export interface Message {
  id: number;
  message: string;
  senderId: number;
  senderName: string;
  senderPicture: string;
  createdAt: string;
  read: boolean;
}
