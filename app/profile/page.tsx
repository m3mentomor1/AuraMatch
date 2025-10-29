// \frontend\app\profile\page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  Moon,
  Sun,
  ArrowLeft,
  Camera,
  Save,
  X,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProfilePage() {
  const router = useRouter();
  const [isDay, setIsDay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    bio: "",
  });

  const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/signin");
      return;
    }

    const user = JSON.parse(userData);
    setCurrentUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName || "",
      age: user.age.toString(),
      bio: user.bio || "",
    });
    setLoading(false);
  }, []);

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
      setNewProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("age", formData.age);
      formDataToSend.append("bio", formData.bio);

      if (newProfilePicture) {
        formDataToSend.append("profilePicture", newProfilePicture);
      }

      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      setCurrentUser(data.user);
      setIsEditing(false);
      setNewProfilePicture(null);
      setPreviewUrl("");
      setSuccess("Profile updated successfully!");

      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      firstName: currentUser.firstName,
      lastName: currentUser.lastName || "",
      age: currentUser.age.toString(),
      bio: currentUser.bio || "",
    });
    setNewProfilePicture(null);
    setPreviewUrl("");
    setError("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

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
        <Link
          href="/home"
          className="flex items-center gap-2 text-2xl font-bold"
        >
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

      {/* Profile Content */}
      <div className="relative z-10 px-6 py-12 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/home"
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
            <div className="flex items-center justify-between mb-6">
              <h1
                className={`text-4xl font-bold ${
                  isDay ? "text-gray-900" : "text-white"
                }`}
              >
                My Profile
              </h1>
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                >
                  Edit Profile
                </Button>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-500"
              >
                {success}
              </motion.div>
            )}

            {/* Profile Picture */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <img
                  src={previewUrl || `${currentUser.profilePicture}`}
                  alt={currentUser.firstName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-purple-500"
                />
                {isEditing && (
                  <>
                    <input
                      type="file"
                      id="profile-picture-edit"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="profile-picture-edit"
                      className="absolute bottom-0 right-0 p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full cursor-pointer hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                    >
                      <Camera className="w-5 h-5" />
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* Profile Details */}
            <div className="space-y-6">
              {/* First Name */}
              <div>
                <label
                  className={`block mb-2 text-sm font-medium ${
                    isDay ? "text-gray-700" : "text-gray-200"
                  }`}
                >
                  First Name
                </label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full h-12 ${
                    isDay
                      ? "bg-white border-purple-200"
                      : "bg-white/5 border-purple-500/30 text-white"
                  } ${!isEditing && "opacity-60"}`}
                />
              </div>

              {/* Last Name */}
              <div>
                <label
                  className={`block mb-2 text-sm font-medium ${
                    isDay ? "text-gray-700" : "text-gray-200"
                  }`}
                >
                  Last Name
                </label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full h-12 ${
                    isDay
                      ? "bg-white border-purple-200"
                      : "bg-white/5 border-purple-500/30 text-white"
                  } ${!isEditing && "opacity-60"}`}
                />
              </div>

              {/* Age */}
              <div>
                <label
                  className={`block mb-2 text-sm font-medium ${
                    isDay ? "text-gray-700" : "text-gray-200"
                  }`}
                >
                  Age
                </label>
                <Input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  min="18"
                  max="100"
                  className={`w-full h-12 ${
                    isDay
                      ? "bg-white border-purple-200"
                      : "bg-white/5 border-purple-500/30 text-white"
                  } ${!isEditing && "opacity-60"}`}
                />
              </div>

              {/* Email (Read-only) */}
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
                  value={currentUser.email}
                  disabled
                  className={`w-full h-12 opacity-60 ${
                    isDay
                      ? "bg-gray-100 border-purple-200"
                      : "bg-white/5 border-purple-500/30 text-white"
                  }`}
                />
                <p
                  className={`text-xs mt-1 ${
                    isDay ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Email cannot be changed
                </p>
              </div>

              {/* Bio */}
              <div>
                <label
                  className={`block mb-2 text-sm font-medium ${
                    isDay ? "text-gray-700" : "text-gray-200"
                  }`}
                >
                  Bio
                </label>
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={4}
                  placeholder="Tell us about yourself..."
                  className={`w-full resize-none ${
                    isDay
                      ? "bg-white border-purple-200"
                      : "bg-white/5 border-purple-500/30 text-white placeholder:text-gray-400"
                  } ${!isEditing && "opacity-60"}`}
                />
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleCancel}
                    disabled={saving}
                    className={`flex-1 ${
                      isDay
                        ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
