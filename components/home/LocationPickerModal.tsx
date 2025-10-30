// \frontend\components\home\LocationPickerModal.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, MapPin, Loader2, Navigation, Search } from "lucide-react";
import { locationService, LocationData } from "@/lib/locationService";

interface LocationPickerModalProps {
  show: boolean;
  isDay: boolean;
  onClose: () => void;
  onLocationSet: (location: LocationData) => void;
}

export default function LocationPickerModal({
  show,
  isDay,
  onClose,
  onLocationSet,
}: LocationPickerModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useMap, setUseMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 14.676, lng: 121.0437 }); // Default: San Jose del Monte
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (show && !useMap) {
      // Try to get user's approximate location for map centering
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setMapCenter({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => {
            // Silently fail, use default location
          },
          { timeout: 3000 }
        );
      }
    }
  }, [show, useMap]);

  const handleUseGPS = async () => {
    setLoading(true);
    setError(null);

    const location = await locationService.requestLocation();

    if (location) {
      onLocationSet(location);
      onClose();
    } else {
      setError(
        "Could not access your location. Please select manually on the map."
      );
      setUseMap(true);
    }

    setLoading(false);
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!useMap) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Simple coordinate calculation (this is approximate)
    const width = rect.width;
    const height = rect.height;

    // Map coordinates (approximately 0.5 degree range)
    const lat = mapCenter.lat + (0.25 - (y / height) * 0.5);
    const lng = mapCenter.lng + ((x / width) * 0.5 - 0.25);

    setSelectedLocation({ lat, lng });
  };

  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    setError(null);

    try {
      // Using Nominatim API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        setMapCenter({ lat, lng });
        setSelectedLocation({ lat, lng });
        setUseMap(true);
      } else {
        setError("Location not found. Please try a different search.");
      }
    } catch (err) {
      setError("Failed to search location. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchLocation();
    }
  };

  const handleConfirmLocation = async () => {
    if (!selectedLocation) return;

    setLoading(true);
    const locationData: LocationData = {
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
    };

    onLocationSet(locationData);
    onClose();
    setLoading(false);
  };

  const handleSwitchToMap = () => {
    setUseMap(true);
    setError(null);
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
            className={`max-w-lg w-full p-8 rounded-3xl ${
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
                Set Your Location
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

            {!useMap ? (
              <div className="space-y-6">
                <div
                  className={`p-6 rounded-xl text-center ${
                    isDay
                      ? "bg-blue-50 border border-blue-200"
                      : "bg-white/5 border border-blue-500/30"
                  }`}
                >
                  <Navigation
                    className={`w-12 h-12 mx-auto mb-3 ${
                      isDay ? "text-blue-600" : "text-blue-400"
                    }`}
                  />
                  <p
                    className={`text-sm mb-2 ${
                      isDay ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    We need your location to show you nearby matches
                  </p>
                  <p
                    className={`text-xs ${
                      isDay ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    Your exact location is never shared with other users
                  </p>
                </div>

                {/* Search Bar */}
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleSearchKeyPress}
                      placeholder="Search for a city or address..."
                      className={`w-full px-4 py-3 pr-12 rounded-full border-2 transition-all ${
                        isDay
                          ? "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                          : "bg-white/10 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                      } focus:outline-none`}
                      disabled={searching}
                    />
                    <button
                      onClick={handleSearchLocation}
                      disabled={searching || !searchQuery.trim()}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${
                        isDay
                          ? "hover:bg-gray-100 text-gray-600"
                          : "hover:bg-white/20 text-gray-300"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {searching ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Search className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div
                      className={`w-full border-t ${
                        isDay ? "border-gray-300" : "border-gray-600"
                      }`}
                    ></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span
                      className={`px-2 ${
                        isDay
                          ? "bg-white text-gray-500"
                          : "bg-gray-900 text-gray-400"
                      }`}
                    >
                      or
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleUseGPS}
                    disabled={loading}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Getting Location...
                      </>
                    ) : (
                      <>
                        <Navigation className="w-5 h-5" />
                        Use My Current Location
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleSwitchToMap}
                    className={`w-full py-3 rounded-full font-medium transition-all ${
                      isDay
                        ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    <MapPin className="w-5 h-5 mr-2" />
                    Select on Map
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p
                  className={`text-sm text-center ${
                    isDay ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  Click on the map to select your location
                </p>

                {/* Simple Map Interface */}
                <div
                  onClick={handleMapClick}
                  className={`relative w-full h-80 rounded-xl overflow-hidden cursor-crosshair border-2 ${
                    selectedLocation
                      ? "border-blue-500"
                      : isDay
                      ? "border-gray-300"
                      : "border-gray-600"
                  }`}
                  style={{
                    backgroundImage: `url(https://tile.openstreetmap.org/8/${Math.floor(
                      ((mapCenter.lng + 180) / 360) * 256
                    )}/${Math.floor(
                      ((1 -
                        Math.log(
                          Math.tan((mapCenter.lat * Math.PI) / 180) +
                            1 / Math.cos((mapCenter.lat * Math.PI) / 180)
                        ) /
                          Math.PI) /
                        2) *
                        256
                    )}.png)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Grid overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>

                  {/* Center crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-8 h-0.5 bg-blue-500"></div>
                    <div className="absolute w-0.5 h-8 bg-blue-500"></div>
                  </div>

                  {/* Selected location marker */}
                  {selectedLocation && (
                    <div
                      className="absolute -translate-x-1/2 -translate-y-full pointer-events-none"
                      style={{
                        left: `${
                          ((selectedLocation.lng - (mapCenter.lng - 0.25)) /
                            0.5) *
                          100
                        }%`,
                        top: `${
                          ((mapCenter.lat + 0.25 - selectedLocation.lat) /
                            0.5) *
                          100
                        }%`,
                      }}
                    >
                      <MapPin className="w-8 h-8 text-blue-600 drop-shadow-lg" />
                    </div>
                  )}
                </div>

                <div
                  className={`p-4 rounded-xl ${
                    isDay
                      ? "bg-blue-50 border border-blue-200"
                      : "bg-white/5 border border-blue-500/30"
                  }`}
                >
                  <p
                    className={`text-xs text-center ${
                      isDay ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    {selectedLocation
                      ? `Selected: ${selectedLocation.lat.toFixed(
                          4
                        )}, ${selectedLocation.lng.toFixed(4)}`
                      : "Click anywhere on the map to select your location"}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setUseMap(false)}
                    className={`flex-1 py-3 rounded-full font-medium transition-all ${
                      isDay
                        ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleConfirmLocation}
                    disabled={!selectedLocation || loading}
                    className="flex-1 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      "Confirm Location"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
