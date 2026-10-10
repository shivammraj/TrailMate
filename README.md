# 🌿 TrailMate AI

> **An AI that wants you to put your phone down.**

[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%99%A5-green)] [![Next.js](https://img.shields.io/badge/Next.js-14-black)] [![Ollama](https://img.shields.io/badge/Ollama-Local%20AI-blue)]

## The Problem
Most AI apps are designed to keep you on your screen. TrailMate AI was built around the opposite principle.

## The Solution
An outdoor AI companion that generates real-world missions, encourages you to leave your phone behind, analyzes outdoor discoveries using open-weight AI, and rewards time spent outside.

## 🎬 Demo
![TrailMate Demo](/demo.gif)

The key demo: Turn off internet → Run local AI → Upload outdoor photo → AI identifies plant/bird → Mission progress updates.

## ✨ Features
- AI-generated outdoor missions (nature walks, bird hunting, plant exploration)
- Photo evidence capture with open-weight AI analysis
- Confidence scoring — honest uncertainty when AI isn't sure
- XP, streaks, and discovery collection
- Privacy-first: coarse location only, photos analyzed server-side
- **AI Mode switcher**: LOCAL (Ollama) | CLOUD (Gemini) | MOCK (always works)

## 🏗 Architecture

```
User → Selects Mission → AI generates it → Goes Outside → 
Captures Photo → Server-side AI analyzes → Mission progress → 
Complete → XP + Discovery saved
```

## 🤖 Open-Source AI

TrailMate uses open-weight AI as a real architectural dependency:

| Mode | How it works |
|------|-------------|
| LOCAL | Ollama + LLaVA running on your machine |
| CLOUD | Gemini Flash (optional fallback) |
| MOCK | Always works, no model needed |

### Why it matters:
- **Privacy**: In LOCAL mode, your outdoor photos never leave your device
- **Offline**: Trail with no signal? Local AI still works
- **Control**: Swap any model without rebuilding the app
- **Cost**: No per-request API fees in local mode

## 🚀 Local AI Setup

1. Install Ollama: https://ollama.com
2. Pull the vision model: `ollama pull llava`
3. Set AI_MODE=local in your .env.local
4. Start TrailMate: `npm run dev`

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Local AI | Ollama + LLaVA |
| Cloud AI | Gemini Flash (optional) |
| Maps | OpenStreetMap |
| Weather | Open-Meteo |
| Deploy | Vercel |

## 📦 Installation

```bash
git clone https://github.com/yourusername/TrailMate
cd TrailMate
npm install
cp .env.example .env.local
# Edit .env.local with your values
npm run dev
```

## ⚙️ Environment Variables

See .env.example. Required: none for MOCK mode. Optional: Supabase for persistence, Ollama for local AI, Gemini for cloud AI.

## 📁 Project Structure

```
├── docs/               # Architecture and testing specs
├── public/             # Static assets
└── src/
    ├── app/            # Next.js App Router (pages and api routes)
    ├── components/     # UI components
    └── lib/            # Utilities, database and AI logic
```

## 🔒 Privacy

- Location: coarse only (city-level, rounded to ~1km)
- Photos: analyzed server-side, not permanently stored
- LOCAL mode: photos processed on your machine, never transmitted

## ⚠️ Limitations

- Local AI (LLaVA) requires ~8GB RAM and performs best with GPU
- Local inference is slower (~5-30s depending on hardware)
- Plant/bird identification accuracy depends on photo quality
- Offline mode requires Ollama pre-installed and model downloaded

## 🙏 Contributors
Built for Hacktoberfest Open-Source AI Challenge — "Touch Grass"

## 📄 License
MIT
