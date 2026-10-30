'use client';

import React from 'react';
import { WorkflowStep } from '@/lib/types';
import { CheckCircle2, CircleDashed, AlertCircle, RefreshCw, Sparkles, Compass } from 'lucide-react';

interface AgentWorkflowIndicatorProps {
  steps: WorkflowStep[];
  currentStepIndex: number;
  isComplete: boolean;
  isDemonstration: boolean;
  error?: string | null;
  onRetry?: () => void;
  onCancel?: () => void;
}

const STEP_DEFINITIONS = [
  { id: 1, label: 'Understanding the selected interests', icon: Compass },
  { id: 2, label: 'Looking up cultural references through Qloo', icon: Sparkles },
  { id: 3, label: 'Exploring related interests using Qloo Insights API', icon: Compass },
  { id: 4, label: 'Preparing a suitable shared activity with Gemini', icon: Sparkles },
  { id: 5, label: 'Checking activity against preferences and exclusions', icon: CheckCircle2 },
];

export const AgentWorkflowIndicator: React.FC<AgentWorkflowIndicatorProps> = ({
  steps,
  currentStepIndex,
  isComplete,
  isDemonstration,
  error,
  onRetry,
  onCancel,
}) => {
  return (
    <div className="py-8 max-w-xl mx-auto space-y-6">
      {/* Container Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E4DDD0] shadow-sm space-y-6">
        <div className="text-center space-y-2 border-b border-[#F0EBE1] pb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#1B4332]/10 text-[#1B4332] flex items-center justify-center mx-auto mb-2">
            {error ? (
              <AlertCircle className="w-6 h-6 text-[#B91C1C]" />
            ) : isComplete ? (
              <CheckCircle2 className="w-6 h-6 text-[#1B4332]" />
            ) : (
              <CircleDashed className="w-6 h-6 animate-spin text-[#1B4332]" />
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#14261C]">
            {error
              ? 'Encountered a hurdle'
              : isComplete
              ? 'Connection moment ready'
              : 'Orchestrating your connection moment'}
          </h2>
          <p className="text-sm text-[#526659]">
            {isDemonstration
              ? 'Working in Demonstration Mode with sample taste-graph intelligence.'
              : 'Consulting Qloo cultural intelligence and synthesizing with Gemini.'}
          </p>
        </div>

        {/* Step List */}
        <div className="space-y-4 pt-1">
          {STEP_DEFINITIONS.map((def, idx) => {
            const actualStep = steps.find(s => s.id === def.id);
            const isCompleted = actualStep?.status === 'completed';
            const isFallback = actualStep?.status === 'fallback';
            const isFailed = actualStep?.status === 'failed';
            const isInProgress = idx === currentStepIndex && !isComplete && !error;
            const isPending = !actualStep && !isInProgress;

            return (
              <div
                key={def.id}
                className={`flex items-start gap-3.5 p-3.5 rounded-xl transition-all border ${
                  isInProgress
                    ? 'bg-[#FAF8F5] border-[#1B4332]/30 ring-1 ring-[#1B4332]/20'
                    : isCompleted
                    ? 'bg-white border-[#E8E2D6]'
                    : isFallback
                    ? 'bg-[#FFFBEB] border-[#FDE68A]'
                    : 'bg-[#FAF8F5]/50 border-transparent opacity-60'
                }`}
              >
                {/* Status Icon */}
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-[#1B4332] text-white flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : isFallback ? (
                    <div className="w-5 h-5 rounded-full bg-[#D97706] text-white flex items-center justify-center text-[10px] font-bold">
                      !
                    </div>
                  ) : isFailed ? (
                    <div className="w-5 h-5 rounded-full bg-[#DC2626] text-white flex items-center justify-center">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  ) : isInProgress ? (
                    <CircleDashed className="w-5 h-5 text-[#1B4332] animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-[#D1C9BC]" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#182F22] flex items-center justify-between">
                    <span>{def.label}</span>
                    {isFallback && (
                      <span className="text-[11px] text-[#B45309] font-medium">Direct fallback</span>
                    )}
                  </div>
                  {actualStep?.detail ? (
                    <p className="text-xs text-[#55695E] mt-0.5 leading-relaxed">
                      {actualStep.detail}
                    </p>
                  ) : isInProgress ? (
                    <p className="text-xs text-[#1B4332] mt-0.5 animate-pulse font-medium">
                      Executing server operation...
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {/* Error handling & Recovery controls */}
        {error && (
          <div className="p-4 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] space-y-3">
            <p className="text-sm text-[#991B1B] font-medium leading-relaxed">
              {error}
            </p>
            <div className="flex items-center gap-2 pt-1">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#1B4332] text-white text-sm font-semibold hover:bg-[#255C45] transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry request</span>
                </button>
              )}
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-white border border-[#D5CDBC] text-[#2D4537] text-sm font-semibold hover:bg-[#FAF8F5] transition-colors"
                >
                  Return to profile
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
