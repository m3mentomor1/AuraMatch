//\frontend\app\signin\page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthHeader from "../../components/auth-components/AuthHeader";
import BackgroundOrbs from "../../components/home/BackgroundOrbs";
import AuthContainer from "../../components/auth-components/AuthContainer";
import SignInForm from "../../components/signin/SignInForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SignInPage() {
  const router = useRouter();
  const [isDay, setIsDay] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign in");
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

      <AuthContainer
        isDay={isDay}
        title="Welcome Back!"
        subtitle="Sign in to continue your aura matching."
        error={error}
      >
        <SignInForm
          isDay={isDay}
          email={email}
          password={password}
          showPassword={showPassword}
          loading={loading}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          onSubmit={handleSubmit}
        />
      </AuthContainer>
    </div>
  );
}
