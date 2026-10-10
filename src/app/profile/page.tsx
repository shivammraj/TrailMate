import React from 'react';
import XPProgress from '@/components/shared/XPProgress';

export default function ProfilePage() {
  return (
    <div className="animate-fade-in space-y-8">
      <header className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#3a9b63] to-[#2d7a4f] flex items-center justify-center text-4xl shadow-lg border-2 border-white/20">
          🦊
        </div>
        <div>
          <h1 className="text-3xl font-outfit font-bold text-stone-50">Nature Explorer</h1>
          <p className="text-stone-400">Joined October 2026</p>
        </div>
      </header>

      <section className="glass-card p-6 rounded-2xl">
        <XPProgress currentXP={450} nextLevelXP={1000} level={3} />
      </section>

      <section className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 rounded-xl text-center">
          <div className="text-3xl mb-1">⏱️</div>
          <div className="text-2xl font-bold font-outfit">145</div>
          <div className="text-xs text-stone-400 uppercase tracking-wider">Minutes Outside</div>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <div className="text-3xl mb-1">🗺️</div>
          <div className="text-2xl font-bold font-outfit">12</div>
          <div className="text-xs text-stone-400 uppercase tracking-wider">Missions Done</div>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <div className="text-3xl mb-1">🔍</div>
          <div className="text-2xl font-bold font-outfit">28</div>
          <div className="text-xs text-stone-400 uppercase tracking-wider">Discoveries</div>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <div className="text-3xl mb-1">🔥</div>
          <div className="text-2xl font-bold font-outfit text-amber-500">5</div>
          <div className="text-xs text-stone-400 uppercase tracking-wider">Day Streak</div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-outfit font-semibold">Achievements</h2>
        <div className="grid grid-cols-1 gap-3">
          {[
            { icon: '🌱', title: 'First Steps', desc: 'Completed your first mission.' },
            { icon: '🦅', title: 'Eagle Eye', desc: 'Identified 5 birds correctly.' },
            { icon: '🌧️', title: 'Weather Proof', desc: 'Completed a mission in the rain.' }
          ].map((a, i) => (
            <div key={i} className="glass-card p-4 rounded-xl flex items-center gap-4">
              <div className="text-4xl bg-white/5 p-2 rounded-lg">{a.icon}</div>
              <div>
                <h4 className="font-bold text-stone-100">{a.title}</h4>
                <p className="text-sm text-stone-400">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
