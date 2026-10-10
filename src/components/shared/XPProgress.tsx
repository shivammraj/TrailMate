import React from 'react';

export default function XPProgress({ currentXP, nextLevelXP, level }: { currentXP: number, nextLevelXP: number, level: number }) {
  const percentage = Math.min(100, Math.round((currentXP / nextLevelXP) * 100));
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <div className="font-outfit font-bold text-xl text-stone-50">Level {level}</div>
        <div className="text-sm text-stone-400 font-medium">
          <span className="text-amber-500">{currentXP}</span> / {nextLevelXP} XP
        </div>
      </div>
      <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
        <div 
          className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
