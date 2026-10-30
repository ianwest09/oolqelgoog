'use client';

import React, { useState } from 'react';
import { Calendar, CalendarPlus, Download, Check, ExternalLink, X, Clock } from 'lucide-react';
import { ConnectionMoment } from '@/lib/types';

interface AddToCalendarButtonProps {
  moment: ConnectionMoment;
  recipientName?: string;
  variant?: 'primary' | 'secondary' | 'compact';
}

function formatIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

export const AddToCalendarButton: React.FC<AddToCalendarButtonProps> = ({
  moment,
  recipientName,
  variant = 'secondary',
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<'today_afternoon' | 'tomorrow_morning' | 'tomorrow_afternoon' | 'custom'>('tomorrow_afternoon');
  const [customDateTime, setCustomDateTime] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(14, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Compute start and end times based on selection
  const getEventTimes = () => {
    let start = new Date();

    if (selectedPreset === 'today_afternoon') {
      start.setHours(14, 30, 0, 0);
      if (start.getTime() < Date.now()) {
        // If 2:30 PM today has passed, set to 1 hour from now
        start = new Date(Date.now() + 60 * 60 * 1000);
      }
    } else if (selectedPreset === 'tomorrow_morning') {
      start.setDate(start.getDate() + 1);
      start.setHours(10, 30, 0, 0);
    } else if (selectedPreset === 'tomorrow_afternoon') {
      start.setDate(start.getDate() + 1);
      start.setHours(14, 0, 0, 0);
    } else if (selectedPreset === 'custom') {
      start = new Date(customDateTime);
    }

    const durationMinutes = moment.suggestedDurationMinutes || 15;
    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

    return { start, end };
  };

  const generateIcsContent = () => {
    const { start, end } = getEventTimes();
    const now = new Date();
    const uid = `kinship-${moment.id}-${Date.now()}@kinship.app`;

    const displayName = recipientName ? `with ${recipientName}` : '';
    const summary = `Kinship Shared Moment: ${moment.title} ${displayName}`.trim();

    const descriptionLines = [
      `Kinship Connection Moment: ${moment.title}`,
      `Suggested Duration: ${moment.suggestedDurationMinutes} minutes unhurried`,
      '',
      `Opening Invitation:`,
      `"${moment.openingSentence}"`,
      '',
      `Conversation Invitations:`,
      ...moment.conversationInvitations.map(inv => `• ${inv}`),
      '',
      `Shared Activity:`,
      moment.practicalActivity,
      '',
      `Caregiver Comfort Reminder:`,
      moment.caregiverNote,
    ];

    if (moment.personalNotes) {
      descriptionLines.push('', `Caregiver Reflection: "${moment.personalNotes}"`);
    }

    const rawDescription = descriptionLines.join('\n');
    const escapedDesc = escapeIcsText(rawDescription);
    const escapedSummary = escapeIcsText(summary);

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Kinship//Moments of Connection//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${formatIcsDate(now)}`,
      `DTSTART:${formatIcsDate(start)}`,
      `DTEND:${formatIcsDate(end)}`,
      `SUMMARY:${escapedSummary}`,
      `DESCRIPTION:${escapedDesc}`,
      'LOCATION:Quiet\\, comfortable room',
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      'DESCRIPTION:Reminder: Kinship Shared Moment',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
  };

  const handleDownloadIcs = () => {
    const icsContent = generateIcsContent();
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const cleanTitle = moment.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
    a.download = `kinship-moment-${cleanTitle}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
      setShowModal(false);
    }, 1500);
  };

  const handleGoogleCalendarWeb = () => {
    const { start, end } = getEventTimes();
    const displayName = recipientName ? `with ${recipientName}` : '';
    const summary = encodeURIComponent(`Kinship Shared Moment: ${moment.title} ${displayName}`.trim());
    const details = encodeURIComponent(
      `Kinship Connection Moment\nOpening: "${moment.openingSentence}"\nActivity: ${moment.practicalActivity}\n\nCaregiver Note: ${moment.caregiverNote}`
    );
    const startStr = formatIcsDate(start);
    const endStr = formatIcsDate(end);

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${summary}&dates=${startStr}/${endStr}&details=${details}&location=${encodeURIComponent('Comfortable quiet setting')}`;
    window.open(googleUrl, '_blank', 'noopener,noreferrer');
    setShowModal(false);
  };

  return (
    <>
      {variant === 'compact' ? (
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="min-h-[44px] px-3 py-1.5 rounded-lg border border-[#D5CDBC] bg-white text-[#2D4537] text-xs font-medium hover:bg-[#FAF8F5] transition-colors flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-[#1B4332]"
          title="Add this connection moment to your calendar"
        >
          <CalendarPlus className="w-3.5 h-3.5 text-[#1B4332]" />
          <span className="hidden sm:inline">Add to Calendar</span>
        </button>
      ) : variant === 'primary' ? (
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="min-h-[50px] px-4 py-3 rounded-xl bg-[#1B4332] text-white text-sm font-semibold hover:bg-[#255C45] transition-colors flex items-center justify-center gap-2 shadow-xs focus-visible:outline-2 focus-visible:outline-[#1B4332]"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>Add to Calendar</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="min-h-[50px] px-4 py-3 rounded-xl border border-[#D5CDBC] bg-white hover:bg-[#FAF8F5] text-[#2D4537] text-sm font-semibold transition-colors flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-[#1B4332]"
          title="Schedule time for this connection moment (.ics)"
        >
          <CalendarPlus className="w-4 h-4 text-[#1B4332]" />
          <span className="hidden md:inline">Schedule Shared Time</span>
          <span className="md:hidden">Calendar</span>
        </button>
      )}

      {/* Calendar Scheduling Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-[#E2DDD0] text-left">
            <div className="flex items-center justify-between border-b border-[#EAE4D9] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#EAE4D9] text-[#1B4332]">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#14261C]">
                    Schedule Shared Time
                  </h3>
                  <p className="text-xs text-[#526659]">
                    Generate an .ICS file for your calendar
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg text-[#526659] hover:text-[#14261C] flex items-center justify-center hover:bg-[#FAF8F5]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-bold text-[#14261C]">
                {moment.title}
              </div>
              <div className="text-xs text-[#526659] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#1B4332]" />
                <span>Duration: {moment.suggestedDurationMinutes} minutes unhurried</span>
              </div>
            </div>

            {/* Timing Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#3D5244] block">
                When would you like to schedule this?
              </label>

              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPreset('today_afternoon')}
                  className={`p-2.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${
                    selectedPreset === 'today_afternoon'
                      ? 'bg-[#EAE4D9] border-[#1B4332] text-[#1B4332] font-semibold'
                      : 'bg-white border-[#D5CDBC] text-[#2D4537] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <span>Today · Afternoon tea time (2:30 PM)</span>
                  {selectedPreset === 'today_afternoon' && <Check className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPreset('tomorrow_morning')}
                  className={`p-2.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${
                    selectedPreset === 'tomorrow_morning'
                      ? 'bg-[#EAE4D9] border-[#1B4332] text-[#1B4332] font-semibold'
                      : 'bg-white border-[#D5CDBC] text-[#2D4537] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <span>Tomorrow · Morning quiet hour (10:30 AM)</span>
                  {selectedPreset === 'tomorrow_morning' && <Check className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPreset('tomorrow_afternoon')}
                  className={`p-2.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${
                    selectedPreset === 'tomorrow_afternoon'
                      ? 'bg-[#EAE4D9] border-[#1B4332] text-[#1B4332] font-semibold'
                      : 'bg-white border-[#D5CDBC] text-[#2D4537] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <span>Tomorrow · Afternoon unhurried (2:00 PM)</span>
                  {selectedPreset === 'tomorrow_afternoon' && <Check className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPreset('custom')}
                  className={`p-2.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${
                    selectedPreset === 'custom'
                      ? 'bg-[#EAE4D9] border-[#1B4332] text-[#1B4332] font-semibold'
                      : 'bg-white border-[#D5CDBC] text-[#2D4537] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <span>Custom date & time...</span>
                  {selectedPreset === 'custom' && <Check className="w-4 h-4" />}
                </button>
              </div>

              {selectedPreset === 'custom' && (
                <div className="pt-2">
                  <input
                    type="datetime-local"
                    value={customDateTime}
                    onChange={e => setCustomDateTime(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-[#D5CDBC] bg-white focus:outline-[#1B4332]"
                  />
                </div>
              )}
            </div>

            {/* Actions: Download ICS or Google Calendar Web */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleDownloadIcs}
                className="w-full min-h-[44px] rounded-xl bg-[#1B4332] hover:bg-[#255C45] text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                {downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Downloaded .ICS File!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download .ICS Calendar File</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleGoogleCalendarWeb}
                className="w-full min-h-[40px] rounded-xl border border-[#D5CDBC] bg-white hover:bg-[#FAF8F5] text-[#2D4537] text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Add directly in Google Calendar web</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#526659]" />
              </button>
            </div>

            <p className="text-[11px] text-[#728578] text-center leading-relaxed">
              The standard .ICS file automatically opens in Apple Calendar, Outlook, Google Calendar, and mobile calendar apps with a 15-minute gentle reminder.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
