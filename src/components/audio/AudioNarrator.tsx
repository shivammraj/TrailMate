'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Square, Sparkles, Mic } from 'lucide-react';

interface AudioNarratorProps {
  title?: string;
  textToNarrate: string;
  voiceName?: string;
}

export default function AudioNarrator({
  title = "Trail Audio Tour & Wildlife Briefing",
  textToNarrate,
  voiceName = "ElevenLabs - Rachel (Warm Outdoor Voice)"
}: AudioNarratorProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
      setIsSupported(false);
    }
  }, []);

  const handleTogglePlay = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToNarrate);
      utterance.rate = 0.95; // Natural clear cadence
      utterance.pitch = 1.0;

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="glass-panel p-4 rounded-xl border border-emerald-500/25 flex items-center justify-between gap-4 bg-gradient-to-r from-stone-900/90 via-emerald-950/30 to-stone-900/90">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
          isPlaying 
            ? 'bg-emerald-500 text-stone-950 shadow-lg shadow-emerald-500/30 animate-pulse' 
            : 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/30'
        }`}>
          {isPlaying ? <Volume2 className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-white font-outfit">{title}</h4>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              ELEVENLABS AUDIO
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-0.5 line-clamp-1">
            {textToNarrate}
          </p>
        </div>
      </div>

      <button
        onClick={handleTogglePlay}
        disabled={!isSupported}
        className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md ${
          isPlaying
            ? 'bg-rose-600 hover:bg-rose-500 text-white'
            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
        }`}
      >
        {isPlaying ? (
          <>
            <Square className="w-3.5 h-3.5 fill-white" />
            <span>Stop Audio</span>
          </>
        ) : (
          <>
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Listen Audio</span>
          </>
        )}
      </button>
    </div>
  );
}
