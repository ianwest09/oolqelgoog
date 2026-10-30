'use client';

import React, { useRef, useState } from 'react';
import { Camera, Trash2, Sparkles, Upload, ChevronDown, ChevronUp } from 'lucide-react';
import { AvatarBadge } from './AvatarBadge';
import { AVATAR_PRESETS } from '@/lib/avatarPresets';

interface AvatarUploaderProps {
  name: string;
  avatarUrl?: string;
  role: 'patient' | 'caregiver';
  onChange: (newAvatarUrl?: string) => void;
  label?: string;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  name,
  avatarUrl,
  role,
  onChange,
  label,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPresets, setShowPresets] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Resize and compress uploaded image to a small, lightweight data URL
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = event => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 160;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          onChange(dataUrl);
        }
        setIsProcessing(false);
      };
      img.onerror = () => setIsProcessing(false);
      img.src = event.target?.result as string;
    };
    reader.onerror = () => setIsProcessing(false);
    reader.readAsDataURL(file);

    // Reset input so re-selecting same file triggers onChange
    e.target.value = '';
  };

  const handleSelectPreset = (presetUrl: string) => {
    onChange(presetUrl);
  };

  const handleRemove = () => {
    onChange(undefined);
  };

  const filteredPresets = AVATAR_PRESETS.filter(
    p => p.category === role || p.category === 'general'
  );

  return (
    <div className="space-y-2.5 p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D5]">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[#14261C]">
          {label || (role === 'patient' ? "Loved one's avatar (optional)" : 'Your avatar (optional)')}
        </label>
        <span className="text-[11px] text-[#697D70]">
          Photo is purely optional
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Avatar Preview */}
        <AvatarBadge
          name={name}
          avatarUrl={avatarUrl}
          role={role}
          size="lg"
          className="shadow-2xs ring-2 ring-[#1B4332]/10"
        />

        {/* Action Controls */}
        <div className="flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id={`avatar-file-${role}`}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="min-h-[36px] px-3 py-1 rounded-xl text-xs font-semibold bg-white hover:bg-[#F2ECE0] text-[#1B4332] border border-[#D5CDBC] transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Processing...' : 'Upload photo'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPresets(!showPresets)}
              className="min-h-[36px] px-3 py-1 rounded-xl text-xs font-medium bg-white hover:bg-[#F2ECE0] text-[#2D4537] border border-[#D5CDBC] transition-colors flex items-center gap-1 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#1B4332]" />
              <span>Choose preset</span>
              {showPresets ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {avatarUrl && (
              <button
                type="button"
                onClick={handleRemove}
                className="min-h-[36px] px-2.5 py-1 rounded-xl text-xs font-medium text-[#991B1B] hover:bg-[#FEE2E2]/60 transition-colors flex items-center gap-1"
                title="Remove photo and use initials"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Remove</span>
              </button>
            )}
          </div>

          <p className="text-[11px] text-[#63766A] leading-tight">
            Add a family picture, select a gentle illustration, or leave it blank to use initials.
          </p>
        </div>
      </div>

      {/* Preset drawer */}
      {showPresets && (
        <div className="pt-2 border-t border-[#EAE3D6] space-y-1.5 animate-in fade-in duration-200">
          <div className="text-[11px] font-semibold text-[#44584C]">
            Select an illustrated portrait:
          </div>
          <div className="flex flex-wrap gap-2">
            {filteredPresets.map(preset => {
              const isSelected = avatarUrl === preset.dataUrl;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.dataUrl)}
                  className={`p-1 rounded-full border transition-all ${
                    isSelected
                      ? 'border-[#1B4332] ring-2 ring-[#1B4332]/30 scale-105'
                      : 'border-[#D5CDBC] hover:border-[#1B4332]/50 hover:scale-102 bg-white'
                  }`}
                  title={preset.label}
                >
                  <AvatarBadge
                    name={preset.label}
                    avatarUrl={preset.dataUrl}
                    role={role}
                    size="sm"
                    showBorder={false}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
