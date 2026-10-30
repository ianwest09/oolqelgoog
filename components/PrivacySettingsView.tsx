'use client';

import React, { useState } from 'react';
import { Shield, Lock, Trash2, CheckCircle2, Server, Key, AlertCircle } from 'lucide-react';

interface PrivacySettingsViewProps {
  onClearAllLocalData: () => void;
  savedCount: number;
  isDemonstration: boolean;
  qlooLiveActive: boolean;
}

export const PrivacySettingsView: React.FC<PrivacySettingsViewProps> = ({
  onClearAllLocalData,
  savedCount,
  isDemonstration,
  qlooLiveActive,
}) => {
  const [cleared, setCleared] = useState(false);

  const handleClear = () => {
    if (window.confirm('This will wipe all saved moments and cached profile inputs from this browser. Proceed?')) {
      onClearAllLocalData();
      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
    }
  };

  return (
    <div className="py-6 sm:py-8 space-y-8 max-w-2xl mx-auto text-[#14261C]">
      {/* Header */}
      <div className="space-y-2 border-b border-[#E6E0D5] pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Privacy, Dignity & Data Controls
        </h1>
        <p className="text-base text-[#465B4E] leading-relaxed">
          Kinship was built from the ground up to protect vulnerable individuals and prioritize caregiver trust.
        </p>
      </div>

      {/* Privacy Guarantees */}
      <section className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2DDD0] shadow-xs space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#1B4332]" />
          <span>Local-Only Architecture</span>
        </h2>
        <div className="space-y-3 text-xs sm:text-sm text-[#405447]">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5" />
            <p><strong>No Patient Records or Diagnosis Collected:</strong> We never ask for full names, medical histories, cognitive diagnoses, or healthcare ID numbers.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5" />
            <p><strong>No Remote User Tracking:</strong> There are no advertising trackers, third-party analytics pixels, or telemetry beacons recording your interactions.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5" />
            <p><strong>Device-Only Storage:</strong> Your saved connection moments are kept entirely in your browser&apos;s private local storage.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5" />
            <p><strong>No Secret Key Exposure:</strong> All integration API keys (Qloo and Gemini) are securely accessed on the server side and never sent to the browser.</p>
          </div>
        </div>
      </section>

      {/* Integration & Mode Status */}
      <section className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2DDD0] shadow-xs space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Server className="w-5 h-5 text-[#1B4332]" />
          <span>Integration & Environment Status</span>
        </h2>

        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9] space-y-3 text-xs sm:text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[#55695E] font-medium">Qloo Taste Graph Mode:</span>
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
              qlooLiveActive
                ? 'bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9]'
                : 'bg-[#FFF8E7] text-[#855B11] border border-[#F0DFB7]'
            }`}>
              {qlooLiveActive ? 'Live Qloo API Active' : 'Demonstration Mode (Sample Data)'}
            </span>
          </div>

          <p className="text-xs text-[#65796D] leading-relaxed">
            {qlooLiveActive
              ? 'Kinship is connected to the live Qloo Hackathon Taste API (https://hackathon.api.qloo.com). Real cultural entities and taste graph correlations are queried.'
              : 'Live Qloo API credentials are not currently configured. Kinship is operating in Demonstration Mode using illustrative cultural profiles and taste graph fixtures. No live API calls are simulated or falsely attributed.'}
          </p>
        </div>
      </section>

      {/* Local Data Management */}
      <section className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2DDD0] shadow-xs space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-[#8C3A3A]" />
          <span>Manage Local Data</span>
        </h2>

        <p className="text-xs sm:text-sm text-[#4E6254] leading-relaxed">
          You currently have <strong>{savedCount}</strong> moment{savedCount !== 1 ? 's' : ''} stored locally on this device. You can clear this data at any time.
        </p>

        <div>
          <button
            onClick={handleClear}
            className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[#D5CDBC] text-sm font-semibold text-[#8C3A3A] hover:bg-[#FEF2F2] hover:border-[#FECACA] transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear all stored moments and reset app</span>
          </button>
        </div>

        {cleared && (
          <div className="p-3 bg-[#E8F5E9] border border-[#C8E6C9] text-xs text-[#1B5E20] font-medium rounded-xl">
            All locally stored data has been cleared.
          </div>
        )}
      </section>

      {/* Non-Clinical Medical Disclaimer */}
      <section className="p-6 rounded-3xl bg-[#FFF8E7] border border-[#F0DFB7] space-y-2 text-xs sm:text-sm text-[#735212] leading-relaxed">
        <h3 className="font-bold text-[#593E07] flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-[#855B11]" />
          <span>Caregiver Safety Notice</span>
        </h3>
        <p>
          Kinship is intended solely as an empathetic social connection tool for caregivers and family members. It is not an Alzheimer&apos;s or dementia diagnosis tool, medical treatment, memory restoration protocol, or cognitive exam. Always follow the guidance of licensed healthcare practitioners.
        </p>
      </section>
    </div>
  );
};
