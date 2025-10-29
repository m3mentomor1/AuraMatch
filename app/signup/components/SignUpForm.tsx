// ============================================
// FILE: frontend/app/signup/components/SignUpForm.tsx
// ============================================
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

interface SignUpFormData {
  email: string;
  password: string;
  showPassword: boolean;
  firstName: string;
  lastName: string;
  age: string;
  bio: string;
}

interface SignUpFormProps {
  isDay: boolean;
  loading: boolean;
  formData: SignUpFormData;
  profilePicture: File | null;
  previewUrl: string;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onTogglePassword: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SignUpForm({
  isDay,
  loading,
  formData,
  profilePicture,
  previewUrl,
  onInputChange,
  onTogglePassword,
  onFileChange,
  onSubmit,
}: SignUpFormProps) {
  return (
    <>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label
            className={`block mb-2 text-sm font-medium ${
              isDay ? "text-gray-700" : "text-gray-200"
            }`}
          >
            Email <span className="text-pink-500">*</span>
          </label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={onInputChange}
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

        {/* Password */}
        <div className="relative">
          <label
            className={`block mb-2 text-sm font-medium ${
              isDay ? "text-gray-700" : "text-gray-200"
            }`}
          >
            Password <span className="text-pink-500">*</span>
          </label>
          <div className="relative">
            <Input
              type={formData.showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={onInputChange}
              placeholder="Enter your password"
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
              {formData.showPassword ? (
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

        {/* Name fields */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label
              className={`block mb-2 text-sm font-medium ${
                isDay ? "text-gray-700" : "text-gray-200"
              }`}
            >
              First Name <span className="text-pink-500">*</span>
            </label>
            <Input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={onInputChange}
              placeholder="John"
              required
              disabled={loading}
              className={`w-full h-12 ${
                isDay
                  ? "bg-white border-purple-200"
                  : "bg-white/5 border-purple-500/30 text-white placeholder:text-gray-400"
              }`}
            />
          </div>

          <div>
            <label
              className={`block mb-2 text-sm font-medium ${
                isDay ? "text-gray-700" : "text-gray-200"
              }`}
            >
              Last Name (Optional)
            </label>
            <Input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={onInputChange}
              placeholder="Doe"
              disabled={loading}
              className={`w-full h-12 ${
                isDay
                  ? "bg-white border-purple-200"
                  : "bg-white/5 border-purple-500/30 text-white placeholder:text-gray-400"
              }`}
            />
          </div>
        </div>

        {/* Age */}
        <div>
          <label
            className={`block mb-2 text-sm font-medium ${
              isDay ? "text-gray-700" : "text-gray-200"
            }`}
          >
            Age <span className="text-pink-500">*</span>
          </label>
          <Input
            type="number"
            name="age"
            value={formData.age}
            onChange={onInputChange}
            placeholder="25"
            required
            min="18"
            max="100"
            disabled={loading}
            className={`w-full h-12 ${
              isDay
                ? "bg-white border-purple-200"
                : "bg-white/5 border-purple-500/30 text-white placeholder:text-gray-400"
            }`}
          />
        </div>

        {/* Bio */}
        <div>
          <label
            className={`block mb-2 text-sm font-medium ${
              isDay ? "text-gray-700" : "text-gray-200"
            }`}
          >
            Short Bio (Optional)
          </label>
          <Textarea
            name="bio"
            value={formData.bio}
            onChange={onInputChange}
            placeholder="Tell us about yourself..."
            rows={4}
            disabled={loading}
            className={`w-full resize-none ${
              isDay
                ? "bg-white border-purple-200"
                : "bg-white/5 border-purple-500/30 text-white placeholder:text-gray-400"
            }`}
          />
        </div>

        {/* Profile Picture */}
        <div>
          <label
            className={`block mb-2 text-sm font-medium ${
              isDay ? "text-gray-700" : "text-gray-200"
            }`}
          >
            Profile Picture <span className="text-pink-500">*</span>
          </label>

          <div
            className={`flex items-center gap-4 p-4 rounded-xl border-2 border-dashed transition-all duration-300 ${
              !profilePicture
                ? "border-red-500 bg-red-500/10"
                : isDay
                ? "border-purple-300 hover:border-purple-400 bg-white"
                : "border-purple-500/30 hover:border-purple-500/50 bg-white/5"
            }`}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center ${
                  isDay ? "bg-purple-100" : "bg-purple-900/30"
                }`}
              >
                <Upload
                  className={`w-8 h-8 ${
                    isDay ? "text-purple-600" : "text-purple-400"
                  }`}
                />
              </div>
            )}

            <div className="flex-1">
              <input
                type="file"
                id="profile-picture"
                accept="image/*"
                onChange={onFileChange}
                disabled={loading}
                className="hidden"
              />
              <label
                htmlFor="profile-picture"
                className={`cursor-pointer inline-block px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDay
                    ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                    : "bg-purple-900/30 text-purple-300 hover:bg-purple-900/50"
                }`}
              >
                Choose File
              </label>
              <p
                className={`text-sm mt-2 ${
                  isDay ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {profilePicture ? profilePicture.name : "No file chosen"}
              </p>
            </div>
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
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <span className={`${isDay ? "text-gray-600" : "text-gray-300"}`}>
          Already using AuraMatch?{" "}
        </span>
        <Link
          href="/signin"
          className="text-purple-600 hover:text-purple-700 font-medium"
        >
          Sign In
        </Link>
      </div>
    </>
  );
}
