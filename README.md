# Kinship: Moments of Connection

> *A familiar interest. A meaningful moment. A little closer together.*

Kinship is an AI-assisted cultural connection tool for families and caregivers supporting older adults, including people living with Alzheimer's disease and other forms of dementia.

The application turns family-confirmed cultural interests into simple, personalised activities that encourage warm, dignified interaction between people.

---

## 1. Ethical Foundation & Supportive Boundaries

Kinship is designed as a **supportive companion tool**, **NOT** a medical device, diagnostic product, cognitive assessment, memory-restoration treatment, or substitute for professional clinical care.

### Core Guarantees:
- **No Memory Quizzing:** We never ask testing questions such as *"Do you remember who sang this?"* or *"What year was this?"*, which can produce anxiety and frustration. Every prompt is framed as an open invitation to share or simply be together.
- **Grounding in Real Taste:** Cultural preferences are based strictly on interests supplied by the family or caregiver. We never infer tastes from age, race, diagnosis, or stereotypes.
- **Autonomy & Agency:** The person can pause, decline, or stop the activity at any time. Caregiver notes provide guidance on reading subtle comfort cues.
- **Privacy by Default:** Zero tracking, zero analytics pixels, and no collection of full patient names or medical diagnoses. Saved moments reside strictly in the browser's local storage.

---

## 2. Architecture & The 5-Step Agentic Workflow

Kinship coordinates cultural intelligence from **Qloo** and reasoning from **Google Gemini**:

```
[Family-Confirmed Profile]
           │
           ▼
[Step 1: Interest & Atmosphere Analysis]
           │
           ▼
[Step 2: Qloo Entity Resolution (/search)]
           │
           ▼
[Step 3: Qloo Taste Exploration (/v2/insights)]
           │
           ▼
[Step 4: Gemini Activity Synthesis (gemini-3.8-flash)]
           │
           ▼
[Step 5: Dignity & Exclusions Filter]
           │
           ▼
[Connection Moment Card]
```

1. **Understanding Selected Interests:** Interprets primary cultural interests, secondary sensory hobbies, duration (5, 10, or 15 mins), and atmosphere (calm, cheerful, reflective, playful).
2. **Qloo Entity Resolution:** Queries the official Qloo Entity Search API (`https://hackathon.api.qloo.com/search`) to resolve the cultural reference into a verified entity ID, retaining canonical metadata.
3. **Qloo Taste Exploration:** Queries Qloo's Insights API (`https://hackathon.api.qloo.com/v2/insights`) to uncover cross-domain taste correlations, preserving transparent data provenance.
4. **Gemini Language Synthesis:** Gemini formats the verified taste pairings into a structured, dementia-friendly activity card containing an opening spoken invitation, practical sensory action, and unhurried closing sentence.
5. **Dignity & Exclusions Filter:** Programmatically checks that no user-specified exclusions are violated and verifies that no memory-testing questions were generated.

---

## 3. Demonstration Mode

When `QLOO_API_KEY` is not present, Kinship runs in **Demonstration Mode**:
- An unmistakable banner is displayed: *"DEMONSTRATION MODE — sample results; live Qloo integration is not active."*
- Realistic, clearly identified illustrative profiles (e.g., Vera's Big Band tea garden, Arthur's maritime acoustic folk) allow full exploration.
- No fabricated API responses or fake affinity scores are ever described as live Qloo data.

When valid credentials are provided, live Qloo API calls execute automatically, accompanied by a verified provenance badge on the resulting activity card.

---

## 4. Environment Variables

Create a `.env.local` file (or set variables in your deployment dashboard):

```bash
# Gemini AI API Key for activity synthesis
GEMINI_API_KEY="your-gemini-api-key"

# Qloo Hackathon Taste Intelligence API Key
QLOO_API_KEY="your-qloo-api-key"

# App URL
APP_URL="http://localhost:3000"
```

---

## 5. Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

---

## 6. Implemented Features & Current Scope

### Implemented:
- Responsive, mobile-first design tested for narrow Android viewports and desktop browsers.
- Screen A: Calm Welcome Screen with non-quizzing philosophy and sample profiles.
- Screen B: Cultural Profile Builder with large touch targets, duration options, atmosphere selectors, and exclusion inputs.
- Screen C: Multi-Step Agent Workflow Indicator displaying verified progress and status.
- Screen D: Complete Connection Moment Card with opening invitation, practical shared activity, provenance notes, and "Stop or change activity" controls.
- Screen E: Saved Moments with device-only local storage, individual item deletion, and full reset capabilities.
- Live server-side Qloo API integration (`/search` and `/v2/insights`).
- Server-side Gemini integration (`gemini-3.8-flash`) with structured schema output and deterministic fallback.
- Dignified color palette (soft cream canvas, deep forest green accents, high contrast typography).

### Remaining Scope & Future Opportunities:
- Integration with local audio playback widgets via Spotify Web Playback SDK when authorized by the family.
- Multilingual audio read-aloud via Gemini TTS for caregivers who prefer spoken audio guidance.
- Printable PDF caregiver cards for offline sharing in memory care residences.

---

## 7. License

Released under the [MIT License](LICENSE).
