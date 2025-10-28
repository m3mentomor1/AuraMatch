"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  Heart,
  Zap,
  Users,
  ArrowRight,
  Star,
  Moon,
  Sun,
} from "lucide-react";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDay, setIsDay] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const toggleTheme = () => setIsDay(!isDay);

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
          style={{
            left: mousePosition.x / 20,
            top: mousePosition.y / 20,
          }}
        />
        <div
          className={`absolute w-96 h-96 rounded-full blur-3xl opacity-20 transition-all duration-1000 ${
            isDay ? "bg-pink-400" : "bg-pink-600"
          }`}
          style={{
            right: mousePosition.x / 30,
            bottom: mousePosition.y / 30,
          }}
        />
        <div
          className={`absolute w-96 h-96 rounded-full blur-3xl opacity-20 transition-all duration-1000 ${
            isDay ? "bg-blue-400" : "bg-blue-600"
          }`}
          style={{
            left: "50%",
            top: "50%",
            transform: `translate(${-mousePosition.x / 40}px, ${
              -mousePosition.y / 40
            }px)`,
          }}
        />
      </div>

      {/* Navigation */}
      <nav
        className={`relative z-10 px-6 py-6 flex justify-between items-center ${
          isDay ? "text-gray-800" : "text-white"
        }`}
      >
        <div className="flex items-center gap-2 text-2xl font-bold">
          <Sparkles
            className={`w-8 h-8 ${
              isDay ? "text-purple-600" : "text-purple-400"
            }`}
          />
          <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            AuraMatch
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all ${
              isDay
                ? "bg-white/50 hover:bg-white/70"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            {isDay ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <Button variant="ghost" className="hidden md:block">
            How It Works
          </Button>
          <Button variant="ghost" className="hidden md:block">
            About
          </Button>
          <Button
            className={`${
              isDay
                ? "bg-gradient-to-r from-purple-600 to-pink-600"
                : "bg-gradient-to-r from-purple-500 to-pink-500"
            } text-white`}
          >
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center space-y-8">
          <div className="inline-block">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                isDay
                  ? "bg-white/60 backdrop-blur-sm"
                  : "bg-white/10 backdrop-blur-sm"
              } border ${isDay ? "border-purple-200" : "border-purple-500/30"}`}
            >
              <Star
                className={`w-4 h-4 ${
                  isDay ? "text-yellow-500" : "text-yellow-400"
                } fill-current`}
              />
              <span
                className={`text-sm ${
                  isDay ? "text-gray-700" : "text-gray-200"
                }`}
              >
                AI-Powered Aura Matching
              </span>
            </div>
          </div>

          <h1
            className={`text-6xl md:text-8xl font-bold ${
              isDay ? "text-gray-900" : "text-white"
            }`}
          >
            Find Your
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Perfect Energy
            </span>
          </h1>

          <p
            className={`text-xl md:text-2xl max-w-2xl mx-auto ${
              isDay ? "text-gray-600" : "text-gray-300"
            }`}
          >
            AuraMatch uses advanced AI to analyze your energy, vibe, and
            personality—connecting you with people who truly resonate with your
            soul.
          </p>

          {/* Email Signup */}
          <div className="max-w-md mx-auto mt-12">
            <div
              className={`flex flex-col sm:flex-row gap-3 p-2 rounded-2xl ${
                isDay
                  ? "bg-white/60 backdrop-blur-sm"
                  : "bg-white/10 backdrop-blur-sm"
              } border ${isDay ? "border-purple-200" : "border-purple-500/30"}`}
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`flex-1 border-0 ${
                  isDay
                    ? "bg-transparent"
                    : "bg-white/5 text-white placeholder:text-gray-400"
                } focus-visible:ring-0 focus-visible:ring-offset-0`}
              />
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 hover:from-purple-700 hover:to-pink-700">
                Join Waitlist
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <p
              className={`text-sm mt-3 ${
                isDay ? "text-gray-500" : "text-gray-400"
              }`}
            >
              ✨ Be among the first 1,000 to experience AuraMatch
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-20">
            <div className={`${isDay ? "text-gray-800" : "text-white"}`}>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                10K+
              </div>
              <div
                className={`text-sm ${
                  isDay ? "text-gray-600" : "text-gray-300"
                }`}
              >
                Auras Matched
              </div>
            </div>
            <div className={`${isDay ? "text-gray-800" : "text-white"}`}>
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                94%
              </div>
              <div
                className={`text-sm ${
                  isDay ? "text-gray-600" : "text-gray-300"
                }`}
              >
                Energy Match Rate
              </div>
            </div>
            <div className={`${isDay ? "text-gray-800" : "text-white"}`}>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                2M+
              </div>
              <div
                className={`text-sm ${
                  isDay ? "text-gray-600" : "text-gray-300"
                }`}
              >
                Vibes Analyzed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-5xl font-bold mb-4 ${
              isDay ? "text-gray-900" : "text-white"
            }`}
          >
            How AuraMatch Works
          </h2>
          <p className={`text-lg ${isDay ? "text-gray-600" : "text-gray-300"}`}>
            Science meets intuition in the perfect match
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div
            className={`p-8 rounded-3xl ${
              isDay
                ? "bg-white/60 backdrop-blur-sm"
                : "bg-white/10 backdrop-blur-sm"
            } border ${
              isDay ? "border-purple-200" : "border-purple-500/30"
            } hover:scale-105 transition-transform duration-300`}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3
              className={`text-2xl font-bold mb-4 ${
                isDay ? "text-gray-900" : "text-white"
              }`}
            >
              AI Aura Analysis
            </h3>
            <p className={`${isDay ? "text-gray-600" : "text-gray-300"}`}>
              Our advanced AI analyzes your photos, interests, and energy to
              create a unique aura profile that captures your true essence.
            </p>
          </div>

          {/* Feature 2 */}
          <div
            className={`p-8 rounded-3xl ${
              isDay
                ? "bg-white/60 backdrop-blur-sm"
                : "bg-white/10 backdrop-blur-sm"
            } border ${
              isDay ? "border-purple-200" : "border-purple-500/30"
            } hover:scale-105 transition-transform duration-300`}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3
              className={`text-2xl font-bold mb-4 ${
                isDay ? "text-gray-900" : "text-white"
              }`}
            >
              Energy Matching
            </h3>
            <p className={`${isDay ? "text-gray-600" : "text-gray-300"}`}>
              We match you with people whose energy frequencies complement
              yours, creating deeper, more meaningful connections.
            </p>
          </div>

          {/* Feature 3 */}
          <div
            className={`p-8 rounded-3xl ${
              isDay
                ? "bg-white/60 backdrop-blur-sm"
                : "bg-white/10 backdrop-blur-sm"
            } border ${
              isDay ? "border-purple-200" : "border-purple-500/30"
            } hover:scale-105 transition-transform duration-300`}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3
              className={`text-2xl font-bold mb-4 ${
                isDay ? "text-gray-900" : "text-white"
              }`}
            >
              Vibe Verification
            </h3>
            <p className={`${isDay ? "text-gray-600" : "text-gray-300"}`}>
              Real-time compatibility scores help you understand the connection
              potential before you even say hello.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20 max-w-5xl mx-auto">
        <div
          className={`p-12 rounded-3xl ${
            isDay
              ? "bg-gradient-to-br from-purple-500 to-pink-500"
              : "bg-gradient-to-br from-purple-600 to-pink-600"
          } text-white text-center`}
        >
          <Users className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to Find Your Match?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands already discovering their perfect energy match
          </p>
          <Button
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`relative z-10 px-6 py-12 border-t ${
          isDay
            ? "border-purple-200 text-gray-600"
            : "border-purple-500/30 text-gray-400"
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles
              className={`w-6 h-6 ${
                isDay ? "text-purple-600" : "text-purple-400"
              }`}
            />
            <span className="font-semibold">AuraMatch</span>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-purple-600 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-purple-600 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-purple-600 transition-colors">
              Contact
            </a>
          </div>
          <div className="text-sm">© 2024 AuraMatch. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
