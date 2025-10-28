// \frontend\app\page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Heart,
  Zap,
  Users,
  ArrowRight,
  Star,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react";

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDay, setIsDay] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const toggleTheme = () => setIsDay(!isDay);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features-section");
    featuresSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
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
        className={`relative z-20 px-6 py-6 flex justify-between items-center ${
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

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
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

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Button
              variant="ghost"
              className="text-base font-medium h-11 px-6"
              onClick={scrollToFeatures}
            >
              How AuraMatch Works
            </Button>
            <Button
              className={`text-base font-medium h-11 px-6 text-white ${
                isDay
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              }`}
            >
              Sign In
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            onClick={toggleMenu}
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`absolute top-20 right-6 z-10 md:hidden rounded-2xl shadow-lg p-4 flex flex-col gap-3 z-[9999] ${
              isDay
                ? "bg-white/90 text-gray-800 border border-purple-200"
                : "bg-white/10 text-white border border-purple-500/30 backdrop-blur-md"
            }`}
          >
            <Button
              variant="ghost"
              className="w-full justify-center text-base"
              onClick={() => {
                scrollToFeatures();
                setMenuOpen(false);
              }}
            >
              How AuraMatch Works
            </Button>
            <Button
              className={`w-full justify-center text-base text-white ${
                isDay
                  ? "bg-gradient-to-r from-purple-600 to-pink-600"
                  : "bg-gradient-to-r from-purple-500 to-pink-500"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Sign In
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        <motion.div
          className="text-center space-y-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="inline-block">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                isDay
                  ? "bg-white/60 backdrop-blur-sm border border-purple-200"
                  : "bg-white/10 backdrop-blur-sm border border-purple-500/30"
              }`}
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
                Energy-Based Matching
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
            className={`text-xl md:text-2xl max-w-3xl mx-auto ${
              isDay ? "text-gray-600" : "text-gray-300"
            }`}
          >
            Connect with people who truly resonate with your soul. AuraMatch
            analyzes your energy, vibe, and personality to find your perfect
            match.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-7 text-xl hover:from-purple-700 hover:to-pink-700 flex items-center justify-center"
            >
              Get Started Free
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-20">
            {[
              { label: "Auras Matched", value: "10K+" },
              { label: "Energy Match Rate", value: "94%" },
              { label: "Vibes Analyzed", value: "2M+" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
                className={isDay ? "text-gray-800" : "text-white"}
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div
                  className={`text-sm ${
                    isDay ? "text-gray-600" : "text-gray-300"
                  }`}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section
        id="features-section"
        className="relative z-10 px-6 py-20 max-w-7xl mx-auto"
      >
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
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
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Sparkles className="w-8 h-8 text-white" />,
              title: "Aura Analysis",
              text: "Our unique algorithm analyzes your photos, interests, and energy to create an authentic aura profile that captures your true essence.",
              gradient: "from-purple-500 to-pink-500",
            },
            {
              icon: <Zap className="w-8 h-8 text-white" />,
              title: "Energy Matching",
              text: "We match you with people whose energy frequencies complement yours, creating deeper, more meaningful connections.",
              gradient: "from-pink-500 to-blue-500",
            },
            {
              icon: <Heart className="w-8 h-8 text-white" />,
              title: "Vibe Verification",
              text: "Real-time compatibility scores help you understand the connection potential before you even say hello.",
              gradient: "from-blue-500 to-purple-500",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              className={`p-8 rounded-3xl border hover:scale-105 transition-transform duration-300 ${
                isDay
                  ? "bg-white/60 border-purple-200"
                  : "bg-white/10 border-purple-500/30"
              } backdrop-blur-sm`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-6`}
              >
                {f.icon}
              </div>
              <h3
                className={`text-2xl font-bold mb-4 ${
                  isDay ? "text-gray-900" : "text-white"
                }`}
              >
                {f.title}
              </h3>
              <p className={isDay ? "text-gray-600" : "text-gray-300"}>
                {f.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20 max-w-5xl mx-auto">
        <motion.div
          className={`p-12 rounded-3xl text-white text-center ${
            isDay
              ? "bg-gradient-to-br from-purple-500 to-pink-500"
              : "bg-gradient-to-br from-purple-600 to-pink-600"
          }`}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
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
            className="bg-white text-purple-600 hover:bg-gray-100 text-xl px-10 py-7"
          >
            Get Started Now
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer
        className={`relative z-10 px-6 py-12 border-t ${
          isDay
            ? "border-purple-200 text-gray-600"
            : "border-purple-500/30 text-gray-400"
        }`}
      >
        <motion.div
          className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
        >
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
          <div className="text-sm">© 2025 AuraMatch. All rights reserved.</div>
        </motion.div>
      </footer>
    </motion.div>
  );
}
