'use client';

import React from 'react';
import { Printer, X, Heart, Clock, Music, AlertTriangle, PenLine, Sparkles, Wind, Coffee } from 'lucide-react';
import { ConnectionMoment } from '@/lib/types';
import { AvatarBadge } from './AvatarBadge';

interface CarePartnerHandoutModalProps {
  moment: ConnectionMoment;
  recipientName?: string;
  onClose: () => void;
}

export const CarePartnerHandoutModal: React.FC<CarePartnerHandoutModalProps> = ({
  moment,
  recipientName,
  onClose,
}) => {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const displayName = recipientName || moment.sourceProfile?.primaryInterest ? `${moment.sourceProfile.primaryInterest} Activity` : 'Loved One';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#E2DDD0] my-auto">
        {/* Modal Controls Bar (hidden during physical printing) */}
        <div className="flex items-center justify-between border-b border-[#EAE4D9] pb-4 print:hidden">
          <div>
            <h2 className="text-lg font-bold text-[#14261C]">
              Printable Care-Partner Handout
            </h2>
            <p className="text-xs text-[#526659]">
              Prepared for respite aides, nurses, or family members sharing the routine.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="min-h-[42px] px-4 py-2 rounded-xl bg-[#1B4332] text-white text-xs sm:text-sm font-semibold hover:bg-[#255C45] transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Handout</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl border border-[#D5CDBC] text-[#526659] hover:text-[#14261C] flex items-center justify-center hover:bg-[#FAF8F5]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas Area */}
        <div className="space-y-6 text-[#14261C] font-sans p-1 sm:p-4 bg-white print:p-0">
          {/* Paper Header */}
          <div className="border-b-2 border-[#1B4332] pb-4 flex items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="text-xs font-bold uppercase tracking-wider text-[#1B4332]">
                Kinship · Cultural Connection Routine
              </div>
              <h1 className="text-2xl font-bold text-[#14261C] mt-1">
                {moment.title}
              </h1>

              {/* Patient and Caregiver Profile Details */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E0D9CB]">
                  <AvatarBadge
                    name={moment.sourceProfile?.patient?.name || displayName}
                    avatarUrl={moment.sourceProfile?.patient?.avatarUrl}
                    role="patient"
                    size="xs"
                  />
                  <span className="font-semibold text-[#14261C]">
                    {moment.sourceProfile?.patient?.name || displayName}
                  </span>
                  {moment.sourceProfile?.patient?.age && (
                    <span className="text-[10px] text-[#55695D]">
                      (Age {moment.sourceProfile.patient.age})
                    </span>
                  )}
                  {moment.sourceProfile?.patient?.nationality && (
                    <span className="text-[10px] text-[#55695D]">
                      · {moment.sourceProfile.patient.nationality}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E0D9CB]">
                  <AvatarBadge
                    name={moment.sourceProfile?.caregiver?.name || 'Caregiver'}
                    avatarUrl={moment.sourceProfile?.caregiver?.avatarUrl}
                    role="caregiver"
                    size="xs"
                  />
                  <span className="text-[#14261C]">
                    Shared by: <strong>{moment.sourceProfile?.caregiver?.relationship || 'Caregiver'}</strong>
                    {moment.sourceProfile?.caregiver?.name ? ` (${moment.sourceProfile.caregiver.name})` : ''}
                  </span>
                </div>

                <span className="text-[#526659]">· {moment.sourceProfile?.atmosphere || 'Calm'} Atmosphere</span>
                <span className="text-[#526659]">· {moment.suggestedDurationMinutes}m unhurried</span>
              </div>
            </div>

            <div className="text-right text-[11px] text-[#6E8375] shrink-0">
              <div className="font-semibold text-[#1B4332]">Kinship Care Plan</div>
              <div>{new Date().toLocaleDateString()}</div>
            </div>
          </div>

          {/* Section 1: Opening Invitation */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E1D3] space-y-1">
            <div className="text-xs font-bold uppercase text-[#1B4332] flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-[#1B4332]" />
              <span>Step 1: Opening words (Say warmly aloud)</span>
            </div>
            <p className="text-base font-medium text-[#1A3324] italic">
              &ldquo;{moment.openingSentence}&rdquo;
            </p>
          </div>

          {/* Section 2: Conversation Prompts */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase text-[#445B4D]">
              Step 2: Gentle conversation invitations (No memory tests)
            </div>
            <div className="space-y-1.5 pl-2 border-l-2 border-[#1B4332]/40">
              {moment.conversationInvitations.map((inv, idx) => (
                <p key={idx} className="text-xs sm:text-sm text-[#23382B] leading-relaxed">
                  • {inv}
                </p>
              ))}
            </div>
          </div>

          {/* Section 3: Shared Practical Activity */}
          <div className="p-4 rounded-xl bg-[#F7F4EC] border border-[#E4DDD0] space-y-1">
            <div className="text-xs font-bold uppercase text-[#2D4537]">
              Step 3: Shared tactile or sensory activity
            </div>
            <p className="text-xs sm:text-sm text-[#1B2F23] leading-relaxed">
              {moment.practicalActivity}
            </p>
          </div>

          {/* Qloo Multi-Sensory Bridge (Aroma, Taste, Tactile) */}
          {moment.multiSensoryBridge && (
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#DFD7C7] space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#1B4332] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#1B4332]" />
                <span>Qloo Multi-Sensory Environment Pairings</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-[#2F4435]">
                {moment.multiSensoryBridge.aromaOrScent && (
                  <div>
                    <strong>Aroma:</strong> {moment.multiSensoryBridge.aromaOrScent}
                  </div>
                )}
                {moment.multiSensoryBridge.flavorOrBeverage && (
                  <div>
                    <strong>Taste/Drink:</strong> {moment.multiSensoryBridge.flavorOrBeverage}
                  </div>
                )}
                {moment.multiSensoryBridge.tactileTexture && (
                  <div>
                    <strong>Tactile:</strong> {moment.multiSensoryBridge.tactileTexture}
                  </div>
                )}
                {moment.multiSensoryBridge.intergenerationalBridge && (
                  <div className="col-span-2 text-[11px] text-[#4F6456] italic">
                    <strong>Relational dynamic:</strong> {moment.multiSensoryBridge.intergenerationalBridge}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 4: Cultural Background */}
          {moment.culturalReference && (
            <div className="text-xs text-[#526659] border-t border-[#ECE5D9] pt-2 flex items-center gap-2">
              <Music className="w-3.5 h-3.5 text-[#1B4332]" />
              <span>
                <strong>Cultural Reference:</strong> {moment.culturalReference.name} ({moment.culturalReference.category})
              </span>
            </div>
          )}

          {/* Section 5: Dignity & Comfort Rules */}
          <div className="p-3.5 rounded-xl bg-[#FFFBF0] border border-[#F3E3B6] text-xs text-[#735212] space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#B45309]" />
              <span>Caregiver Comfort Reminder</span>
            </div>
            <p>{moment.caregiverNote}</p>
            <p className="text-[11px] font-semibold text-[#8C6215]">
              It is always okay to stop early, turn the sound down, or simply sit together quietly.
            </p>
          </div>

          {/* Section 6: Handwritten Session Notes Area */}
          <div className="border border-dashed border-[#C8BFB0] rounded-xl p-3.5 space-y-2">
            <div className="text-xs font-bold text-[#14261C] flex items-center gap-1.5">
              <PenLine className="w-3.5 h-3.5 text-[#1B4332]" />
              <span>Care-Partner Session Notes & Observations</span>
            </div>
            {moment.personalNotes ? (
              <p className="text-xs text-[#2A3E31] italic">
                Previous note: &ldquo;{moment.personalNotes}&rdquo;
              </p>
            ) : null}
            <div className="h-16 border-b border-dashed border-[#DCD5C8]" />
          </div>
        </div>
      </div>
    </div>
  );
};
