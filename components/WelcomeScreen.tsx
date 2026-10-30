'use client';

import React from 'react';
import {
  Sparkles,
  Music,
  BookOpen,
  Clock,
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  BookmarkCheck,
  PenLine,
  History,
  Star,
} from 'lucide-react';
import { DEMO_PROFILES } from '@/lib/demonstrationData';
import { CulturalProfile, ConnectionMoment } from '@/lib/types';
import { AvatarBadge } from './AvatarBadge';

interface WelcomeScreenProps {
  onCreateClick: () => void;
  onSelectSampleProfile: (profile: CulturalProfile) => void;
  recentMoments?: ConnectionMoment[];
  onSelectRecentMoment?: (moment: ConnectionMoment) => void;
  onViewAllSaved?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onCreateClick,
  onSelectSampleProfile,
  recentMoments = [],
  onSelectRecentMoment,
  onViewAllSaved,
}) => {
  const hasRecentMoments = recentMoments && recentMoments.length > 0;
  const displayedRecentMoments = recentMoments.slice(0, 3);

  return (
    <div className="py-6 sm:py-10 space-y-10">
      {/* Hero Section */}
      <section className="text-center max-w-2xl mx-auto space-y-5 px-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAE4D9] text-[#2D4537] text-xs font-semibold tracking-wide">
          <HeartHandshake className="w-3.5 h-3.5 text-[#1B4332]" />
          <span>Cultural Intelligence & Shared Moments</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#14261C] leading-[1.15]">
          Make room for a meaningful moment.
        </h1>

        <p className="text-lg sm:text-xl text-[#3E5346] leading-relaxed max-w-xl mx-auto">
          Discover familiar interests and turn them into simple experiences you can share together.
        </p>

        {/* Primary and Secondary Call to Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={onCreateClick}
            className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 rounded-xl bg-[#1B4332] hover:bg-[#255C45] text-[#FAF8F5] text-base font-semibold shadow-sm transition-all flex items-center justify-center gap-2.5 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-[#1B4332]"
          >
            <Sparkles className="w-5 h-5" />
            <span>Create a moment</span>
          </button>

          <button
            onClick={() => onSelectSampleProfile(DEMO_PROFILES[0].profile)}
            className="w-full sm:w-auto min-h-[52px] px-6 py-3.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE2] text-[#1B4332] border border-[#D5CDBC] text-base font-semibold transition-all flex items-center justify-center gap-2 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-[#1B4332]"
          >
            <span>Explore an example</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Gentle Core Framing */}
        <div className="pt-2 text-xs sm:text-sm text-[#5C7164] bg-[#F2ECE2]/60 rounded-xl p-3.5 border border-[#E6E0D5] max-w-lg mx-auto">
          <p className="font-medium text-[#294032]">
            Every activity is a gentle suggestion, never a memory test.
          </p>
          <p className="text-xs text-[#526659] mt-0.5">
            Designed for unhurried presence. You can slow down, pause, or change the activity whenever you wish.
          </p>
        </div>
      </section>

      {/* Recent Moments Quick-Access Section (shows up to 3 saved moments) */}
      {hasRecentMoments && (
        <section aria-labelledby="recent-moments-title" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E1D5] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#EAE4D9] text-[#1B4332]">
                <History className="w-4 h-4" />
              </div>
              <div>
                <h2 id="recent-moments-title" className="text-lg font-bold text-[#14261C]">
                  Recent Moments
                </h2>
                <p className="text-xs text-[#526659]">
                  Pick up right where you left off with your saved connection moments.
                </p>
              </div>
            </div>

            {onViewAllSaved && (
              <button
                onClick={onViewAllSaved}
                className="text-xs font-semibold text-[#1B4332] hover:text-[#255C45] hover:underline flex items-center gap-1 self-start sm:self-auto min-h-[36px]"
              >
                <span>View all saved ({recentMoments.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {displayedRecentMoments.map(moment => (
              <div
                key={moment.id}
                className="bg-white rounded-2xl p-5 border border-[#E2DDD0] shadow-xs hover:border-[#1B4332]/50 hover:shadow-sm transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="flex items-center gap-1 font-semibold text-[#1B4332] bg-[#EAE4D9]/80 px-2 py-0.5 rounded-md">
                      <Clock className="w-3 h-3" />
                      {moment.suggestedDurationMinutes}m unhurried
                    </span>
                    {moment.resonanceScore ? (
                      <span className="text-[11px] font-semibold text-[#1B5E20] bg-[#E8F5E9] px-2 py-0.5 rounded flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{moment.resonanceScore}/5★</span>
                      </span>
                    ) : (
                      <span className="text-[#65796D] capitalize truncate">
                        {moment.sourceProfile?.atmosphere || 'calm'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <AvatarBadge
                      name={moment.sourceProfile?.patient?.name || 'Loved One'}
                      avatarUrl={moment.sourceProfile?.patient?.avatarUrl}
                      role="patient"
                      size="sm"
                    />
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-[#14261C] group-hover:text-[#1B4332] transition-colors truncate">
                        {moment.title}
                      </h3>
                      <div className="text-[11px] text-[#55695D] truncate">
                        {moment.sourceProfile?.patient?.name || 'Loved One'}
                        {moment.sourceProfile?.caregiver?.relationship ? ` & ${moment.sourceProfile.caregiver.relationship}` : ''}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#44584C] italic bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EDE7DC] line-clamp-2">
                    &ldquo;{moment.openingSentence}&rdquo;
                  </p>

                  <div className="text-[11px] text-[#65796D] flex items-center gap-1">
                    <Music className="w-3 h-3 text-[#1B4332] shrink-0" />
                    <span className="truncate">
                      <strong>Interest:</strong> {moment.sourceProfile?.primaryInterest}
                    </span>
                  </div>

                  {moment.personalNotes && (
                    <div className="p-2 rounded-lg bg-[#FCFAF6] border border-[#E8E1D3] text-[11px] text-[#2E4536] flex items-start gap-1.5">
                      <PenLine className="w-3 h-3 text-[#1B4332] shrink-0 mt-0.5" />
                      <span className="line-clamp-2">
                        <strong>Reflection:</strong> {moment.personalNotes}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-[#F0EBE1] flex items-center justify-between gap-2">
                  <span className="text-[11px] text-[#7A8E80]">
                    {new Date(moment.createdAt).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => onSelectRecentMoment && onSelectRecentMoment(moment)}
                    className="min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1B4332] group-hover:bg-[#255C45] text-white transition-colors flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-[#1B4332]"
                  >
                    <span>Open activity</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Illustrative Demonstration Profiles */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#14261C]">
              Explore sample cultural profiles
            </h2>
            <p className="text-sm text-[#526659]">
              Try a pre-configured profile to see how Kinship pairs cultural taste, age, and nationality with shared sensory activities.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEMO_PROFILES.map((sample, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-[#E4DDD0] shadow-xs hover:border-[#1B4332]/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1B4332] bg-[#EAE4D9]/70 px-2 py-0.5 rounded-md">
                    {sample.profile.activityType.toUpperCase()} · {sample.profile.durationMinutes} MINS
                  </span>
                  <span className="text-xs text-[#6F8276] capitalize">
                    {sample.profile.atmosphere}
                  </span>
                </div>

                {/* Profile Avatar Header */}
                <div className="flex items-center gap-3 pt-1">
                  <AvatarBadge
                    name={sample.profile.patient?.name}
                    avatarUrl={sample.profile.patient?.avatarUrl}
                    role="patient"
                    size="md"
                    className="shadow-2xs ring-1 ring-[#1B4332]/20"
                  />
                  <div>
                    <h3 className="text-base font-bold text-[#14261C]">
                      {sample.label}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#637669]">
                      <span>Age {sample.profile.patient?.age}</span>
                      <span>·</span>
                      <span>{sample.profile.caregiver?.relationship}</span>
                      <span>·</span>
                      <span>{sample.profile.patient?.nationality}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[#4E6254] leading-relaxed">
                  {sample.description}
                </p>

                <div className="text-xs text-[#697D70] pt-0.5 space-y-1">
                  <div>
                    <strong className="text-[#2D4537]">Primary Interest:</strong> {sample.profile.primaryInterest}
                  </div>
                  {sample.profile.patient?.formativeEra && (
                    <div className="text-[11px] text-[#556B5D] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EBE5DA] inline-block">
                      Reminiscence Era: {sample.profile.patient.formativeEra}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-[#F0EBE1]">
                <button
                  onClick={() => onSelectSampleProfile(sample.profile)}
                  className="w-full min-h-[44px] py-2 px-3 rounded-lg text-sm font-semibold bg-[#FAF8F5] hover:bg-[#1B4332] text-[#1B4332] hover:text-white border border-[#DCD5C8] hover:border-[#1B4332] transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-2 focus-visible:outline-[#1B4332]"
                >
                  <span>Load this profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How Kinship Approaches Dignity & Respect */}
      <section className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E4DDD0] shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-[#14261C] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#1B4332]" />
          <span>Core Non-Negotiable Principles</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-1 text-sm text-[#405447]">
          <div className="space-y-1.5">
            <div className="font-semibold text-[#182F22] flex items-center gap-1.5">
              <Music className="w-4 h-4 text-[#1B4332]" />
              <span>Grounded in Taste, Not Age</span>
            </div>
            <p className="text-xs leading-relaxed text-[#55695E]">
              We use family-confirmed cultural interests and Qloo&apos;s taste graph. We never make assumptions based on age or diagnosis.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="font-semibold text-[#182F22] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#1B4332]" />
              <span>Invitations, Never Quizzes</span>
            </div>
            <p className="text-xs leading-relaxed text-[#55695E]">
              No questions that test whether a person remembers something. Every prompt is an open invitation to share or simply be present.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="font-semibold text-[#182F22] flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#1B4332]" />
              <span>Autonomy at Every Step</span>
            </div>
            <p className="text-xs leading-relaxed text-[#55695E]">
              The person can decline, pause, or change the activity at any moment without feeling rushed or judged.
            </p>
          </div>
        </div>

        {/* Clear non-clinical disclaimer */}
        <div className="pt-3 text-[12px] text-[#697D70] border-t border-[#F0EBE1] leading-relaxed">
          <strong>Important notice:</strong> Kinship is a supportive cultural connection companion tool for families and caregivers. It is not a medical device, diagnostic instrument, cognitive assessment, memory-restoration treatment, or substitute for professional medical advice.
        </div>
      </section>
    </div>
  );
};
