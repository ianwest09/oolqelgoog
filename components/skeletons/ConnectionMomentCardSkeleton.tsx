'use client';

import React from 'react';

export const ConnectionMomentCardSkeleton: React.FC = () => {
  return (
    <div className="py-4 sm:py-8 space-y-6 max-w-2xl mx-auto animate-pulse" aria-busy="true" aria-label="Loading connection moment">
      {/* Top provenance & reassurance bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="h-5 w-32 bg-[#E8E2D6] rounded-md" />
        <div className="flex items-center gap-2">
          <div className="h-6 w-36 bg-[#E8E2D6] rounded-md" />
          <div className="h-8 w-16 bg-[#E8E2D6] rounded-lg" />
        </div>
      </div>

      {/* Main Connection Moment Card */}
      <article className="bg-white rounded-3xl p-6 sm:p-9 border border-[#E2DDD0] shadow-sm space-y-7">
        {/* Header Block */}
        <header className="space-y-3 border-b border-[#F0EBE1] pb-6">
          <div className="flex items-center justify-between">
            <div className="h-6 w-32 bg-[#EAE4D9] rounded-md" />
            <div className="h-4 w-24 bg-[#EAE4D9] rounded-md" />
          </div>

          <div className="space-y-2 pt-1">
            <div className="h-8 w-4/5 bg-[#E8E2D6] rounded-lg" />
            <div className="h-8 w-3/5 bg-[#E8E2D6] rounded-lg" />
          </div>

          <div className="space-y-1.5 pt-2">
            <div className="h-4 w-full bg-[#F2ECE2] rounded" />
            <div className="h-4 w-5/6 bg-[#F2ECE2] rounded" />
          </div>
        </header>

        {/* Section 1: Opening Sentence Skeleton */}
        <section className="space-y-3 bg-[#FAF8F5] p-5 rounded-2xl border border-[#EBE4D8]">
          <div className="h-3.5 w-48 bg-[#E2DBD0] rounded" />
          <div className="space-y-2">
            <div className="h-5 w-11/12 bg-[#E8E2D6] rounded" />
            <div className="h-5 w-3/4 bg-[#E8E2D6] rounded" />
          </div>
        </section>

        {/* Section 2: Gentle Conversation Invitations Skeleton */}
        <section className="space-y-3">
          <div className="h-3.5 w-56 bg-[#E2DBD0] rounded" />
          <div className="space-y-2.5">
            <div className="h-14 w-full bg-[#FAF8F5] border border-[#E8E2D6] rounded-xl" />
            <div className="h-14 w-full bg-[#FAF8F5] border border-[#E8E2D6] rounded-xl" />
          </div>
        </section>

        {/* Section 3: Practical Shared Activity Skeleton */}
        <section className="space-y-3 bg-[#F3EFE7]/70 p-5 rounded-2xl border border-[#E6DFC2]">
          <div className="h-3.5 w-40 bg-[#DED6C7] rounded" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-[#EAE4D9] rounded" />
            <div className="h-4 w-4/5 bg-[#EAE4D9] rounded" />
          </div>
        </section>

        {/* Section 4: Cultural Reference & Provenance Skeleton */}
        <section className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E0D5] space-y-2.5">
          <div className="h-4 w-52 bg-[#E2DBD0] rounded" />
          <div className="h-3.5 w-4/5 bg-[#ECE6DB] rounded" />
          <div className="h-3.5 w-2/3 bg-[#ECE6DB] rounded" />
        </section>

        {/* Section 5: Caregiver comfort guide skeleton */}
        <section className="p-4 rounded-2xl bg-[#FFFBF0] border border-[#F3E3B6] space-y-2">
          <div className="h-4 w-44 bg-[#F2DEC2] rounded" />
          <div className="h-3.5 w-full bg-[#F5E6CC] rounded" />
          <div className="h-3.5 w-3/4 bg-[#F5E6CC] rounded" />
        </section>

        {/* Primary User Actions Skeleton */}
        <footer className="pt-4 border-t border-[#F0EBE1] flex flex-col sm:flex-row gap-3">
          <div className="h-[50px] flex-1 bg-[#1B4332]/15 rounded-xl" />
          <div className="h-[50px] flex-1 bg-[#EAE4D9] rounded-xl" />
        </footer>
      </article>
    </div>
  );
};
