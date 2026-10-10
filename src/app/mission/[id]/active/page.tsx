'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import CameraCapture from '@/components/capture/CameraCapture';
import AIAnalysisCard from '@/components/discovery/AIAnalysisCard';
import type { AIAnalysisResult } from '@/lib/types';
import { getSessionId } from '@/lib/utils';

type Tab = 'progress' | 'camera' | 'done';

const MOCK_OBJECTIVES = [
  { id: 'obj-1', description: 'Find and photograph a tree', completed: 0, count: 1 },
  { id: 'obj-2', description: 'Spot a bird', completed: 0, count: 1 },
  { id: 'obj-3', description: 'Find a flower or plant', completed: 0, count: 1 },
];

export default function ActiveMissionPage() {
  const router = useRouter();
  const params = useParams();
  const missionId = params?.id as string ?? 'mock-1';

  const [tab, setTab] = useState<Tab>('progress');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [objectives, setObjectives] = useState(MOCK_OBJECTIVES);
  const [completedCount, setCompletedCount] = useState(0);

  const totalCount = objectives.reduce((sum, o) => sum + o.count, 0);
  const allComplete = completedCount >= totalCount;

  const handleCapture = async (file: File) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisError(null);

    try {
      const sessionId = getSessionId();
      const formData = new FormData();
      formData.append('image', file);
      formData.append('objectiveId', objectives[completedCount]?.id ?? 'obj-1');
      formData.append('sessionId', sessionId);

      const res = await fetch(`/api/missions/${missionId}/evidence`, {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setAnalysisError(json.error ?? 'Analysis failed. Please try again.');
        return;
      }

      setAnalysisResult(json.data.analysis);
    } catch {
      setAnalysisError('Could not reach the AI. Check your connection or try mock mode in Settings.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddDiscovery = () => {
    if (!analysisResult) return;
    setCompletedCount(prev => Math.min(prev + 1, totalCount));
    setObjectives(prev => {
      const updated = [...prev];
      const idx = updated.findIndex(o => o.completed < o.count);
      if (idx !== -1) updated[idx] = { ...updated[idx], completed: updated[idx].completed + 1 };
      return updated;
    });
    setAnalysisResult(null);
    setTab('progress');
  };

  return (
    <div className="fixed inset-0 bg-[#0a1628] z-50 flex flex-col">

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-safe pt-6 pb-3 border-b border-white/10">
        <button
          onClick={() => router.back()}
          className="text-stone-400 hover:text-stone-50 text-sm transition-colors"
        >
          ← Exit
        </button>
        <span className="text-stone-400 text-sm font-medium">
          {completedCount}/{totalCount} complete
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto px-5 py-6">

        {/* Progress tab */}
        {tab === 'progress' && (
          <div className="flex flex-col items-center justify-center min-h-full space-y-8 animate-fade-in text-center">
            <div className="text-7xl animate-pulse">🌿</div>
            <div>
              <h1 className="font-outfit text-3xl font-bold text-stone-50 mb-2">Nature Walk Explorer</h1>
              <div className="flex justify-center gap-2 mt-4">
                {objectives.map((obj, i) => (
                  <div
                    key={obj.id}
                    className={`h-2 w-10 rounded-full transition-all duration-500 ${
                      obj.completed >= obj.count ? 'bg-[#3a9b63]' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
              <p className="text-stone-400 text-sm mt-3">{completedCount} of {totalCount} objectives</p>
            </div>

            {/* Objectives list */}
            <div className="w-full max-w-sm space-y-2 text-left">
              {objectives.map((obj) => (
                <div
                  key={obj.id}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl glass-card text-sm ${
                    obj.completed >= obj.count ? 'opacity-50' : ''
                  }`}
                >
                  <span className={obj.completed >= obj.count ? 'text-[#3a9b63]' : 'text-stone-500'}>
                    {obj.completed >= obj.count ? '✓' : '○'}
                  </span>
                  <span className={obj.completed >= obj.count ? 'line-through text-stone-500' : 'text-stone-200'}>
                    {obj.description}
                  </span>
                </div>
              ))}
            </div>

            {!allComplete && (
              <div className="space-y-2 pt-4">
                <p className="text-xl font-light text-stone-300">You have everything you need.</p>
                <p className="text-2xl font-bold text-[#3a9b63]">Put your phone away.</p>
                <p className="text-xl font-light text-stone-300">Go explore. 🌿</p>
              </div>
            )}

            {allComplete && (
              <div className="space-y-2">
                <p className="text-2xl font-bold text-[#fbbf24]">All objectives complete! 🎉</p>
                <p className="text-stone-300">Head back and finish your mission.</p>
              </div>
            )}
          </div>
        )}

        {/* Camera tab */}
        {tab === 'camera' && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center mb-4">
              <h2 className="font-outfit text-xl font-bold text-stone-50">Capture Evidence</h2>
              <p className="text-stone-400 text-sm mt-1">Take a photo or upload an image for AI analysis</p>
            </div>

            {!isAnalyzing && !analysisResult && (
              <CameraCapture onCapture={handleCapture} onError={setAnalysisError} />
            )}

            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="w-12 h-12 border-4 border-[#3a9b63] border-t-transparent rounded-full animate-spin" />
                <p className="text-stone-300 font-medium">AI is analyzing your discovery...</p>
                <p className="text-stone-500 text-sm">This may take a few seconds</p>
              </div>
            )}

            {analysisError && (
              <div className="glass-card rounded-xl p-4 border border-red-500/30 text-red-400 text-sm">
                <p className="font-medium mb-1">Analysis failed</p>
                <p>{analysisError}</p>
                <button
                  onClick={() => { setAnalysisError(null); }}
                  className="mt-3 text-stone-300 hover:text-white text-xs underline"
                >
                  Try again
                </button>
              </div>
            )}

            {analysisResult && !isAnalyzing && (
              <AIAnalysisCard
                analysis={analysisResult}
                onAddDiscovery={handleAddDiscovery}
              />
            )}
          </div>
        )}

        {/* Done tab */}
        {tab === 'done' && (
          <div className="flex flex-col items-center justify-center min-h-full space-y-6 animate-fade-in text-center">
            <div className="text-6xl">🎉</div>
            <div>
              <h1 className="font-outfit text-3xl font-bold text-[#fbbf24]">Mission Complete!</h1>
              <p className="text-stone-300 mt-2">You earned +100 XP</p>
            </div>
            <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
              <div className="glass-card rounded-xl p-3 text-center">
                <p className="text-[#3a9b63] font-bold text-lg">{completedCount}</p>
                <p className="text-stone-500 text-xs">Discoveries</p>
              </div>
              <div className="glass-card rounded-xl p-3 text-center">
                <p className="text-[#fbbf24] font-bold text-lg">100</p>
                <p className="text-stone-500 text-xs">XP Earned</p>
              </div>
              <div className="glass-card rounded-xl p-3 text-center">
                <p className="text-sky-400 font-bold text-lg">~30m</p>
                <p className="text-stone-500 text-xs">Outside</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/')}
              className="w-full max-w-xs py-4 bg-gradient-to-r from-[#2d7a4f] to-[#3a9b63] text-white font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all"
            >
              Return Home
            </button>
            <button
              onClick={() => router.push('/discover')}
              className="text-stone-400 hover:text-stone-200 text-sm transition-colors"
            >
              View my discoveries →
            </button>
          </div>
        )}
      </div>

      {/* Bottom tab bar */}
      <div className="flex-shrink-0 px-4 pb-safe pb-6 pt-3 border-t border-white/10">
        <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl backdrop-blur-md">
          {([
            { key: 'progress', label: 'Progress', icon: '📍' },
            { key: 'camera',   label: 'Camera',   icon: '📷' },
            { key: 'done',     label: 'Finish',   icon: '🏁' },
          ] as { key: Tab; label: string; icon: string }[]).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === t.key
                  ? t.key === 'done'
                    ? 'bg-[#fbbf24] text-stone-900'
                    : 'bg-[#3a9b63] text-white'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
