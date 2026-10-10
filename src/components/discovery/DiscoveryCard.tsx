import React from 'react';

export default function DiscoveryCard({ discovery }: { discovery: any }) {
  const getEmoji = (cat: string) => {
    switch(cat) {
      case 'plant': return '🌳';
      case 'bird': return '🐦';
      case 'insect': return '🦋';
      default: return '🪨';
    }
  };

  return (
    <div className="glass-card p-4 rounded-2xl hover-lift flex flex-col items-center text-center gap-2">
      <div className="text-5xl my-2">{getEmoji(discovery.category)}</div>
      <div>
        <h3 className="font-outfit font-bold text-stone-100">{discovery.label}</h3>
        <p className="text-xs text-stone-400 mt-1">{new Date(discovery.date).toLocaleDateString()}</p>
      </div>
      <div className="w-full mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-[#3a9b63]" style={{ width: `${discovery.confidence * 100}%` }} />
      </div>
      <div className="text-[10px] text-stone-500 uppercase font-bold tracking-wider">{Math.round(discovery.confidence * 100)}% Match</div>
    </div>
  );
}
