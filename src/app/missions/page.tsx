'use client';

import React from 'react';
import MissionCard from '@/components/mission/MissionCard';

export default function MissionsPage() {
  const missionTypes = [
    { id: 't1', title: 'Nature Walk', type: 'nature', desc: 'A peaceful stroll to observe plants and trees.', diff: 'easy', min: 20 },
    { id: 't2', title: 'Bird Hunt', type: 'bird', desc: 'Find and identify local birds.', diff: 'medium', min: 30 },
    { id: 't3', title: 'Plant Explorer', type: 'plant', desc: 'Discover rare flora around you.', diff: 'easy', min: 30 },
    { id: 't4', title: 'Photo Quest', type: 'photo', desc: 'Capture specific nature themes.', diff: 'medium', min: 45 },
    { id: 't5', title: 'Running Mission', type: 'run', desc: 'Get your heart rate up in nature.', diff: 'hard', min: 45 },
    { id: 't6', title: 'Custom Mission', type: 'custom', desc: 'AI generated surprise.', diff: 'medium', min: 30 },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-outfit font-bold text-stone-50">
          🗺️ Choose Mission
        </h1>
        <p className="text-stone-400">Select a template to generate a personalized outdoor quest.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missionTypes.map((m) => (
          <MissionCard 
            key={m.id}
            mission={{
              id: m.id,
              title: m.title,
              type: m.type,
              difficulty: m.diff,
              durationMinutes: m.min,
              xpReward: m.min * 5
            }}
          />
        ))}
      </div>
    </div>
  );
}
