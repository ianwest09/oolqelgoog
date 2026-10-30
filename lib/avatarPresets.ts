export interface AvatarPreset {
  id: string;
  label: string;
  category: 'patient' | 'caregiver' | 'general';
  dataUrl: string;
}

// Crisp, lightweight, dementia-friendly warm SVG illustrations encoded as clean data URIs
export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'elder_female_lavender',
    label: 'Gentle Matriarch (Lilac)',
    category: 'patient',
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="50" fill="#E8DEF8"/>
        <!-- Torso -->
        <path d="M22 92 C26 68, 74 68, 78 92 Z" fill="#6750A4"/>
        <path d="M42 68 Q50 74 58 68 Z" fill="#EAD6C9"/>
        <!-- Head -->
        <circle cx="50" cy="46" r="21" fill="#F8E5D8"/>
        <!-- Hair (Silver bun & soft curls) -->
        <path d="M28 42 C26 26, 74 26, 72 42 C70 32, 60 22, 50 22 C40 22, 30 32, 28 42 Z" fill="#D8D4DB"/>
        <circle cx="50" cy="20" r="9" fill="#D8D4DB"/>
        <!-- Face Features -->
        <circle cx="43" cy="45" r="2" fill="#4A3B32"/>
        <circle cx="57" cy="45" r="2" fill="#4A3B32"/>
        <!-- Glasses -->
        <circle cx="43" cy="45" r="5.5" fill="none" stroke="#6750A4" stroke-width="1.5"/>
        <circle cx="57" cy="45" r="5.5" fill="none" stroke="#6750A4" stroke-width="1.5"/>
        <path d="M48.5 45 L51.5 45" stroke="#6750A4" stroke-width="1.5"/>
        <!-- Smile -->
        <path d="M44 54 Q50 60 56 54" fill="none" stroke="#9A4444" stroke-width="1.8" stroke-linecap="round"/>
        <!-- Cheeks -->
        <circle cx="36" cy="50" r="3" fill="#F2B8B5" opacity="0.6"/>
        <circle cx="64" cy="50" r="3" fill="#F2B8B5" opacity="0.6"/>
      </svg>
    `)}`
  },
  {
    id: 'elder_male_sage',
    label: 'Gentle Patriarch (Sage)',
    category: 'patient',
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="50" fill="#E2EBE5"/>
        <!-- Torso Cardigan -->
        <path d="M22 92 C26 68, 74 68, 78 92 Z" fill="#2E5A44"/>
        <path d="M44 68 L50 82 L56 68 Z" fill="#EAE0D5"/>
        <!-- Head -->
        <circle cx="50" cy="46" r="21" fill="#F6E4D6"/>
        <!-- Silver Hair Side & Crest -->
        <path d="M28 44 C28 26, 72 26, 72 44 C68 28, 60 25, 50 25 C40 25, 32 28, 28 44 Z" fill="#CFD8D3"/>
        <!-- Features -->
        <circle cx="43" cy="45" r="2" fill="#362E2B"/>
        <circle cx="57" cy="45" r="2" fill="#362E2B"/>
        <!-- Friendly laugh lines & brows -->
        <path d="M38 39 Q43 37 47 39" stroke="#9FAEA6" stroke-width="1.5" fill="none"/>
        <path d="M53 39 Q57 37 62 39" stroke="#9FAEA6" stroke-width="1.5" fill="none"/>
        <!-- Gentle Smile -->
        <path d="M44 55 Q50 60 56 55" fill="none" stroke="#7A3E3E" stroke-width="2" stroke-linecap="round"/>
        <!-- Moustache -->
        <path d="M42 53 Q50 51 58 53 Q50 56 42 53 Z" fill="#C5D0CB"/>
      </svg>
    `)}`
  },
  {
    id: 'elder_warm_amber',
    label: 'Warm Elder (Amber)',
    category: 'patient',
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="50" fill="#FCEBD6"/>
        <!-- Torso -->
        <path d="M22 92 C26 68, 74 68, 78 92 Z" fill="#B45309"/>
        <path d="M42 68 Q50 73 58 68 Z" fill="#F5E4D7"/>
        <!-- Head -->
        <circle cx="50" cy="46" r="21" fill="#F5E4D7"/>
        <!-- Soft silver/white curly hair -->
        <path d="M27 45 C25 24, 75 24, 73 45 C69 27, 59 23, 50 23 C41 23, 31 27, 27 45 Z" fill="#E6DFD5"/>
        <!-- Features -->
        <circle cx="42" cy="46" r="2.2" fill="#3A2F2B"/>
        <circle cx="58" cy="46" r="2.2" fill="#3A2F2B"/>
        <!-- Warm smile -->
        <path d="M43 55 Q50 61 57 55" fill="none" stroke="#9A3B3B" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `)}`
  },
  {
    id: 'caregiver_daughter_emerald',
    label: 'Daughter / Aide (Emerald)',
    category: 'caregiver',
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="50" fill="#D8F3DC"/>
        <!-- Torso -->
        <path d="M22 92 C26 68, 74 68, 78 92 Z" fill="#1B4332"/>
        <path d="M42 68 Q50 74 58 68 Z" fill="#F9E8DE"/>
        <!-- Head -->
        <circle cx="50" cy="46" r="20" fill="#F9E8DE"/>
        <!-- Hair (Wavy brown) -->
        <path d="M26 48 C24 24, 76 24, 74 48 C77 60, 71 70, 68 72 C71 50, 68 30, 50 30 C32 30, 29 50, 32 72 C29 70, 23 60, 26 48 Z" fill="#4A3528"/>
        <!-- Eyes & Smile -->
        <circle cx="43" cy="45" r="2.2" fill="#2E241E"/>
        <circle cx="57" cy="45" r="2.2" fill="#2E241E"/>
        <path d="M44 54 Q50 59 56 54" fill="none" stroke="#A84343" stroke-width="2" stroke-linecap="round"/>
        <!-- Cheeks -->
        <circle cx="37" cy="49" r="3" fill="#F7AFAF" opacity="0.6"/>
        <circle cx="63" cy="49" r="3" fill="#F7AFAF" opacity="0.6"/>
      </svg>
    `)}`
  },
  {
    id: 'caregiver_son_navy',
    label: 'Son / Companion (Navy)',
    category: 'caregiver',
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="50" fill="#E0E7FF"/>
        <!-- Torso -->
        <path d="M22 92 C26 68, 74 68, 78 92 Z" fill="#1E3A8A"/>
        <path d="M42 68 Q50 73 58 68 Z" fill="#F7E6D8"/>
        <!-- Head -->
        <circle cx="50" cy="46" r="20" fill="#F7E6D8"/>
        <!-- Short dark hair -->
        <path d="M28 40 C28 24, 72 24, 72 40 C68 28, 59 26, 50 26 C41 26, 32 28, 28 40 Z" fill="#2C231E"/>
        <!-- Eyes & Smile -->
        <circle cx="43" cy="45" r="2.2" fill="#2C231E"/>
        <circle cx="57" cy="45" r="2.2" fill="#2C231E"/>
        <path d="M44 54 Q50 59 56 54" fill="none" stroke="#683333" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `)}`
  },
  {
    id: 'caregiver_grandchild_gold',
    label: 'Grandchild (Sunny Gold)',
    category: 'caregiver',
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="50" fill="#FEF3C7"/>
        <!-- Torso -->
        <path d="M22 92 C26 68, 74 68, 78 92 Z" fill="#D97706"/>
        <path d="M43 68 Q50 73 57 68 Z" fill="#FAE9DF"/>
        <!-- Head -->
        <circle cx="50" cy="46" r="20" fill="#FAE9DF"/>
        <!-- Ponytail or modern cut -->
        <path d="M27 42 C27 25, 73 25, 73 42 C67 27, 57 26, 50 26 C43 26, 33 27, 27 42 Z" fill="#78350F"/>
        <!-- Eyes & Smile -->
        <circle cx="43" cy="45" r="2.2" fill="#301A09"/>
        <circle cx="57" cy="45" r="2.2" fill="#301A09"/>
        <path d="M43 54 Q50 60 57 54" fill="none" stroke="#9A3412" stroke-width="2.2" stroke-linecap="round"/>
        <circle cx="36" cy="49" r="3" fill="#FCA5A5" opacity="0.6"/>
        <circle cx="64" cy="49" r="3" fill="#FCA5A5" opacity="0.6"/>
      </svg>
    `)}`
  },
  {
    id: 'companion_partner_rose',
    label: 'Loving Partner (Rose)',
    category: 'caregiver',
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="50" fill="#FFE4E6"/>
        <!-- Torso -->
        <path d="M22 92 C26 68, 74 68, 78 92 Z" fill="#9F1239"/>
        <path d="M43 68 Q50 73 57 68 Z" fill="#FBEAE0"/>
        <!-- Head -->
        <circle cx="50" cy="46" r="20" fill="#FBEAE0"/>
        <!-- Soft silver-tinted hair -->
        <path d="M27 44 C27 26, 73 26, 73 44 C67 28, 57 26, 50 26 C43 26, 33 28, 27 44 Z" fill="#94A3B8"/>
        <!-- Eyes & Gentle Heart -->
        <circle cx="43" cy="45" r="2.2" fill="#334155"/>
        <circle cx="57" cy="45" r="2.2" fill="#334155"/>
        <path d="M44 54 Q50 59 56 54" fill="none" stroke="#9F1239" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `)}`
  }
];

export function getInitials(name?: string, fallback = '?'): string {
  if (!name || !name.trim()) return fallback;
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
