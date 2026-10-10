# TrailMate AI — Architecture

> **"An AI that wants you to put your phone down. 🌿"**

---

## 1. Project Overview

TrailMate AI is an open-source outdoor companion that generates real-world missions, encourages users to leave their screens, analyzes outdoor discoveries using open-weight AI, and rewards time spent outside.

**Hackathon:** Hacktoberfest Open-Source AI Challenge — "Touch Grass"

**Core principle:** AI should reduce screen time, not increase it.

---

## 2. Confirmed Technology Decisions

| Layer | Technology | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | Server components, API routes, streaming |
| Language | TypeScript (strict mode) | Type safety across all agents |
| Styling | Tailwind CSS | Utility-first, fast iteration |
| Database | Supabase (PostgreSQL) | User already has project ready |
| Auth | Anonymous session (localStorage UUID) | Fastest demo, no login friction |
| Local AI | Ollama + LLaVA | Free, runs on most laptops, multimodal vision |
| Cloud AI fallback | Gemini Flash | Optional, server-side only |
| Maps | Leaflet + OpenStreetMap | Free, open, no API key |
| Weather | Open-Meteo | Free, no API key, accurate |
| Deployment | Vercel | Free tier, one-click |

---

## 3. Folder Structure

```
src/
  app/                        # Next.js App Router pages & API routes
    page.tsx                  # Home/landing
    missions/page.tsx         # Mission discovery
    mission/[id]/page.tsx     # Mission detail
    mission/[id]/active/page.tsx  # Active mission (minimal UI)
    discover/page.tsx         # All discoveries
    profile/page.tsx          # User profile & stats
    settings/page.tsx         # AI mode, privacy settings
    api/
      missions/route.ts       # GET all, POST create
      missions/[id]/route.ts  # GET single mission
      missions/[id]/start/route.ts      # POST start mission
      missions/[id]/evidence/route.ts   # POST add evidence
      missions/[id]/complete/route.ts   # POST complete mission
      discoveries/route.ts    # GET discoveries
      profile/route.ts        # GET profile stats
      ai/analyze/route.ts     # POST analyze image (proxies to AI layer)

  components/
    mission/                  # MissionCard, MissionProgress, MissionHeader
    discovery/                # DiscoveryCard, EvidenceCard, AIAnalysisCard
    outdoor/                  # WeatherCard, MapCard, OutdoorStats
    capture/                  # CameraCapture, ImageUpload
    ui/                       # Button, Card, Badge, Chip, BottomNav, Sidebar
    layout/                   # AppShell, PageContainer
    shared/                   # LoadingState, ErrorState, EmptyState, XPProgress

  lib/
    ai/
      provider.ts             # AIProvider interface (THE abstraction — use this)
      index.ts                # Factory: reads AI_MODE env, returns correct provider
      local/index.ts          # LocalAIProvider (Ollama + LLaVA)
      cloud/index.ts          # CloudAIProvider (Gemini Flash — optional)
      mock/index.ts           # MockAIProvider (always works, no model needed)
      prompts/                # Prompt templates (mission gen, analysis, etc.)
      validation/             # Zod schemas for structured AI output
    maps/
      locationService.ts      # Geolocation, permission handling
      mapService.ts           # OSM, nearby parks via Overpass API
    weather/
      weatherService.ts       # Open-Meteo integration
    missions/
      missionService.ts       # Mission CRUD client-side wrapper
      outdoorMissionService.ts # Location-aware mission generation
    discovery/
      discoveryService.ts     # Discovery CRUD
    supabase/
      client.ts               # Supabase browser client
      server.ts               # Supabase server client (for API routes)
    types/
      index.ts                # ALL TypeScript interfaces live here
    utils/
      index.ts                # Shared utilities (distance calc, formatting)

database/
  schema/001_initial.sql      # Full PostgreSQL schema
  seed/seed.sql               # Development seed data

docs/
  ARCHITECTURE.md             # THIS FILE — all agents must read this
  AI_ARCHITECTURE.md          # Why open-weight AI matters
  LOCAL_AI.md                 # How to run Ollama + LLaVA locally
  OUTDOOR_DATA.md             # OSM, Open-Meteo, Geolocation guide
  TESTING.md                  # Test commands and results
  DEMO_SCRIPT.md              # 90-second judge presentation

tests/                        # Test files
public/                       # Static assets
.env.example                  # Template — COMMIT THIS
.env.local                    # Real secrets — NEVER COMMIT
```

---

## 4. Data Flow

```
[User] → opens app → anonymous session created (localStorage UUID)
  ↓
[Home] → shows today's mission + weather + recent discoveries
  ↓
[Mission Discovery] → user selects type + difficulty
  ↓
[API: POST /api/missions] → server calls getAIProvider().generateMission(context)
  ↓
[Mission Detail] → shows objectives, weather, distance, start button
  ↓
[API: POST /api/missions/:id/start] → saves startedAt to Supabase
  ↓
[Active Mission] → MINIMAL UI → "Go outside" message
  ↓
[Evidence Capture] → camera / upload → image as base64
  ↓
[API: POST /api/ai/analyze] → server calls getAIProvider().analyzeOutdoorImage(base64)
  → returns AIAnalysisResult { label, confidence, category, description }
  ↓
[API: POST /api/missions/:id/evidence] → saves evidence + analysis to Supabase
  ↓
[AI Analysis Result] → shown to user with confidence indicator
  ↓
[Mission Progress updated] → objectives[n].completed++
  ↓
[API: POST /api/missions/:id/complete] → calculates XP, updates streak, saves discovery
  ↓
[Mission Complete] → XP animation, discovery added
  ↓
[Profile] → updated stats
```

---

## 5. AI Abstraction Rules (CRITICAL — ALL AGENTS MUST FOLLOW)

### Rule 1: NEVER call an AI model from frontend/component code
```typescript
// ❌ WRONG — never do this in a component or page
const result = await ollama.generate({ model: 'llava', ... });

// ✅ CORRECT — call the API route
const result = await fetch('/api/ai/analyze', { method: 'POST', body: formData });
```

### Rule 2: NEVER put AI credentials in client-side code
```typescript
// ❌ WRONG
const GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// ✅ CORRECT — server-only
const GEMINI_KEY = process.env.GEMINI_API_KEY; // in API route only
```

### Rule 3: Always use the AIProvider interface
```typescript
// In API routes:
import { getAIProvider } from '@/lib/ai';
const ai = getAIProvider();
const result = await ai.analyzeOutdoorImage(base64);
```

### Rule 4: Confidence below 0.5 = "uncertain"
```typescript
if (result.confidence < 0.5) {
  result.uncertain = true;
  result.label = 'Unknown — try a clearer photo';
}
```

---

## 6. API Contracts

### POST /api/missions
```typescript
// Request
{ type: MissionType; difficulty: MissionDifficulty; availableTime: number; location?: CoarseLocation }
// Response: APIResponse<Mission>
```

### GET /api/missions
```typescript
// Response: APIResponse<Mission[]>
```

### GET /api/missions/:id
```typescript
// Response: APIResponse<Mission>
```

### POST /api/missions/:id/start
```typescript
// Request: { sessionId: string }
// Response: APIResponse<Mission>
```

### POST /api/missions/:id/evidence
```typescript
// Request: FormData { image: File; objectiveId: string; sessionId: string }
// Response: APIResponse<{ evidence: Evidence; analysis: AIAnalysisResult }>
```

### POST /api/missions/:id/complete
```typescript
// Request: { sessionId: string }
// Response: APIResponse<{ xpEarned: number; discoveries: Discovery[]; stats: ProfileStats }>
```

### POST /api/ai/analyze
```typescript
// Request: FormData { image: File; context?: string }
// Response: APIResponse<AIAnalysisResult>
```

### GET /api/discoveries
```typescript
// Query: ?sessionId=string
// Response: APIResponse<Discovery[]>
```

### GET /api/profile
```typescript
// Query: ?sessionId=string
// Response: APIResponse<ProfileStats>
```

---

## 7. Environment Variables

```bash
# .env.local (NEVER commit this)

AI_MODE=mock              # local | cloud | mock
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llava        # multimodal vision model

GEMINI_API_KEY=           # optional cloud fallback

SUPABASE_URL=             # from Supabase project settings
SUPABASE_ANON_KEY=        # from Supabase project settings
SUPABASE_SERVICE_ROLE_KEY= # server-side only

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 8. Session Management

No login required. Session = UUID stored in `localStorage`.

```typescript
// lib/utils/session.ts
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('trailmate_session');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('trailmate_session', id);
  }
  return id;
}
```

All API calls include `sessionId` in the request body or query params.

---

## 9. Database Schema Summary

```sql
users           -- session_id, xp, streak, outdoor_minutes
missions        -- type, title, description, difficulty, status, xp_reward
mission_objectives -- mission_id, description, type, count, completed
evidence        -- mission_id, objective_id, ai_label, ai_confidence, verified
discoveries     -- user_id, mission_id, label, category, confidence, location (coarse)
achievements    -- user_id, type, title, unlocked_at
outdoor_sessions -- user_id, mission_id, started_at, ended_at, distance_km
```

---

## 10. MVP Acceptance Criteria

- [ ] User can open app without login
- [ ] User can select a mission type and difficulty
- [ ] AI generates a structured mission with objectives
- [ ] User can start a mission
- [ ] User can capture/upload a photo as evidence
- [ ] Server-side AI analyzes the photo and returns structured result
- [ ] AI result shows label, confidence, category, description
- [ ] Mission progress updates when evidence is verified
- [ ] User can complete the mission
- [ ] XP is awarded on completion
- [ ] Discovery is saved and visible in Discoveries screen
- [ ] Profile shows updated stats
- [ ] App gracefully handles: AI offline, location denied, camera denied
- [ ] Build passes: `npm run build`
- [ ] TypeScript passes: `npm run type-check`

---

## 11. Privacy Rules

- Location is only accessed after explicit user permission
- Only coarse location (city-level) is stored in the database
- Precise GPS coordinates are never persisted
- Photos are analyzed server-side and not stored permanently unless user confirms
- Local AI mode: photos never leave the device (processed on-device via Ollama)

---

## 12. Integration Rules Between Agents

| From | To | Method |
|---|---|---|
| Frontend component | API route | `fetch('/api/...')` |
| API route | AI layer | `getAIProvider()` |
| API route | Database | `createServerSupabaseClient()` |
| Frontend | Location | `locationService.getLocation()` |
| Frontend | Weather | Displayed via WeatherCard from `/api/weather` if added |
| AI route | Ollama | HTTP to `OLLAMA_BASE_URL` (server-side only) |
| AI route | Gemini | Gemini SDK (server-side only) |

**Never:**
- Call Supabase directly from components (use API routes)
- Call AI models from components
- Store API keys in `NEXT_PUBLIC_*` env vars
- Use `any` type in TypeScript

---

## 13. AI Mode Switcher (visible in Settings)

The Settings page must show the current AI mode and allow switching:

```
AI Mode: [LOCAL] [CLOUD] [MOCK]
```

This sets a user preference stored in localStorage that is sent with AI analysis requests.

Only show modes that are actually configured/available.

---

*Last updated by Agent 1 (Architect). All agents must follow rules in this document.*
