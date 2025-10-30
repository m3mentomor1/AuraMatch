// ============================================
// FILE: frontend/app/home/components/BackgroundOrbs.tsx
// ============================================
"use client";

interface BackgroundOrbsProps {
  isDay: boolean;
}

export default function BackgroundOrbs({ isDay }: BackgroundOrbsProps) {
  return (
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
  );
}
