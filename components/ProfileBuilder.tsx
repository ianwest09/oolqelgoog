'use client';

import React, { useState } from 'react';
import { CulturalProfile, ActivityType, AtmosphereType, DurationOption } from '@/lib/types';
import {
  Sparkles,
  Headphones,
  Eye,
  MessageCircle,
  Hand,
  Moon,
  X,
  Plus,
  User,
  HeartHandshake,
  Globe,
  Clock,
  Sparkle,
} from 'lucide-react';
import { AvatarUploader } from './AvatarUploader';
import { ProfileBuilderSkeleton } from './skeletons/ProfileBuilderSkeleton';

interface ProfileBuilderProps {
  initialProfile?: CulturalProfile | null;
  onSubmit: (profile: CulturalProfile) => void;
  isLoading: boolean;
}

const DEFAULT_PROFILE: CulturalProfile = {
  primaryInterest: '',
  additionalInterests: [],
  preferredLanguage: 'English',
  activityType: 'listening',
  durationMinutes: 10,
  atmosphere: 'calm',
  exclusions: '',
  practicalPreferences: '',
  patient: {
    name: '',
    sex: 'female',
    gender: 'female',
    age: '84', // Current chronological age
    formativeEra: '1950s Great American Songbook & Crooners', // Formative musical era (ages 15-25)
    era: '1950s Great American Songbook & Crooners',
    nationality: 'British',
    avatarUrl: '',
  },
  caregiver: {
    name: '',
    sex: 'female',
    gender: 'female',
    age: '52', // Caregiver chronological age
    relationship: 'Daughter',
    nationality: '',
    sharedBackgroundNote: '',
    avatarUrl: '',
  },
};

const POPULAR_SUGGESTIONS = [
  'Ella Fitzgerald',
  'Frank Sinatra',
  'Gordon Lightfoot',
  'The Beatles',
  'Singin\' in the Rain',
  'Claude Monet',
  'Pavarotti',
  'Trio Los Panchos',
];

const SECONDARY_INTEREST_OPTIONS = [
  'Gardening & flowers',
  'Cooking & baking',
  'Nature & birdwatching',
  'Classic radio',
  'Woodworking',
  'Embroidery & crafts',
  'Maritime & sailing',
  'Travel & landscapes',
];

const RELATIONSHIP_OPTIONS = [
  'Daughter',
  'Son',
  'Spouse / Partner',
  'Grandchild',
  'Sister / Brother',
  'Professional Caregiver',
  'Volunteer Companion',
];

const GENDER_OPTIONS = [
  { id: 'female', label: 'Female' },
  { id: 'male', label: 'Male' },
  { id: 'non-binary', label: 'Non-binary' },
  { id: 'prefer-not-to-say', label: 'Prefer not to say' },
];

const FORMATIVE_ERA_SUGGESTIONS = [
  '1940s Big Band & Wartime Swing',
  '1950s Great American Songbook & Crooners',
  '1960s Folk Revival & British Invasion',
  '1970s Boleros, Classic Rock & Soul',
  '1980s Acoustic Pop & Ballads',
];

const ACTIVITY_TYPES: { id: ActivityType; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
  { id: 'listening', label: 'Listening', icon: Headphones, desc: 'Gentle melodies, acoustic songs, or ambient soundscapes' },
  { id: 'looking', label: 'Looking', icon: Eye, desc: 'Artwork, photography books, or peaceful scenic imagery' },
  { id: 'conversation', label: 'Conversation', icon: MessageCircle, desc: 'Open sensory reflections and unhurried sharing' },
  { id: 'hands-on', label: 'Gentle hands-on', icon: Hand, desc: 'Holding warm tea, folding, arranging flowers, or light craft' },
  { id: 'quiet-companionship', label: 'Quiet presence', icon: Moon, desc: 'Relaxing side-by-side with familiar low sounds' },
];

const ATMOSPHERES: { id: AtmosphereType; label: string; desc: string }[] = [
  { id: 'calm', label: 'Calm', desc: 'Soothing and restful' },
  { id: 'cheerful', label: 'Cheerful', desc: 'Warm and smiling' },
  { id: 'reflective', label: 'Reflective', desc: 'Gentle and contemplative' },
  { id: 'playful', label: 'Playful', desc: 'Lighthearted and curious' },
];

const DURATIONS: DurationOption[] = [5, 10, 15];

export const ProfileBuilder: React.FC<ProfileBuilderProps> = ({
  initialProfile,
  onSubmit,
  isLoading,
}) => {
  const [profile, setProfile] = useState<CulturalProfile>(initialProfile || DEFAULT_PROFILE);
  const [prevInitial, setPrevInitial] = useState(initialProfile);
  const [customInterestInput, setCustomInterestInput] = useState('');

  // Sync state if initialProfile changes from outside
  if (initialProfile !== prevInitial) {
    setPrevInitial(initialProfile);
    setProfile(initialProfile || DEFAULT_PROFILE);
  }

  if (isLoading) {
    return <ProfileBuilderSkeleton />;
  }

  const handlePrimaryChange = (val: string) => {
    setProfile(prev => ({ ...prev, primaryInterest: val }));
  };

  const toggleSecondaryInterest = (interest: string) => {
    setProfile(prev => {
      const exists = prev.additionalInterests.includes(interest);
      const updated = exists
        ? prev.additionalInterests.filter(i => i !== interest)
        : [...prev.additionalInterests, interest];
      return { ...prev, additionalInterests: updated };
    });
  };

  const addCustomInterest = () => {
    const trimmed = customInterestInput.trim();
    if (trimmed && !profile.additionalInterests.includes(trimmed)) {
      setProfile(prev => ({
        ...prev,
        additionalInterests: [...prev.additionalInterests, trimmed],
      }));
      setCustomInterestInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomInterest();
    }
  };

  const updatePatient = (field: string, val: any) => {
    setProfile(prev => ({
      ...prev,
      patient: {
        ...(prev.patient || {}),
        [field]: val,
      },
    }));
  };

  const updateCaregiver = (field: string, val: any) => {
    setProfile(prev => ({
      ...prev,
      caregiver: {
        relationship: 'Daughter',
        ...(prev.caregiver || {}),
        [field]: val,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.primaryInterest.trim()) return;
    onSubmit(profile);
  };

  const isFormValid = Boolean(profile.primaryInterest.trim());

  return (
    <form onSubmit={handleSubmit} className="py-4 sm:py-8 space-y-7 max-w-2xl mx-auto">
      {/* Header */}
      <div className="space-y-2 border-b border-[#E6E0D5] pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#14261C]">
          Build a cultural connection profile
        </h1>
        <p className="text-sm sm:text-base text-[#465B4E] leading-relaxed">
          Provide family-confirmed cultural tastes and relational details to generate a deeply relatable shared moment between patient and caregiver.
        </p>
        <p className="text-xs text-[#6F8276] italic">
          * Note: Relational context informs the opening words and tactile traditions (e.g. daughter comforting her mother vs spouse sharing a favorite melody).
        </p>
      </div>

      {/* Relational Details Section 1: Loved One (Patient) Details */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E4DDD0] shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#F0EBE1] pb-3">
          <div className="w-8 h-8 rounded-lg bg-[#EAE4D9] text-[#1B4332] flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#14261C]">
              Loved One (Patient) Profile
            </h2>
            <p className="text-xs text-[#526659]">
              Age, sex, nationality, and formative era shape their cultural identity and dignified address.
            </p>
          </div>
        </div>

        {/* Optional Avatar for Loved One */}
        <AvatarUploader
          name={profile.patient?.name || 'Loved One'}
          avatarUrl={profile.patient?.avatarUrl}
          role="patient"
          onChange={url => updatePatient('avatarUrl', url)}
          label="Loved one's avatar photo (optional)"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Patient Name */}
          <div>
            <label htmlFor="patientName" className="block text-xs font-bold text-[#14261C] mb-1">
              Name or preferred address
            </label>
            <input
              id="patientName"
              type="text"
              value={profile.patient?.name || ''}
              onChange={e => updatePatient('name', e.target.value)}
              placeholder="e.g. Vera, Arthur, Mom, Dad"
              className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-[#14261C] focus:bg-white focus:border-[#1B4332] focus-visible:outline-none placeholder:text-[#8D9F94]"
            />
          </div>

          {/* Patient Sex / Gender */}
          <div>
            <label className="block text-xs font-bold text-[#14261C] mb-1">
              Sex / Gender identity
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {GENDER_OPTIONS.map(g => {
                const currentSex = profile.patient?.sex || profile.patient?.gender;
                const isSelected = currentSex === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      updatePatient('sex', g.id);
                      updatePatient('gender', g.id);
                    }}
                    className={`min-h-[42px] px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-2xs font-semibold'
                        : 'bg-[#FAF8F5] text-[#334D3F] border-[#DCD5C8] hover:bg-[#F2ECE2]'
                    }`}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {/* Patient Chronological Age */}
          <div>
            <label htmlFor="patientAge" className="block text-xs font-bold text-[#14261C] mb-1">
              Chronological Age Today (e.g. 84, 79)
            </label>
            <p className="text-[11px] text-[#697D70] mb-1">
              Current age shapes sensory tolerance, volume, and physical pacing.
            </p>
            <input
              id="patientAge"
              type="text"
              value={profile.patient?.age || ''}
              onChange={e => updatePatient('age', e.target.value)}
              placeholder="e.g. 84"
              className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-[#14261C] focus:bg-white focus:border-[#1B4332] focus-visible:outline-none placeholder:text-[#8D9F94]"
            />
          </div>

          {/* Nationality / Cultural Heritage */}
          <div>
            <label htmlFor="patientNationality" className="block text-xs font-bold text-[#14261C] mb-1">
              Nationality / Cultural heritage
            </label>
            <p className="text-[11px] text-[#697D70] mb-1">
              Informs authentic language warmth, comfort foods, and hospitality customs.
            </p>
            <input
              id="patientNationality"
              type="text"
              value={profile.patient?.nationality || ''}
              onChange={e => updatePatient('nationality', e.target.value)}
              placeholder="e.g. British, Mexican, Scottish, Italian-American"
              className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-[#14261C] focus:bg-white focus:border-[#1B4332] focus-visible:outline-none placeholder:text-[#8D9F94]"
            />
          </div>
        </div>

        {/* Formative Era Selector (Reminiscence bump - strictly distinct from age!) */}
        <div className="pt-1 space-y-1.5 border-t border-[#F0EBE1]">
          <div className="flex items-baseline justify-between">
            <label className="block text-xs font-bold text-[#14261C]">
              Cultural Reminiscence Era (Historical decade from youth ~ages 15–25)
            </label>
            <span className="text-[11px] text-[#855B11] bg-[#FEF6E4] px-2 py-0.5 rounded font-medium">
              Distinct from age
            </span>
          </div>
          <p className="text-[11px] text-[#55695E]">
            The historical era when musical identity and spontaneous recognition crystallized.
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {FORMATIVE_ERA_SUGGESTIONS.map(era => {
              const currentEra = profile.patient?.formativeEra || profile.patient?.era;
              const isSelected = currentEra === era;
              return (
                <button
                  key={era}
                  type="button"
                  onClick={() => {
                    updatePatient('formativeEra', era);
                    updatePatient('era', era);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    isSelected
                      ? 'bg-[#1B4332] text-white border-[#1B4332] font-semibold'
                      : 'bg-[#FAF8F5] text-[#334D3F] border-[#DCD5C8] hover:bg-[#F2ECE2]'
                  }`}
                >
                  {era}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Relational Details Section 2: Caregiver Details & Dynamic */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E4DDD0] shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#F0EBE1] pb-3">
          <div className="w-8 h-8 rounded-lg bg-[#EAE4D9] text-[#1B4332] flex items-center justify-center">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#14261C]">
              Caregiver Profile & Relational Dynamic
            </h2>
            <p className="text-xs text-[#526659]">
              Your relationship, age, sex, and cultural background define the interaction dynamic.
            </p>
          </div>
        </div>

        {/* Optional Avatar for Caregiver */}
        <AvatarUploader
          name={profile.caregiver?.name || 'Caregiver'}
          avatarUrl={profile.caregiver?.avatarUrl}
          role="caregiver"
          onChange={url => updateCaregiver('avatarUrl', url)}
          label="Your avatar photo (optional)"
        />

        {/* Relationship to Loved One */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#14261C]">
            Your relationship to them *
          </label>
          <div className="flex flex-wrap gap-1.5">
            {RELATIONSHIP_OPTIONS.map(rel => {
              const isSelected = profile.caregiver?.relationship === rel;
              return (
                <button
                  key={rel}
                  type="button"
                  onClick={() => updateCaregiver('relationship', rel)}
                  className={`min-h-[38px] px-3.5 py-1 rounded-xl text-xs font-medium transition-all border ${
                    isSelected
                      ? 'bg-[#1B4332] text-white border-[#1B4332] font-semibold shadow-2xs'
                      : 'bg-[#FAF8F5] text-[#334D3F] border-[#DCD5C8] hover:bg-[#F2ECE2]'
                  }`}
                >
                  {rel}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {/* Caregiver Name */}
          <div>
            <label htmlFor="caregiverName" className="block text-xs font-bold text-[#14261C] mb-1">
              Your name (optional)
            </label>
            <input
              id="caregiverName"
              type="text"
              value={profile.caregiver?.name || ''}
              onChange={e => updateCaregiver('name', e.target.value)}
              placeholder="e.g. Sarah, David, Elena"
              className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-[#14261C] focus:bg-white focus:border-[#1B4332] focus-visible:outline-none placeholder:text-[#8D9F94]"
            />
          </div>

          {/* Caregiver Sex / Gender */}
          <div>
            <label className="block text-xs font-bold text-[#14261C] mb-1">
              Caregiver sex / gender identity
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {GENDER_OPTIONS.map(g => {
                const currentSex = profile.caregiver?.sex || profile.caregiver?.gender;
                const isSelected = currentSex === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      updateCaregiver('sex', g.id);
                      updateCaregiver('gender', g.id);
                    }}
                    className={`min-h-[42px] px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-2xs font-semibold'
                        : 'bg-[#FAF8F5] text-[#334D3F] border-[#DCD5C8] hover:bg-[#F2ECE2]'
                    }`}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {/* Caregiver Chronological Age */}
          <div>
            <label htmlFor="caregiverAge" className="block text-xs font-bold text-[#14261C] mb-1">
              Caregiver age (e.g. 52, 28)
            </label>
            <p className="text-[11px] text-[#697D70] mb-1">
              Enables Qloo to bridge the generational gap between you.
            </p>
            <input
              id="caregiverAge"
              type="text"
              value={profile.caregiver?.age || ''}
              onChange={e => updateCaregiver('age', e.target.value)}
              placeholder="e.g. 52 or 28"
              className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-[#14261C] focus:bg-white focus:border-[#1B4332] focus-visible:outline-none placeholder:text-[#8D9F94]"
            />
          </div>

          {/* Caregiver Nationality / Cultural Background */}
          <div>
            <label htmlFor="caregiverNationality" className="block text-xs font-bold text-[#14261C] mb-1">
              Caregiver nationality / cultural background
            </label>
            <p className="text-[11px] text-[#697D70] mb-1">
              For second-generation or cross-cultural family bridges.
            </p>
            <input
              id="caregiverNationality"
              type="text"
              value={profile.caregiver?.nationality || ''}
              onChange={e => updateCaregiver('nationality', e.target.value)}
              placeholder="e.g. Canadian, Mexican-American, British"
              className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-[#14261C] focus:bg-white focus:border-[#1B4332] focus-visible:outline-none placeholder:text-[#8D9F94]"
            />
          </div>
        </div>

        {/* Shared Comfort Tradition or Memory */}
        <div className="space-y-1 pt-1">
          <label htmlFor="sharedNote" className="block text-xs font-bold text-[#14261C]">
            Shared comfort tradition, memory, or ritual (optional)
          </label>
          <p className="text-[11px] text-[#55695E]">
            A familiar touchpoint you both enjoy (e.g. &ldquo;We always made Earl Grey tea at 4pm&rdquo;, &ldquo;We loved Sunday patio coffee&rdquo;).
          </p>
          <input
            id="sharedNote"
            type="text"
            value={profile.caregiver?.sharedBackgroundNote || ''}
            onChange={e => updateCaregiver('sharedBackgroundNote', e.target.value)}
            placeholder="e.g. Enjoys having tea brewed together; loves holding hands while listening"
            className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-[#14261C] focus:bg-white focus:border-[#1B4332] focus-visible:outline-none placeholder:text-[#8D9F94]"
          />
        </div>
      </div>

      {/* Field 1: Primary Cultural Interest (Required) */}
      <div className="space-y-3 bg-white p-5 sm:p-6 rounded-2xl border border-[#E4DDD0] shadow-xs">
        <div className="flex items-baseline justify-between">
          <label htmlFor="primaryInterest" className="text-base font-bold text-[#14261C] flex items-center gap-1.5">
            <span>Favourite musician, artist, film, or cultural interest</span>
            <span className="text-[#B91C1C] text-sm" title="Required">*</span>
          </label>
        </div>
        <p className="text-xs text-[#526659]">
          For example: an artist (Ella Fitzgerald), song title (Moon River), film (Singin&apos; in the Rain), painter (Monet), or radio drama.
        </p>
        <input
          id="primaryInterest"
          type="text"
          value={profile.primaryInterest}
          onChange={e => handlePrimaryChange(e.target.value)}
          placeholder="e.g., Ella Fitzgerald, The Beatles, Monet"
          required
          className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-[#14261C] text-base focus:bg-white focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20 focus-visible:outline-none transition-all placeholder:text-[#8D9F94]"
        />

        {/* Quick Inspiration suggestions */}
        <div className="pt-2">
          <div className="text-xs font-semibold text-[#5B6F63] mb-1.5">
            Or tap a common example:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_SUGGESTIONS.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => handlePrimaryChange(s)}
                className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-medium transition-colors border ${
                  profile.primaryInterest.toLowerCase() === s.toLowerCase()
                    ? 'bg-[#1B4332] text-white border-[#1B4332]'
                    : 'bg-[#F4EFE6] text-[#2D4537] border-[#E2DBD0] hover:bg-[#EAE4D9]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Field 2: Other Known Interests */}
      <div className="space-y-3 bg-white p-5 sm:p-6 rounded-2xl border border-[#E4DDD0] shadow-xs">
        <label className="text-base font-bold text-[#14261C] block">
          Other known interests & hobbies (optional)
        </label>
        <p className="text-xs text-[#526659]">
          Select any hobbies or sensory themes that bring comfort or familiarity.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {SECONDARY_INTEREST_OPTIONS.map(opt => {
            const isSelected = profile.additionalInterests.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggleSecondaryInterest(opt)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                  isSelected
                    ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-2xs'
                    : 'bg-[#FAF8F5] text-[#334D3F] border-[#DCD5C8] hover:bg-[#F2ECE2]'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Add custom interest tag */}
        <div className="flex gap-2 pt-2">
          <input
            type="text"
            value={customInterestInput}
            onChange={e => setCustomInterestInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add another interest (e.g., knitting, classic cars)"
            className="flex-1 min-h-[44px] px-3.5 py-2 text-sm rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-[#14261C] focus:bg-white focus:border-[#1B4332] focus-visible:outline-none placeholder:text-[#8D9F94]"
          />
          <button
            type="button"
            onClick={addCustomInterest}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-[#EAE4D9] hover:bg-[#DED7CA] text-[#1B4332] text-sm font-semibold flex items-center gap-1 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        {profile.additionalInterests.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {profile.additionalInterests.map(interest => (
              <span
                key={interest}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#EAE4D9]/80 text-[#1B4332] text-xs font-medium"
              >
                <span>{interest}</span>
                <button
                  type="button"
                  onClick={() => toggleSecondaryInterest(interest)}
                  className="hover:text-red-700"
                  aria-label={`Remove ${interest}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Field 3: Desired Activity Type */}
      <div className="space-y-3 bg-white p-5 sm:p-6 rounded-2xl border border-[#E4DDD0] shadow-xs">
        <label className="text-base font-bold text-[#14261C] block">
          Desired activity style
        </label>
        <p className="text-xs text-[#526659]">
          Choose an engaging style that matches today&apos;s comfort level.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {ACTIVITY_TYPES.map(type => {
            const Icon = type.icon;
            const isSelected = profile.activityType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setProfile(p => ({ ...p, activityType: type.id }))}
                className={`min-h-[58px] p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'border-[#1B4332] bg-[#FAF8F5] ring-2 ring-[#1B4332]/20'
                    : 'border-[#E2DBD0] bg-white hover:bg-[#FAF8F5]'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  isSelected ? 'bg-[#1B4332] text-white' : 'bg-[#EAE4D9] text-[#2D4537]'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#14261C]">{type.label}</div>
                  <div className="text-xs text-[#526659] leading-tight">{type.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Field 4 & 5: Duration and Atmosphere */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Duration */}
        <div className="space-y-3 bg-white p-5 rounded-2xl border border-[#E4DDD0] shadow-xs">
          <label className="text-base font-bold text-[#14261C] block">
            Preferred session duration
          </label>
          <p className="text-xs text-[#526659]">
            Short, focused moments prevent sensory fatigue.
          </p>
          <div className="grid grid-cols-3 gap-2 pt-1">
            {DURATIONS.map(d => (
              <button
                key={d}
                type="button"
                onClick={() => setProfile(p => ({ ...p, durationMinutes: d }))}
                className={`min-h-[48px] py-2.5 rounded-xl border text-center transition-all ${
                  profile.durationMinutes === d
                    ? 'bg-[#1B4332] text-white border-[#1B4332] font-bold shadow-xs'
                    : 'bg-[#FAF8F5] text-[#2D4537] border-[#DCD5C8] font-medium hover:bg-[#F2ECE2]'
                }`}
              >
                <div className="text-base">{d}</div>
                <div className="text-[11px] leading-none opacity-80">minutes</div>
              </button>
            ))}
          </div>
        </div>

        {/* Atmosphere */}
        <div className="space-y-3 bg-white p-5 rounded-2xl border border-[#E4DDD0] shadow-xs">
          <label className="text-base font-bold text-[#14261C] block">
            Preferred atmosphere
          </label>
          <p className="text-xs text-[#526659]">
            Select the general emotional tone for today.
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {ATMOSPHERES.map(atm => (
              <button
                key={atm.id}
                type="button"
                onClick={() => setProfile(p => ({ ...p, atmosphere: atm.id }))}
                className={`min-h-[44px] px-3 py-2 rounded-xl border text-center transition-all ${
                  profile.atmosphere === atm.id
                    ? 'bg-[#1B4332] text-white border-[#1B4332] font-bold shadow-xs'
                    : 'bg-[#FAF8F5] text-[#2D4537] border-[#DCD5C8] font-medium hover:bg-[#F2ECE2]'
                }`}
              >
                <div className="text-xs">{atm.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Field 6: Exclusions & Topics to Avoid (Crucial Safety Rule) */}
      <div className="space-y-3 bg-white p-5 sm:p-6 rounded-2xl border border-[#E4DDD0] shadow-xs">
        <label htmlFor="exclusions" className="text-base font-bold text-[#14261C] flex items-center gap-1.5">
          <span>Topics, sounds, or activities to avoid</span>
          <span className="text-xs font-normal text-[#65796D]">(Recommended)</span>
        </label>
        <p className="text-xs text-[#526659]">
          Tell us about sensitive themes, sudden loud brass, medical references, or distressing memories that should never be brought up.
        </p>
        <textarea
          id="exclusions"
          rows={2}
          value={profile.exclusions}
          onChange={e => setProfile(p => ({ ...p, exclusions: e.target.value }))}
          placeholder="e.g., Loud trumpet blasts, discussions of hospitals or illness, shipwrecks, sudden changes"
          className="w-full p-3 text-sm rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-[#14261C] focus:bg-white focus:border-[#1B4332] focus-visible:outline-none placeholder:text-[#8D9F94]"
        />
      </div>

      {/* Field 7: Practical Preferences & Language */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Preferred Language */}
        <div className="space-y-2 bg-white p-5 rounded-2xl border border-[#E4DDD0] shadow-xs">
          <label htmlFor="language" className="text-sm font-bold text-[#14261C] block">
            Preferred language
          </label>
          <select
            id="language"
            value={profile.preferredLanguage}
            onChange={e => setProfile(p => ({ ...p, preferredLanguage: e.target.value }))}
            className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-sm text-[#14261C] focus:bg-white focus:border-[#1B4332] focus-visible:outline-none"
          >
            <option value="English">English</option>
            <option value="Spanish">Español (Spanish)</option>
            <option value="French">Français (French)</option>
            <option value="Italian">Italiano (Italian)</option>
            <option value="German">Deutsch (German)</option>
            <option value="Portuguese">Português (Portuguese)</option>
            <option value="Other">Other / Instrumental</option>
          </select>
        </div>

        {/* Practical notes */}
        <div className="space-y-2 bg-white p-5 rounded-2xl border border-[#E4DDD0] shadow-xs">
          <label htmlFor="practical" className="text-sm font-bold text-[#14261C] block">
            Practical comfort notes (optional)
          </label>
          <input
            id="practical"
            type="text"
            value={profile.practicalPreferences || ''}
            onChange={e => setProfile(p => ({ ...p, practicalPreferences: e.target.value }))}
            placeholder="e.g., Sitting by the sunny window, holds warm tea"
            className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-[#14261C] focus:bg-white focus:border-[#1B4332] focus-visible:outline-none placeholder:text-[#8D9F94]"
          />
        </div>
      </div>

      {/* Prominent Action Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className={`w-full min-h-[56px] py-4 px-6 rounded-2xl text-lg font-bold shadow-md transition-all flex items-center justify-center gap-3 ${
            isFormValid && !isLoading
              ? 'bg-[#1B4332] hover:bg-[#235841] text-[#FAF8F5] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-[#1B4332]'
              : 'bg-[#D2CBC0] text-[#7A746B] cursor-not-allowed'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span>{isLoading ? 'Preparing connection moment...' : 'Create connection moment'}</span>
        </button>

        <p className="text-center text-xs text-[#5C7164] mt-2.5">
          Kinship will resolve this interest through Qloo, discover related taste pairings, and synthesize a calm shared activity tailored to your relationship.
        </p>
      </div>
    </form>
  );
};
