'use client';

import React, { useState, useMemo, useSyncExternalStore } from 'react';
import { ConnectionMoment } from '@/lib/types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { Heart, Sparkles, TrendingUp, Calendar, Smile, AlertCircle } from 'lucide-react';

interface SavedMomentsChartProps {
  moments: ConnectionMoment[];
  onSelectMoment?: (moment: ConnectionMoment) => void;
}

const emptySubscribe = () => () => {};

const SCORE_LABELS: Record<number, { label: string; color: string; bg: string }> = {
  5: { label: 'Deep Connection & Joy', color: '#1B5E20', bg: '#E8F5E9' },
  4: { label: 'Calm & Engaged', color: '#2E7D32', bg: '#EDF7ED' },
  3: { label: 'Peaceful Presence', color: '#556B2F', bg: '#F4F7EE' },
  2: { label: 'Mild Engagement', color: '#B45309', bg: '#FEF3C7' },
  1: { label: 'Restless / Stopped Early', color: '#B91C1C', bg: '#FEE2E2' },
};

interface ChartPoint {
  id: string;
  timestamp: number;
  formattedDate: string;
  formattedTime: string;
  title: string;
  activityType: string;
  atmosphere: string;
  score: number;
  scoreLabel: string;
  notes?: string;
  moment: ConnectionMoment;
}

export const SavedMomentsChart: React.FC<SavedMomentsChartProps> = ({
  moments,
  onSelectMoment,
}) => {
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'listening' | 'looking' | 'conversation' | 'hands-on'>('all');

  // Format and sort moments chronologically
  const chartData: ChartPoint[] = useMemo(() => {
    // Sort oldest to newest for timeline line chart
    const sorted = [...moments].sort((a, b) => {
      const timeA = a.lastReflectedAt || a.createdAt || 0;
      const timeB = b.lastReflectedAt || b.createdAt || 0;
      return timeA - timeB;
    });

    const points: ChartPoint[] = sorted.map(m => {
      const timestamp = m.lastReflectedAt || m.createdAt || 0;
      const dateObj = new Date(timestamp || 1700000000000);
      // If no explicit score was set, default to 4 if positive note or 3 as neutral baseline
      const score = m.resonanceScore || (m.personalNotes ? 4 : 3);
      const scoreInfo = SCORE_LABELS[score] || SCORE_LABELS[3];

      return {
        id: m.id,
        timestamp,
        formattedDate: dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' }),
        formattedTime: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: m.title,
        activityType: m.sourceProfile?.activityType || 'listening',
        atmosphere: m.sourceProfile?.atmosphere || 'calm',
        score,
        scoreLabel: scoreInfo.label,
        notes: m.personalNotes,
        moment: m,
      };
    });

    if (selectedFilter === 'all') return points;
    return points.filter(p => p.activityType === selectedFilter);
  }, [moments, selectedFilter]);

  // Aggregate stats: average score, top resonated activity, reflection count
  const metrics = useMemo(() => {
    if (chartData.length === 0) {
      return { avgScore: 0, ratedCount: 0, topActivity: 'N/A', highResonanceCount: 0 };
    }

    const sum = chartData.reduce((acc, p) => acc + p.score, 0);
    const avg = (sum / chartData.length).toFixed(1);

    const activityScores: Record<string, { sum: number; count: number }> = {};
    let highCount = 0;

    chartData.forEach(p => {
      if (p.score >= 4) highCount++;
      if (!activityScores[p.activityType]) {
        activityScores[p.activityType] = { sum: 0, count: 0 };
      }
      activityScores[p.activityType].sum += p.score;
      activityScores[p.activityType].count += 1;
    });

    let bestActivity = 'Listening';
    let bestAvg = 0;

    Object.entries(activityScores).forEach(([type, data]) => {
      const typeAvg = data.sum / data.count;
      if (typeAvg > bestAvg) {
        bestAvg = typeAvg;
        bestActivity = type;
      }
    });

    return {
      avgScore: avg,
      ratedCount: chartData.length,
      topActivity: bestActivity,
      highResonanceCount: highCount,
    };
  }, [chartData]);

  if (!isMounted) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-[#6F8276] bg-white rounded-xl border border-[#E2DDD0]">
        Loading connection sentiment trends...
      </div>
    );
  }

  if (moments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Top Controls & Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 bg-white rounded-xl border border-[#E2DDD0] shadow-2xs">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5A7062]">
            <Heart className="w-3.5 h-3.5 text-[#1B4332]" />
            <span>Avg Connection</span>
          </div>
          <div className="text-xl font-bold text-[#14261C] mt-0.5">
            {metrics.avgScore} <span className="text-xs font-normal text-[#6F8276]">/ 5</span>
          </div>
          <p className="text-[10px] text-[#788C7E] mt-0.5">
            Caregiver rating average
          </p>
        </div>

        <div className="p-3 bg-white rounded-xl border border-[#E2DDD0] shadow-2xs">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5A7062]">
            <TrendingUp className="w-3.5 h-3.5 text-[#1B4332]" />
            <span>Best Resonance</span>
          </div>
          <div className="text-base font-bold text-[#14261C] mt-0.5 capitalize truncate">
            {metrics.topActivity}
          </div>
          <p className="text-[10px] text-[#788C7E] mt-0.5">
            Led to strongest engagement
          </p>
        </div>

        <div className="p-3 bg-white rounded-xl border border-[#E2DDD0] shadow-2xs">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5A7062]">
            <Sparkles className="w-3.5 h-3.5 text-[#1B4332]" />
            <span>Joyful / Calm</span>
          </div>
          <div className="text-xl font-bold text-[#14261C] mt-0.5">
            {metrics.highResonanceCount} <span className="text-xs font-normal text-[#6F8276]">sessions</span>
          </div>
          <p className="text-[10px] text-[#788C7E] mt-0.5">
            Scored 4 or 5 out of 5
          </p>
        </div>

        <div className="p-3 bg-white rounded-xl border border-[#E2DDD0] shadow-2xs">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5A7062]">
            <Calendar className="w-3.5 h-3.5 text-[#1B4332]" />
            <span>Data Points</span>
          </div>
          <div className="text-xl font-bold text-[#14261C] mt-0.5">
            {chartData.length}
          </div>
          <p className="text-[10px] text-[#788C7E] mt-0.5">
            Logged connection moments
          </p>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
        <span className="text-[#5A7062] font-semibold">Filter activity style:</span>
        <div className="flex flex-wrap gap-1">
          {(['all', 'listening', 'looking', 'conversation', 'hands-on'] as const).map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedFilter(type)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                selectedFilter === type
                  ? 'bg-[#1B4332] text-white'
                  : 'bg-white text-[#4A6052] border border-[#D5CDBC] hover:bg-[#FAF8F5]'
              }`}
            >
              {type === 'all' ? 'All Activities' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts Line Chart Container */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2DDD0] shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#14261C]">Connection Resonance Over Time</span>
          <span className="text-[#6F8276] text-[11px]">Y-Axis: 1 (Restless) to 5 (Deep Connection)</span>
        </div>

        <div className="h-56 sm:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE1" vertical={false} />
              
              <XAxis
                dataKey="formattedDate"
                stroke="#7F9486"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#E5DFD4' }}
              />

              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                stroke="#7F9486"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#E5DFD4' }}
                tickFormatter={(val) => {
                  switch (val) {
                    case 5: return '5★ Joy';
                    case 4: return '4★ Calm';
                    case 3: return '3★ Peace';
                    case 2: return '2★ Mild';
                    case 1: return '1★ Restless';
                    default: return String(val);
                  }
                }}
              />

              <ReferenceLine y={3} stroke="#D4A373" strokeDasharray="3 3" opacity={0.6} />

              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const data = payload[0].payload as ChartPoint;
                  const labelInfo = SCORE_LABELS[data.score] || SCORE_LABELS[3];

                  return (
                    <div className="bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-[#D5CDBC] shadow-lg text-xs max-w-xs space-y-1.5 z-50">
                      <div className="flex items-center justify-between gap-2 border-b border-[#EFEBE4] pb-1">
                        <span className="font-bold text-[#14261C] truncate">{data.title}</span>
                        <span className="text-[10px] text-[#6F8276] shrink-0">{data.formattedDate}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className="px-2 py-0.5 rounded font-semibold text-[11px]"
                          style={{ backgroundColor: labelInfo.bg, color: labelInfo.color }}
                        >
                          {data.score} / 5 · {labelInfo.label}
                        </span>
                      </div>

                      <div className="text-[11px] text-[#55695E] capitalize">
                        Style: {data.activityType} · Atmosphere: {data.atmosphere}
                      </div>

                      {data.notes && (
                        <div className="pt-1 border-t border-[#F0EBE1] text-[11px] text-[#2C4033] italic leading-tight">
                          &ldquo;{data.notes.slice(0, 110)}{data.notes.length > 110 ? '...' : ''}&rdquo;
                        </div>
                      )}

                      <div className="text-[10px] text-[#1B4332] font-semibold pt-0.5">
                        Tap point to view activity
                      </div>
                    </div>
                  );
                }}
              />

              <Line
                type="monotone"
                dataKey="score"
                stroke="#1B4332"
                strokeWidth={2.5}
                dot={{
                  r: 5,
                  fill: '#1B4332',
                  strokeWidth: 2,
                  stroke: '#FAF8F5',
                }}
                activeDot={{
                  r: 7,
                  fill: '#D4A373',
                  stroke: '#1B4332',
                  strokeWidth: 2,
                  onClick: (_, event) => {
                    // Navigate to moment if clicked
                    const payload = (event as any)?.payload as ChartPoint | undefined;
                    if (payload && onSelectMoment) {
                      onSelectMoment(payload.moment);
                    }
                  },
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#6F8276] pt-1 border-t border-[#F0EBE1]">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1B4332] inline-block" />
            Caregiver Reflection Sentiment
          </span>
          <span>Hover or tap data point to see reflection note</span>
        </div>
      </div>
    </div>
  );
};
