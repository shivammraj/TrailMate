'use client';

import React from 'react';
import Link from 'next/link';
import WeatherCard from '@/components/outdoor/WeatherCard';
import TabPFNSafetyScore from '@/components/ai/TabPFNSafetyScore';
import AudioNarrator from '@/components/audio/AudioNarrator';
import AITrailAssistant from '@/components/ai/AITrailAssistant';
import XPProgress from '@/components/shared/XPProgress';
import { Compass, Sparkles, MapPin, Award, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="animate-fade-in space-y-8 pb-12">
      {/* Header Banner */}
      <header className="relative rounded-3xl p-6 md:p-8 overflow-hidden glass-card border border-emerald-500/20 bg-gradient-to-r from-[#0c160e] via-[#122416] to-[#0c160e]">
        <div className="absolute top-0 right-0 w-80 h-full opacity-25 pointer-events-none bg-cover bg-center" style={{ backgroundImage: `url('/images/manali.jpg')` }} />
        <div className="relative z-10 space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>INDIAN OUTDOOR TRAILS & REAL-TIME WEATHER</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-outfit font-extrabold text-stone-50 tracking-tight leading-tight">
            Namaste, Explorer 🌿
          </h1>
          <p className="text-stone-300 text-base leading-relaxed">
            Your real-time Indian outdoor companion. Explore the Himalayas, Western Ghats, and tea garden trails powered by live weather APIs, ElevenLabs voice tours, and TabPFN ML safety analytics.
          </p>
        </div>
      </header>

      {/* 1. Real-Time Weather Widget */}
      <section className="space-y-4">
        <WeatherCard />
      </section>

      {/* 2. ElevenLabs Audio Trail Tour */}
      <section>
        <AudioNarrator
          title="Daily Audio Tour: Triund Ridge Trail, Himachal"
          textToNarrate="Namaste Explorer. Welcome to Triund Ridge Trail in Dharamshala, Himachal Pradesh. Current mountain weather is 18 degrees Celsius under clear skies. Expect magnificent views of the snow-draped Dhauladhar range. Carry 2 liters of water and wear sturdy trekking boots."
        />
      </section>

      {/* 3. Featured Real Indian Trail Card */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-outfit font-bold text-white flex items-center gap-2">
              Featured Indian Trail
            </h2>
            <p className="text-xs text-stone-400">Handpicked based on live Himalayan weather safety</p>
          </div>
          <Link href="/discover" className="text-emerald-400 text-sm font-semibold hover:underline flex items-center gap-1">
            <span>Explore All Indian Trails</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden border border-white/10 hover-lift grid grid-cols-1 md:grid-cols-12 gap-0">
          <div className="md:col-span-6 h-56 md:h-auto relative overflow-hidden">
            <img
              src="/images/manali.jpg"
              alt="Triund Ridge Trail Dharamshala"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-xs text-emerald-300 font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Safety Score 96/100</span>
            </div>
          </div>

          <div className="md:col-span-6 p-6 flex flex-col justify-between space-y-4 bg-gradient-to-br from-stone-900/90 to-stone-950/90">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Dharamshala, Himachal Pradesh • Moderate Ridge Trek</span>
              </div>
              <h3 className="text-xl font-outfit font-bold text-white">
                Triund Ridge Trek (Dhauladhar Views)
              </h3>
              <p className="text-stone-300 text-xs mt-2 leading-relaxed">
                Walk through oak forest canopy and rhododendron glades, leading up to panoramic vistas of the snow-capped Dhauladhar mountains and Kangra valley.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/10 text-center font-mono text-xs">
              <div>
                <span className="text-stone-400 text-[10px] block">Distance</span>
                <span className="font-bold text-stone-100">9.0 km</span>
              </div>
              <div>
                <span className="text-stone-400 text-[10px] block">Est. Time</span>
                <span className="font-bold text-stone-100">4h 00m</span>
              </div>
              <div>
                <span className="text-stone-400 text-[10px] block">Elevation</span>
                <span className="font-bold text-emerald-400">+1,100m</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <Link
                href="/discover"
                className="flex-1 text-center py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-emerald-950/50"
              >
                Start Himalayan Trail Navigation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TabPFN Tabular Safety Machine Learning Module */}
      <section className="space-y-4">
        <TabPFNSafetyScore />
      </section>

      {/* 5. Gemma AI Outdoor Assistant & Companion */}
      <section className="space-y-4">
        <AITrailAssistant />
      </section>

      {/* 6. Recent Indian Species Discoveries & Badges */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Discoveries */}
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/10">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-outfit font-bold text-white flex items-center gap-2">
              <span>🦚 Indian Wildlife & Flora Discoveries</span>
            </h3>
            <span className="text-xs text-stone-400 font-mono">Verified</span>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            <div className="glass-panel p-3 rounded-xl min-w-[150px] border border-white/10 hover-lift space-y-2">
              <img src="/images/blue_jay.jpg" alt="Himalayan Monal" className="w-full h-24 object-cover rounded-lg" />
              <div>
                <div className="font-semibold text-xs text-white truncate">Himalayan Monal</div>
                <div className="text-[10px] text-stone-400">Spotted at Manali</div>
              </div>
            </div>

            <div className="glass-panel p-3 rounded-xl min-w-[150px] border border-white/10 hover-lift space-y-2">
              <img src="/images/valley_of_flowers.jpg" alt="Buransh Flower" className="w-full h-24 object-cover rounded-lg" />
              <div>
                <div className="font-semibold text-xs text-white truncate">Buransh Rhododendron</div>
                <div className="text-[10px] text-stone-400">Uttarakhand Blossom</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress & Badge */}
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/10 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-outfit font-bold text-white">Himalayan Trekker Rank</h3>
            <div className="flex items-center gap-1 text-amber-400 font-semibold text-xs font-mono">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>7 Day Streak</span>
            </div>
          </div>

          <XPProgress currentXP={750} nextLevelXP={1000} level={4} />

          <div className="p-3 rounded-xl bg-stone-900/80 border border-white/10 flex items-center gap-3">
            <img src="/images/badge_ranger.jpg" alt="Himalayan Ranger Badge" className="w-12 h-12 rounded-lg object-cover border border-amber-500/40" />
            <div>
              <div className="text-xs font-bold text-white font-outfit">Himalayan Forest Ranger</div>
              <div className="text-[11px] text-stone-400">Unlocked for completing 5 weather-verified Indian high-altitude treks.</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
