'use client';

import React from 'react';
import type { AIAnalysisResult } from '@/lib/types';
import { ConfidenceIndicator } from '@/components/ui/ConfidenceIndicator';

const CATEGORY_EMOJI: Record<string, string> = {
  plant: '🌿', bird: '🐦', insect: '🦋', fungus: '🍄',
  rock: '🪨', landscape: '🏔', animal: '🦎', texture: '🎨', other: '✨',
};

const MODE_BADGE: Record<string, { label: string; color: string }> = {
  mock: { label: 'MOCK', color: 'bg-stone-500/20 text-stone-400 border-stone-500/30' },
  local: { label: 'LOCAL AI', color: 'bg-[#2d7a4f]/20 text-[#52c27d] border-[#2d7a4f]/30' },
  cloud: { label: 'CLOUD AI', color: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
};

function getModelMode(model: string): string {
  if (model.startsWith('ollama/')) return 'local';
  if (model.includes('gemini')) return 'cloud';
  return 'mock';
}

interface AIAnalysisCardProps {
  analysis: AIAnalysisResult;
  onAddDiscovery?: () => void;
}

export default function AIAnalysisCard({ analysis, onAddDiscovery }: AIAnalysisCardProps) {
  if (!analysis) return null;

  const mode = getModelMode(analysis.model ?? '');
  const badge = MODE_BADGE[mode];
  const emoji = CATEGORY_EMOJI[analysis.category] ?? '✨';

  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
        <h3 className="font-outfit font-bold text-stone-50">AI Analysis</h3>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
          {badge.label}
        </span>
      </div>

      <div className="p-5 space-y-5">
        {/* Confidence ring + label */}
        <div className="flex items-center gap-5">
          <ConfidenceIndicator confidence={analysis.confidence} size={100} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{emoji}</span>
              <span className="text-xs font-medium uppercase tracking-wide text-stone-400">
                {analysis.category}
              </span>
            </div>
            <p className={`font-outfit text-2xl font-bold ${analysis.uncertain ? 'text-stone-400' : 'text-stone-50'}`}>
              {analysis.label}
            </p>
          </div>
        </div>

        {/* Description */}
        {analysis.description && !analysis.uncertain && (
          <p className="text-stone-300 text-sm leading-relaxed">{analysis.description}</p>
        )}

        {/* Mission relevance */}
        <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-xl ${
          analysis.missionRelevance
            ? 'bg-[#2d7a4f]/20 text-[#52c27d]'
            : 'bg-stone-500/10 text-stone-400'
        }`}>
          <span>{analysis.missionRelevance ? '✓' : '○'}</span>
          <span>{analysis.missionRelevance ? 'Counts toward mission objective' : 'Does not match mission objective'}</span>
        </div>

        {/* Processing time */}
        {analysis.processingTime > 0 && (
          <p className="text-stone-600 text-xs">
            Analyzed in {analysis.processingTime}ms · {analysis.model}
          </p>
        )}

        {/* Add to discoveries button */}
        {!analysis.uncertain && analysis.missionRelevance && onAddDiscovery && (
          <button
            onClick={onAddDiscovery}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#2d7a4f] to-[#3a9b63] text-white font-bold text-sm hover:opacity-90 active:scale-95 transition-all"
          >
            + Add to Discoveries
          </button>
        )}
      </div>
    </div>
  );
}
