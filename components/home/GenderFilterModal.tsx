// frontend/components/home/GenderFilterModal.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Users } from "lucide-react";

interface GenderFilterModalProps {
  show: boolean;
  isDay: boolean;
  selectedGenders: string[];
  onClose: () => void;
  onApply: (genders: string[]) => void;
}

export default function GenderFilterModal({
  show,
  isDay,
  selectedGenders,
  onClose,
  onApply,
}: GenderFilterModalProps) {
  const [tempGenders, setTempGenders] = useState<string[]>(selectedGenders);

  useEffect(() => {
    setTempGenders(selectedGenders);
  }, [selectedGenders, show]);

  const handleApply = () => {
    onApply(tempGenders);
  };

  const handleReset = () => {
    setTempGenders(["male", "female", "other"]);
  };

  const toggleGender = (gender: string) => {
    if (tempGenders.includes(gender)) {
      // Don't allow deselecting if it's the only one selected
      if (tempGenders.length > 1) {
        setTempGenders(tempGenders.filter((g) => g !== gender));
      }
    } else {
      setTempGenders([...tempGenders, gender]);
    }
  };

  const genderOptions = [
    { value: "male", label: "Men", emoji: "👨" },
    { value: "female", label: "Women", emoji: "👩" },
    { value: "other", label: "Other", emoji: "🧑" },
  ];

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
                Gender Filter
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
              {/* Gender Options */}
              <div>
                <label
                  className={`block mb-4 text-sm font-medium ${
                    isDay ? "text-gray-700" : "text-gray-200"
                  }`}
                >
                  Show me
                </label>
                <div className="space-y-3">
                  {genderOptions.map((option) => {
                    const isSelected = tempGenders.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        onClick={() => toggleGender(option.value)}
                        className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                          isSelected
                            ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20"
                            : isDay
                            ? "border-gray-300 hover:border-gray-400 bg-white"
                            : "border-gray-600 hover:border-gray-500 bg-white/5"
                        }`}
                      >
                        <span className="text-2xl">{option.emoji}</span>
                        <span
                          className={`flex-1 text-left font-medium ${
                            isSelected
                              ? "text-purple-600 dark:text-purple-400"
                              : isDay
                              ? "text-gray-900"
                              : "text-white"
                          }`}
                        >
                          {option.label}
                        </span>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            isSelected
                              ? "border-purple-600 bg-purple-600"
                              : isDay
                              ? "border-gray-400"
                              : "border-gray-500"
                          }`}
                        >
                          {isSelected && (
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Summary Display */}
              <div
                className={`p-4 rounded-xl text-center ${
                  isDay
                    ? "bg-purple-50 border border-purple-200"
                    : "bg-white/5 border border-purple-500/30"
                }`}
              >
                <Users
                  className={`w-8 h-8 mx-auto mb-2 ${
                    isDay ? "text-purple-600" : "text-purple-400"
                  }`}
                />
                <p
                  className={`text-sm ${
                    isDay ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  You'll see profiles of
                </p>
                <p
                  className={`text-lg font-bold mt-1 ${
                    isDay ? "text-gray-900" : "text-white"
                  }`}
                >
                  {tempGenders.length === 3
                    ? "Everyone"
                    : tempGenders
                        .map(
                          (g) =>
                            genderOptions.find((opt) => opt.value === g)
                              ?.label || g
                        )
                        .join(" & ")}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
