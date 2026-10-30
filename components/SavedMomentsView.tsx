'use client';

import React, { useState, useMemo } from 'react';
import { ConnectionMoment } from '@/lib/types';
import { SavedMomentsChart } from './SavedMomentsChart';
import { AvatarBadge } from './AvatarBadge';
import {
  Bookmark,
  Trash2,
  ArrowRight,
  Clock,
  Sparkles,
  Copy,
  Check,
  PenLine,
  Search,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Heart,
  Star,
  Activity,
  Wind,
  Coffee,
} from 'lucide-react';

interface SavedMomentsViewProps {
  savedMoments: ConnectionMoment[];
  onRemoveMoment: (id: string) => void;
  onClearAll: () => void;
  onSelectMoment: (moment: ConnectionMoment) => void;
  onCreateMomentClick: () => void;
  onUpdateNotes?: (momentId: string, notes: string, score?: number) => void;
}

const RESONANCE_OPTIONS: { score: number; label: string; desc: string; color: string; bg: string }[] = [
  { score: 5, label: 'Deep Connection & Joy', desc: 'Smiles, spark of joy, engaged', color: '#1B5E20', bg: '#E8F5E9' },
  { score: 4, label: 'Calm & Engaged', desc: 'Attentive, relaxed, responsive', color: '#2E7D32', bg: '#EDF7ED' },
  { score: 3, label: 'Peaceful Presence', desc: 'Restful, comfortable, quiet', color: '#556B2F', bg: '#F4F7EE' },
  { score: 2, label: 'Mild Engagement', desc: 'Distracted or brief focus', color: '#B45309', bg: '#FEF3C7' },
  { score: 1, label: 'Restless / Stopped Early', desc: 'Fatigued, discontinued', color: '#B91C1C', bg: '#FEE2E2' },
];

export const SavedMomentsView: React.FC<SavedMomentsViewProps> = ({
  savedMoments,
  onRemoveMoment,
  onClearAll,
  onSelectMoment,
  onCreateMomentClick,
  onUpdateNotes,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [draftNote, setDraftNote] = useState<string>('');
  const [draftScore, setDraftScore] = useState<number>(4);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showInsights, setShowInsights] = useState<boolean>(true);
  const [activeInsightsTab, setActiveInsightsTab] = useState<'chart' | 'summary'>('chart');

  // Compute "What Resonated" reflection insights & care trends
  const insights = useMemo(() => {
    const total = savedMoments.length;
    const withNotes = savedMoments.filter(m => m.personalNotes && m.personalNotes.trim().length > 0);

    const atmosphereCounts: Record<string, number> = {};
    const interestCounts: Record<string, number> = {};

    savedMoments.forEach(m => {
      const atmo = m.sourceProfile?.atmosphere || 'calm';
      atmosphereCounts[atmo] = (atmosphereCounts[atmo] || 0) + 1;

      const interest = m.sourceProfile?.primaryInterest || 'General';
      interestCounts[interest] = (interestCounts[interest] || 0) + 1;
    });

    const topInterests = Object.entries(interestCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));

    return {
      total,
      reflectedCount: withNotes.length,
      atmosphereCounts,
      topInterests,
    };
  }, [savedMoments]);

  // Filtered moments based on search query
  const filteredMoments = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return savedMoments;

    return savedMoments.filter(m =>
      m.title.toLowerCase().includes(query) ||
      m.sourceProfile.primaryInterest.toLowerCase().includes(query) ||
      (m.personalNotes && m.personalNotes.toLowerCase().includes(query)) ||
      (m.culturalReference?.name && m.culturalReference.name.toLowerCase().includes(query))
    );
  }, [savedMoments, searchQuery]);

  const handleCopy = (m: ConnectionMoment) => {
    const scoreObj = RESONANCE_OPTIONS.find(o => o.score === m.resonanceScore);
    const lines = [
      `Kinship Moment: ${m.title}`,
      `Duration: ${m.suggestedDurationMinutes}m unhurried`,
      `Opening: "${m.openingSentence}"`,
      `Shared Activity: ${m.practicalActivity}`,
      `Caregiver Guide: ${m.caregiverNote}`,
    ];

    if (scoreObj) {
      lines.push(`Resonance Rating: ${scoreObj.score}/5 (${scoreObj.label})`);
    }

    if (m.personalNotes) {
      lines.push(`Caregiver Reflection: "${m.personalNotes}"`);
    }

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedId(m.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStartEditingNote = (m: ConnectionMoment) => {
    setEditingNoteId(m.id);
    setDraftNote(m.personalNotes || '');
    setDraftScore(m.resonanceScore || 4);
  };

  const handleSaveNoteInline = (momentId: string) => {
    if (onUpdateNotes) {
      onUpdateNotes(momentId, draftNote.trim(), draftScore);
    }
    setEditingNoteId(null);
  };

  if (savedMoments.length === 0) {
    return (
      <div className="py-12 max-w-lg mx-auto text-center space-y-5 px-4">
        <div className="w-14 h-14 rounded-2xl bg-[#EAE4D9] text-[#1B4332] flex items-center justify-center mx-auto">
          <Bookmark className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-bold text-[#14261C]">
            No saved moments yet
          </h2>
          <p className="text-sm text-[#4E6254] leading-relaxed">
            When you find a cultural connection moment that resonates, save it here along with your personal reflections and connection ratings to track what sparks comfort and joy over time.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={onCreateMomentClick}
            className="min-h-[48px] px-6 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#255C45] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create your first moment</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-8 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6E0D5] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#14261C]">
            Saved Connection Moments
          </h1>
          <p className="text-xs sm:text-sm text-[#526659]">
            {savedMoments.length} moment{savedMoments.length !== 1 ? 's' : ''} stored locally with your notes and sentiment tracking.
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to clear all saved moments and reflections from this device?')) {
              onClearAll();
            }
          }}
          className="min-h-[40px] px-3 py-1.5 rounded-lg border border-[#D5CDBC] text-xs font-semibold text-[#8C3A3A] hover:bg-[#FEF2F2] hover:border-[#FECACA] transition-colors self-start sm:self-auto flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear all saved</span>
        </button>
      </div>

      {/* Feature: Caregiver "What Resonated" Reflection Insights & Recharts Line Chart */}
      <div className="rounded-2xl border border-[#DFD8C8] bg-[#FAF8F5] p-4 sm:p-5 space-y-4 transition-all shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#EAE4D9] text-[#1B4332]">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">
                  Caregiver Insights & Sentiment Over Time
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#EAE4D9] text-[#2E4738]">
                  {insights.reflectedCount} Reflected
                </span>
              </div>
              <p className="text-xs text-[#526659]">
                Visualizing notes, ratings, and environments that brought peace.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {showInsights && (
              <div className="hidden xs:flex rounded-lg border border-[#D5CDBC] bg-white p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveInsightsTab('chart')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    activeInsightsTab === 'chart'
                      ? 'bg-[#1B4332] text-white shadow-2xs'
                      : 'text-[#4A6052] hover:text-[#14261C]'
                  }`}
                >
                  Chart
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInsightsTab('summary')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    activeInsightsTab === 'summary'
                      ? 'bg-[#1B4332] text-white shadow-2xs'
                      : 'text-[#4A6052] hover:text-[#14261C]'
                  }`}
                >
                  Summary
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowInsights(!showInsights)}
              className="p-1.5 text-xs text-[#4F6456] hover:text-[#14261C] hover:bg-[#EAE4D9]/60 rounded-lg transition-colors"
              aria-label="Toggle insights"
            >
              {showInsights ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {showInsights && (
          <div className="pt-2 border-t border-[#EAE3D5] space-y-4">
            {activeInsightsTab === 'chart' ? (
              /* Recharts Line Chart View */
              <SavedMomentsChart
                moments={savedMoments}
                onSelectMoment={onSelectMoment}
              />
            ) : (
              /* Summary Statistics Cards */
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-xl border border-[#E2DDD0] space-y-1">
                  <span className="text-[11px] font-semibold text-[#5A7062]">Reflections Logged</span>
                  <div className="text-lg font-bold text-[#14261C]">
                    {insights.reflectedCount} of {insights.total}
                  </div>
                  <p className="text-[10px] text-[#788C7E]">
                    Sessions with caregiver notes
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#E2DDD0] space-y-1">
                  <span className="text-[11px] font-semibold text-[#5A7062]">Primary Atmospheres</span>
                  <div className="text-xs font-medium text-[#2C4233] space-y-0.5">
                    {Object.entries(insights.atmosphereCounts).map(([atmo, count]) => (
                      <div key={atmo} className="flex justify-between capitalize">
                        <span>{atmo}:</span>
                        <span className="font-bold">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#E2DDD0] space-y-1">
                  <span className="text-[11px] font-semibold text-[#5A7062]">Top Interests</span>
                  <div className="text-xs font-medium text-[#2C4233] space-y-0.5">
                    {insights.topInterests.map((item, idx) => (
                      <div key={idx} className="flex justify-between truncate">
                        <span className="truncate max-w-[120px]">{item.name}</span>
                        <span className="font-bold shrink-0">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#7A8E80] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search saved moments by interest, artist, or reflection note..."
          className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-[#D5CDBC] rounded-xl focus:outline-[#1B4332] text-[#14261C] placeholder:text-[#889B8E]"
        />
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {filteredMoments.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#526659]">
            No moments matched your search. Try another keyword.
          </div>
        ) : (
          filteredMoments.map(m => {
            const isEditing = editingNoteId === m.id;
            const score = m.resonanceScore || (m.personalNotes ? 4 : 3);
            const scoreInfo = RESONANCE_OPTIONS.find(o => o.score === score) || RESONANCE_OPTIONS[2];

            return (
              <div
                key={m.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2DDD0] shadow-xs space-y-4 hover:border-[#1B4332]/40 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="flex items-center gap-1 font-semibold text-[#1B4332] bg-[#EAE4D9]/80 px-2 py-0.5 rounded">
                        <Clock className="w-3 h-3" />
                        {m.suggestedDurationMinutes}m
                      </span>
                      <span className="text-[#65796D] capitalize">
                        {m.sourceProfile.activityType} · {m.sourceProfile.atmosphere}
                      </span>
                      {/* Resonance Score Pill */}
                      <span
                        className="font-semibold px-2 py-0.5 rounded text-[11px] flex items-center gap-1"
                        style={{ backgroundColor: scoreInfo.bg, color: scoreInfo.color }}
                      >
                        <Star className="w-3 h-3 fill-current" />
                        <span>{score}/5 · {scoreInfo.label}</span>
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-[#14261C]">
                      {m.title}
                    </h2>

                    {/* Patient & Caregiver Avatar Bar */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-[#526659]">
                      {/* Patient Avatar & Details */}
                      <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-2 py-1 rounded-xl border border-[#E8E2D5]">
                        <AvatarBadge
                          name={m.sourceProfile?.patient?.name || 'Loved One'}
                          avatarUrl={m.sourceProfile?.patient?.avatarUrl}
                          role="patient"
                          size="xs"
                        />
                        <span className="font-semibold text-[#14261C]">
                          {m.sourceProfile?.patient?.name || 'Loved One'}
                        </span>
                        {m.sourceProfile?.patient?.age && (
                          <span className="text-[10px] bg-white px-1.5 py-0.2 rounded border border-[#E0D9CB]">
                            Age {m.sourceProfile.patient.age}
                          </span>
                        )}
                        {m.sourceProfile?.patient?.nationality && (
                          <span className="text-[10px] text-[#55695D]">
                            ({m.sourceProfile.patient.nationality})
                          </span>
                        )}
                      </div>

                      {/* Caregiver Avatar & Details */}
                      <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-2 py-1 rounded-xl border border-[#E8E2D5]">
                        <AvatarBadge
                          name={m.sourceProfile?.caregiver?.name || 'Caregiver'}
                          avatarUrl={m.sourceProfile?.caregiver?.avatarUrl}
                          role="caregiver"
                          size="xs"
                        />
                        <span className="text-[#14261C]">
                          {m.sourceProfile?.caregiver?.name ? (
                            <>
                              <strong className="font-semibold">{m.sourceProfile.caregiver.name}</strong>
                              <span className="text-[11px] text-[#78350F] ml-1">
                                ({m.sourceProfile.caregiver.relationship})
                              </span>
                            </>
                          ) : (
                            <span className="font-semibold text-[#78350F]">
                              {m.sourceProfile?.caregiver?.relationship || 'Caregiver'}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleCopy(m)}
                      className="w-9 h-9 rounded-lg border border-[#D5CDBC] bg-white text-[#2D4537] hover:bg-[#FAF8F5] flex items-center justify-center transition-colors"
                      title="Copy moment text and reflections"
                    >
                      {copiedId === m.id ? (
                        <Check className="w-4 h-4 text-green-700" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => onRemoveMoment(m.id)}
                      className="w-9 h-9 rounded-lg border border-[#D5CDBC] bg-white text-[#8C3A3A] hover:bg-[#FEF2F2] flex items-center justify-center transition-colors"
                      title="Remove this saved moment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-[#405447] italic bg-[#FAF8F5] p-3 rounded-xl border border-[#ECE6DB]">
                  &ldquo;{m.openingSentence}&rdquo;
                </p>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#526659]">
                  <div>
                    <strong>Primary Interest:</strong> {m.sourceProfile.primaryInterest}
                  </div>
                  {m.culturalReference?.name && (
                    <div>
                      <strong>Cultural work:</strong> {m.culturalReference.name}
                    </div>
                  )}
                  {(m.sourceProfile?.patient?.formativeEra || m.sourceProfile?.patient?.era) && (
                    <div className="text-[11px] bg-[#EFE9DC] px-2 py-0.5 rounded text-[#1B4332]">
                      Era: {m.sourceProfile.patient.formativeEra || m.sourceProfile.patient.era}
                    </div>
                  )}
                </div>

                {/* Multi-sensory badges if present */}
                {m.multiSensoryBridge && (
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    {m.multiSensoryBridge.aromaOrScent && (
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#1B4332] border border-[#E6DFC6] flex items-center gap-1">
                        <Wind className="w-3 h-3 text-[#1B4332]" />
                        <span className="truncate max-w-[200px]">{m.multiSensoryBridge.aromaOrScent}</span>
                      </span>
                    )}
                    {m.multiSensoryBridge.flavorOrBeverage && (
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#855B11] border border-[#EADFC7] flex items-center gap-1">
                        <Coffee className="w-3 h-3 text-[#855B11]" />
                        <span className="truncate max-w-[200px]">{m.multiSensoryBridge.flavorOrBeverage}</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Personal Reflection & Notes Display with Resonance Rating */}
                <div className="p-3.5 rounded-xl bg-[#FCFAF6] border border-[#E9E3D6] space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#1B4332] flex items-center gap-1.5">
                      <PenLine className="w-3.5 h-3.5 text-[#1B4332]" />
                      <span>Caregiver Reflection & Resonance Rating:</span>
                    </span>

                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => handleStartEditingNote(m)}
                        className="text-xs font-semibold text-[#2D4537] hover:text-[#14261C] hover:underline"
                      >
                        {m.personalNotes ? 'Edit note & rating' : '+ Add note & rating'}
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-3 pt-1">
                      {/* Connection Rating Selector */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-[#4B6053] block">
                          How was the connection resonance?
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                          {RESONANCE_OPTIONS.map(opt => (
                            <button
                              key={opt.score}
                              type="button"
                              onClick={() => setDraftScore(opt.score)}
                              className={`p-2 rounded-lg text-left border transition-all text-xs ${
                                draftScore === opt.score
                                  ? 'border-[#1B4332] ring-2 ring-[#1B4332]/20 font-bold'
                                  : 'border-[#D5CDBC] bg-white opacity-85 hover:opacity-100'
                              }`}
                              style={{ backgroundColor: draftScore === opt.score ? opt.bg : undefined }}
                            >
                              <div className="flex items-center gap-1 font-bold text-[11px]" style={{ color: opt.color }}>
                                <Star className="w-3 h-3 fill-current" />
                                <span>{opt.score}★</span>
                              </div>
                              <div className="text-[10px] text-[#2C4033] leading-tight truncate">
                                {opt.label.split(' ')[0]}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <textarea
                        value={draftNote}
                        onChange={e => setDraftNote(e.target.value)}
                        placeholder="Write your observation (e.g. Vera smiled when the piano started, calm breathing, volume was comfortable)..."
                        rows={2}
                        className="w-full p-2.5 text-xs text-[#14261C] bg-white border border-[#D5CDBC] rounded-lg focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] outline-none leading-relaxed"
                      />

                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingNoteId(null)}
                          className="px-2.5 py-1 text-xs rounded-md border border-[#D5CDBC] bg-white text-[#526659] hover:bg-[#FAF8F5]"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveNoteInline(m.id)}
                          className="px-3 py-1 text-xs rounded-md bg-[#1B4332] text-white font-semibold hover:bg-[#255C45]"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : m.personalNotes ? (
                    <div className="space-y-1">
                      <p className="text-xs text-[#2A3E31] leading-relaxed whitespace-pre-line bg-white/70 p-2.5 rounded-lg border border-[#EDE7DC]">
                        {m.personalNotes}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-[#7A8E80] italic">
                      No reflection recorded yet. Click &ldquo;+ Add note & rating&rdquo; to track how this session went on the timeline chart.
                    </p>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#F0EBE1]">
                  <span className="text-[11px] text-[#718578]">
                    Saved {new Date(m.createdAt).toLocaleDateString()}
                    {m.lastReflectedAt ? ` · Reflected ${new Date(m.lastReflectedAt).toLocaleDateString()}` : ''}
                  </span>

                  <button
                    onClick={() => onSelectMoment(m)}
                    className="min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#1B4332] hover:bg-[#255C45] text-white transition-colors flex items-center gap-1.5"
                  >
                    <span>Open activity card</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
