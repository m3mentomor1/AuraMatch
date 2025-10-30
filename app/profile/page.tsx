// frontend/app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProfileHeader from "../../components/profile/ProfileHeader";
import BackgroundOrbs from "../../components/home/BackgroundOrbs";
import ProfilePicture from "../../components/profile/ProfilePicture";
import ProfileForm from "../../components/profile/ProfileForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
    gender: "",
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
      gender: user.gender || "",
    });
    setLoading(false);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
      formDataToSend.append("gender", formData.gender);

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
      gender: currentUser.gender || "",
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
      <BackgroundOrbs isDay={isDay} />

      <ProfileHeader isDay={isDay} onToggleTheme={() => setIsDay(!isDay)} />

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

            <ProfilePicture
              isEditing={isEditing}
              previewUrl={previewUrl}
              currentPicture={currentUser.profilePicture}
              userName={currentUser.firstName}
              onFileChange={handleFileChange}
            />

            <ProfileForm
              isDay={isDay}
              isEditing={isEditing}
              saving={saving}
              formData={formData}
              currentEmail={currentUser.email}
              onInputChange={handleInputChange}
              onSave={handleSave}
              onCancel={handleCancel}
              onEdit={() => setIsEditing(true)}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
