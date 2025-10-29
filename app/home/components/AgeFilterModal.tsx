// ============================================
// FILE: frontend/app/home/components/AgeFilterModal.tsx
// ============================================
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AgeFilterModalProps {
  show: boolean;
  isDay: boolean;
  minAge: number;
  maxAge: number;
  onClose: () => void;
  onApply: (min: number, max: number) => void;
}

export default function AgeFilterModal({
  show,
  isDay,
  minAge,
  maxAge,
  onClose,
  onApply,
}: AgeFilterModalProps) {
  const [tempMinAge, setTempMinAge] = useState(minAge);
  const [tempMaxAge, setTempMaxAge] = useState(maxAge);

  useEffect(() => {
    setTempMinAge(minAge);
    setTempMaxAge(maxAge);
  }, [minAge, maxAge, show]);

  const handleApply = () => {
    onApply(tempMinAge, tempMaxAge);
  };

  const handleReset = () => {
    setTempMinAge(18);
    setTempMaxAge(100);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`max-w-md w-full p-8 rounded-3xl ${
              isDay
                ? "bg-white border border-purple-200"
                : "bg-gray-900 border border-purple-500/30"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className={`text-2xl font-bold ${
                  isDay ? "text-gray-900" : "text-white"
                }`}
              >
                Age Filter
              </h3>
              <button
                onClick={onClose}
                className={`p-2 rounded-full transition-colors ${
                  isDay ? "hover:bg-gray-100" : "hover:bg-white/10"
                }`}
              >
                <X
                  className={`w-6 h-6 ${
                    isDay ? "text-gray-700" : "text-white"
                  }`}
                />
              </button>
            </div>

            <div className="space-y-6">
              {/* Min Age Slider */}
              <div>
                <label
                  className={`block mb-3 text-sm font-medium ${
                    isDay ? "text-gray-700" : "text-gray-200"
                  }`}
                >
                  Minimum Age:{" "}
                  <span className="text-purple-600 font-bold">
                    {tempMinAge}
                  </span>
                </label>
                <input
                  type="range"
                  min="18"
                  max="100"
                  value={tempMinAge}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value <= tempMaxAge) {
                      setTempMinAge(value);
                    }
                  }}
                  className="w-full h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #9333ea 0%, #ec4899 100%)`,
                  }}
                />
                <div
                  className={`flex justify-between text-xs mt-1 ${
                    isDay ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  <span>18</span>
                  <span>100</span>
                </div>
              </div>

              {/* Max Age Slider */}
              <div>
                <label
                  className={`block mb-3 text-sm font-medium ${
                    isDay ? "text-gray-700" : "text-gray-200"
                  }`}
                >
                  Maximum Age:{" "}
                  <span className="text-pink-600 font-bold">{tempMaxAge}</span>
                </label>
                <input
                  type="range"
                  min="18"
                  max="100"
                  value={tempMaxAge}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= tempMinAge) {
                      setTempMaxAge(value);
                    }
                  }}
                  className="w-full h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #9333ea 0%, #ec4899 100%)`,
                  }}
                />
                <div
                  className={`flex justify-between text-xs mt-1 ${
                    isDay ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  <span>18</span>
                  <span>100</span>
                </div>
              </div>

              {/* Age Range Display */}
              <div
                className={`p-4 rounded-xl text-center ${
                  isDay
                    ? "bg-purple-50 border border-purple-200"
                    : "bg-white/5 border border-purple-500/30"
                }`}
              >
                <p
                  className={`text-sm ${
                    isDay ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  You'll see profiles between
                </p>
                <p
                  className={`text-2xl font-bold mt-1 ${
                    isDay ? "text-gray-900" : "text-white"
                  }`}
                >
                  {tempMinAge} - {tempMaxAge} years old
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleReset}
                  className={`flex-1 py-3 rounded-full font-medium transition-all ${
                    isDay
                      ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  Reset
                </Button>
                <Button
                  onClick={handleApply}
                  className="flex-1 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Apply Filter
                </Button>
              </div>
            </div>
          </motion.div>

          <style jsx>{`
            input[type="range"].slider::-webkit-slider-thumb {
              appearance: none;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: white;
              cursor: pointer;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            }

            input[type="range"].slider::-moz-range-thumb {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: white;
              cursor: pointer;
              border: none;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
