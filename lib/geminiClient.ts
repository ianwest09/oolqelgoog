import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import { CulturalProfile, QlooEntity, QlooInsight, ConnectionMoment, CulturalReferenceProvenance } from './types';

export interface GenerateMomentInput {
  profile: CulturalProfile;
  seedEntity?: QlooEntity;
  insights?: QlooInsight[];
  isQlooLive: boolean;
}

interface MomentOutputSchema {
  title: string;
  selectionRationale: string;
  openingSentence: string;
  conversationInvitations: string[];
  practicalActivity: string;
  culturalReferenceName: string;
  culturalReferenceCategory: string;
  suggestedDurationMinutes: number;
  closingSentence: string;
  caregiverNote: string;
  exclusionsVerifiedNotes: string;
  multiSensoryBridge?: {
    aromaOrScent?: string;
    flavorOrBeverage?: string;
    tactileTexture?: string;
    visualAtmosphere?: string;
    intergenerationalBridge?: string;
    sensoryPacingNote?: string;
  };
}

export function isGeminiConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(key && key.trim() !== '' && key !== 'MY_GEMINI_API_KEY');
}

export async function generateConnectionMomentWithGemini(
  input: GenerateMomentInput
): Promise<Omit<ConnectionMoment, 'id' | 'createdAt' | 'workflowSteps'>> {
  const { profile, seedEntity, insights = [], isQlooLive } = input;

  if (!isGeminiConfigured()) {
    return generateDeterministicFallbackMoment(input);
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });

  const candidateReferences = [
    ...(seedEntity ? [`Primary Seed: ${seedEntity.name} (${seedEntity.category || 'Cultural'}, verified: ${seedEntity.verified})`] : []),
    ...insights.map(i => `Qloo Insight Recommendation: ${i.name} (category: ${i.category}, relationship: ${i.relationship})`)
  ].join('\n');

  const systemInstruction = `You are the empathetic, expert activity designer for "Kinship: Moments of Connection", an innovative cultural connection companion powered by Qloo Taste Intelligence and Gemini for families and caregivers supporting older adults, including people living with dementia.

CRITICAL ETHICAL & SAFETY CONSTRAINTS:
1. NON-CLINICAL COMPANION: This is NOT a medical device, cognitive test, memory restoration therapy, or diagnostic tool. Never claim that it prevents dementia, restores memory, or provides clinical treatment.
2. NO MEMORY TESTING: Never ask questions like "Do you remember when...?", "What year was this?", or quiz the person. That causes anxiety. Use open invitations:
   - "Would you enjoy listening to this with me?"
   - "What do you notice about this melody?"
   - "We can simply sit and enjoy the rhythm together."
3. NO FABRICATION: Do NOT invent personal memories, past family events, song lyrics, or fabricate Qloo entities. Only reference cultural items supplied in the prompt or listed in Verified Qloo Candidates.
4. STRICT EXCLUSIONS: You MUST avoid all items, sounds, themes, or triggers listed in the caregiver's exclusions.
5. DIGNITY & RESPECT: Adults living with dementia deserve genuine warmth and agency. The person can stop or change the activity at any time.
6. RELATIONAL BOND & INTERGENERATIONAL DYNAMICS:
   - CHRONOLOGICAL AGE vs FORMATIVE ERA: Distinguish chronological age today (which dictates energy, physical comfort, auditory thresholds, and generational distance) from formative cultural era (the reminiscence period, typically youth ages 15–25, when deep cultural and musical tastes crystallize).
   - CAREGIVER & PATIENT INTERACTION: Weave their specific relationship (e.g. daughter, son, spouse, grandchild, friend, professional caregiver), biological sex/gender, caregiver age, and respective nationalities into the dialogue and sensory grounding.
   - For example:
     * A 54-year-old daughter with an 84-year-old mother shares loving daughterly reciprocity and comforting rituals (like tea or baking).
     * A 26-year-old grandchild with an 82-year-old grandparent shares intergenerational warmth and curiosity about ancestral heritage.
     * An 80-year-old spouse shares decades of mutual romantic companionship and quiet intimacy.
   - MULTI-SENSORY TASTE INTELLIGENCE (QLOO VALUE):
     * Qloo bridges cross-domain taste: link the music not just to other songs, but to authentic culinary flavors/tea, soothing aromas, tactile physical objects, and visual calm.
     * Provide an Intergenerational Bridge explaining how the caregiver also genuinely connects with this cultural moment.

Return JSON conforming strictly to the defined schema.`;

  const patientName = profile.patient?.name || 'Loved One';
  const patientSex = profile.patient?.sex || profile.patient?.gender || 'Not specified';
  const patientAge = profile.patient?.age || 'Elder';
  const patientEra = profile.patient?.formativeEra || profile.patient?.era || 'Mid-20th century';
  const patientNationality = profile.patient?.nationality || 'Not specified';

  const caregiverName = profile.caregiver?.name || 'Caregiver';
  const relationship = profile.caregiver?.relationship || 'Caregiver';
  const caregiverSex = profile.caregiver?.sex || profile.caregiver?.gender || 'Not specified';
  const caregiverAge = profile.caregiver?.age || 'Adult';
  const caregiverNationality = profile.caregiver?.nationality || 'Not specified';
  const sharedTradition = profile.caregiver?.sharedBackgroundNote || '';

  const userPrompt = `Please design a meaningful shared connection moment for this profile:
- Primary Family-Confirmed Interest: "${profile.primaryInterest}"
- Additional Interests: ${profile.additionalInterests.join(', ') || 'None provided'}
- Desired Activity Type: ${profile.activityType}
- Desired Duration: ${profile.durationMinutes} minutes
- Desired Atmosphere: ${profile.atmosphere}
- Preferred Language: ${profile.preferredLanguage}

- LOVED ONE (PATIENT) PROFILE:
  * Name: "${patientName}"
  * Sex / Gender: "${patientSex}"
  * Chronological Age Today: "${patientAge}" (affects sensory sensitivity, unhurried pacing)
  * Formative Cultural & Musical Era: "${patientEra}" (reminiscence bump from youth ~ages 15–25)
  * Nationality / Cultural Heritage: "${patientNationality}" (informs authentic hospitality, language, comfort items)

- CAREGIVER & RELATIONAL DYNAMIC:
  * Relationship to Loved One: "${relationship}"
  * Caregiver Name: "${caregiverName}"
  * Caregiver Sex / Gender: "${caregiverSex}"
  * Caregiver Chronological Age: "${caregiverAge}" (note the age gap and intergenerational bridge)
  * Caregiver Cultural Heritage: "${caregiverNationality}"
  * Shared Comfort Tradition / Ritual: "${sharedTradition || 'None provided'}"

- CAREGIVER EXCLUSIONS (Must strictly respect): "${profile.exclusions || 'None'}"
- Practical caregiver preferences: "${profile.practicalPreferences || 'Standard comfort'}"

VERIFIED TASTE GRAPH / CULTURAL CANDIDATES:
${candidateReferences || 'No specific Qloo entities returned; ground directly in family-supplied interest.'}

Create a single, dignified, practical activity card tailored to this specific relationship (${relationship} ${caregiverName} & ${patientName}), including the Qloo cross-domain multi-sensory bridge.`;

  let timerId: NodeJS.Timeout | undefined;
  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      timerId = setTimeout(() => reject(new Error('timeout')), 10000);
    });

    const callPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: 'Gentle, descriptive activity title (e.g. "Sharing an Autumn Duet with Ella")'
            },
            selectionRationale: {
              type: Type.STRING,
              description: '1-2 sentences explaining why this activity was chosen based on the cultural interest and atmosphere'
            },
            openingSentence: {
              type: Type.STRING,
              description: 'One warm, gentle opening sentence for the caregiver to speak aloud'
            },
            conversationInvitations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '1 to 2 open invitations to converse or reflect without testing memory'
            },
            practicalActivity: {
              type: Type.STRING,
              description: 'One simple, concrete sensory or shared activity'
            },
            culturalReferenceName: {
              type: Type.STRING,
              description: 'Specific cultural work, recording, or theme featured'
            },
            culturalReferenceCategory: {
              type: Type.STRING,
              description: 'Category (e.g. Vocal Jazz, Maritime Folk, Botanical Scenery)'
            },
            suggestedDurationMinutes: {
              type: Type.INTEGER,
              description: 'Suggested duration (5, 10, or 15)'
            },
            closingSentence: {
              type: Type.STRING,
              description: 'Optional warm, unhurried closing sentence'
            },
            caregiverNote: {
              type: Type.STRING,
              description: 'Advice for the caregiver on reading comfort cues and how to slow down or stop if the person seems tired or overwhelmed'
            },
            exclusionsVerifiedNotes: {
              type: Type.STRING,
              description: 'Brief note confirming excluded topics were avoided'
            },
            multiSensoryBridge: {
              type: Type.OBJECT,
              description: 'Qloo cross-domain sensory and intergenerational bridging pairings',
              properties: {
                aromaOrScent: {
                  type: Type.STRING,
                  description: 'Scent or aroma matching the culture/era (e.g. Earl Grey steam, cedarwood, crushed fresh mint, orange blossom)'
                },
                flavorOrBeverage: {
                  type: Type.STRING,
                  description: 'Comforting beverage or light taste pairing (e.g. warm chamomile tea, spiced milk, lemon shortbread)'
                },
                tactileTexture: {
                  type: Type.STRING,
                  description: 'Physical touchpoint to hold or feel (e.g. warm ceramic mug, soft wool throw, smooth wooden box, velvet ribbon)'
                },
                visualAtmosphere: {
                  type: Type.STRING,
                  description: 'Visual lighting and setting advice (e.g. gentle natural morning light, peaceful garden window)'
                },
                intergenerationalBridge: {
                  type: Type.STRING,
                  description: 'Insight on how this cultural interest bridges the age gap and allows caregiver to share genuine reciprocal enjoyment'
                },
                sensoryPacingNote: {
                  type: Type.STRING,
                  description: 'Sensory load advice (e.g. acoustic warmth, soft volume, unhurried tempo)'
                }
              }
            }
          },
          required: [
            'title',
            'selectionRationale',
            'openingSentence',
            'conversationInvitations',
            'practicalActivity',
            'culturalReferenceName',
            'suggestedDurationMinutes',
            'caregiverNote'
          ]
        }
      }
    });

    const response = await Promise.race([callPromise, timeoutPromise]);
    if (timerId) clearTimeout(timerId);

    const rawText = response.text || '';
    const parsed: MomentOutputSchema = JSON.parse(rawText);

    const chosenRef = insights[0]?.name || seedEntity?.name || profile.primaryInterest;
    const provenanceDetail: CulturalReferenceProvenance = {
      name: parsed.culturalReferenceName || chosenRef,
      category: parsed.culturalReferenceCategory || seedEntity?.category || 'Cultural Interest',
      provenance: isQlooLive 
        ? `Verified Qloo Taste Graph insight originating from "${seedEntity?.name || profile.primaryInterest}"`
        : `Demonstration sample reference (seed: "${seedEntity?.name || profile.primaryInterest}")`,
      isQlooLive,
      entityId: seedEntity?.id,
      relationshipNote: insights[0]?.relationship || `Connected with ${profile.primaryInterest}`
    };

    return {
      title: parsed.title,
      selectionRationale: parsed.selectionRationale,
      openingSentence: parsed.openingSentence,
      conversationInvitations: parsed.conversationInvitations.slice(0, 2),
      practicalActivity: parsed.practicalActivity,
      culturalReference: provenanceDetail,
      suggestedDurationMinutes: (parsed.suggestedDurationMinutes as 5 | 10 | 15) || profile.durationMinutes,
      closingSentence: parsed.closingSentence || 'Thank you for spending this peaceful time together.',
      caregiverNote: parsed.caregiverNote,
      isDemonstration: !isQlooLive,
      sourceProfile: profile,
      qlooVerified: isQlooLive && Boolean(seedEntity?.verified),
      multiSensoryBridge: parsed.multiSensoryBridge
    };
  } catch {
    if (timerId) clearTimeout(timerId);
    return generateDeterministicFallbackMoment(input);
  }
}

/**
 * Deterministic fallback generator when Gemini API is offline or returns error.
 * Ensures the app never breaks and consistently adheres to anti-quizzing and dementia guidelines.
 */
export function generateDeterministicFallbackMoment(
  input: GenerateMomentInput
): Omit<ConnectionMoment, 'id' | 'createdAt' | 'workflowSteps'> {
  const { profile, seedEntity, insights = [], isQlooLive } = input;
  const primaryName = seedEntity?.name || profile.primaryInterest;
  const relatedItem = insights[0]?.name || primaryName;

  const activityLabels: Record<string, string> = {
    listening: 'Shared Listening',
    looking: 'Visual Exploration',
    conversation: 'Gentle Conversation',
    'hands-on': 'Gentle Hands-On Activity',
    'quiet-companionship': 'Quiet Companionship'
  };

  const atmosphereTones: Record<string, string> = {
    calm: 'a soothing, peaceful pace',
    cheerful: 'an uplifting, warm atmosphere',
    reflective: 'a gentle, contemplative feeling',
    playful: 'a lighthearted, smiling moment'
  };

  const activityTypeDescription = activityLabels[profile.activityType] || 'Quiet Shared Time';
  const toneDesc = atmosphereTones[profile.atmosphere] || 'a gentle atmosphere';

  const provenanceDetail: CulturalReferenceProvenance = {
    name: relatedItem,
    category: seedEntity?.category || 'Cultural Interest',
    provenance: isQlooLive
      ? `Verified Qloo Taste Graph insight originating from "${primaryName}"`
      : `Demonstration sample reference (seed: "${primaryName}")`,
    isQlooLive,
    entityId: seedEntity?.id,
    relationshipNote: insights[0]?.relationship || `Connected to ${primaryName}`
  };

  const patientName = profile.patient?.name || '';
  const patientNationality = (profile.patient?.nationality || '').toLowerCase();
  const relationship = profile.caregiver?.relationship || '';
  const caregiverName = profile.caregiver?.name || '';
  const sharedRitual = profile.caregiver?.sharedBackgroundNote || '';

  // Determine affectionate opening address based on relationship
  let openingGreeting = 'I thought we might enjoy a few quiet minutes together';
  if (relationship.toLowerCase().includes('daughter') || relationship.toLowerCase().includes('son')) {
    const address = profile.patient?.sex === 'female' || profile.patient?.gender === 'female'
      ? (patientName ? `${patientName}` : 'Mum') 
      : (patientName ? `${patientName}` : 'Dad');
    openingGreeting = `${address}, I brought over a warm cup and put on some ${primaryName} softly for us`;
  } else if (relationship.toLowerCase().includes('spouse') || relationship.toLowerCase().includes('partner')) {
    openingGreeting = patientName 
      ? `${patientName}, I put on this gentle tune by ${primaryName} for us to enjoy together`
      : `I put on this gentle tune by ${primaryName} for us to share together`;
  } else if (relationship.toLowerCase().includes('grandchild')) {
    const isFemale = profile.patient?.sex === 'female' || profile.patient?.gender === 'female';
    const address = isFemale ? 'Grandma' : (profile.patient?.sex === 'male' || profile.patient?.gender === 'male' ? 'Grandpa' : (patientName || ''));
    openingGreeting = address 
      ? `${address}, I was hoping we could listen to a little bit of ${primaryName} together`
      : `I was hoping we could listen to a little bit of ${primaryName} together`;
  } else if (patientName) {
    openingGreeting = `${patientName}, I thought you might enjoy a peaceful moment with some ${primaryName}`;
  }

  // Tailor practical activity with shared tradition if available
  let practicalStep = profile.activityType === 'hands-on'
    ? `Gently hold a familiar tactile item, such as a warm tea mug or soft textured cloth, while enjoying the rhythm of ${relatedItem} at an unhurried pace.`
    : `Sit comfortably side by side, allowing the warm tones of ${relatedItem} to fill the room softly without needing to speak.`;

  if (sharedRitual) {
    practicalStep = `${practicalStep} As a comforting ritual: ${sharedRitual}.`;
  }

  const rationaleGreeting = relationship ? `tailored for their bond as ${relationship}` : 'tailored for familiar warmth';

  // Multi-sensory taste bridge tailored to nationality and music style
  let aroma = 'Warm herbal steam and soothing lavender essence';
  let beverage = 'Steeped warm chamomile tea with honey';
  let texture = 'Holding a warm ceramic mug with both hands';

  if (patientNationality.includes('british') || patientNationality.includes('english') || patientNationality.includes('scottish')) {
    aroma = 'Fragrant bergamot steam from steeped Earl Grey tea & fresh lavender';
    beverage = 'Warm Earl Grey or English Breakfast tea with a dash of milk';
    texture = 'Smooth porcelain tea cup and warm wool knit throw';
  } else if (patientNationality.includes('mexican') || patientNationality.includes('latin') || patientNationality.includes('spanish')) {
    aroma = 'Crushed fresh mint (hierbabuena) and sweet cinnamon aroma';
    beverage = 'Warm té de manzanilla con canela or cool agua de frutas';
    texture = 'Velvety herb leaves and terracotta mug warmth';
  } else if (patientNationality.includes('italian')) {
    aroma = 'Fresh citrus zest, sweet anise, and roasted espresso bean warmth';
    beverage = 'Warm decaffeinated cappuccino or chamomile with lemon zest';
    texture = 'Smooth ceramic cup and soft cotton linen';
  }

  const intergenNote = caregiverName
    ? `${caregiverName} (${relationship}) and ${patientName || 'their loved one'} connect across generational perspectives by grounding in timeless melodies and sensory hospitality.`
    : `Bridges the age gap through universal sensory warmth and familiar cultural melodies.`;

  return {
    title: `${activityTypeDescription} with ${relatedItem}`,
    selectionRationale: `Drawn from ${primaryName}'s cultural resonance and ${rationaleGreeting}, creating an unhurried, comfortable atmosphere with ${toneDesc}.`,
    openingSentence: openingGreeting,
    conversationInvitations: [
      `"Would you like to relax and share this with me for a little while?"`,
      `"What does this melody or feeling bring to mind for you right now?"`
    ],
    practicalActivity: practicalStep,
    culturalReference: provenanceDetail,
    suggestedDurationMinutes: profile.durationMinutes,
    closingSentence: `We can leave this here for today. Thank you for sharing this lovely moment with me.`,
    caregiverNote: `Observe posture and eye contact. If the person closes their eyes peacefully, let the silence be enough. If they show signs of restlessness, conclude gently without fuss.`,
    isDemonstration: !isQlooLive,
    sourceProfile: profile,
    qlooVerified: isQlooLive && Boolean(seedEntity?.verified),
    multiSensoryBridge: {
      aromaOrScent: aroma,
      flavorOrBeverage: beverage,
      tactileTexture: texture,
      visualAtmosphere: 'Soft natural daylight near a comfortable window, free from glare or flickering screens',
      intergenerationalBridge: intergenNote,
      sensoryPacingNote: 'Low acoustic volume and unhurried acoustic rhythm to prevent cognitive fatigue.'
    }
  };
}
