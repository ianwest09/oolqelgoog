'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Waves,
  Volume2,
  VolumeX,
  Play,
  Square,
  CloudRain,
  Flame,
  Wind,
  Bell,
  Disc,
} from 'lucide-react';

export type AmbientSoundType = 'rain' | 'hearth' | 'breeze' | 'chimes' | 'vinyl';

interface AmbientTrack {
  id: AmbientSoundType;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const TRACKS: AmbientTrack[] = [
  { id: 'rain', name: 'Courtyard Rain', icon: <CloudRain className="w-4 h-4" />, description: 'Gentle, steady drops against leaves' },
  { id: 'breeze', name: 'Garden Breeze', icon: <Wind className="w-4 h-4" />, description: 'Slow, swaying afternoon trees' },
  { id: 'hearth', name: 'Warm Hearth', icon: <Flame className="w-4 h-4" />, description: 'Soft fireside crackle and warmth' },
  { id: 'chimes', name: 'Tea & Chimes', icon: <Bell className="w-4 h-4" />, description: 'Peaceful harmonic acoustic chimes' },
  { id: 'vinyl', name: 'Vintage Vinyl', icon: <Disc className="w-4 h-4" />, description: 'Warm acoustic needle glow' },
];

// Pure Web Audio buffer generator outside React component
function createPinkNoiseBuffer(ctx: AudioContext, bufferSize: number): AudioBuffer {
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  let lastOut = 0.0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    lastOut = (lastOut * 0.94) + (white * 0.06);
    output[i] = lastOut;
  }
  return noiseBuffer;
}

export const AmbientSoundGenerator: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedTrack, setSelectedTrack] = useState<AmbientSoundType>('breeze');
  const [volume, setVolume] = useState<number>(0.25);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeNodesRef = useRef<any[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Stop all active audio generator nodes
  const stopAudio = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    activeNodesRef.current.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {
        // ignore already stopped
      }
    });
    activeNodesRef.current = [];

    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.suspend();
    }
    setIsPlaying(false);
  };

  // Start sound synthesis based on track
  const startAudio = (track: AmbientSoundType) => {
    stopAudio();

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioContextClass();
      } else if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      const nodes: any[] = [];

      if (track === 'rain' || track === 'breeze' || track === 'hearth' || track === 'vinyl') {
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = createPinkNoiseBuffer(ctx, bufferSize);

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        if (track === 'rain') {
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(800, ctx.currentTime);

          const highpass = ctx.createBiquadFilter();
          highpass.type = 'highpass';
          highpass.frequency.setValueAtTime(150, ctx.currentTime);

          whiteNoise.connect(highpass);
          highpass.connect(filter);
          filter.connect(masterGain);
          nodes.push(whiteNoise, filter, highpass);
        } else if (track === 'breeze') {
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(350, ctx.currentTime);

          const lfo = ctx.createOscillator();
          lfo.frequency.setValueAtTime(0.15, ctx.currentTime);
          const lfoGain = ctx.createGain();
          lfoGain.gain.setValueAtTime(160, ctx.currentTime);

          lfo.connect(lfoGain);
          lfoGain.connect(filter.frequency);

          whiteNoise.connect(filter);
          filter.connect(masterGain);
          lfo.start();
          nodes.push(whiteNoise, filter, lfo, lfoGain);
        } else if (track === 'hearth') {
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(250, ctx.currentTime);

          whiteNoise.connect(filter);
          filter.connect(masterGain);
          nodes.push(whiteNoise, filter);

          intervalRef.current = setInterval(() => {
            if (ctx.state !== 'running') return;
            const osc = ctx.createOscillator();
            const crackleGain = ctx.createGain();
            osc.frequency.setValueAtTime(1200 + Math.random() * 800, ctx.currentTime);
            crackleGain.gain.setValueAtTime(0.08 * Math.random(), ctx.currentTime);
            crackleGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
            osc.connect(crackleGain);
            crackleGain.connect(masterGain);
            osc.start();
            osc.stop(ctx.currentTime + 0.05);
          }, 350);
        } else if (track === 'vinyl') {
          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(500, ctx.currentTime);
          filter.Q.setValueAtTime(1.2, ctx.currentTime);

          whiteNoise.connect(filter);
          filter.connect(masterGain);
          nodes.push(whiteNoise, filter);
        }

        whiteNoise.start();
      } else if (track === 'chimes') {
        const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
        const playChime = () => {
          if (ctx.state !== 'running') return;
          const freq = notes[Math.floor(Math.random() * notes.length)];
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0.18, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.2);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start();
          osc.stop(ctx.currentTime + 3.5);
        };

        playChime();
        intervalRef.current = setInterval(() => {
          playChime();
        }, 2800);
      }

      activeNodesRef.current = nodes;
      setIsPlaying(true);
    } catch (e) {
      console.warn('Could not start ambient sound:', e);
      setIsPlaying(false);
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio(selectedTrack);
    }
  };

  const handleChangeTrack = (trackId: AmbientSoundType) => {
    setSelectedTrack(trackId);
    if (isPlaying) {
      startAudio(trackId);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(newVol, audioCtxRef.current.currentTime);
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <div className="rounded-2xl border border-[#DFD8C8] bg-[#FAF8F5] p-3.5 sm:p-4 transition-all">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg transition-colors ${
            isPlaying ? 'bg-[#1B4332] text-white animate-pulse' : 'bg-[#EAE4D9] text-[#1B4332]'
          }`}>
            <Waves className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#1B4332] uppercase tracking-wider">
                Ambient Sound Atmosphere
              </span>
              <span className="text-[10px] text-[#718578] font-medium hidden sm:inline">
                (Grounding background sound)
              </span>
            </div>
            <p className="text-xs text-[#526659]">
              {isPlaying
                ? `Playing: ${TRACKS.find(t => t.id === selectedTrack)?.name}`
                : 'Subtle soundscape to ease restlessness & sundowning'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleTogglePlay}
            className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              isPlaying
                ? 'bg-[#EAE4D9] text-[#1B4332] border border-[#D5CDBC]'
                : 'bg-[#1B4332] text-white hover:bg-[#255C45] shadow-xs'
            }`}
          >
            {isPlaying ? (
              <>
                <Square className="w-3 h-3" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-white" />
                <span>Play Sound</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-xs text-[#4F6456] hover:text-[#14261C] hover:bg-[#EAE4D9]/60 rounded-lg transition-colors"
            title={isExpanded ? 'Hide ambient options' : 'Choose soundscape & volume'}
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Track Selection & Volume Bar */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-[#EDE7DB] space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {TRACKS.map(track => (
              <button
                key={track.id}
                type="button"
                onClick={() => handleChangeTrack(track.id)}
                className={`p-2 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                  selectedTrack === track.id
                    ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-xs'
                    : 'bg-white text-[#2D4537] border-[#D5CDBC] hover:bg-[#F3EFE7]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {track.icon}
                  <span className="text-xs font-bold truncate">{track.name}</span>
                </div>
                <span className={`text-[10px] leading-tight line-clamp-1 ${
                  selectedTrack === track.id ? 'text-[#E0EFE5]' : 'text-[#708477]'
                }`}>
                  {track.description}
                </span>
              </button>
            ))}
          </div>

          {/* Volume Slider */}
          <div className="flex items-center gap-3 pt-1">
            <VolumeX className="w-3.5 h-3.5 text-[#728578]" />
            <input
              type="range"
              min="0"
              max="0.6"
              step="0.02"
              value={volume}
              onChange={e => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-[#1B4332] cursor-pointer"
            />
            <Volume2 className="w-3.5 h-3.5 text-[#1B4332]" />
            <span className="text-xs font-mono text-[#526659] min-w-[32px]">
              {Math.round((volume / 0.6) * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
