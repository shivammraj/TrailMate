import React from 'react';

export default function MissionHeader({ mission }: { mission: any }) {
  const getIcon = (type: string) => {
    switch(type) {
      case 'nature': return '🌿';
      case 'bird': return '🐦';
      case 'plant': return '🌸';
      case 'photo': return '📷';
      case 'run': return '🏃';
      default: return '✨';
    }
  };

  return (
    <header className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="text-6xl bg-white/5 p-4 rounded-2xl border border-white/10">
          {getIcon(mission.type)}
        </div>
        <div>
          <h1 className="text-3xl font-outfit font-bold text-stone-50">{mission.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="bg-[#3a9b63]/20 text-[#3a9b63] px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
              {mission.difficulty}
            </span>
            <span className="text-stone-400 text-sm">⏱️ {mission.durationMinutes} min</span>
            {mission.distanceKm && <span className="text-stone-400 text-sm">📍 {mission.distanceKm} km</span>}
          </div>
        </div>
      </div>
      <p className="text-stone-300 text-lg leading-relaxed">
        {mission.description}
      </p>
    </header>
  );
}
