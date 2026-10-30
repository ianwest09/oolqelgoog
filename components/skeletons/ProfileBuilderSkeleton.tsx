'use client';

import React from 'react';

export const ProfileBuilderSkeleton: React.FC = () => {
  return (
    <div className="py-4 sm:py-8 space-y-8 max-w-2xl mx-auto animate-pulse" aria-busy="true" aria-label="Loading profile builder">
      {/* Header */}
      <div className="space-y-3 border-b border-[#E6E0D5] pb-5">
        <div className="h-8 w-3/4 bg-[#E2DBD0] rounded-lg" />
        <div className="h-4 w-full bg-[#EAE4D9] rounded" />
        <div className="h-3.5 w-2/3 bg-[#EAE4D9] rounded" />
      </div>

      {/* Field 1: Primary Cultural Interest */}
      <div className="space-y-3 bg-white p-5 rounded-2xl border border-[#E4DDD0] shadow-xs">
        <div className="h-5 w-3/5 bg-[#E2DBD0] rounded" />
        <div className="h-3.5 w-4/5 bg-[#EAE4D9] rounded" />
        <div className="h-12 w-full bg-[#FAF8F5] border border-[#D5CDBC] rounded-xl" />
        <div className="flex gap-2 pt-2">
          <div className="h-7 w-20 bg-[#F4EFE6] rounded-lg" />
          <div className="h-7 w-24 bg-[#F4EFE6] rounded-lg" />
          <div className="h-7 w-28 bg-[#F4EFE6] rounded-lg" />
          <div className="h-7 w-20 bg-[#F4EFE6] rounded-lg" />
        </div>
      </div>

      {/* Field 2: Other Known Interests */}
      <div className="space-y-3 bg-white p-5 rounded-2xl border border-[#E4DDD0] shadow-xs">
        <div className="h-5 w-1/2 bg-[#E2DBD0] rounded" />
        <div className="h-3.5 w-3/4 bg-[#EAE4D9] rounded" />
        <div className="flex flex-wrap gap-2 pt-1">
          <div className="h-10 w-28 bg-[#FAF8F5] border border-[#DCD5C8] rounded-xl" />
          <div className="h-10 w-32 bg-[#FAF8F5] border border-[#DCD5C8] rounded-xl" />
          <div className="h-10 w-36 bg-[#FAF8F5] border border-[#DCD5C8] rounded-xl" />
          <div className="h-10 w-24 bg-[#FAF8F5] border border-[#DCD5C8] rounded-xl" />
        </div>
      </div>

      {/* Field 3: Desired Activity Type */}
      <div className="space-y-3 bg-white p-5 rounded-2xl border border-[#E4DDD0] shadow-xs">
        <div className="h-5 w-44 bg-[#E2DBD0] rounded" />
        <div className="h-3.5 w-64 bg-[#EAE4D9] rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {[1, 2, 3, 4].map(idx => (
            <div key={idx} className="h-16 p-3 rounded-xl border border-[#E2DBD0] bg-white flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#EAE4D9] shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-20 bg-[#E2DBD0] rounded" />
                <div className="h-3 w-36 bg-[#EAE4D9] rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Field 4 & 5: Duration and Atmosphere */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-3 bg-white p-5 rounded-2xl border border-[#E4DDD0] shadow-xs">
          <div className="h-5 w-40 bg-[#E2DBD0] rounded" />
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="h-12 bg-[#FAF8F5] border border-[#DCD5C8] rounded-xl" />
            <div className="h-12 bg-[#FAF8F5] border border-[#DCD5C8] rounded-xl" />
            <div className="h-12 bg-[#FAF8F5] border border-[#DCD5C8] rounded-xl" />
          </div>
        </div>

        <div className="space-y-3 bg-white p-5 rounded-2xl border border-[#E4DDD0] shadow-xs">
          <div className="h-5 w-36 bg-[#E2DBD0] rounded" />
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="h-11 bg-[#FAF8F5] border border-[#DCD5C8] rounded-xl" />
            <div className="h-11 bg-[#FAF8F5] border border-[#DCD5C8] rounded-xl" />
          </div>
        </div>
      </div>

      {/* Field 6: Exclusions */}
      <div className="space-y-3 bg-white p-5 rounded-2xl border border-[#E4DDD0] shadow-xs">
        <div className="h-5 w-52 bg-[#E2DBD0] rounded" />
        <div className="h-16 w-full bg-[#FAF8F5] border border-[#D5CDBC] rounded-xl" />
      </div>

      {/* Primary Action Button Skeleton */}
      <div className="pt-2">
        <div className="h-14 w-full bg-[#1B4332]/25 rounded-2xl" />
      </div>
    </div>
  );
};
