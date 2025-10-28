// \frontend\app\signin\page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Moon, Sun, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [isDay, setIsDay] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toggleTheme = () => setIsDay(!isDay);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign in:", { email, password });
  };

  return (
    <div
      className={`min-h-screen transition-all duration-1000 ${
        isDay
          ? "bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50"
          : "bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950"
      }`}
    >
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
        className={`relative z-20 px-6 py-6 flex justify-between items-center ${
          isDay ? "text-gray-800" : "text-white"
        }`}
      >
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <Sparkles
            className={`w-8 h-8 ${
              isDay ? "text-purple-600" : "text-purple-400"
            }`}
          />
          <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            AuraMatch
          </span>
        </Link>

        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full transition-all flex items-center justify-center ${
            isDay
              ? "bg-white/50 hover:bg-white/70"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          {isDay ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
        </button>
      </nav>

      {/* Sign In Form */}
      <div className="relative z-10 px-6 py-12 max-w-md mx-auto">
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
            className={`p-8 rounded-3xl border backdrop-blur-sm ${
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
              Welcome Back
            </h1>
            <p className={`mb-8 ${isDay ? "text-gray-600" : "text-gray-300"}`}>
              Sign in to continue your aura matching.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label
                  className={`block mb-2 text-sm font-medium ${
                    isDay ? "text-gray-700" : "text-gray-200"
                  }`}
                >
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className={`w-full h-12 ${
                    isDay
                      ? "bg-white border-purple-200"
                      : "bg-white/5 border-purple-500/30 text-white placeholder:text-gray-400"
                  }`}
                />
              </div>

              {/* Password with Show/Hide Toggle */}
              <div className="relative">
                <label
                  className={`block mb-2 text-sm font-medium ${
                    isDay ? "text-gray-700" : "text-gray-200"
                  }`}
                >
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={`w-full h-12 pr-12 ${
                      isDay
                        ? "bg-white border-purple-200"
                        : "bg-white/5 border-purple-500/30 text-white placeholder:text-gray-400"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center justify-center"
                  >
                    {showPassword ? (
                      <EyeOff
                        className={`w-5 h-5 ${
                          isDay ? "text-purple-600" : "text-purple-400"
                        }`}
                      />
                    ) : (
                      <Eye
                        className={`w-5 h-5 ${
                          isDay ? "text-purple-600" : "text-purple-400"
                        }`}
                      />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 text-base font-medium"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <span className={`${isDay ? "text-gray-600" : "text-gray-300"}`}>
                New to AuraMatch?{" "}
              </span>
              <Link
                href="/signup"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Create an account
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
