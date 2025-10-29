// ============================================
// FILE: frontend/app/profile/components/ProfileForm.tsx
// ============================================
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Save, Loader2 } from "lucide-react";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  age: string;
  bio: string;
}

interface ProfileFormProps {
  isDay: boolean;
  isEditing: boolean;
  saving: boolean;
  formData: ProfileFormData;
  currentEmail: string;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
}

export default function ProfileForm({
  isDay,
  isEditing,
  saving,
  formData,
  currentEmail,
  onInputChange,
  onSave,
  onCancel,
  onEdit,
}: ProfileFormProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1
          className={`text-4xl font-bold ${
            isDay ? "text-gray-900" : "text-white"
          }`}
        >
          My Profile
        </h1>
        {!isEditing && (
          <Button
            onClick={onEdit}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
          >
            Edit Profile
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* First Name */}
        <div>
          <label
            className={`block mb-2 text-sm font-medium ${
              isDay ? "text-gray-700" : "text-gray-200"
            }`}
          >
            First Name
          </label>
          <Input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={onInputChange}
            disabled={!isEditing}
            className={`w-full h-12 ${
              isDay
                ? "bg-white border-purple-200"
                : "bg-white/5 border-purple-500/30 text-white"
            } ${!isEditing && "opacity-60"}`}
          />
        </div>

        {/* Last Name */}
        <div>
          <label
            className={`block mb-2 text-sm font-medium ${
              isDay ? "text-gray-700" : "text-gray-200"
            }`}
          >
            Last Name
          </label>
          <Input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={onInputChange}
            disabled={!isEditing}
            className={`w-full h-12 ${
              isDay
                ? "bg-white border-purple-200"
                : "bg-white/5 border-purple-500/30 text-white"
            } ${!isEditing && "opacity-60"}`}
          />
        </div>

        {/* Age */}
        <div>
          <label
            className={`block mb-2 text-sm font-medium ${
              isDay ? "text-gray-700" : "text-gray-200"
            }`}
          >
            Age
          </label>
          <Input
            type="number"
            name="age"
            value={formData.age}
            onChange={onInputChange}
            disabled={!isEditing}
            min="18"
            max="100"
            className={`w-full h-12 ${
              isDay
                ? "bg-white border-purple-200"
                : "bg-white/5 border-purple-500/30 text-white"
            } ${!isEditing && "opacity-60"}`}
          />
        </div>

        {/* Email (Read-only) */}
        <div>
          <label
            className={`block mb-2 text-sm font-medium ${
              isDay ? "text-gray-700" : "text-gray-200"
            }`}
          >
            Email
          </label>
          <Input
            type="email"
            value={currentEmail}
            disabled
            className={`w-full h-12 opacity-60 ${
              isDay
                ? "bg-gray-100 border-purple-200"
                : "bg-white/5 border-purple-500/30 text-white"
            }`}
          />
          <p
            className={`text-xs mt-1 ${
              isDay ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Email cannot be changed
          </p>
        </div>

        {/* Bio */}
        <div>
          <label
            className={`block mb-2 text-sm font-medium ${
              isDay ? "text-gray-700" : "text-gray-200"
            }`}
          >
            Bio
          </label>
          <Textarea
            name="bio"
            value={formData.bio}
            onChange={onInputChange}
            disabled={!isEditing}
            rows={4}
            placeholder="Tell us about yourself..."
            className={`w-full resize-none ${
              isDay
                ? "bg-white border-purple-200"
                : "bg-white/5 border-purple-500/30 text-white placeholder:text-gray-400"
            } ${!isEditing && "opacity-60"}`}
          />
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-4 pt-4">
            <Button
              onClick={onCancel}
              disabled={saving}
              className={`flex-1 ${
                isDay
                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <X className="w-5 h-5 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={onSave}
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
