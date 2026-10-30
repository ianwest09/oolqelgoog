'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Pause,
  Play,
  Square,
  SkipForward,
  SkipBack,
  Headphones,
} from 'lucide-react';
import { ConnectionMoment } from '@/lib/types';

export interface NarrationSection {
  id: string;
  label: string;
  text: string;
}

interface SpeechNarratorProps {
  moment: ConnectionMoment;
  onActiveSectionChange?: (sectionId: string | null) => void;
}

export const SpeechNarrator: React.FC<SpeechNarratorProps> = ({
  moment,
  onActiveSectionChange,
}) => {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [speechRate, setSpeechRate] = useState<number>(0.88); // Calm, unhurried pace by default
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');

  // Build the ordered narration sections
  const sections: NarrationSection[] = useMemo(() => [
    {
      id: 'title',
      label: 'Activity Overview',
      text: `${moment.title}. Suggested duration is ${moment.suggestedDurationMinutes} minutes unhurried. ${moment.selectionRationale}`,
    },
    {
      id: 'opening',
      label: 'Opening Invitation',
      text: `Opening invitation to read aloud warmly to your loved one: "${moment.openingSentence}"`,
    },
    {
      id: 'conversation',
      label: 'Conversation Invitations',
      text: `Gentle conversation invitations, without memory testing: ${moment.conversationInvitations.join('. ')}`,
    },
    {
      id: 'activity',
      label: 'Shared Practical Activity',
      text: `Practical shared activity: ${moment.practicalActivity}`,
    },
    ...(moment.closingSentence
      ? [
          {
            id: 'closing',
            label: 'Closing Sentence',
            text: `Optional gentle closing: "${moment.closingSentence}"`,
          },
        ]
      : []),
    {
      id: 'caregiver',
      label: 'Caregiver Comfort Guide',
      text: `Caregiver comfort guide: ${moment.caregiverNote}. Remember, it is always okay to finish early or simply sit in peaceful presence.`,
    },
  ], [moment]);

  const currentSectionRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);

  // Sync refs safely within effects
  useEffect(() => {
    currentSectionRef.current = currentSectionIndex;
  }, [currentSectionIndex]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Check browser support and load speech synthesis voices asynchronously
  useEffect(() => {
    let mounted = true;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const frameId = requestAnimationFrame(() => {
        if (mounted) setIsSupported(true);
      });

      const updateVoices = () => {
        if (!mounted) return;
        const available = window.speechSynthesis.getVoices();
        setVoices(available);
        if (available.length > 0) {
          setSelectedVoice(prev => {
            if (prev) return prev;
            const defaultVoice =
              available.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))) ||
              available.find(v => v.lang.startsWith('en')) ||
              available[0];
            return defaultVoice ? defaultVoice.name : '';
          });
        }
      };

      updateVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }

      return () => {
        mounted = false;
        cancelAnimationFrame(frameId);
        window.speechSynthesis.cancel();
      };
    }
  }, []);

  // Update parent when active section changes
  useEffect(() => {
    if (onActiveSectionChange) {
      if (isPlaying) {
        onActiveSectionChange(sections[currentSectionIndex]?.id || null);
      } else {
        onActiveSectionChange(null);
      }
    }
  }, [isPlaying, currentSectionIndex, onActiveSectionChange, sections]);

  // Speak a specific section by index
  const speakSection = (index: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    if (index >= sections.length) {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSectionIndex(0);
      return;
    }

    const section = sections[index];
    const utterance = new SpeechSynthesisUtterance(section.text);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    if (selectedVoice && voices.length > 0) {
      const voiceObj = voices.find(v => v.name === selectedVoice);
      if (voiceObj) utterance.voice = voiceObj;
    }

    utterance.onend = () => {
      if (isPlayingRef.current) {
        const nextIndex = index + 1;
        if (nextIndex < sections.length) {
          setCurrentSectionIndex(nextIndex);
          speakSection(nextIndex);
        } else {
          setIsPlaying(false);
          setIsPaused(false);
          setCurrentSectionIndex(0);
        }
      }
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('SpeechSynthesis error:', e);
      }
      setIsPlaying(false);
      setIsPaused(false);
    };

    setCurrentSectionIndex(index);
    setIsPlaying(true);
    setIsPaused(false);
    window.speechSynthesis.speak(utterance);
  };

  const handlePlay = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      speakSection(currentSectionIndex);
    }
  };

  const handlePause = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSectionIndex(0);
    }
  };

  const handleNextSection = () => {
    const nextIdx = Math.min(sections.length - 1, currentSectionIndex + 1);
    setCurrentSectionIndex(nextIdx);
    if (isPlaying) {
      speakSection(nextIdx);
    }
  };

  const handlePrevSection = () => {
    const prevIdx = Math.max(0, currentSectionIndex - 1);
    setCurrentSectionIndex(prevIdx);
    if (isPlaying) {
      speakSection(prevIdx);
    }
  };

  const handleSelectSection = (index: number) => {
    setCurrentSectionIndex(index);
    speakSection(index);
  };

  if (!isSupported) {
    return null;
  }

  const activeSection = sections[currentSectionIndex];

  return (
    <div className="rounded-2xl border border-[#DCD5C6] bg-[#FAF8F3] p-4 sm:p-5 space-y-3.5 transition-all shadow-xs">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EAE3D5] pb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg transition-colors ${
            isPlaying
              ? 'bg-[#1B4332] text-white animate-pulse'
              : 'bg-[#EAE4D9] text-[#1B4332]'
          }`}>
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">
                Audio Companion (Read Aloud)
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#EAE4D9] text-[#2E4738]">
                SpeechSynthesis
              </span>
            </div>
            <p className="text-xs text-[#526659]">
              Listen to the activity prompts hands-free so you can give full attention to your loved one.
            </p>
          </div>
        </div>

        {/* Pace Selector (Calm 0.88x vs Normal 1.0x) */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[11px] font-semibold text-[#5A7062]">Pace:</span>
          <button
            type="button"
            onClick={() => {
              setSpeechRate(0.85);
              if (isPlaying) speakSection(currentSectionIndex);
            }}
            className={`px-2 py-0.5 rounded text-xs font-medium border transition-colors ${
              speechRate < 0.95
                ? 'bg-[#1B4332] text-white border-[#1B4332]'
                : 'bg-white text-[#405447] border-[#D5CDBC] hover:bg-[#F3EFE7]'
            }`}
          >
            Unhurried (0.85x)
          </button>
          <button
            type="button"
            onClick={() => {
              setSpeechRate(1.0);
              if (isPlaying) speakSection(currentSectionIndex);
            }}
            className={`px-2 py-0.5 rounded text-xs font-medium border transition-colors ${
              speechRate >= 0.95
                ? 'bg-[#1B4332] text-white border-[#1B4332]'
                : 'bg-white text-[#405447] border-[#D5CDBC] hover:bg-[#F3EFE7]'
            }`}
          >
            Standard (1.0x)
          </button>
        </div>
      </div>

      {/* Main Playback Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          {/* Play / Pause button */}
          <button
            type="button"
            onClick={isPlaying ? handlePause : handlePlay}
            className={`min-h-[42px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-[#1B4332] ${
              isPlaying
                ? 'bg-[#EAE4D9] text-[#1B4332] border border-[#D5CDBC]'
                : 'bg-[#1B4332] hover:bg-[#255C45] text-white shadow-xs'
            }`}
            title={isPlaying ? 'Pause speech narration' : 'Read activity aloud'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : isPaused ? (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Resume Reading</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Read Activity Aloud</span>
              </>
            )}
          </button>

          {/* Stop Button */}
          {(isPlaying || isPaused) && (
            <button
              type="button"
              onClick={handleStop}
              className="min-h-[42px] px-3 py-2 rounded-xl border border-[#D5CDBC] bg-white hover:bg-[#FAF8F5] text-[#8C3A3A] text-xs font-semibold transition-colors flex items-center gap-1.5"
              title="Stop narration"
            >
              <Square className="w-3.5 h-3.5" />
              <span>Stop</span>
            </button>
          )}

          {/* Previous / Next Section buttons */}
          <div className="flex items-center gap-1 border-l border-[#E2DBD0] pl-2 ml-1">
            <button
              type="button"
              onClick={handlePrevSection}
              disabled={currentSectionIndex === 0}
              className="w-8 h-8 rounded-lg border border-[#D5CDBC] bg-white text-[#2D4537] hover:bg-[#F3EFE7] disabled:opacity-40 disabled:hover:bg-white flex items-center justify-center transition-colors"
              title="Previous prompt"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNextSection}
              disabled={currentSectionIndex >= sections.length - 1}
              className="w-8 h-8 rounded-lg border border-[#D5CDBC] bg-white text-[#2D4537] hover:bg-[#F3EFE7] disabled:opacity-40 disabled:hover:bg-white flex items-center justify-center transition-colors"
              title="Next prompt"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Current status indicator */}
        <div className="text-xs text-[#405447] flex items-center gap-2">
          {isPlaying && (
            <span className="flex items-center gap-1 font-semibold text-[#1B4332]">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              Reading:
            </span>
          )}
          <span className="font-medium truncate max-w-[220px]">
            {activeSection?.label} ({currentSectionIndex + 1}/{sections.length})
          </span>
        </div>
      </div>

      {/* Quick Jump Section Badges */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] font-semibold text-[#667C6E] mr-1">
          Jump to:
        </span>
        {sections.map((sec, idx) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => handleSelectSection(idx)}
            className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all border ${
              currentSectionIndex === idx && (isPlaying || isPaused)
                ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-xs'
                : 'bg-white text-[#30473A] border-[#DCD5C8] hover:bg-[#EAE4D9]/60'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>
    </div>
  );
};
