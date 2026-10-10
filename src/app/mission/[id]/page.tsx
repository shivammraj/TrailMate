'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import WeatherCard from '@/components/outdoor/WeatherCard';
import MissionHeader from '@/components/mission/MissionHeader';

export default function MissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  // Mock mission based on params
  const mission = {
    id: params.id as string,
    title: 'Nature Walk Explorer',
    type: 'nature',
    description: 'A 30-minute walk through your local park to spot early spring blooms and listen to bird calls.',
    difficulty: 'easy',
    durationMinutes: 30,
    distanceKm: 2.5,
    xpReward: 150,
    objectives: [
      'Find a broadleaf tree',
      'Spot a local bird',
      'Walk 1000 steps in nature'
    ]
  };

  return (
    <div className="animate-fade-in space-y-6 pb-20">
      <MissionHeader mission={mission} />
      
      <section>
        <WeatherCard />
      </section>

      <section className="glass-card p-6 rounded-2xl space-y-4">
        <h2 className="text-xl font-outfit font-bold">Objectives</h2>
        <ul className="space-y-3">
          {mission.objectives.map((obj, i) => (
            <li key={i} className="flex gap-3 text-stone-300 items-start">
              <span className="text-[#3a9b63] mt-1">○</span>
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </section>
      
      <section className="glass-card p-6 rounded-2xl border-amber-500/30">
        <h3 className="font-outfit font-bold text-amber-500 mb-2">🌿 AI Tip</h3>
        <p className="text-sm text-stone-400">
          Make sure your phone is charged. Once you start, you'll be encouraged to put it away until you find something worth capturing.
        </p>
      </section>

      <button 
        onClick={() => router.push(`/mission/${mission.id}/active`)}
        className="w-full py-4 bg-[#3a9b63] hover:bg-[#2d7a4f] text-white font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(58,155,99,0.4)] transition-all hover-lift"
      >
        Start Mission
      </button>
    </div>
  );
}
