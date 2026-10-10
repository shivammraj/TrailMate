'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function MissionCard({ mission, isActive = false, onClick }: { mission: any; isActive?: boolean; onClick?: () => void }) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) onClick();
    else router.push(`/mission/${mission.id}`);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-[#3a9b63]';
      case 'medium': return 'bg-[#f59e0b]';
      case 'hard': return 'bg-red-500';
      default: return 'bg-stone-500';
    }
  };

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
    <div 
      onClick={handleClick}
      className={`glass-card relative overflow-hidden rounded-2xl p-5 cursor-pointer hover-lift flex flex-col gap-3
        ${isActive ? 'border-[#3a9b63]/50 shadow-[0_0_15px_rgba(58,155,99,0.1)]' : ''}
      `}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getDifficultyColor(mission.difficulty)}`} />
      
      <div className="flex justify-between items-start pl-2">
        <div className="flex items-center gap-3">
          <div className="text-4xl bg-white/5 p-2 rounded-xl border border-white/10">
            {getIcon(mission.type)}
          </div>
          <div>
            <h3 className="font-outfit text-xl font-bold text-stone-50">{mission.title}</h3>
            <div className="flex items-center gap-2 text-xs text-stone-400 mt-1">
              <span className="capitalize">{mission.difficulty}</span>
              <span>•</span>
              <span>{mission.durationMinutes} min</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 px-2 py-1 rounded-lg text-xs font-bold border border-amber-500/20">
          <span>⭐</span> {mission.xpReward} XP
        </div>
      </div>
    </div>
  );
}
