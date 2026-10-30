'use client';

import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-[#2D4537] text-[#FAF8F5] px-3.5 py-2 text-xs font-semibold shadow-lg border border-[#3E5D4B] animate-fade-in"
    >
      <WifiOff className="w-4 h-4 text-[#E6C687] animate-pulse shrink-0" />
      <div>
        <span>Offline Mode</span>
        <span className="text-[11px] font-normal text-[#C8D9CE] block sm:inline sm:ml-1">
          · Saved moments & timer work offline
        </span>
      </div>
    </div>
  );
};
