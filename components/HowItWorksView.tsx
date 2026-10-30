'use client';

import React from 'react';
import { Compass, Sparkles, HeartHandshake, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface HowItWorksViewProps {
  onCreateMomentClick: () => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ onCreateMomentClick }) => {
  return (
    <div className="py-6 sm:py-8 space-y-8 max-w-2xl mx-auto text-[#14261C]">
      {/* Title */}
      <div className="space-y-2 border-b border-[#E6E0D5] pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          How Kinship Works
        </h1>
        <p className="text-base text-[#465B4E] leading-relaxed">
          Turning familiar cultural interests into unhurried, respectful shared experiences between older adults and caregivers.
        </p>
      </div>

      {/* Philosophy: Preserving Personhood & Taste */}
      <section className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2DDD0] shadow-xs space-y-4">
        <div className="w-10 h-10 rounded-xl bg-[#1B4332]/10 text-[#1B4332] flex items-center justify-center">
          <HeartHandshake className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-[#14261C]">
          1. Dignity, Familiarity, and Taste
        </h2>
        <p className="text-sm text-[#3E5346] leading-relaxed">
          Adults living with Alzheimer&apos;s disease or other forms of dementia retain their individual aesthetic sensibilities, musical passions, and personal tastes. We reject one-size-fits-all stereotypes that treat older adults as children or assume everyone likes the same generic music.
        </p>
        <p className="text-sm text-[#3E5346] leading-relaxed">
          Kinship starts from family-confirmed interests—a favourite jazz singer, a nostalgic radio play, a passion for wooden boats, or a love of aromatic herb gardens—and grounds each interaction in genuine personal meaning.
        </p>
      </section>

      {/* Qloo & Gemini Architecture */}
      <section className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2DDD0] shadow-xs space-y-4">
        <div className="w-10 h-10 rounded-xl bg-[#1B4332]/10 text-[#1B4332] flex items-center justify-center">
          <Sparkles className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-[#14261C]">
          2. Cultural Intelligence & the 5-Step Agent
        </h2>
        <p className="text-sm text-[#3E5346] leading-relaxed">
          When you request a connection moment, Kinship executes an authentic, verified 5-stage workflow:
        </p>

        <div className="space-y-3 pt-2 text-xs sm:text-sm text-[#344C3F]">
          <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8] space-y-1">
            <strong className="text-[#1B4332]">Step 1: Interest & Atmosphere Interpretation</strong>
            <p className="text-[#55695E]">The agent reviews the requested activity style (listening, looking, hands-on), session length (5–15 mins), and atmosphere (calm, cheerful, reflective, playful).</p>
          </div>

          <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8] space-y-1">
            <strong className="text-[#1B4332]">Step 2: Qloo Entity Resolution</strong>
            <p className="text-[#55695E]">The cultural reference is mapped to Qloo&apos;s global cultural intelligence graph via the official Search API, securing a verified entity ID and metadata.</p>
          </div>

          <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8] space-y-1">
            <strong className="text-[#1B4332]">Step 3: Qloo Taste Exploration</strong>
            <p className="text-[#55695E]">Using Qloo&apos;s Insights API, cross-domain taste affinities and recordings are discovered, preserving full provenance of why an item was chosen.</p>
          </div>

          <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8] space-y-1">
            <strong className="text-[#1B4332]">Step 4: Gemini Language Synthesis</strong>
            <p className="text-[#55695E]">Gemini shapes the verified cultural intelligence into a concrete, gentle activity card containing opening words, practical sensory steps, and comfort guidelines.</p>
          </div>

          <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8] space-y-1">
            <strong className="text-[#1B4332]">Step 5: Dignity & Exclusions Filter</strong>
            <p className="text-[#55695E]">The synthesized activity is programmatically vetted to ensure excluded topics are avoided and no quizzing or memory tests are present.</p>
          </div>
        </div>
      </section>

      {/* The Rule of Non-Quizzing */}
      <section className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2DDD0] shadow-xs space-y-4">
        <div className="w-10 h-10 rounded-xl bg-[#1B4332]/10 text-[#1B4332] flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-[#14261C]">
          3. Invitations, Never Memory Tests
        </h2>
        <p className="text-sm text-[#3E5346] leading-relaxed">
          Asking a person living with dementia questions like <em>&ldquo;Do you remember who sang this?&rdquo;</em> or <em>&ldquo;What year did we go there?&rdquo;</em> can trigger anxiety, feelings of inadequacy, and frustration.
        </p>
        <p className="text-sm text-[#3E5346] leading-relaxed">
          Kinship replaces testing questions with open-ended invitations that require no recall:
        </p>
        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D6] space-y-2 text-xs sm:text-sm text-[#1E3326] italic">
          <div>&ldquo;Would you like to listen to this together with me?&rdquo;</div>
          <div>&ldquo;What do you think of this melody?&rdquo;</div>
          <div>&ldquo;We can simply sit and rest here for a few minutes.&rdquo;</div>
        </div>
      </section>

      {/* Medical Boundary Notice */}
      <section className="p-6 rounded-3xl bg-[#FFF8E7] border border-[#F0DFB7] space-y-3 text-xs sm:text-sm text-[#735212] leading-relaxed">
        <h2 className="font-bold text-[#593E07] flex items-center gap-2 text-base">
          <ShieldCheck className="w-5 h-5 text-[#855B11]" />
          <span>Non-Clinical Supportive Boundary</span>
        </h2>
        <p>
          Kinship is a cultural connection tool designed for interpersonal warmth. It is <strong>not</strong> a medical device, diagnostic test, therapeutic memory-restoration treatment, or substitute for certified clinical dementia care.
        </p>
        <p>
          We do not claim that Kinship restores memory, halts disease progression, or diagnoses neurological conditions.
        </p>
      </section>

      {/* Action */}
      <div className="pt-2 text-center">
        <button
          onClick={onCreateMomentClick}
          className="min-h-[50px] px-8 py-3 rounded-xl bg-[#1B4332] hover:bg-[#255C45] text-white text-base font-semibold shadow-xs transition-colors inline-flex items-center gap-2"
        >
          <span>Create a connection moment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
