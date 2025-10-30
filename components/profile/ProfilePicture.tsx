// \frontend\components\profile\ProfilePicture.tsx
"use client";

import { Camera } from "lucide-react";

interface ProfilePictureProps {
  isEditing: boolean;
  previewUrl: string;
  currentPicture: string;
  userName: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfilePicture({
  isEditing,
  previewUrl,
  currentPicture,
  userName,
  onFileChange,
}: ProfilePictureProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="relative">
        <img
          src={previewUrl || currentPicture}
          alt={userName}
          className="w-32 h-32 rounded-full object-cover border-4 border-purple-500"
        />
        {isEditing && (
          <>
            <input
              type="file"
              id="profile-picture-edit"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
            <label
              htmlFor="profile-picture-edit"
              className="absolute bottom-0 right-0 p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full cursor-pointer hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
            >
              <Camera className="w-5 h-5" />
            </label>
          </>
        )}
      </div>
    </div>
  );
}
