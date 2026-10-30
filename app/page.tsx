'use client';

import React, { useState, useEffect } from 'react';
import { CulturalProfile, ConnectionMoment, WorkflowStep, SavedPersonProfile } from '@/lib/types';
import { DEMO_PROFILES, DEMO_PRECOMPUTED_MOMENT, DEMO_SAMPLE_SAVED_MOMENTS } from '@/lib/demonstrationData';
import { Navbar } from '@/components/Navbar';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { ProfileBuilder } from '@/components/ProfileBuilder';
import { AgentWorkflowIndicator } from '@/components/AgentWorkflowIndicator';
import { ConnectionMomentCard } from '@/components/ConnectionMomentCard';
import { SavedMomentsView } from '@/components/SavedMomentsView';
import { HowItWorksView } from '@/components/HowItWorksView';
import { PrivacySettingsView } from '@/components/PrivacySettingsView';
import { ProfileManagerModal } from '@/components/ProfileManagerModal';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { ConnectionMomentCardSkeleton, ProfileBuilderSkeleton } from '@/components/skeletons';

const STORAGE_KEY = 'kinship_saved_moments_v1';
const PERSON_PROFILES_KEY = 'kinship_loved_ones_v1';

const DEFAULT_PERSON_PROFILES: SavedPersonProfile[] = [
  {
    id: 'person_vera',
    name: 'Vera',
    relationship: 'Mother',
    profile: DEMO_PROFILES[0].profile,
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'person_arthur',
    name: 'Arthur',
    relationship: 'Father',
    profile: DEMO_PROFILES[1].profile,
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'person_rosa',
    name: 'Rosa',
    relationship: 'Aunt',
    profile: DEMO_PROFILES[2].profile,
    createdAt: Date.now() - 86400000 * 1,
  },
];

export default function KinshipApp() {
  const [currentTab, setCurrentTab] = useState<'welcome' | 'create' | 'saved' | 'how-it-works' | 'privacy'>('welcome');
  const [activeProfile, setActiveProfile] = useState<CulturalProfile | null>(null);
  const [currentMoment, setCurrentMoment] = useState<ConnectionMoment | null>(null);

  // Transition loading states for perceived performance
  const [isLoadingMoment, setIsLoadingMoment] = useState<boolean>(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);

  // Workflow state
  const [isOrchestrating, setIsOrchestrating] = useState<boolean>(false);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [workflowError, setWorkflowError] = useState<string | null>(null);

  // Saved moments and client-side mount indicator for zero hydration mismatch
  const [savedMoments, setSavedMoments] = useState<ConnectionMoment[]>([]);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Loved ones & residents multi-profile state
  const [personProfiles, setPersonProfiles] = useState<SavedPersonProfile[]>(DEFAULT_PERSON_PROFILES);
  const [activePersonId, setActivePersonId] = useState<string>('person_vera');
  const [showProfileManager, setShowProfileManager] = useState<boolean>(false);

  // Integration status
  const [isDemonstration, setIsDemonstration] = useState<boolean>(true);
  const [qlooLiveActive, setQlooLiveActive] = useState<boolean>(false);

  // Load saved moments and loved ones safely after hydration and check backend API status
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setIsMounted(true);
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSavedMoments(parsed);
          } else {
            setSavedMoments(DEMO_SAMPLE_SAVED_MOMENTS);
          }
        } else {
          setSavedMoments(DEMO_SAMPLE_SAVED_MOMENTS);
        }

        const storedPersons = localStorage.getItem(PERSON_PROFILES_KEY);
        if (storedPersons) {
          const parsedPersons = JSON.parse(storedPersons);
          if (Array.isArray(parsedPersons) && parsedPersons.length > 0) {
            setPersonProfiles(parsedPersons);
          }
        }
      } catch (e) {
        console.warn('Failed to load local storage data:', e);
      }
    });

    fetch('/api/qloo/status')
      .then(res => res.json())
      .then(data => {
        setIsDemonstration(!data.qlooLive);
        setQlooLiveActive(Boolean(data.qlooLive));
      })
      .catch(() => {
        setIsDemonstration(true);
        setQlooLiveActive(false);
      });

    return () => cancelAnimationFrame(frameId);
  }, []);

  // Save moments to localStorage (handles adding, updating notes, or toggling)
  const handleSaveMoment = (moment: ConnectionMoment, forceSave = false) => {
    setSavedMoments(prev => {
      const exists = prev.some(m => m.id === moment.id);
      let updated: ConnectionMoment[];
      if (exists) {
        if (forceSave || moment.personalNotes !== undefined) {
          updated = prev.map(m => (m.id === moment.id ? { ...m, ...moment } : m));
        } else {
          updated = prev.filter(m => m.id !== moment.id);
        }
      } else {
        updated = [moment, ...prev];
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not write to localStorage:', e);
      }
      return updated;
    });

    setCurrentMoment(prev => (prev && prev.id === moment.id ? { ...prev, ...moment } : prev));
  };

  // Update personal caregiver notes/reflections and resonance rating for a specific moment
  const handleUpdateNotes = (momentId: string, notes: string, score?: number) => {
    const lastReflectedAt = Date.now();
    setCurrentMoment(prev => {
      if (prev && prev.id === momentId) {
        return {
          ...prev,
          personalNotes: notes,
          ...(score !== undefined ? { resonanceScore: score } : {}),
          lastReflectedAt,
        };
      }
      return prev;
    });

    setSavedMoments(prev => {
      const exists = prev.some(m => m.id === momentId);
      let updated: ConnectionMoment[];
      if (exists) {
        updated = prev.map(m =>
          m.id === momentId
            ? {
                ...m,
                personalNotes: notes,
                ...(score !== undefined ? { resonanceScore: score } : {}),
                lastReflectedAt,
              }
            : m
        );
      } else if (currentMoment && currentMoment.id === momentId) {
        updated = [
          {
            ...currentMoment,
            personalNotes: notes,
            ...(score !== undefined ? { resonanceScore: score } : {}),
            lastReflectedAt,
          },
          ...prev,
        ];
      } else {
        updated = prev;
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not write to localStorage:', e);
      }
      return updated;
    });
  };

  const handleRemoveMoment = (id: string) => {
    setSavedMoments(prev => {
      const updated = prev.filter(m => m.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not write to localStorage:', e);
      }
      return updated;
    });
  };

  const handleClearAllMoments = () => {
    setSavedMoments([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Could not clear localStorage:', e);
    }
  };

  // Save updated person profiles to localStorage
  const handleSavePersonProfiles = (profiles: SavedPersonProfile[]) => {
    setPersonProfiles(profiles);
    try {
      localStorage.setItem(PERSON_PROFILES_KEY, JSON.stringify(profiles));
    } catch (e) {
      console.warn('Failed to save person profiles:', e);
    }
  };

  const handleSelectPersonProfile = (person: SavedPersonProfile) => {
    setActivePersonId(person.id);
    setActiveProfile(person.profile);
    setCurrentTab('create');
  };

  // Launch the 5-step agentic workflow
  const handleGenerateMoment = async (profileToUse: CulturalProfile) => {
    setActiveProfile(profileToUse);
    setIsOrchestrating(true);
    setWorkflowError(null);
    setCurrentStepIndex(0);

    // Initial placeholder steps while network executes
    setWorkflowSteps([
      { id: 1, title: 'Understanding selected interests', status: 'in_progress', detail: 'Parsing cultural seed and comfort parameters...' },
      { id: 2, title: 'Looking up cultural references through Qloo', status: 'pending', detail: 'Awaiting entity resolution...' },
      { id: 3, title: 'Exploring related interests using Qloo Insights API', status: 'pending', detail: 'Awaiting taste graph traversal...' },
      { id: 4, title: 'Preparing shared activity with Gemini', status: 'pending', detail: 'Awaiting activity synthesis...' },
      { id: 5, title: 'Checking activity against exclusions & dignity rules', status: 'pending', detail: 'Awaiting safety vetting...' },
    ]);

    const stepTimer1 = setTimeout(() => setCurrentStepIndex(1), 600);
    const stepTimer2 = setTimeout(() => setCurrentStepIndex(2), 1400);
    const stepTimer3 = setTimeout(() => setCurrentStepIndex(3), 2200);

    try {
      const response = await fetch('/api/generate-moment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: profileToUse }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete the connection moment.');
      }

      setWorkflowSteps(data.workflowSteps || []);
      setCurrentStepIndex(4);
      setIsDemonstration(Boolean(data.isDemonstration));
      setQlooLiveActive(Boolean(data.qlooLiveActive));

      setTimeout(() => {
        setCurrentMoment(data.moment);
        setIsOrchestrating(false);
      }, 500);
    } catch (err: unknown) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      const msg = err instanceof Error ? err.message : 'Network error';
      setWorkflowError(msg);
      setWorkflowSteps(prev =>
        prev.map((s, idx) =>
          idx === currentStepIndex ? { ...s, status: 'failed', detail: msg } : s
        )
      );
    }
  };

  const handleSelectSampleProfile = (profile: CulturalProfile) => {
    setActiveProfile(profile);
    handleGenerateMoment(profile);
  };

  const isCurrentMomentSaved = Boolean(
    currentMoment && savedMoments.some(m => m.id === currentMoment.id)
  );

  const activePerson = personProfiles.find(p => p.id === activePersonId);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#14261C] flex flex-col font-sans selection:bg-[#1B4332] selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={tab => {
          setCurrentTab(tab);
          if (tab === 'create' && !currentMoment && !isOrchestrating) {
            // keep form visible
          }
        }}
        savedCount={isMounted ? savedMoments.length : 0}
        isDemonstration={isDemonstration}
        activePersonName={activePerson?.name}
        onOpenProfileManager={() => setShowProfileManager(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6">
        {/* Screen C: Active Agent Orchestration View with Skeleton Preview */}
        {isOrchestrating ? (
          <div className="space-y-6">
            <AgentWorkflowIndicator
              steps={workflowSteps}
              currentStepIndex={currentStepIndex}
              isComplete={Boolean(currentMoment && !isOrchestrating)}
              isDemonstration={isDemonstration}
              error={workflowError}
              onRetry={() => {
                if (activeProfile) handleGenerateMoment(activeProfile);
              }}
              onCancel={() => {
                setIsOrchestrating(false);
                setWorkflowError(null);
              }}
            />
            {!workflowError && <ConnectionMomentCardSkeleton />}
          </div>
        ) : isLoadingMoment ? (
          <ConnectionMomentCardSkeleton />
        ) : isLoadingProfile ? (
          <ProfileBuilderSkeleton />
        ) : currentTab === 'create' && currentMoment ? (
          /* Screen D: Resulting Connection Moment Card */
          <ConnectionMomentCard
            moment={currentMoment}
            onSave={handleSaveMoment}
            isSaved={isCurrentMomentSaved}
            onUpdateNotes={handleUpdateNotes}
            recipientName={activePerson?.name}
            onTryAnother={() => {
              if (activeProfile) {
                handleGenerateMoment(activeProfile);
              }
            }}
            onReturnToProfile={() => {
              setCurrentMoment(null);
            }}
            onStopActivity={() => {
              setCurrentMoment(null);
              setCurrentTab('welcome');
            }}
          />
        ) : currentTab === 'create' ? (
          /* Screen B: Cultural Profile Builder */
          <ProfileBuilder
            initialProfile={activeProfile}
            onSubmit={handleGenerateMoment}
            isLoading={isOrchestrating || isLoadingProfile}
          />
        ) : currentTab === 'saved' ? (
          /* Screen E: Saved Moments View */
          <SavedMomentsView
            savedMoments={savedMoments}
            onRemoveMoment={handleRemoveMoment}
            onClearAll={handleClearAllMoments}
            onUpdateNotes={handleUpdateNotes}
            onSelectMoment={moment => {
              setIsLoadingMoment(true);
              setCurrentTab('create');
              setTimeout(() => {
                setCurrentMoment(moment);
                setActiveProfile(moment.sourceProfile);
                setIsLoadingMoment(false);
              }, 250);
            }}
            onCreateMomentClick={() => {
              setIsLoadingProfile(true);
              setCurrentMoment(null);
              setCurrentTab('create');
              setTimeout(() => setIsLoadingProfile(false), 200);
            }}
          />
        ) : currentTab === 'how-it-works' ? (
          /* How It Works Information Screen */
          <HowItWorksView
            onCreateMomentClick={() => {
              setIsLoadingProfile(true);
              setCurrentMoment(null);
              setCurrentTab('create');
              setTimeout(() => setIsLoadingProfile(false), 200);
            }}
          />
        ) : currentTab === 'privacy' ? (
          /* Privacy & Care Settings */
          <PrivacySettingsView
            onClearAllLocalData={() => {
              handleClearAllMoments();
              setActiveProfile(null);
              setCurrentMoment(null);
            }}
            savedCount={savedMoments.length}
            isDemonstration={isDemonstration}
            qlooLiveActive={qlooLiveActive}
          />
        ) : (
          /* Screen A: Welcome Screen */
          <WelcomeScreen
            onCreateClick={() => {
              setIsLoadingProfile(true);
              setCurrentMoment(null);
              setCurrentTab('create');
              setTimeout(() => setIsLoadingProfile(false), 200);
            }}
            onSelectSampleProfile={handleSelectSampleProfile}
            recentMoments={savedMoments}
            onSelectRecentMoment={moment => {
              setIsLoadingMoment(true);
              setCurrentTab('create');
              setTimeout(() => {
                setCurrentMoment(moment);
                setActiveProfile(moment.sourceProfile);
                setIsLoadingMoment(false);
              }, 250);
            }}
            onViewAllSaved={() => setCurrentTab('saved')}
          />
        )}
      </main>

      {/* Feature 2: Multi-Profile Loved Ones Manager Modal */}
      {showProfileManager && (
        <ProfileManagerModal
          currentProfiles={personProfiles}
          activeProfileId={activePersonId}
          onSelectProfile={handleSelectPersonProfile}
          onSaveProfiles={handleSavePersonProfiles}
          onClose={() => setShowProfileManager(false)}
        />
      )}

      {/* Feature 5: Offline Indicator */}
      <OfflineIndicator />

      {/* Dignified & Accessible Footer */}
      <footer className="mt-auto border-t border-[#E6E1D8] bg-[#FAF8F5] py-6 px-4 text-center text-xs text-[#526659]">
        <div className="max-w-4xl mx-auto space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-medium">
            <span>Kinship: Moments of Connection</span>
            <span aria-hidden="true">·</span>
            <span>Powered by Qloo Taste Intelligence & Gemini AI</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setCurrentTab('privacy')}
              className="hover:text-[#1B4332] underline hover:no-underline"
            >
              Privacy & Disclaimers
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setCurrentTab('how-it-works')}
              className="hover:text-[#1B4332] underline hover:no-underline"
            >
              Dementia Guidance
            </button>
          </div>
          <p className="text-[11px] text-[#6E8375] max-w-xl mx-auto">
            Kinship is a supportive cultural companion for caregivers and families, not a medical device, diagnostic product, or therapeutic cure.
          </p>
        </div>
      </footer>
    </div>
  );
}
