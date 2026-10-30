'use client';

import React, { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  X,
  User,
  HeartHandshake,
  ArrowRight,
  Globe,
  Clock,
  Sparkles,
} from 'lucide-react';
import { SavedPersonProfile, CulturalProfile } from '@/lib/types';
import { AvatarUploader } from './AvatarUploader';
import { AvatarBadge } from './AvatarBadge';

interface ProfileManagerModalProps {
  currentProfiles: SavedPersonProfile[];
  activeProfileId?: string;
  onSelectProfile: (person: SavedPersonProfile) => void;
  onSaveProfiles: (profiles: SavedPersonProfile[]) => void;
  onClose: () => void;
}

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

export const ProfileManagerModal: React.FC<ProfileManagerModalProps> = ({
  currentProfiles,
  activeProfileId,
  onSelectProfile,
  onSaveProfiles,
  onClose,
}) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Patient detail states
  const [formName, setFormName] = useState('');
  const [formSex, setFormSex] = useState<'female' | 'male' | 'non-binary' | 'prefer-not-to-say'>('female');
  const [formAge, setFormAge] = useState('84');
  const [formNationality, setFormNationality] = useState('British');
  const [formFormativeEra, setFormFormativeEra] = useState('1950s Great American Songbook');
  const [formAvatarUrl, setFormAvatarUrl] = useState<string | undefined>(undefined);

  // Caregiver detail states
  const [formCaregiverName, setFormCaregiverName] = useState('');
  const [formCaregiverSex, setFormCaregiverSex] = useState<'female' | 'male' | 'non-binary' | 'prefer-not-to-say'>('female');
  const [formCaregiverAge, setFormCaregiverAge] = useState('52');
  const [formRelationship, setFormRelationship] = useState('Daughter');
  const [formCaregiverNationality, setFormCaregiverNationality] = useState('');
  const [formSharedNote, setFormSharedNote] = useState('');
  const [formCaregiverAvatarUrl, setFormCaregiverAvatarUrl] = useState<string | undefined>(undefined);

  // Taste & environment states
  const [formPrimaryInterest, setFormPrimaryInterest] = useState('');
  const [formAdditionalInterests, setFormAdditionalInterests] = useState('');
  const [formAtmosphere, setFormAtmosphere] = useState<'calm' | 'cheerful' | 'reflective' | 'playful'>('calm');
  const [formExclusions, setFormExclusions] = useState('');
  const [formPreferences, setFormPreferences] = useState('');

  const handleStartAdd = () => {
    setFormName('');
    setFormSex('female');
    setFormAge('84');
    setFormNationality('');
    setFormFormativeEra('1950s Great American Songbook');
    setFormAvatarUrl(undefined);

    setFormCaregiverName('');
    setFormCaregiverSex('female');
    setFormCaregiverAge('52');
    setFormRelationship('Daughter');
    setFormCaregiverNationality('');
    setFormSharedNote('');
    setFormCaregiverAvatarUrl(undefined);

    setFormPrimaryInterest('');
    setFormAdditionalInterests('');
    setFormAtmosphere('calm');
    setFormExclusions('');
    setFormPreferences('');

    setIsAddingNew(true);
    setEditingId(null);
  };

  const handleStartEdit = (person: SavedPersonProfile) => {
    setEditingId(person.id);
    setIsAddingNew(false);

    const pat = person.profile.patient;
    const cg = person.profile.caregiver;

    setFormName(person.name);
    setFormSex(((pat?.sex || pat?.gender) as any) || 'female');
    setFormAge(String(pat?.age || '84'));
    setFormNationality(pat?.nationality || '');
    setFormFormativeEra(pat?.formativeEra || pat?.era || '1950s Great American Songbook');
    setFormAvatarUrl(pat?.avatarUrl);

    setFormCaregiverName(cg?.name || '');
    setFormCaregiverSex(((cg?.sex || cg?.gender) as any) || 'female');
    setFormCaregiverAge(String(cg?.age || '52'));
    setFormRelationship(cg?.relationship || person.relationship || 'Daughter');
    setFormCaregiverNationality(cg?.nationality || '');
    setFormSharedNote(cg?.sharedBackgroundNote || '');
    setFormCaregiverAvatarUrl(cg?.avatarUrl);

    setFormPrimaryInterest(person.profile.primaryInterest);
    setFormAdditionalInterests((person.profile.additionalInterests || []).join(', '));
    setFormAtmosphere(person.profile.atmosphere);
    setFormExclusions(person.profile.exclusions || '');
    setFormPreferences(person.profile.practicalPreferences || '');
  };

  const handleSavePerson = () => {
    if (!formName.trim() || !formPrimaryInterest.trim()) return;

    const culturalProfile: CulturalProfile = {
      primaryInterest: formPrimaryInterest.trim(),
      additionalInterests: formAdditionalInterests
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
      preferredLanguage: 'English',
      activityType: 'listening',
      durationMinutes: 10,
      atmosphere: formAtmosphere,
      exclusions: formExclusions.trim(),
      practicalPreferences: formPreferences.trim(),
      patient: {
        name: formName.trim(),
        sex: formSex,
        gender: formSex,
        age: formAge.trim(),
        formativeEra: formFormativeEra.trim(),
        era: formFormativeEra.trim(),
        nationality: formNationality.trim(),
        avatarUrl: formAvatarUrl,
      },
      caregiver: {
        name: formCaregiverName.trim(),
        sex: formCaregiverSex,
        gender: formCaregiverSex,
        age: formCaregiverAge.trim(),
        relationship: formRelationship.trim(),
        nationality: formCaregiverNationality.trim(),
        sharedBackgroundNote: formSharedNote.trim(),
        avatarUrl: formCaregiverAvatarUrl,
      },
    };

    if (editingId) {
      // Update existing
      const updated = currentProfiles.map(p =>
        p.id === editingId
          ? {
              ...p,
              name: formName.trim(),
              relationship: formRelationship.trim(),
              profile: culturalProfile,
            }
          : p
      );
      onSaveProfiles(updated);
      setEditingId(null);
    } else {
      // Add new
      const newPerson: SavedPersonProfile = {
        id: `person_${Date.now()}`,
        name: formName.trim(),
        relationship: formRelationship.trim(),
        profile: culturalProfile,
        createdAt: Date.now(),
      };
      onSaveProfiles([newPerson, ...currentProfiles]);
      setIsAddingNew(false);
    }
  };

  const handleDelete = (id: string) => {
    if (typeof window !== 'undefined' && window.confirm('Remove this person profile?')) {
      const updated = currentProfiles.filter(p => p.id !== id);
      onSaveProfiles(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-7 space-y-5 shadow-2xl border border-[#E2DDD0] my-auto max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#EAE4D9] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#EAE4D9] text-[#1B4332]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#14261C]">
                Loved Ones & Residents
              </h2>
              <p className="text-xs text-[#526659]">
                Manage personalized patient and caregiver connection profiles.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-[#D5CDBC] text-[#526659] hover:text-[#14261C] flex items-center justify-center hover:bg-[#FAF8F5]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Add/Edit Form vs Profiles List */}
        {isAddingNew || editingId ? (
          <div className="space-y-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D3]">
            <h3 className="text-sm font-bold text-[#1B4332] flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>{editingId ? 'Edit Profile & Details' : 'Add New Loved One or Resident'}</span>
            </h3>

            {/* Patient Details */}
            <div className="space-y-3 bg-white p-3.5 rounded-xl border border-[#E2DDD0]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1B4332] block">
                Loved One (Patient) Profile
              </span>

              {/* Patient Avatar */}
              <AvatarUploader
                name={formName || 'Loved One'}
                avatarUrl={formAvatarUrl}
                role="patient"
                onChange={setFormAvatarUrl}
                label="Loved one's avatar photo (optional)"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#3F5446] mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="e.g. Vera, Arthur"
                    className="w-full p-2 text-xs rounded-lg border border-[#D5CDBC] bg-[#FAF8F5] focus:bg-white focus:outline-[#1B4332]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#3F5446] mb-1">
                    Sex / Gender Identity
                  </label>
                  <select
                    value={formSex}
                    onChange={e => setFormSex(e.target.value as any)}
                    className="w-full p-2 text-xs rounded-lg border border-[#D5CDBC] bg-[#FAF8F5] focus:bg-white focus:outline-[#1B4332]"
                  >
                    {GENDER_OPTIONS.map(g => (
                      <option key={g.id} value={g.id}>{g.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#3F5446] mb-1">
                    Chronological Age Today
                  </label>
                  <input
                    type="text"
                    value={formAge}
                    onChange={e => setFormAge(e.target.value)}
                    placeholder="e.g. 84, 79"
                    className="w-full p-2 text-xs rounded-lg border border-[#D5CDBC] bg-[#FAF8F5] focus:bg-white focus:outline-[#1B4332]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#3F5446] mb-1">
                    Nationality / Heritage
                  </label>
                  <input
                    type="text"
                    value={formNationality}
                    onChange={e => setFormNationality(e.target.value)}
                    placeholder="e.g. British, Scottish, Mexican"
                    className="w-full p-2 text-xs rounded-lg border border-[#D5CDBC] bg-[#FAF8F5] focus:bg-white focus:outline-[#1B4332]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#3F5446] mb-1">
                  Cultural Reminiscence Era (Historical decade from youth ~ages 15–25)
                </label>
                <input
                  type="text"
                  value={formFormativeEra}
                  onChange={e => setFormFormativeEra(e.target.value)}
                  placeholder="e.g. 1950s Great American Songbook, 1960s Folk Revival"
                  className="w-full p-2 text-xs rounded-lg border border-[#D5CDBC] bg-[#FAF8F5] focus:bg-white focus:outline-[#1B4332]"
                />
              </div>
            </div>

            {/* Caregiver Details */}
            <div className="space-y-3 bg-white p-3.5 rounded-xl border border-[#E2DDD0]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1B4332] block">
                Caregiver Profile & Dynamic
              </span>

              {/* Caregiver Avatar */}
              <AvatarUploader
                name={formCaregiverName || 'Caregiver'}
                avatarUrl={formCaregiverAvatarUrl}
                role="caregiver"
                onChange={setFormCaregiverAvatarUrl}
                label="Caregiver avatar photo (optional)"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#3F5446] mb-1">
                    Relationship to Patient *
                  </label>
                  <select
                    value={formRelationship}
                    onChange={e => setFormRelationship(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-[#D5CDBC] bg-[#FAF8F5] focus:bg-white focus:outline-[#1B4332]"
                  >
                    {RELATIONSHIP_OPTIONS.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#3F5446] mb-1">
                    Caregiver Name
                  </label>
                  <input
                    type="text"
                    value={formCaregiverName}
                    onChange={e => setFormCaregiverName(e.target.value)}
                    placeholder="e.g. Sarah, David"
                    className="w-full p-2 text-xs rounded-lg border border-[#D5CDBC] bg-[#FAF8F5] focus:bg-white focus:outline-[#1B4332]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#3F5446] mb-1">
                    Caregiver Age
                  </label>
                  <input
                    type="text"
                    value={formCaregiverAge}
                    onChange={e => setFormCaregiverAge(e.target.value)}
                    placeholder="e.g. 52, 28"
                    className="w-full p-2 text-xs rounded-lg border border-[#D5CDBC] bg-[#FAF8F5] focus:bg-white focus:outline-[#1B4332]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#3F5446] mb-1">
                    Caregiver Nationality / Heritage
                  </label>
                  <input
                    type="text"
                    value={formCaregiverNationality}
                    onChange={e => setFormCaregiverNationality(e.target.value)}
                    placeholder="e.g. Canadian, Mexican-American"
                    className="w-full p-2 text-xs rounded-lg border border-[#D5CDBC] bg-[#FAF8F5] focus:bg-white focus:outline-[#1B4332]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#3F5446] mb-1">
                  Shared Tradition or Comfort Memory
                </label>
                <input
                  type="text"
                  value={formSharedNote}
                  onChange={e => setFormSharedNote(e.target.value)}
                  placeholder="e.g. Making afternoon tea together, listening to vinyl"
                  className="w-full p-2 text-xs rounded-lg border border-[#D5CDBC] bg-[#FAF8F5] focus:bg-white focus:outline-[#1B4332]"
                />
              </div>
            </div>

            {/* Cultural Tastes */}
            <div className="space-y-2.5 bg-white p-3.5 rounded-xl border border-[#E2DDD0]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1B4332] block">
                Cultural Preferences
              </span>

              <div>
                <label className="block text-[11px] font-semibold text-[#3F5446] mb-1">
                  Primary Cultural Interest *
                </label>
                <input
                  type="text"
                  value={formPrimaryInterest}
                  onChange={e => setFormPrimaryInterest(e.target.value)}
                  placeholder="e.g. Ella Fitzgerald, Monet's Water Lilies, Frank Sinatra"
                  className="w-full p-2 text-xs rounded-lg border border-[#D5CDBC] bg-[#FAF8F5] focus:bg-white focus:outline-[#1B4332]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#3F5446] mb-1">
                  Additional Interests (comma-separated)
                </label>
                <input
                  type="text"
                  value={formAdditionalInterests}
                  onChange={e => setFormAdditionalInterests(e.target.value)}
                  placeholder="e.g. Rose gardening, Baking bread, Radio plays"
                  className="w-full p-2 text-xs rounded-lg border border-[#D5CDBC] bg-[#FAF8F5] focus:bg-white focus:outline-[#1B4332]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#3F5446] mb-1">
                    Atmosphere
                  </label>
                  <select
                    value={formAtmosphere}
                    onChange={e => setFormAtmosphere(e.target.value as any)}
                    className="w-full p-2 text-xs rounded-lg border border-[#D5CDBC] bg-[#FAF8F5] focus:bg-white focus:outline-[#1B4332]"
                  >
                    <option value="calm">Calm & Soothing</option>
                    <option value="cheerful">Cheerful & Warm</option>
                    <option value="reflective">Reflective & Gentle</option>
                    <option value="playful">Playful & Upbeat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#3F5446] mb-1">
                    Topics to Avoid
                  </label>
                  <input
                    type="text"
                    value={formExclusions}
                    onChange={e => setFormExclusions(e.target.value)}
                    placeholder="e.g. Loud brass, hospitals"
                    className="w-full p-2 text-xs rounded-lg border border-[#D5CDBC] bg-[#FAF8F5] focus:bg-white focus:outline-[#1B4332]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingId(null);
                }}
                className="px-3 py-1.5 rounded-lg border border-[#D5CDBC] text-xs font-medium text-[#526659] hover:bg-[#F2ECE2]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePerson}
                disabled={!formName.trim() || !formPrimaryInterest.trim()}
                className="px-4 py-1.5 rounded-lg bg-[#1B4332] text-xs font-semibold text-white hover:bg-[#255C45] disabled:opacity-50"
              >
                Save Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#526659]">
                {currentProfiles.length} active profile{currentProfiles.length !== 1 ? 's' : ''}
              </span>
              <button
                type="button"
                onClick={handleStartAdd}
                className="min-h-[36px] px-3 py-1.5 rounded-xl bg-[#1B4332] text-white text-xs font-semibold hover:bg-[#255C45] flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Loved One</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {currentProfiles.map(person => {
                const isSelected = activeProfileId === person.id;
                const patient = person.profile.patient;
                const caregiver = person.profile.caregiver;

                return (
                  <div
                    key={person.id}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#EAE4D9]/60 border-[#1B4332] shadow-xs'
                        : 'bg-white border-[#E2DDD0] hover:border-[#1B4332]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar preview next to name */}
                      <AvatarBadge
                        name={person.name}
                        avatarUrl={patient?.avatarUrl}
                        role="patient"
                        size="md"
                      />

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-bold text-sm text-[#14261C]">
                            {person.name}
                          </span>
                          {(caregiver?.relationship || person.relationship) && (
                            <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#526659] border border-[#E4DDD0]">
                              {caregiver?.relationship || person.relationship}
                            </span>
                          )}
                          {patient?.nationality && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-[#4A6052] border border-[#E4DDD0]">
                              {patient.nationality}
                            </span>
                          )}
                          {patient?.age && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FAF8F5] text-[#637669] border border-[#E4DDD0]">
                              Age {patient.age}
                            </span>
                          )}
                          {isSelected && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1B4332] text-white">
                              Active
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#4E6254]">
                          <strong>Interest:</strong> {person.profile.primaryInterest}
                        </p>

                        {caregiver?.sharedBackgroundNote && (
                          <p className="text-[11px] text-[#55695E] italic">
                            Shared: &ldquo;{caregiver.sharedBackgroundNote}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(person)}
                        className="w-8 h-8 rounded-lg border border-[#D5CDBC] text-[#4A6052] hover:bg-[#FAF8F5] flex items-center justify-center transition-colors"
                        title="Edit profile & details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectProfile(person);
                          onClose();
                        }}
                        className="min-h-[34px] px-3 py-1 rounded-lg text-xs font-semibold bg-[#1B4332] text-white hover:bg-[#255C45] transition-colors flex items-center gap-1"
                      >
                        <span>Select</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(person.id)}
                        className="w-8 h-8 rounded-lg border border-[#D5CDBC] text-[#8C3A3A] hover:bg-[#FEF2F2] flex items-center justify-center transition-colors"
                        title="Remove profile"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
