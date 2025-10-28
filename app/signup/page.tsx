// \frontend\app\signup\page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  Moon,
  Sun,
  ArrowLeft,
  Upload,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SignUpPage() {
  const router = useRouter();
  const [isDay, setIsDay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    showPassword: false,
    firstName: "",
    lastName: "",
    age: "",
    bio: "",
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  const toggleTheme = () => setIsDay(!isDay);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profilePicture) {
      setError("⚠️ Please upload a profile picture before continuing.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("age", formData.age);
      formDataToSend.append("bio", formData.bio);
      formDataToSend.append("profilePicture", profilePicture);

      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      // Save token to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to home/discovery page
      router.push("/home");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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

      {/* Sign Up Form */}
      <div className="relative z-10 px-6 py-12 max-w-2xl mx-auto">
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
              Create Account
            </h1>
            <p className={`mb-8 ${isDay ? "text-gray-600" : "text-gray-300"}`}>
              Start your journey to find someone that matches your aura
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

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    onClick={() =>
                      setFormData({
                        ...formData,
                        showPassword: !formData.showPassword,
                      })
                    }
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                    error && !profilePicture
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
                      onChange={handleFileChange}
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
          </div>
        </motion.div>
      </div>

      <div className="h-12"></div>
    </div>
  );
}
