export type ActivityType = 
  | 'listening'
  | 'looking'
  | 'conversation'
  | 'hands-on'
  | 'quiet-companionship';

export type AtmosphereType = 
  | 'calm'
  | 'cheerful'
  | 'reflective'
  | 'playful';

export type DurationOption = 5 | 10 | 15;

export interface PatientDetails {
  name?: string; // e.g., "Vera"
  sex?: 'female' | 'male' | 'non-binary' | 'prefer-not-to-say' | string; // Biological sex / gender
  gender?: 'female' | 'male' | 'non-binary' | 'prefer-not-to-say' | string; // Compatibility alias
  age?: number | string; // Current chronological age today (e.g., 84, 79). Shapes physical pacing, hearing/sensory threshold.
  formativeEra?: string; // Formative musical & cultural reminiscence era (e.g. "1950s Great American Songbook"). Distinct from age!
  era?: string; // Short alias for formativeEra
  nationality?: string; // Cultural heritage / country of origin (e.g., "British", "Mexican", "Scottish", "Italian-American")
  avatarUrl?: string; // Optional photo or avatar data URI / image URL
}

export interface CaregiverDetails {
  name?: string; // e.g., "Sarah"
  sex?: 'female' | 'male' | 'non-binary' | 'prefer-not-to-say' | string; // Caregiver sex / gender
  gender?: 'female' | 'male' | 'non-binary' | 'prefer-not-to-say' | string; // Compatibility alias
  age?: number | string; // Caregiver chronological age (e.g., 52 or 28). Crucial for intergenerational vs peer dynamic!
  relationship: string; // e.g., "Daughter", "Son", "Spouse / Partner", "Grandchild", "Sister / Brother", "Professional Caregiver", "Volunteer Companion"
  nationality?: string; // Caregiver cultural heritage / nationality (e.g., "Canadian", "Mexican-American")
  sharedBackgroundNote?: string; // e.g., "Loves afternoon tea rituals", "Cooks family recipes on Sundays"
  avatarUrl?: string; // Optional photo or avatar data URI / image URL
}

export interface QlooMultiSensoryBridge {
  aromaOrScent?: string; // e.g., "Bergamot, dried lavender buds, or warm Earl Grey steam"
  flavorOrBeverage?: string; // e.g., "Warm chamomile tea, steamed milk, or lemon shortbread"
  tactileTexture?: string; // e.g., "Smooth ceramic mug, warm wool knit throw, or polished wood"
  visualAtmosphere?: string; // e.g., "Gentle natural window light, muted amber lamp"
  intergenerationalBridge?: string; // How this connects across age gaps (e.g., "Daughter Sarah and mother Vera can connect over timeless melodies that inspired modern singer-songwriters")
  sensoryPacingNote?: string; // Gentle pacing recommendation (e.g., "Slow tempo, solo piano to prevent auditory fatigue")
}

export interface CulturalProfile {
  primaryInterest: string; // e.g., "Ella Fitzgerald", "Singin' in the Rain", "Monet's Water Lilies"
  additionalInterests: string[]; // e.g., ["Gardening", "Tea making", "Baking"]
  preferredLanguage: string; // e.g., "English", "Spanish", "French"
  activityType: ActivityType;
  durationMinutes: DurationOption;
  atmosphere: AtmosphereType;
  exclusions: string; // Topics, sounds, memories to avoid (e.g. "sudden loud brass, mentions of hospitals")
  practicalPreferences?: string; // e.g., "Seated comfort, large imagery, soft volume"
  patient?: PatientDetails;
  caregiver?: CaregiverDetails;
}

export interface QlooEntity {
  id: string;
  name: string;
  category: string;
  subculture?: string;
  popularity?: number;
  description?: string;
  verified: boolean;
}

export interface QlooInsight {
  id: string;
  name: string;
  category: string;
  relationship: string;
  seedEntityName: string;
  affinityScore?: number;
  isDemonstration: boolean;
}

export interface WorkflowStep {
  id: number;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'fallback' | 'failed';
  detail: string;
  timestamp?: number;
}

export interface CulturalReferenceProvenance {
  name: string;
  category: string;
  provenance: string; // e.g. "Qloo Taste Graph affinity linked to Ella Fitzgerald"
  isQlooLive: boolean;
  entityId?: string;
  relationshipNote?: string;
}

export interface ConnectionMoment {
  id: string;
  title: string;
  selectionRationale: string;
  openingSentence: string;
  conversationInvitations: string[]; // 1-2 open, respectful invitations — never testing memory!
  practicalActivity: string; // 1 tactile or shared engaging sensory step
  culturalReference: CulturalReferenceProvenance;
  suggestedDurationMinutes: DurationOption;
  closingSentence: string;
  caregiverNote: string; // Instructions on reading cues, slowing down, stopping safely
  personalNotes?: string; // Caregiver's personal observations and reflections on how this moment went
  lastReflectedAt?: number; // Timestamp of when the note was added or updated
  resonanceScore?: number; // 1-5 rating of connection & mood (1=restless/stopped early, 3=peaceful, 5=deeply connected/sparked joy)
  sentimentMood?: 'deeply-connected' | 'calm-content' | 'peaceful' | 'restless' | 'disengaged';
  createdAt: number;
  isDemonstration: boolean;
  sourceProfile: CulturalProfile;
  workflowSteps: WorkflowStep[];
  qlooVerified: boolean;
  multiSensoryBridge?: QlooMultiSensoryBridge; // Qloo cross-domain sensory & intergenerational bridge
}

export interface GenerationApiResponse {
  success: boolean;
  moment: ConnectionMoment;
  workflowSteps: WorkflowStep[];
  isDemonstration: boolean;
  qlooLiveActive: boolean;
  message?: string;
}

export interface SavedPersonProfile {
  id: string;
  name: string; // e.g., "Vera", "Arthur", "Rosa"
  relationship?: string; // e.g., "Mother", "Father", "Resident", "Spouse"
  profile: CulturalProfile;
  notes?: string;
  createdAt: number;
}

