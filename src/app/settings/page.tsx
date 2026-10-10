'use client';

import React, { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [aiMode, setAiMode] = useState('mock');

  useEffect(() => {
    const saved = localStorage.getItem('trailmate_ai_mode') || 'mock';
    setAiMode(saved);
  }, []);

  const handleModeChange = (mode: string) => {
    setAiMode(mode);
    localStorage.setItem('trailmate_ai_mode', mode);
  };

  return (
    <div className="animate-fade-in space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-outfit font-bold text-stone-50">
          ⚙️ Settings
        </h1>
        <p className="text-stone-400">Configure your TrailMate experience.</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-outfit font-semibold">AI Mode</h2>
        <div className="glass-card p-1 rounded-xl flex">
          {['mock', 'local', 'cloud'].map(mode => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${
                aiMode === mode 
                  ? 'bg-[#3a9b63] text-white shadow-lg' 
                  : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
        
        <div className="glass-card p-4 rounded-xl text-sm text-stone-300">
          {aiMode === 'mock' && "Mock Mode: No AI requests are made. Fast, but returns fake data. Best for UI testing."}
          {aiMode === 'local' && "Local Mode: Uses Ollama + LLaVA on your machine. Private, free, requires local setup."}
          {aiMode === 'cloud' && "Cloud Mode: Uses Gemini Flash API. Fast, accurate, requires API key."}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-outfit font-semibold">Privacy</h2>
        <div className="glass-card p-6 rounded-xl space-y-4 text-sm text-stone-300">
          <p>
            <strong>Photos:</strong> Are analyzed {aiMode === 'local' ? 'entirely on your device' : 'on our server'} and are not stored permanently.
          </p>
          <p>
            <strong>Location:</strong> Only rough city-level location is used to suggest nearby parks. Precise coordinates are never saved.
          </p>
        </div>
      </section>

      <section className="space-y-4 pb-12">
        <h2 className="text-xl font-outfit font-semibold">About</h2>
        <div className="glass-card p-6 rounded-xl text-center space-y-2">
          <div className="text-4xl mb-2">🌿</div>
          <h3 className="font-bold text-lg text-white">TrailMate AI</h3>
          <p className="text-stone-400 text-sm">Version 1.0.0-beta</p>
          <p className="text-stone-400 text-sm mt-4">Built for Hacktoberfest 2026</p>
          <a href="#" className="inline-block mt-4 text-[#3a9b63] hover:underline">View on GitHub</a>
        </div>
      </section>
    </div>
  );
}
