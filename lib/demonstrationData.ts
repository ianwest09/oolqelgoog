import { CulturalProfile, QlooEntity, QlooInsight, ConnectionMoment } from './types';
import { AVATAR_PRESETS } from './avatarPresets';

export const DEMO_PROFILES: { label: string; description: string; profile: CulturalProfile }[] = [
  {
    label: "Vera (Jazz & English Garden)",
    description: "Loves gentle big band melodies, afternoon tea, and fragrant flower beds.",
    profile: {
      primaryInterest: "Ella Fitzgerald",
      additionalInterests: ["Rose gardening", "Classic BBC radio", "Baking scones"],
      preferredLanguage: "English",
      activityType: "listening",
      durationMinutes: 10,
      atmosphere: "calm",
      exclusions: "Loud brass outbursts, discussions of medical appointments or hospitals",
      practicalPreferences: "Enjoys holding a warm mug of tea; prefers soft volume.",
      patient: {
        name: "Vera",
        sex: "female",
        gender: "female",
        age: 84, // Chronological age today
        formativeEra: "1950s Great American Songbook", // Cultural reminiscence era
        era: "1950s Great American Songbook",
        nationality: "British",
        avatarUrl: AVATAR_PRESETS[0].dataUrl,
      },
      caregiver: {
        name: "Sarah",
        sex: "female",
        gender: "female",
        age: 54, // Caregiver chronological age
        relationship: "Daughter",
        nationality: "British-Canadian",
        sharedBackgroundNote: "Baking scones and drinking warm Earl Grey tea together",
        avatarUrl: AVATAR_PRESETS[3].dataUrl,
      },
    }
  },
  {
    label: "Arthur (Maritime Folk & Woodcraft)",
    description: "Appreciates acoustic ballads, coastal scenery, and traditional hand tools.",
    profile: {
      primaryInterest: "Gordon Lightfoot",
      additionalInterests: ["Wooden boat building", "Lighthouses", "Lake Superior lore"],
      preferredLanguage: "English",
      activityType: "looking",
      durationMinutes: 5,
      atmosphere: "reflective",
      exclusions: "Storms, shipwrecks, or distressing weather",
      practicalPreferences: "Prefers large photo prints or clear screen images held at lap level.",
      patient: {
        name: "Arthur",
        sex: "male",
        gender: "male",
        age: 79,
        formativeEra: "1960s Maritime Folk & Ballads",
        era: "1960s Maritime Folk & Ballads",
        nationality: "Scottish-Canadian",
        avatarUrl: AVATAR_PRESETS[1].dataUrl,
      },
      caregiver: {
        name: "David",
        sex: "male",
        gender: "male",
        age: 49,
        relationship: "Son",
        nationality: "Canadian",
        sharedBackgroundNote: "Looking at wooden boat craftsmanship and quiet harbor stories",
        avatarUrl: AVATAR_PRESETS[4].dataUrl,
      },
    }
  },
  {
    label: "Rosa (Boleros & Courtyard Cooking)",
    description: "Resonates with Latin acoustic guitar, fragrant citrus, and family recipe traditions.",
    profile: {
      primaryInterest: "Trio Los Panchos",
      additionalInterests: ["Herb gardens", "Spanish guitar", "Hand embroidery"],
      preferredLanguage: "Spanish",
      activityType: "conversation",
      durationMinutes: 15,
      atmosphere: "cheerful",
      exclusions: "Rushed tasks or sudden loud television",
      practicalPreferences: "Likes sitting by the window with gentle sunlight.",
      patient: {
        name: "Rosa",
        sex: "female",
        gender: "female",
        age: 82,
        formativeEra: "1960s Bolero & Acoustic Requinto",
        era: "1960s Bolero & Acoustic Requinto",
        nationality: "Mexican",
        avatarUrl: AVATAR_PRESETS[2].dataUrl,
      },
      caregiver: {
        name: "Elena",
        sex: "female",
        gender: "female",
        age: 26,
        relationship: "Grandchild",
        nationality: "Mexican-American",
        sharedBackgroundNote: "Sitting on the sunny patio with fresh mint water and family recipes",
        avatarUrl: AVATAR_PRESETS[5].dataUrl,
      },
    }
  }
];

export const DEMO_QLOO_ENTITIES: Record<string, QlooEntity> = {
  "ella fitzgerald": {
    id: "urn:entity:artist:demo_ella_fitzgerald_01",
    name: "Ella Fitzgerald",
    category: "music_artist",
    subculture: "Vocal Jazz / Great American Songbook",
    popularity: 0.94,
    description: "Legendary American jazz vocalist celebrated for tone, diction, and phrasing.",
    verified: true
  },
  "gordon lightfoot": {
    id: "urn:entity:artist:demo_gordon_lightfoot_02",
    name: "Gordon Lightfoot",
    category: "music_artist",
    subculture: "Folk & Acoustic Ballads",
    popularity: 0.88,
    description: "Renowned Canadian singer-songwriter known for acoustic folk and maritime reflections.",
    verified: true
  },
  "trio los panchos": {
    id: "urn:entity:artist:demo_trio_los_panchos_03",
    name: "Trio Los Panchos",
    category: "music_artist",
    subculture: "Classic Latin Bolero",
    popularity: 0.91,
    description: "Celebrated romantic bolero trio known for three-part harmony and the requinto guitar.",
    verified: true
  }
};

export const DEMO_QLOO_INSIGHTS: Record<string, QlooInsight[]> = {
  "urn:entity:artist:demo_ella_fitzgerald_01": [
    {
      id: "urn:entity:recording:demo_autumn_in_new_york",
      name: "Autumn in New York (Duet with Louis Armstrong)",
      category: "music_recording",
      relationship: "Taste Graph affinity (shared recording catalogue & vocal harmony)",
      seedEntityName: "Ella Fitzgerald",
      affinityScore: 0.96,
      isDemonstration: true
    },
    {
      id: "urn:entity:artist:demo_nat_king_cole",
      name: "Nat King Cole Trio",
      category: "music_artist",
      relationship: "Cross-artist taste correlation (warm vocal warmth & piano jazz)",
      seedEntityName: "Ella Fitzgerald",
      affinityScore: 0.93,
      isDemonstration: true
    },
    {
      id: "urn:entity:cultural:demo_english_rose_gardens",
      name: "Heritage Botanical Gardens & Old Roses",
      category: "lifestyle_interest",
      relationship: "Contextual hobby alignment (soothing botanical sensory resonance)",
      seedEntityName: "Ella Fitzgerald",
      affinityScore: 0.87,
      isDemonstration: true
    }
  ],
  "urn:entity:artist:demo_gordon_lightfoot_02": [
    {
      id: "urn:entity:recording:demo_early_morning_rain",
      name: "Early Mornin' Rain (Acoustic 12-String)",
      category: "music_recording",
      relationship: "Core signature acoustic track",
      seedEntityName: "Gordon Lightfoot",
      affinityScore: 0.95,
      isDemonstration: true
    },
    {
      id: "urn:entity:cultural:demo_great_lakes_wooden_boats",
      name: "Classic Wooden Skiffs & Quiet Harbours",
      category: "lifestyle_interest",
      relationship: "Contextual affinity with coastal craftsmanship",
      seedEntityName: "Gordon Lightfoot",
      affinityScore: 0.89,
      isDemonstration: true
    }
  ],
  "urn:entity:artist:demo_trio_los_panchos_03": [
    {
      id: "urn:entity:recording:demo_sin_ti",
      name: "Sin Ti (Romantic Bolero with Alfredo Gil)",
      category: "music_recording",
      relationship: "Signature melodic arrangement featuring the gentle requinto",
      seedEntityName: "Trio Los Panchos",
      affinityScore: 0.97,
      isDemonstration: true
    },
    {
      id: "urn:entity:cultural:demo_aromatic_herb_gardens",
      name: "Courtyard Herb Gardens & Fresh Mint Leaves",
      category: "lifestyle_interest",
      relationship: "Sensory companion pairing (fresh scent + gentle strumming)",
      seedEntityName: "Trio Los Panchos",
      affinityScore: 0.88,
      isDemonstration: true
    }
  ]
};

export const DEMO_PRECOMPUTED_MOMENT: ConnectionMoment = {
  id: "moment_demo_vera_default",
  title: "Sipping Chamomile with Ella's Gentle 'Cheek to Cheek'",
  selectionRationale: "Selected using Ella Fitzgerald's softest vocal duet with Louis Armstrong, paired seamlessly with Vera's love for warm afternoon tea and garden scents, tailored for her daughter Sarah.",
  openingSentence: "Mum, I brought over two warm mugs of chamomile tea, and I have Ella's gentle voice playing softly for us.",
  conversationInvitations: [
    "Would you enjoy simply resting and listening with me for a few minutes?",
    "What kind of feeling does this melody bring to mind today?"
  ],
  practicalActivity: "Hold the warm tea mug together to feel the comforting warmth in your hands while Ella's quiet voice plays at low volume.",
  culturalReference: {
    name: "Ella Fitzgerald & Louis Armstrong — 'Cheek to Cheek'",
    category: "Vocal Jazz",
    provenance: "Demonstration taste-graph sample (seed: Ella Fitzgerald)",
    isQlooLive: false,
    entityId: "urn:entity:recording:demo_autumn_in_new_york",
    relationshipNote: "Illustrative recommendation from the demonstration taste graph."
  },
  suggestedDurationMinutes: 10,
  closingSentence: "Thank you for sharing this quiet moment with me; we can turn the music off whenever you're ready.",
  caregiverNote: "Notice facial cues and body relaxation. If the person seems tired or fidgety, there is no need to finish the song. Quietly turn down the sound and simply enjoy the warm tea.",
  personalNotes: "Vera smiled warmly when Ella's opening vocal began and held both hands gently around the warm mug. Very calming afternoon.",
  lastReflectedAt: Date.now() - 3600000,
  resonanceScore: 5,
  sentimentMood: "deeply-connected",
  createdAt: Date.now(),
  isDemonstration: true,
  sourceProfile: DEMO_PROFILES[0].profile,
  workflowSteps: [
    { id: 1, title: "Understanding interests & relational context", status: "completed", detail: "Analyzed vocal jazz affinity, daughter-mother connection, and quiet tea ritual." },
    { id: 2, title: "Qloo Entity Resolution", status: "completed", detail: "Demonstration mode: Resolved 'Ella Fitzgerald' to sample entity urn:entity:artist:demo_ella_fitzgerald_01." },
    { id: 3, title: "Qloo Taste Exploration", status: "completed", detail: "Demonstration mode: Found correlated gentle duet recordings & sensory garden pairings." },
    { id: 4, title: "Gemini Activity Synthesis", status: "completed", detail: "Synthesized warm tea sensory tactile activity with daughter-mother filial phrasing." },
    { id: 5, title: "Safety & Exclusions Check", status: "completed", detail: "Verified: Excluded loud brass, medical mentions, and memory-recall testing." }
  ],
  qlooVerified: false,
  multiSensoryBridge: {
    aromaOrScent: "Fragrant bergamot steam from freshly steeped Earl Grey tea & garden lavender",
    flavorOrBeverage: "Warm chamomile or Earl Grey tea with a splash of milk & a crisp bite of shortbread",
    tactileTexture: "Holding a warm smooth ceramic mug in both hands for reassuring grounding",
    visualAtmosphere: "Soft natural window light illuminating tranquil garden greenery; no flickering screens",
    intergenerationalBridge: "Connects Ella's timeless vocal styling with modern acoustic ballads, giving daughter Sarah and mother Vera a shared musical language rather than passive supervision.",
    sensoryPacingNote: "Unhurried phrasing with zero abrupt volume spikes; cushions auditory sensory fatigue."
  }
};

export const DEMO_SAMPLE_SAVED_MOMENTS: ConnectionMoment[] = [
  {
    id: "moment_sample_1",
    title: "Quiet Afternoon Tea with Ella Fitzgerald",
    selectionRationale: "Soft vocal jazz duet paired with tactile tea warmth, tailored for daughter Sarah and her British mother Vera.",
    openingSentence: "Mum, I made a warm cup of Earl Grey tea for us, and I have a lovely gentle tune playing softly.",
    conversationInvitations: [
      "Would you like to relax and listen with me for a few minutes?",
      "What do you like about the way the piano sounds in this one?"
    ],
    practicalActivity: "Hold the warm tea mug together in both hands while the piano plays softly in the background.",
    culturalReference: {
      name: "Ella Fitzgerald — 'Autumn in New York'",
      category: "Vocal Jazz",
      provenance: "Demonstration taste-graph sample",
      isQlooLive: false,
    },
    suggestedDurationMinutes: 10,
    closingSentence: "Thank you for sharing this lovely tea with me.",
    caregiverNote: "Sip slowly; if tired, just rest hands on the warm mug.",
    personalNotes: "Mum held the mug with both hands, smiled at the trumpet intro, and hummed along for two verses. Very peaceful session.",
    lastReflectedAt: Date.now() - 86400000 * 4,
    createdAt: Date.now() - 86400000 * 4,
    resonanceScore: 5,
    sentimentMood: "deeply-connected",
    isDemonstration: true,
    sourceProfile: DEMO_PROFILES[0].profile,
    workflowSteps: [],
    qlooVerified: false,
    multiSensoryBridge: {
      aromaOrScent: "Bergamot steam from Earl Grey tea & lavender garden blossoms",
      flavorOrBeverage: "Warm Earl Grey tea with milk",
      tactileTexture: "Smooth ceramic porcelain tea mug held in both hands",
      visualAtmosphere: "Gentle natural daylight by the living room window",
      intergenerationalBridge: "Bridges 1950s Great American Songbook with modern vocal jazz that both daughter Sarah and Vera cherish.",
      sensoryPacingNote: "Gentle acoustic tempo with soft brushes and muted trumpet."
    }
  },
  {
    id: "moment_sample_2",
    title: "Looking at Wooden Skiffs & Quiet Harbours",
    selectionRationale: "Maritime acoustic reflections and coastal photography for Arthur and his son David.",
    openingSentence: "Dad, I have some lovely photographs of classic wooden wooden skiffs on Lake Superior to share with you.",
    conversationInvitations: [
      "Look at the smooth cedar planking on this boat — what do you notice first?",
      "We can simply admire the calm lake water in this picture."
    ],
    practicalActivity: "Rest the photo book on Arthur's lap, gently turning one page at a time with Gordon Lightfoot playing at low volume.",
    culturalReference: {
      name: "Gordon Lightfoot — 'Early Mornin\' Rain'",
      category: "Acoustic Ballad",
      provenance: "Demonstration taste-graph sample",
      isQlooLive: false,
    },
    suggestedDurationMinutes: 5,
    closingSentence: "That was a nice look across the harbor. We can set the pictures aside for now.",
    caregiverNote: "Allow plenty of time per photograph. No need to name locations.",
    personalNotes: "Arthur traced his finger along the gunwale of the cedar boat in the photograph. Stayed focused for 7 minutes.",
    lastReflectedAt: Date.now() - 86400000 * 2,
    createdAt: Date.now() - 86400000 * 2,
    resonanceScore: 4,
    sentimentMood: "calm-content",
    isDemonstration: true,
    sourceProfile: DEMO_PROFILES[1].profile,
    workflowSteps: [],
    qlooVerified: false,
    multiSensoryBridge: {
      aromaOrScent: "Fresh cedar shavings and clean fresh pine breeze",
      flavorOrBeverage: "Warm dark roast coffee or apple cider in an earthenware mug",
      tactileTexture: "Textured heavyweight matte photo paper and warm wool lap throw",
      visualAtmosphere: "Quiet lake horizon and polished wooden boat craft prints",
      intergenerationalBridge: "Father and son connect over traditional northern folk storytelling and timeless maritime craftsmanship.",
      sensoryPacingNote: "Mellow 12-string acoustic guitar picking with zero percussion spikes."
    }
  },
  {
    id: "moment_sample_3",
    title: "Holding Fresh Mint in the Sun with Trio Los Panchos",
    selectionRationale: "Acoustic Mexican bolero harmony paired with fragrant courtyard mint, shared between granddaughter Elena and Rosa.",
    openingSentence: "Abuelita, I picked some fresh mint from the courtyard and put on Trio Los Panchos for us.",
    conversationInvitations: [
      "Smell the fresh crushed mint leaves — isn't that refreshing?",
      "The guitar has such a gentle rhythm today."
    ],
    practicalActivity: "Rub a sprig of fresh mint between fingers to release the fragrant scent while listening to the requinto guitar.",
    culturalReference: {
      name: "Trio Los Panchos — 'Sin Ti'",
      category: "Latin Bolero",
      provenance: "Demonstration taste-graph sample",
      isQlooLive: false,
    },
    suggestedDurationMinutes: 15,
    closingSentence: "Muchas gracias, Abuelita. Let's sit in the warmth of the sun a little longer.",
    caregiverNote: "Sensory aroma grounding; keep volume soft.",
    personalNotes: "Grandma closed her eyes and smiled as soon as she smelled the mint. Tapped her fingers in time with the guitar strumming.",
    lastReflectedAt: Date.now() - 86400000 * 1,
    createdAt: Date.now() - 86400000 * 1,
    resonanceScore: 5,
    sentimentMood: "deeply-connected",
    isDemonstration: true,
    sourceProfile: DEMO_PROFILES[2].profile,
    workflowSteps: [],
    qlooVerified: false,
    multiSensoryBridge: {
      aromaOrScent: "Crushed fresh hierbabuena (spearmint) and citrus blossoms",
      flavorOrBeverage: "Refreshing iced agua de menta or warm té de manzanilla con canela",
      tactileTexture: "Velvety fresh herb leaves and terracotta planter warmth",
      visualAtmosphere: "Sunny courtyard patio with dappled afternoon warmth",
      intergenerationalBridge: "Granddaughter Elena embraces her heritage through classic Latin boleros, creating a deep emotional bridge across generations.",
      sensoryPacingNote: "Acoustic requinto nylon strings and warm three-part vocal harmony."
    }
  },
];
