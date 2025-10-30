// \frontend\components\home\DistanceFilterModal.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, MapPin, AlertCircle } from "lucide-react";

interface DistanceFilterModalProps {
  show: boolean;
  isDay: boolean;
  maxDistance: number;
  hasLocation: boolean;
  onClose: () => void;
  onApply: (distance: number) => void;
  onRequestLocation: () => void;
}

export default function DistanceFilterModal({
  show,
  isDay,
  maxDistance,
  hasLocation,
  onClose,
  onApply,
  onRequestLocation,
}: DistanceFilterModalProps) {
  const [tempDistance, setTempDistance] = useState(maxDistance);

  useEffect(() => {
    setTempDistance(maxDistance);
  }, [maxDistance, show]);

  const handleApply = () => {
    if (!hasLocation) {
      onRequestLocation();
      return;
    }
    onApply(tempDistance);
  };

  const handleReset = () => {
    setTempDistance(500);
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
                Distance Filter
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

            {!hasLocation ? (
              <div className="space-y-6">
                <div
                  className={`p-6 rounded-xl text-center ${
                    isDay
                      ? "bg-orange-50 border border-orange-200"
                      : "bg-orange-900/20 border border-orange-500/30"
                  }`}
                >
                  <AlertCircle
                    className={`w-12 h-12 mx-auto mb-3 ${
                      isDay ? "text-orange-600" : "text-orange-400"
                    }`}
                  />
                  <p
                    className={`text-sm mb-2 font-medium ${
                      isDay ? "text-gray-900" : "text-white"
                    }`}
                  >
                    Location Required
                  </p>
                  <p
                    className={`text-sm ${
                      isDay ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    To filter by distance, we need to know your location first.
                  </p>
                </div>

                <Button
                  onClick={onRequestLocation}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Set My Location
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Distance Slider */}
                <div>
                  <label
                    className={`block mb-3 text-sm font-medium ${
                      isDay ? "text-gray-700" : "text-gray-200"
                    }`}
                  >
                    Maximum Distance:{" "}
                    <span className="text-purple-600 font-bold">
                      {tempDistance === 500 ? "Any" : `${tempDistance} km`}
                    </span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="500"
                    value={tempDistance}
                    onChange={(e) => setTempDistance(parseInt(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #2563eb 0%, #9333ea 100%)`,
                    }}
                  />
                  <div
                    className={`flex justify-between text-xs mt-1 ${
                      isDay ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    <span>1 km</span>
                    <span>500 km</span>
                  </div>
                </div>

                {/* Distance Display */}
                <div
                  className={`p-4 rounded-xl text-center ${
                    isDay
                      ? "bg-blue-50 border border-blue-200"
                      : "bg-white/5 border border-blue-500/30"
                  }`}
                >
                  <MapPin
                    className={`w-8 h-8 mx-auto mb-2 ${
                      isDay ? "text-blue-600" : "text-blue-400"
                    }`}
                  />
                  <p
                    className={`text-sm ${
                      isDay ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    Show profiles within
                  </p>
                  <p
                    className={`text-2xl font-bold mt-1 ${
                      isDay ? "text-gray-900" : "text-white"
                    }`}
                  >
                    {tempDistance === 500
                      ? "Any Distance"
                      : `${tempDistance} km`}
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
                    className="flex-1 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    Apply Filter
                  </Button>
                </div>
              </div>
            )}
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
