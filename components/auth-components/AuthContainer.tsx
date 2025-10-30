// ============================================
// FILE: frontend/app/components/AuthContainer.tsx
// ============================================
"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface AuthContainerProps {
  isDay: boolean;
  title: string;
  subtitle: string;
  error?: string;
  children: ReactNode;
}

export default function AuthContainer({
  isDay,
  title,
  subtitle,
  error,
  children,
}: AuthContainerProps) {
  return (
    <div className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link
          href="/"
          className={`inline-flex items-center gap-2 mb-8 ${
            isDay
              ? "text-gray-600 hover:text-gray-800"
              : "text-gray-400 hover:text-gray-200"
          } transition-colors`}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to home
        </Link>

        <div
          className={`w-full p-8 rounded-3xl border backdrop-blur-sm ${
            isDay
              ? "bg-white/80 border-purple-200"
              : "bg-white/10 border-purple-500/30"
          }`}
        >
          <h1
            className={`text-4xl font-bold mb-2 ${
              isDay ? "text-gray-900" : "text-white"
            }`}
          >
            {title}
          </h1>
          <p className={`mb-8 ${isDay ? "text-gray-600" : "text-gray-300"}`}>
            {subtitle}
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500"
            >
              {error}
            </motion.div>
          )}

          {children}
        </div>
      </motion.div>
    </div>
  );
}
