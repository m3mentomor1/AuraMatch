// \frontend\components\signin\SignInForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

interface SignInFormProps {
  isDay: boolean;
  email: string;
  password: string;
  showPassword: boolean;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SignInForm({
  isDay,
  email,
  password,
  showPassword,
  loading,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
}: SignInFormProps) {
  return (
    <>
      <form onSubmit={onSubmit} className="space-y-6">
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
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={loading}
            className={`w-full h-12 ${
              isDay
                ? "bg-white border-purple-200"
                : "bg-white/5 border-purple-500/30 text-white placeholder:text-gray-400"
            }`}
          />
        </div>

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
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              className={`w-full h-12 pr-12 ${
                isDay
                  ? "bg-white border-purple-200"
                  : "bg-white/5 border-purple-500/30 text-white placeholder:text-gray-400"
              }`}
            />

            <button
              type="button"
              onClick={onTogglePassword}
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
          disabled={loading}
          className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
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
    </>
  );
}
