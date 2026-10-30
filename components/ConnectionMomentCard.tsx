'use client';

import React, { useState } from 'react';
import { ConnectionMoment } from '@/lib/types';
import { ActivityTimer } from './ActivityTimer';
import { SpeechNarrator } from './SpeechNarrator';
import { AmbientSoundGenerator } from './AmbientSoundGenerator';
import { CulturalBridgeVisualizer } from './CulturalBridgeVisualizer';
import { CarePartnerHandoutModal } from './CarePartnerHandoutModal';
import { AddToCalendarButton } from './AddToCalendarButton';
import { AvatarBadge } from './AvatarBadge';
import {
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  ArrowLeft,
  Clock,
  Music,
  Heart,
  AlertTriangle,
  Copy,
  Check,
  Info,
  Sparkles,
  ExternalLink,
  PenLine,
  Volume2,
  Printer,
  Star,
  Coffee,
  Wind,
  Eye,
  HeartHandshake,
  Sparkle,
} from 'lucide-react';

interface ConnectionMomentCardProps {
  moment: ConnectionMoment;
  onSave: (moment: ConnectionMoment) => void;
  isSaved: boolean;
  onTryAnother: () => void;
  onReturnToProfile: () => void;
  onStopActivity: () => void;
  onUpdateNotes?: (momentId: string, notes: string, score?: number) => void;
  recipientName?: string;
}

const RESONANCE_CHOICES = [
  { score: 5, label: 'Deep Connection & Joy', color: '#1B5E20', bg: '#E8F5E9' },
  { score: 4, label: 'Calm & Engaged', color: '#2E7D32', bg: '#EDF7ED' },
  { score: 3, label: 'Peaceful Presence', color: '#556B2F', bg: '#F4F7EE' },
  { score: 2, label: 'Mild Engagement', color: '#B45309', bg: '#FEF3C7' },
  { score: 1, label: 'Restless / Stopped Early', color: '#B91C1C', bg: '#FEE2E2' },
];

export const ConnectionMomentCard: React.FC<ConnectionMomentCardProps> = ({
  moment,
  onSave,
  isSaved,
  onTryAnother,
  onReturnToProfile,
  onStopActivity,
  onUpdateNotes,
  recipientName,
}) => {
  const [copied, setCopied] = useState(false);
  const [showStopModal, setShowStopModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [prevMomentId, setPrevMomentId] = useState<string>(moment.id);
  const [notes, setNotes] = useState<string>(moment.personalNotes || '');
  const [resonanceScore, setResonanceScore] = useState<number>(moment.resonanceScore || 4);
  const [notesSavedAlert, setNotesSavedAlert] = useState(false);
  const [activeSpeechSection, setActiveSpeechSection] = useState<string | null>(null);

  // Sync notes state when active moment changes
  if (moment.id !== prevMomentId) {
    setPrevMomentId(moment.id);
    setNotes(moment.personalNotes || '');
    setResonanceScore(moment.resonanceScore || 4);
    setNotesSavedAlert(false);
  }

  // Quick speak helper for individual section buttons
  const speakSingleSnippet = (text: string, sectionId: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.88;
    setActiveSpeechSection(sectionId);
    utterance.onend = () => setActiveSpeechSection(null);
    utterance.onerror = () => setActiveSpeechSection(null);
    window.speechSynthesis.speak(utterance);
  };

  const handleSaveNotes = () => {
    const updatedMoment: ConnectionMoment = {
      ...moment,
      personalNotes: notes,
      resonanceScore,
      lastReflectedAt: Date.now(),
    };

    if (onUpdateNotes) {
      onUpdateNotes(moment.id, notes, resonanceScore);
    }
    onSave(updatedMoment);

    setNotesSavedAlert(true);
    setTimeout(() => setNotesSavedAlert(false), 2500);
  };

  const handleCopy = () => {
    const choice = RESONANCE_CHOICES.find(c => c.score === resonanceScore);
    const lines = [
      `Kinship Activity: ${moment.title}`,
      `Duration: ${moment.suggestedDurationMinutes} minutes unhurried`,
      '',
      'Opening Sentence:',
      `"${moment.openingSentence}"`,
      '',
      'Conversation Invitations:',
      ...moment.conversationInvitations.map(inv => `• ${inv}`),
      '',
      'Shared Activity:',
      moment.practicalActivity,
      '',
      'Caregiver Note:',
      moment.caregiverNote,
    ];

    if (choice) {
      lines.push('', `Resonance Rating: ${choice.score}/5 (${choice.label})`);
    }

    if (moment.closingSentence) {
      lines.push('', 'Closing:', `"${moment.closingSentence}"`);
    }

    if (notes.trim()) {
      lines.push('', 'Caregiver Personal Reflections & Notes:', `"${notes.trim()}"`);
    }

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-4 sm:py-8 space-y-6 max-w-2xl mx-auto">
      {/* Top provenance & reassurance bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <button
          onClick={onReturnToProfile}
          className="min-h-[44px] inline-flex items-center gap-1.5 text-sm font-semibold text-[#2D4537] hover:text-[#14261C] transition-colors focus-visible:outline-2 focus-visible:outline-[#1B4332] rounded-lg p-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to profile</span>
        </button>

        <div className="flex items-center gap-2">
          {moment.isDemonstration ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FFF8E7] text-[#855B11] text-xs font-semibold border border-[#F0DFB7]">
              Sample Demonstration Data
            </span>
          ) : moment.qlooVerified ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#E8F5E9] text-[#1B5E20] text-xs font-semibold border border-[#C8E6C9]">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Qloo Taste Graph
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#F4EFE6] text-[#44584C] text-xs font-medium border border-[#E2DBD0]">
              Family-Supplied Interest
            </span>
          )}

          <button
            onClick={() => setShowPrintModal(true)}
            className="min-h-[44px] px-3 py-1.5 rounded-lg border border-[#D5CDBC] bg-white text-[#2D4537] text-xs font-medium hover:bg-[#FAF8F5] transition-colors flex items-center gap-1.5"
            title="Print a clean care-partner handout for respite or family aides"
          >
            <Printer className="w-3.5 h-3.5 text-[#1B4332]" />
            <span className="hidden sm:inline">Care Handout</span>
          </button>

          <AddToCalendarButton
            moment={moment}
            recipientName={recipientName}
            variant="compact"
          />

          <button
            onClick={handleCopy}
            className="min-h-[44px] px-3 py-1.5 rounded-lg border border-[#D5CDBC] bg-white text-[#2D4537] text-xs font-medium hover:bg-[#FAF8F5] transition-colors flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-[#1B4332]"
            title="Copy activity text to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-700" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Main Connection Moment Card */}
      <article className="bg-white rounded-3xl p-6 sm:p-9 border border-[#E2DDD0] shadow-sm space-y-7 text-[#14261C]">
        {/* Header Block */}
        <header className="space-y-4 border-b border-[#F0EBE1] pb-6">
          <div className="flex items-center justify-between text-xs text-[#526659] font-medium">
            <span className="flex items-center gap-1.5 bg-[#EAE4D9]/80 px-2.5 py-1 rounded-md text-[#1B4332] font-semibold">
              <Clock className="w-3.5 h-3.5" />
              {moment.suggestedDurationMinutes} minutes unhurried
            </span>
            <span className="capitalize text-[#697D70]">
              {moment.sourceProfile.atmosphere} atmosphere
            </span>
          </div>

          {/* Relational Dynamic & Avatar Connection Banner */}
          <div className="bg-[#FAF8F5] border border-[#E6E0D5] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Loved One (Patient) Details */}
            <div className="flex items-center gap-3">
              <AvatarBadge
                name={moment.sourceProfile?.patient?.name || recipientName || 'Loved One'}
                avatarUrl={moment.sourceProfile?.patient?.avatarUrl}
                role="patient"
                size="lg"
                className="shadow-2xs ring-2 ring-[#1B4332]/20"
              />
              <div className="space-y-0.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#1B4332]">
                  Loved One
                </div>
                <div className="text-base font-bold text-[#14261C] flex items-center gap-1.5">
                  <span>{moment.sourceProfile?.patient?.name || recipientName || 'Loved One'}</span>
                  {(moment.sourceProfile?.patient?.sex || moment.sourceProfile?.patient?.gender) && (
                    <span className="text-[10px] font-medium px-1.5 py-0.2 rounded capitalize bg-white text-[#4A6052] border border-[#E2DDD0]">
                      {moment.sourceProfile?.patient?.sex || moment.sourceProfile?.patient?.gender}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-xs text-[#526659]">
                  {moment.sourceProfile?.patient?.age && (
                    <span className="bg-white px-2 py-0.5 rounded border border-[#E2DDD0] font-semibold text-[#14261C]">
                      Age {moment.sourceProfile?.patient?.age}
                    </span>
                  )}
                  {moment.sourceProfile?.patient?.nationality && (
                    <span className="bg-white px-2 py-0.5 rounded border border-[#E2DDD0]">
                      {moment.sourceProfile?.patient?.nationality}
                    </span>
                  )}
                  {(moment.sourceProfile?.patient?.formativeEra || moment.sourceProfile?.patient?.era) && (
                    <span className="bg-[#EFE9DC] text-[#1B4332] px-2 py-0.5 rounded text-[11px] font-medium" title="Cultural reminiscence era from youth">
                      Era: {moment.sourceProfile?.patient?.formativeEra || moment.sourceProfile?.patient?.era}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Intergenerational Bridge Symbol */}
            <div className="hidden sm:flex flex-col items-center justify-center px-2 text-[#855B11]">
              <div className="w-8 h-8 rounded-full bg-[#FEF6E4] border border-[#F3E3B6] flex items-center justify-center text-[#B45309] shadow-2xs">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider mt-1 text-[#855B11]">
                Shared
              </span>
            </div>

            {/* Caregiver Details */}
            <div className="flex items-center gap-3 sm:text-right sm:flex-row-reverse border-t sm:border-t-0 pt-3 sm:pt-0 border-[#ECE6D9]">
              <AvatarBadge
                name={moment.sourceProfile?.caregiver?.name || 'Caregiver'}
                avatarUrl={moment.sourceProfile?.caregiver?.avatarUrl}
                role="caregiver"
                size="lg"
                className="shadow-2xs ring-2 ring-[#B45309]/20"
              />
              <div className="space-y-0.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#855B11]">
                  {moment.sourceProfile?.caregiver?.relationship || 'Caregiver'}
                </div>
                <div className="text-base font-bold text-[#14261C] flex items-center sm:justify-end gap-1.5">
                  <span>{moment.sourceProfile?.caregiver?.name || 'Caregiver'}</span>
                  {(moment.sourceProfile?.caregiver?.sex || moment.sourceProfile?.caregiver?.gender) && (
                    <span className="text-[10px] font-medium px-1.5 py-0.2 rounded capitalize bg-white text-[#4A6052] border border-[#E2DDD0]">
                      {moment.sourceProfile?.caregiver?.sex || moment.sourceProfile?.caregiver?.gender}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center sm:justify-end gap-1.5 pt-0.5 text-xs text-[#526659]">
                  {moment.sourceProfile?.caregiver?.age && (
                    <span className="bg-white px-2 py-0.5 rounded border border-[#E2DDD0] font-semibold text-[#14261C]">
                      Age {moment.sourceProfile?.caregiver?.age}
                    </span>
                  )}
                  {moment.sourceProfile?.caregiver?.nationality && (
                    <span className="bg-white px-2 py-0.5 rounded border border-[#E2DDD0]">
                      {moment.sourceProfile?.caregiver?.nationality}
                    </span>
                  )}
                  {moment.sourceProfile?.caregiver?.sharedBackgroundNote && (
                    <span className="bg-[#FAF8F5] text-[#697D70] px-2 py-0.5 rounded text-[11px] italic truncate max-w-[170px]" title={moment.sourceProfile.caregiver.sharedBackgroundNote}>
                      {moment.sourceProfile.caregiver.sharedBackgroundNote}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#14261C] leading-snug">
            {moment.title}
          </h1>

          <p className="text-sm text-[#4E6254] leading-relaxed">
            {moment.selectionRationale}
          </p>
        </header>

        {/* Feature 6: Interactive Cultural Bridge Visualizer */}
        <section aria-label="Cultural taste bridge visualizer">
          <CulturalBridgeVisualizer moment={moment} />
        </section>

        {/* Feature: Qloo Multi-Sensory Taste Bridge */}
        {moment.multiSensoryBridge && (
          <section
            aria-label="Qloo cross-domain multi-sensory bridge"
            className="rounded-2xl border border-[#DFD8C8] bg-[#FAF8F5] p-5 space-y-3.5 shadow-xs"
          >
            <div className="flex items-center justify-between border-b border-[#EAE3D5] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#EAE4D9] text-[#1B4332]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">
                      Qloo Multi-Sensory Taste Bridge
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9]">
                      Cross-Domain AI
                    </span>
                  </div>
                  <p className="text-xs text-[#526659]">
                    Deepens interaction quality through aroma, flavor, tactile holding, and intergenerational resonance.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const b = moment.multiSensoryBridge;
                  const text = `Qloo Multi-Sensory Bridge. Scent and aroma: ${b?.aromaOrScent || ''}. Beverage and taste: ${b?.flavorOrBeverage || ''}. Tactile texture: ${b?.tactileTexture || ''}. Intergenerational bridge: ${b?.intergenerationalBridge || ''}.`;
                  speakSingleSnippet(text, 'multisensory');
                }}
                className="text-xs text-[#2E4738] hover:text-[#14261C] flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#D5CDBC] bg-white hover:bg-[#F2ECE0] transition-colors"
                title="Read multi-sensory pairings aloud"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#1B4332]" />
                <span className="hidden sm:inline">Listen to pairings</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Aroma & Scent */}
              {moment.multiSensoryBridge.aromaOrScent && (
                <div className="bg-white p-3.5 rounded-xl border border-[#E6E0D5] space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#1B4332] flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-[#1B4332]" />
                    <span>Aroma & Scent Anchor</span>
                  </div>
                  <p className="text-xs text-[#2A3F32] leading-relaxed">
                    {moment.multiSensoryBridge.aromaOrScent}
                  </p>
                </div>
              )}

              {/* Flavor & Beverage */}
              {moment.multiSensoryBridge.flavorOrBeverage && (
                <div className="bg-white p-3.5 rounded-xl border border-[#E6E0D5] space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#855B11] flex items-center gap-1.5">
                    <Coffee className="w-3.5 h-3.5 text-[#855B11]" />
                    <span>Flavor & Beverage Comfort</span>
                  </div>
                  <p className="text-xs text-[#2A3F32] leading-relaxed">
                    {moment.multiSensoryBridge.flavorOrBeverage}
                  </p>
                </div>
              )}

              {/* Tactile Texture */}
              {moment.multiSensoryBridge.tactileTexture && (
                <div className="bg-white p-3.5 rounded-xl border border-[#E6E0D5] space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#2D4D39] flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-[#2D4D39]" />
                    <span>Tactile Physical Touchpoint</span>
                  </div>
                  <p className="text-xs text-[#2A3F32] leading-relaxed">
                    {moment.multiSensoryBridge.tactileTexture}
                  </p>
                </div>
              )}

              {/* Visual Atmosphere */}
              {moment.multiSensoryBridge.visualAtmosphere && (
                <div className="bg-white p-3.5 rounded-xl border border-[#E6E0D5] space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#4E6254] flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#4E6254]" />
                    <span>Visual Lighting & Setting</span>
                  </div>
                  <p className="text-xs text-[#2A3F32] leading-relaxed">
                    {moment.multiSensoryBridge.visualAtmosphere}
                  </p>
                </div>
              )}
            </div>

            {/* Intergenerational Resonance Bridge */}
            {moment.multiSensoryBridge.intergenerationalBridge && (
              <div className="p-3.5 rounded-xl bg-[#F3EFE7] border border-[#DFD7C7] space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#1B4332] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#1B4332]" />
                  <span>Intergenerational Resonance (Caregiver & Loved One Bridge)</span>
                </div>
                <p className="text-xs text-[#23382B] leading-relaxed">
                  {moment.multiSensoryBridge.intergenerationalBridge}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Feature 1: SpeechSynthesis Audio Narrator (Hands-free caregiver reading) */}
        <section aria-label="Audio companion read aloud">
          <SpeechNarrator
            moment={moment}
            onActiveSectionChange={setActiveSpeechSection}
          />
        </section>

        {/* Feature 3: Ambient Sensory Background Sound Generator */}
        <section aria-label="Ambient grounding soundscape">
          <AmbientSoundGenerator />
        </section>

        {/* Feature 2: Optional Activity Timer Component */}
        <section aria-label="Activity session timer">
          <ActivityTimer
            initialMinutes={moment.suggestedDurationMinutes}
            activityTitle={moment.title}
          />
        </section>

        {/* Section 1: Opening Sentence (Spoken aloud by family member/caregiver) */}
        <section
          className={`space-y-2 p-5 rounded-2xl border transition-all ${
            activeSpeechSection === 'opening'
              ? 'bg-[#F2ECE0] border-[#1B4332] ring-2 ring-[#1B4332]/20'
              : 'bg-[#FAF8F5] border-[#EBE4D8]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-[#1B4332] flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-[#1B4332]/20" />
              <span>Opening invitation (read aloud warmly)</span>
            </div>
            <button
              type="button"
              onClick={() => speakSingleSnippet(`Opening invitation: ${moment.openingSentence}`, 'opening')}
              className="text-xs text-[#42594C] hover:text-[#1B4332] flex items-center gap-1 px-2 py-0.5 rounded hover:bg-[#EAE4D9]/50 transition-colors"
              title="Read opening aloud"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Listen</span>
            </button>
          </div>
          <p className="text-lg sm:text-xl font-medium text-[#1A3324] leading-relaxed italic">
            &ldquo;{moment.openingSentence}&rdquo;
          </p>
        </section>

        {/* Section 2: Gentle Conversation Invitations (Non-quizzing) */}
        <section
          className={`space-y-3 p-5 rounded-2xl border transition-all ${
            activeSpeechSection === 'conversation'
              ? 'bg-[#F2ECE0] border-[#1B4332] ring-2 ring-[#1B4332]/20'
              : 'border-transparent p-0'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-[#526659] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Gentle conversation invitations (no memory test)</span>
            </div>
            <button
              type="button"
              onClick={() =>
                speakSingleSnippet(
                  `Gentle conversation invitations: ${moment.conversationInvitations.join('. ')}`,
                  'conversation'
                )
              }
              className="text-xs text-[#42594C] hover:text-[#1B4332] flex items-center gap-1 px-2 py-0.5 rounded hover:bg-[#EAE4D9]/50 transition-colors"
              title="Read conversation prompts aloud"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Listen</span>
            </button>
          </div>
          <div className="space-y-2.5">
            {moment.conversationInvitations.map((inv, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white border border-[#E8E2D6] text-base text-[#1E3326] leading-relaxed font-normal shadow-xs"
              >
                {inv}
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Practical Shared Activity (Tactile or sensory) */}
        <section
          className={`space-y-2 p-5 rounded-2xl border transition-all ${
            activeSpeechSection === 'activity'
              ? 'bg-[#EFE9DC] border-[#1B4332] ring-2 ring-[#1B4332]/20'
              : 'bg-[#F3EFE7]/70 border-[#E6DFC2]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-[#2E4738]">
              Practical shared activity
            </div>
            <button
              type="button"
              onClick={() =>
                speakSingleSnippet(`Practical shared activity: ${moment.practicalActivity}`, 'activity')
              }
              className="text-xs text-[#2E4738] hover:text-[#14261C] flex items-center gap-1 px-2 py-0.5 rounded hover:bg-[#EAE4D9]/50 transition-colors"
              title="Read activity aloud"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Listen</span>
            </button>
          </div>
          <p className="text-base text-[#1E3326] leading-relaxed">
            {moment.practicalActivity}
          </p>
        </section>

        {/* Section 4: Cultural Reference & Provenance */}
        {moment.culturalReference && (
          <section className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E0D5] text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#1B4332]">
              <Music className="w-3.5 h-3.5" />
              <span>Cultural Reference: {moment.culturalReference.name}</span>
            </div>
            <div className="text-[#55695E] leading-relaxed">
              <strong>Source Provenance:</strong> {moment.culturalReference.provenance}
            </div>
            {moment.culturalReference.relationshipNote && (
              <div className="text-[#65796D]">
                <strong>Taste Relationship:</strong> {moment.culturalReference.relationshipNote}
              </div>
            )}
            <div className="pt-1">
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(moment.culturalReference.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#1B4332] font-semibold hover:underline"
              >
                <span>Listen or search legitimately online</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </section>
        )}

        {/* Section 5: Closing Sentence */}
        {moment.closingSentence && (
          <section
            className={`space-y-1.5 p-3 rounded-xl transition-all ${
              activeSpeechSection === 'closing'
                ? 'bg-[#F2ECE0] border border-[#1B4332]'
                : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-[#526659]">
                Optional closing sentence
              </div>
              <button
                type="button"
                onClick={() =>
                  speakSingleSnippet(`Closing sentence: ${moment.closingSentence}`, 'closing')
                }
                className="text-xs text-[#526659] hover:text-[#1B4332] flex items-center gap-1 px-2 py-0.5 rounded hover:bg-[#EAE4D9]/50"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Listen</span>
              </button>
            </div>
            <p className="text-base text-[#2E4738] italic">
              &ldquo;{moment.closingSentence}&rdquo;
            </p>
          </section>
        )}

        {/* Feature 3: Caregiver Notes & Reflections Textarea */}
        <section className="space-y-3.5 bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E1D3]">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#1B4332] flex items-center gap-1.5">
              <PenLine className="w-3.5 h-3.5 text-[#1B4332]" />
              <span>Personal Notes & Connection Rating</span>
            </div>
            {notesSavedAlert && (
              <span className="text-xs text-[#1B5E20] font-semibold flex items-center gap-1 animate-fade-in bg-[#E8F5E9] px-2 py-0.5 rounded border border-[#C8E6C9]">
                <Check className="w-3.5 h-3.5" />
                Saved with this moment
              </span>
            )}
          </div>

          <p className="text-xs text-[#526659] leading-relaxed">
            Record how this specific connection moment went. Your rating and reflections are mapped on the saved moments timeline chart.
          </p>

          {/* Resonance Rating selector */}
          <div className="space-y-1.5 pt-0.5">
            <div className="text-[11px] font-semibold text-[#405447]">
              How was the connection resonance today?
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {RESONANCE_CHOICES.map(c => {
                const isSelected = resonanceScore === c.score;
                return (
                  <button
                    key={c.score}
                    type="button"
                    onClick={() => {
                      setResonanceScore(c.score);
                      setNotesSavedAlert(false);
                    }}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'border-[#1B4332] ring-2 ring-[#1B4332]/20 font-bold'
                        : 'border-[#D5CDBC] bg-white opacity-85 hover:opacity-100 hover:border-[#1B4332]/40'
                    }`}
                    style={{ backgroundColor: isSelected ? c.bg : undefined }}
                  >
                    <div className="flex items-center gap-1 text-xs font-bold" style={{ color: c.color }}>
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{c.score}★</span>
                    </div>
                    <div className="text-[10px] text-[#2C4033] leading-tight mt-0.5">
                      {c.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <textarea
            value={notes}
            onChange={e => {
              setNotes(e.target.value);
              setNotesSavedAlert(false);
            }}
            placeholder="How did this moment go? (e.g. Vera smiled when the piano started, or Arthur preferred holding the postcard quietly in the sun...)"
            rows={3}
            className="w-full p-3.5 text-sm text-[#14261C] bg-white border border-[#D5CDBC] rounded-xl focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] outline-none transition-all placeholder:text-[#889B8E] resize-y leading-relaxed"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <span className="text-[11px] text-[#718578]">
              {moment.lastReflectedAt ? (
                <>Last saved reflection: {new Date(moment.lastReflectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</>
              ) : (
                <>Saved automatically with this connection moment</>
              )}
            </span>

            <button
              type="button"
              onClick={handleSaveNotes}
              className="min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#1B4332] hover:bg-[#255C45] text-white transition-colors flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-[#1B4332]"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save reflection</span>
            </button>
          </div>
        </section>

        {/* Caregiver comfort & stop note */}
        <section
          className={`p-4 rounded-2xl border space-y-1.5 text-xs text-[#735212] leading-relaxed transition-all ${
            activeSpeechSection === 'caregiver'
              ? 'bg-[#FEF6E4] border-[#B45309] ring-2 ring-[#B45309]/20'
              : 'bg-[#FFFBF0] border-[#F3E3B6]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="font-bold flex items-center gap-1.5 text-[#593E07]">
              <AlertTriangle className="w-4 h-4 text-[#B45309]" />
              <span>Caregiver Guide: Comfort & Autonomy</span>
            </div>
            <button
              type="button"
              onClick={() =>
                speakSingleSnippet(
                  `Caregiver comfort guide: ${moment.caregiverNote}. It is always okay to finish early or sit together in silence.`,
                  'caregiver'
                )
              }
              className="text-xs text-[#735212] hover:text-[#593E07] flex items-center gap-1 px-2 py-0.5 rounded hover:bg-[#FDE68A]/40"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Listen</span>
            </button>
          </div>
          <p>{moment.caregiverNote}</p>
          <p className="text-[#8A6317]">
            Remember: It is always okay to finish early, turn the sound down, or sit together in silence.
          </p>
        </section>

        {/* Primary User Actions */}
        <footer className="pt-4 border-t border-[#F0EBE1] flex flex-col sm:flex-row gap-3">
          {/* Action 1: Save */}
          <button
            onClick={() => {
              const momentToSave: ConnectionMoment = {
                ...moment,
                personalNotes: notes,
                resonanceScore,
                lastReflectedAt: notes ? Date.now() : moment.lastReflectedAt,
              };
              onSave(momentToSave);
            }}
            className={`min-h-[50px] flex-1 py-3 px-5 rounded-xl text-base font-semibold transition-all flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-[#1B4332] ${
              isSaved
                ? 'bg-[#EAE4D9] text-[#1B4332] border border-[#D5CDBC]'
                : 'bg-[#1B4332] hover:bg-[#255C45] text-white shadow-xs'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-5 h-5" />
                <span>Saved to collection</span>
              </>
            ) : (
              <>
                <Bookmark className="w-5 h-5" />
                <span>Save this moment</span>
              </>
            )}
          </button>

          {/* Action 2: Try another */}
          <button
            onClick={onTryAnother}
            className="min-h-[50px] flex-1 py-3 px-5 rounded-xl border border-[#D5CDBC] bg-white hover:bg-[#FAF8F5] text-[#1B4332] text-base font-semibold transition-colors flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-[#1B4332]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try another suggestion</span>
          </button>

          {/* Action 3: Schedule Shared Time */}
          <AddToCalendarButton
            moment={moment}
            recipientName={recipientName}
            variant="secondary"
          />

          {/* Action 4: Care Handout */}
          <button
            onClick={() => setShowPrintModal(true)}
            className="min-h-[50px] px-4 py-3 rounded-xl border border-[#D5CDBC] bg-white hover:bg-[#FAF8F5] text-[#2D4537] text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            title="Print care-partner handout"
          >
            <Printer className="w-4 h-4 text-[#1B4332]" />
            <span className="hidden md:inline">Print Handout</span>
          </button>
        </footer>

        {/* Stop or Change Activity Button */}
        <div className="text-center pt-1">
          <button
            onClick={() => setShowStopModal(true)}
            className="min-h-[44px] text-xs font-semibold text-[#8C3A3A] hover:text-[#B91C1C] underline hover:no-underline transition-colors focus-visible:outline-2 focus-visible:outline-[#B91C1C] rounded p-1"
          >
            Stop or change activity right now
          </button>
        </div>
      </article>

      {/* Printable Care-Partner Handout Modal */}
      {showPrintModal && (
        <CarePartnerHandoutModal
          moment={moment}
          recipientName={recipientName}
          onClose={() => setShowPrintModal(false)}
        />
      )}

      {/* Stop / Change Activity Modal */}
      {showStopModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-[#E2DDD0] shadow-xl text-left">
            <h3 className="text-lg font-bold text-[#14261C]">
              Stop or change this moment?
            </h3>
            <p className="text-sm text-[#405447] leading-relaxed">
              Caregiver assistance must never override personal discomfort. If the person seems tired, restless, or would rather do something else, you can stop immediately.
            </p>
            <div className="p-3 bg-[#FAF8F5] rounded-xl text-xs text-[#526659]">
              Gentle closing line: <em>&ldquo;We don&apos;t need to do any more of this today. Let&apos;s just sit comfortably.&rdquo;</em>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={() => {
                  setShowStopModal(false);
                  onStopActivity();
                }}
                className="min-h-[46px] flex-1 py-2 px-4 rounded-xl bg-[#1B4332] text-white text-sm font-semibold hover:bg-[#255C45]"
              >
                Conclude and return home
              </button>
              <button
                onClick={() => setShowStopModal(false)}
                className="min-h-[46px] flex-1 py-2 px-4 rounded-xl border border-[#D5CDBC] bg-white text-[#2D4537] text-sm font-medium hover:bg-[#FAF8F5]"
              >
                Keep activity open
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
