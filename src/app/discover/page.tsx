'use client';

import React, { useState } from 'react';
import AudioNarrator from '@/components/audio/AudioNarrator';
import { MapPin, Search, ShieldCheck, Sparkles, Navigation, Compass } from 'lucide-react';

interface TrailItem {
  id: string;
  name: string;
  location: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  distanceKm: number;
  elevationMeters: number;
  estHours: string;
  safetyScore: number;
  image: string;
  category: 'Himalayas' | 'Western Ghats' | 'Forest' | 'Lake';
  narrative: string;
}

const INDIAN_TRAIL_CATALOG: TrailItem[] = [
  {
    id: 't1',
    name: 'Triund Ridge Trek (Dhauladhar Vistas)',
    location: 'Dharamshala, Himachal Pradesh',
    difficulty: 'Moderate',
    distanceKm: 9.0,
    elevationMeters: 1100,
    estHours: '4h 00m',
    safetyScore: 96,
    image: '/images/manali.jpg',
    category: 'Himalayas',
    narrative: 'Walk through oak forest canopy and rhododendron glades, leading up to panoramic vistas of the snow-capped Dhauladhar mountains.'
  },
  {
    id: 't2',
    name: 'Valley of Flowers National Park Trek',
    location: 'Chamoli, Uttarakhand',
    difficulty: 'Moderate',
    distanceKm: 14.0,
    elevationMeters: 1440,
    estHours: '6h 30m',
    safetyScore: 92,
    image: '/images/valley_of_flowers.jpg',
    category: 'Himalayas',
    narrative: 'UNESCO World Heritage high-altitude alpine valley blanketed in wild endemic flora, cascading waterfalls, and Himalayan snow peaks.'
  },
  {
    id: 't3',
    name: 'Kudremukh Horse-Face Peak Trek',
    location: 'Chikmagalur, Karnataka',
    difficulty: 'Hard',
    distanceKm: 18.5,
    elevationMeters: 920,
    estHours: '7h 00m',
    safetyScore: 89,
    image: '/images/manali.jpg',
    category: 'Western Ghats',
    narrative: 'Rolling emerald grassland hills, cloud forest shola patches, and pristine mountain streams across the Western Ghats biodiversity hotspot.'
  },
  {
    id: 't4',
    name: 'Munnar Chembra Peak & Tea Gardens Walk',
    location: 'Wayanad / Munnar, Kerala',
    difficulty: 'Easy',
    distanceKm: 6.2,
    elevationMeters: 380,
    estHours: '2h 30m',
    safetyScore: 98,
    image: '/images/forest.jpg',
    category: 'Western Ghats',
    narrative: 'Gentle winding trail through misty tea plantation estates leading to a natural heart-shaped mountain lake.'
  }
];

export default function DiscoveriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeAudioTrail, setActiveAudioTrail] = useState<TrailItem | null>(INDIAN_TRAIL_CATALOG[0]);

  const filteredTrails = INDIAN_TRAIL_CATALOG.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="animate-fade-in space-y-8 pb-12">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
          <Compass className="w-3.5 h-3.5" />
          <span>INDIAN HIKING & TREKKING CATALOG</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-outfit font-extrabold text-stone-50 tracking-tight">
          Discover Indian Trails & Field Guide
        </h1>
        <p className="text-stone-300 text-sm">
          Explore curated Indian mountain treks, Western Ghats trails, live weather safety scores, and listen to voice guides.
        </p>
      </header>

      {/* Audio Tour Player Banner */}
      {activeAudioTrail && (
        <section className="space-y-2">
          <div className="text-xs font-mono text-stone-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Active Voice Tour Selected</span>
          </div>
          <AudioNarrator
            title={`Voice Tour: ${activeAudioTrail.name}`}
            textToNarrate={activeAudioTrail.narrative}
          />
        </section>
      )}

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch justify-between">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Indian trail name or state (e.g. Himachal, Uttarakhand, Kerala)..."
            className="w-full bg-stone-900/90 border border-white/15 focus:border-emerald-500/60 rounded-xl px-4 py-2.5 pl-10 text-xs text-stone-100 placeholder-stone-400 outline-none shadow-inner"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {['All', 'Himalayas', 'Western Ghats'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                  : 'bg-stone-900/70 text-stone-300 border-white/10 hover:bg-stone-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Trail Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTrails.map((trail) => (
          <div
            key={trail.id}
            className="glass-card rounded-2xl overflow-hidden border border-white/10 hover-lift flex flex-col justify-between"
          >
            <div className="h-48 relative overflow-hidden">
              <img
                src={trail.image}
                alt={trail.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-xs text-emerald-300 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Safety {trail.safetyScore}/100</span>
              </div>
              <div className="absolute top-3 right-3 bg-stone-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-xs text-amber-300 font-mono">
                {trail.difficulty}
              </div>
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between bg-stone-900/60">
              <div>
                <div className="flex items-center gap-1 text-xs text-emerald-400 font-mono mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{trail.location}</span>
                </div>
                <h3 className="font-outfit font-bold text-stone-100 text-lg">{trail.name}</h3>
                <p className="text-xs text-stone-300 mt-1 line-clamp-2 leading-relaxed">
                  {trail.narrative}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/10 text-center font-mono text-xs">
                <div>
                  <span className="text-[10px] text-stone-400 block">Distance</span>
                  <span className="font-semibold text-white">{trail.distanceKm} km</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">Time</span>
                  <span className="font-semibold text-white">{trail.estHours}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">Climb</span>
                  <span className="font-semibold text-emerald-400">+{trail.elevationMeters}m</span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setActiveAudioTrail(trail)}
                  className="flex-1 py-2 bg-emerald-700/60 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold transition-all border border-emerald-500/30 flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Listen Voice Tour</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
