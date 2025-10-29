// ============================================
// FILE: frontend/app/signup/page.tsx
// ============================================
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthHeader from "../components/AuthHeader";
import BackgroundOrbs from "../home/components/BackgroundOrbs";
import AuthContainer from "../components/AuthContainer";
import SignUpForm from "./components/SignUpForm";

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

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
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
      <BackgroundOrbs isDay={isDay} />
      <AuthHeader isDay={isDay} onToggleTheme={() => setIsDay(!isDay)} />

      <div className="relative z-10 px-6 py-12 max-w-2xl mx-auto">
        <AuthContainer
          isDay={isDay}
          title="Create an Account"
          subtitle="Start your journey to find someone that matches your aura"
          error={error}
        >
          <SignUpForm
            isDay={isDay}
            loading={loading}
            formData={formData}
            profilePicture={profilePicture}
            previewUrl={previewUrl}
            onInputChange={handleInputChange}
            onTogglePassword={() =>
              setFormData({ ...formData, showPassword: !formData.showPassword })
            }
            onFileChange={handleFileChange}
            onSubmit={handleSubmit}
          />
        </AuthContainer>
      </div>

      <div className="h-12"></div>
    </div>
  );
}
