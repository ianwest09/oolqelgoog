'use client';

import React, { useState } from 'react';
import { Sparkles, Music, Coffee, Compass, ChevronDown, ChevronUp, Info, CheckCircle2 } from 'lucide-react';
import { ConnectionMoment } from '@/lib/types';

interface CulturalBridgeVisualizerProps {
  moment: ConnectionMoment;
}

export const CulturalBridgeVisualizer: React.FC<CulturalBridgeVisualizerProps> = ({ moment }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [selectedNode, setSelectedNode] = useState<'seed' | 'taste' | 'sensory' | 'atmosphere'>('taste');

  const seedName = moment.sourceProfile?.primaryInterest || 'Cultural Preference';
  const qlooName = moment.culturalReference?.name || 'Related Musical Work';
  const sensoryName = moment.sourceProfile?.activityType === 'listening'
    ? 'Warm Tea & Tactile Holding'
    : moment.sourceProfile?.activityType === 'looking'
      ? 'Large Visual Imagery'
      : 'Tactile Shared Presence';
  const atmosphereName = `${moment.sourceProfile?.atmosphere || 'Calm'} Atmosphere`;

  const nodeDetails = {
    seed: {
      title: '1. Cultural Seed (Familiar Memory)',
      subtitle: seedName,
      body: 'Long-term musical and cultural tastes remain preserved deep into late-stage memory. Grounding an activity in familiar artists creates immediate emotional safety without requiring recall.',
    },
    taste: {
      title: '2. Qloo Taste Intelligence Bridge',
      subtitle: qlooName,
      body: moment.culturalReference?.relationshipNote || 'Discovered through high taste-correlation with the seed artist. Connects familiar tone, era, and phrasing to prevent sensory dissonance while introducing gentle novelty.',
    },
    sensory: {
      title: '3. Tactile Sensory Anchor',
      subtitle: sensoryName,
      body: 'Pairing auditory or conversational prompts with physical touch (like holding a warm mug or soft fabric) engages motor pathways and prevents cognitive overwhelm.',
    },
    atmosphere: {
      title: '4. Emotional Atmosphere Guard',
      subtitle: atmosphereName,
      body: `Configured to ensure ${moment.sourceProfile?.atmosphere} pacing, respecting exclusions (${moment.sourceProfile?.exclusions || 'none specified'}) to ensure safety and prevent agitation.`,
    },
  };

  return (
    <div className="rounded-2xl border border-[#DFD8C8] bg-[#FAF8F5] p-4 sm:p-5 space-y-4 transition-all shadow-xs">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 border-b border-[#EAE3D5] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#EAE4D9] text-[#1B4332]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">
                Cultural Taste Bridge Visualizer
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9]">
                Qloo Graph
              </span>
            </div>
            <p className="text-xs text-[#526659]">
              How familiar taste safely bridges into tactile companionship.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="min-h-[36px] px-2.5 py-1 text-xs font-semibold text-[#3B5446] hover:text-[#14261C] hover:bg-[#EAE4D9]/60 rounded-lg transition-colors flex items-center gap-1"
        >
          <span>{isExpanded ? 'Hide graph' : 'Show graph'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Node Flow Diagram */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 relative">
            {/* Node 1: Seed */}
            <button
              type="button"
              onClick={() => setSelectedNode('seed')}
              className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
                selectedNode === 'seed'
                  ? 'bg-white border-[#1B4332] ring-2 ring-[#1B4332]/20 shadow-xs'
                  : 'bg-white/80 border-[#E2DDD0] hover:border-[#1B4332]/40'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[#1B4332]">
                <Music className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Familiar Seed</span>
              </div>
              <div className="text-xs font-bold text-[#14261C] truncate">
                {seedName}
              </div>
            </button>

            {/* Node 2: Taste Bridge */}
            <button
              type="button"
              onClick={() => setSelectedNode('taste')}
              className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
                selectedNode === 'taste'
                  ? 'bg-white border-[#1B4332] ring-2 ring-[#1B4332]/20 shadow-xs'
                  : 'bg-white/80 border-[#E2DDD0] hover:border-[#1B4332]/40'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[#1B5E20]">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Qloo Taste Bridge</span>
              </div>
              <div className="text-xs font-bold text-[#14261C] truncate">
                {qlooName}
              </div>
            </button>

            {/* Node 3: Sensory */}
            <button
              type="button"
              onClick={() => setSelectedNode('sensory')}
              className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
                selectedNode === 'sensory'
                  ? 'bg-white border-[#1B4332] ring-2 ring-[#1B4332]/20 shadow-xs'
                  : 'bg-white/80 border-[#E2DDD0] hover:border-[#1B4332]/40'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[#855B11]">
                <Coffee className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Sensory Anchor</span>
              </div>
              <div className="text-xs font-bold text-[#14261C] truncate">
                {sensoryName}
              </div>
            </button>

            {/* Node 4: Atmosphere */}
            <button
              type="button"
              onClick={() => setSelectedNode('atmosphere')}
              className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
                selectedNode === 'atmosphere'
                  ? 'bg-white border-[#1B4332] ring-2 ring-[#1B4332]/20 shadow-xs'
                  : 'bg-white/80 border-[#E2DDD0] hover:border-[#1B4332]/40'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[#304B3B]">
                <Compass className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Mood Guard</span>
              </div>
              <div className="text-xs font-bold text-[#14261C] truncate capitalize">
                {atmosphereName}
              </div>
            </button>
          </div>

          {/* Active Node Deep-Dive Info Box */}
          <div className="p-3.5 rounded-xl bg-white border border-[#E0D8CB] space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1B4332]">
                {nodeDetails[selectedNode].title}: {nodeDetails[selectedNode].subtitle}
              </span>
              <span className="text-[11px] text-[#718578]">
                Click nodes above to inspect
              </span>
            </div>
            <p className="text-[#3E5346] leading-relaxed">
              {nodeDetails[selectedNode].body}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
