'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  BellRing,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react';

interface ActivityTimerProps {
  initialMinutes: number;
  activityTitle?: string;
  onTimerComplete?: () => void;
}

// Gentle Web Audio API synthesizer for peaceful, therapeutic chime
const playGentleChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Harmonic frequencies for a calming, warm chime (528Hz Love/Calm tone + octave & fifth)
    const freqs = [528, 792, 1056];

    freqs.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Soft attack, smooth decay
      const initialVol = index === 0 ? 0.25 : 0.12;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(initialVol, now + 0.08 + index * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4 + index * 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.04);
      osc.stop(now + 3.0);
    });
  } catch (err) {
    console.warn('Web Audio chime could not play:', err);
  }
};

export const ActivityTimer: React.FC<ActivityTimerProps> = ({
  initialMinutes,
  activityTitle,
  onTimerComplete,
}) => {
  const [targetMinutes, setTargetMinutes] = useState<number>(initialMinutes || 10);
  const [secondsRemaining, setSecondsRemaining] = useState<number>((initialMinutes || 10) * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [hasPlayedWarning, setHasPlayedWarning] = useState<boolean>(false);

  const totalSeconds = targetMinutes * 60;
  const progressPercent = Math.max(0, Math.min(100, ((totalSeconds - secondsRemaining) / totalSeconds) * 100));

  const [prevInitialMinutes, setPrevInitialMinutes] = useState<number>(initialMinutes);

  // Sync if initialMinutes changes and timer hasn't started yet
  if (initialMinutes !== prevInitialMinutes && !isActive) {
    setPrevInitialMinutes(initialMinutes);
    const mins = initialMinutes || 10;
    setTargetMinutes(mins);
    setSecondsRemaining(mins * 60);
  }

  // Main countdown timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            setIsActive(false);
            setIsCompleted(true);
            if (soundEnabled) {
              playGentleChime();
            }
            if (onTimerComplete) {
              onTimerComplete();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsRemaining, soundEnabled, onTimerComplete]);

  // Format MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleTogglePlay = () => {
    if (isCompleted) {
      // Restart if completed
      setSecondsRemaining(targetMinutes * 60);
      setIsCompleted(false);
      setIsActive(true);
      return;
    }
    setIsActive(prev => !prev);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsCompleted(false);
    setSecondsRemaining(targetMinutes * 60);
    setHasPlayedWarning(false);
  };

  const handleSetPreset = (minutes: number) => {
    setIsActive(false);
    setIsCompleted(false);
    setTargetMinutes(minutes);
    setSecondsRemaining(minutes * 60);
    setHasPlayedWarning(false);
  };

  const handleAdjustMinutes = (delta: number) => {
    const newMinutes = Math.max(1, Math.min(60, targetMinutes + delta));
    setTargetMinutes(newMinutes);
    if (!isActive) {
      setSecondsRemaining(newMinutes * 60);
    } else {
      setSecondsRemaining(prev => Math.max(1, prev + delta * 60));
    }
  };

  const handleTestChime = () => {
    playGentleChime();
  };

  return (
    <div className="rounded-2xl border border-[#DFD8C8] bg-[#FCFBF7] p-4 sm:p-5 transition-all shadow-xs">
      {/* Header bar with toggle */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl transition-colors ${
            isCompleted 
              ? 'bg-[#E8F5E9] text-[#1B5E20]' 
              : isActive 
                ? 'bg-[#1B4332] text-white animate-pulse' 
                : 'bg-[#EAE4D9] text-[#1B4332]'
          }`}>
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">
                Activity Session Timer
              </span>
              <span className="text-[11px] font-medium text-[#728578] hidden sm:inline">
                (Optional pacing aid)
              </span>
            </div>
            <div className="text-xs text-[#526659]">
              {isActive
                ? `Running unhurriedly · ${formatTime(secondsRemaining)} remaining`
                : isCompleted
                  ? 'Session completed · Resting comfortably'
                  : `Set to ${targetMinutes} minutes · Ready when you are`}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Quick time display in collapsed mode */}
          {!isExpanded && (
            <span className={`text-sm font-mono font-bold px-2.5 py-1 rounded-lg border ${
              isCompleted
                ? 'bg-[#E8F5E9] text-[#1B5E20] border-[#C8E6C9]'
                : isActive
                  ? 'bg-[#1B4332] text-white border-[#1B4332]'
                  : 'bg-white text-[#14261C] border-[#DFD8C8]'
            }`}>
              {formatTime(secondsRemaining)}
            </span>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="min-h-[40px] px-2.5 py-1 text-xs font-semibold text-[#3B5446] hover:text-[#14261C] hover:bg-[#EAE4D9]/60 rounded-lg transition-colors flex items-center gap-1"
            title={isExpanded ? 'Collapse timer view' : 'Expand timer view'}
            aria-label={isExpanded ? 'Collapse timer' : 'Expand timer'}
          >
            <span className="hidden sm:inline">{isExpanded ? 'Hide' : 'Timer'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Controls Area */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-[#EDE7DB] space-y-4">
          {/* Completion Banner (Visual Alert) */}
          {isCompleted && (
            <div className="p-3.5 rounded-xl bg-[#E8F5E9] border border-[#A5D6A7] text-[#1B5E20] flex items-start gap-3 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[#2E7D32]" />
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-semibold">
                  Session duration reached gracefully
                </p>
                <p className="text-xs text-[#2E7D32] leading-relaxed">
                  Take a calm breath together. You can continue listening quietly, transition to another light conversation, or wrap up comfortably.
                </p>
              </div>
            </div>
          )}

          {/* Time Remaining Main Display & Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-[#14261C]">
                  {formatTime(secondsRemaining)}
                </span>
                <span className="text-xs text-[#526659]">
                  of {targetMinutes} min session
                </span>
              </div>

              {/* Sound Alert Toggle */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                    soundEnabled
                      ? 'bg-[#EAE4D9]/80 text-[#1B4332] border-[#D5CDBC]'
                      : 'bg-white text-[#7A8E81] border-[#E2DBD0]'
                  }`}
                  title={soundEnabled ? 'Gentle chime alert enabled' : 'Chime muted'}
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#1B4332]" />
                      <span>Chime on</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-[#889B8F]" />
                      <span>Muted</span>
                    </>
                  )}
                </button>
                {soundEnabled && (
                  <button
                    type="button"
                    onClick={handleTestChime}
                    className="min-h-[36px] px-2 py-1 rounded-lg text-[11px] text-[#556D5E] hover:text-[#1B4332] hover:bg-[#EAE4D9]/50 transition-colors"
                    title="Play a soft sample of the chime"
                  >
                    Test
                  </button>
                )}
              </div>
            </div>

            {/* Visual soothing progress bar */}
            <div className="w-full bg-[#E8E2D6] h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isCompleted
                    ? 'bg-[#2E7D32]'
                    : isActive
                      ? 'bg-[#1B4332]'
                      : 'bg-[#557666]'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Preset Buttons & Minute Adjustments */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-[#5A7062] mr-1">
                Presets:
              </span>
              {[3, 5, 10, 15, 20].map(mins => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => handleSetPreset(mins)}
                  className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                    targetMinutes === mins
                      ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-xs'
                      : 'bg-white text-[#2D4537] border-[#D5CDBC] hover:bg-[#F3EFE7]'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>

            {/* Quick + / - 1 Minute Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleAdjustMinutes(-1)}
                className="w-8 h-8 rounded-lg border border-[#D5CDBC] bg-white text-[#2D4537] hover:bg-[#F3EFE7] flex items-center justify-center transition-colors"
                title="Subtract 1 minute"
                aria-label="Subtract 1 minute"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleAdjustMinutes(1)}
                className="w-8 h-8 rounded-lg border border-[#D5CDBC] bg-white text-[#2D4537] hover:bg-[#F3EFE7] flex items-center justify-center transition-colors"
                title="Add 1 minute"
                aria-label="Add 1 minute"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Primary Action Buttons (Play / Pause / Reset) */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleTogglePlay}
              className={`min-h-[44px] flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-[#1B4332] ${
                isActive
                  ? 'bg-[#EAE4D9] text-[#1B4332] hover:bg-[#DFD7CA] border border-[#D5CDBC]'
                  : 'bg-[#1B4332] hover:bg-[#255C45] text-white shadow-xs'
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Timer</span>
                </>
              ) : isCompleted ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Restart Session</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Activity Timer</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D5CDBC] bg-white hover:bg-[#F3EFE7] text-[#3A5042] text-sm font-medium transition-colors flex items-center gap-1.5"
              title="Reset timer to beginning"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>

          {/* Compassionate Dementia Care Tip */}
          <p className="text-[11px] text-[#697D70] leading-relaxed italic bg-[#F7F4EC] p-2.5 rounded-lg border border-[#ECE5D8]">
            Caregiver reminder: If attention wanders or restlessness occurs, stop early without worry. Connection is about mutual comfort, never completing the clock.
          </p>
        </div>
      )}
    </div>
  );
};
