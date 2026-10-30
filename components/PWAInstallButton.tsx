'use client';

import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running standalone, do not show button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="min-h-[36px] px-3 py-1.5 rounded-lg bg-[#1B4332] text-[#FAF8F5] text-xs font-semibold hover:bg-[#255C45] transition-all flex items-center gap-1.5 shadow-xs focus-visible:outline-2 focus-visible:outline-[#1B4332]"
        title="Install Kinship app to your home screen or desktop for offline access"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="min-h-[36px] px-3 py-1.5 rounded-lg border border-[#D5CDBC] bg-white text-[#2D4537] text-xs font-semibold hover:bg-[#FAF8F5] transition-colors flex items-center gap-1.5"
          title="Install Kinship on iPhone or iPad"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-[#E2DDD0] space-y-4 text-left">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#14261C]">
                  Install Kinship on iOS
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-[#526659] hover:text-[#14261C]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#44584C] leading-relaxed">
                Add Kinship directly to your iPhone or iPad home screen for quick, offline access:
              </p>

              <div className="space-y-3 p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EBE4D8] text-xs text-[#2D4537]">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded bg-white border border-[#D5CDBC] shrink-0 mt-0.5">
                    <Share2 className="w-4 h-4 text-[#1B4332]" />
                  </div>
                  <div>
                    <strong>Step 1:</strong> Tap the <strong>Share</strong> icon in the Safari bottom toolbar.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded bg-white border border-[#D5CDBC] shrink-0 mt-0.5">
                    <PlusSquare className="w-4 h-4 text-[#1B4332]" />
                  </div>
                  <div>
                    <strong>Step 2:</strong> Scroll down and tap <strong>Add to Home Screen</strong>.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full min-h-[44px] rounded-xl bg-[#1B4332] py-2 text-xs font-semibold text-white hover:bg-[#255C45] transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
