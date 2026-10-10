import React from 'react';

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showText?: boolean;
  className?: string;
}

export function ProgressBar({ 
  value, 
  max = 100, 
  label, 
  showText = true,
  className = '' 
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full ${className}`}>
      {(label || showText) && (
        <div className="flex justify-between items-center mb-1.5 text-sm">
          {label && <span className="font-medium text-stone-300">{label}</span>}
          {showText && <span className="text-stone-400 font-mono text-xs">{value}/{max}</span>}
        </div>
      )}
      <div className="h-2 w-full bg-[#0a1628] rounded-full overflow-hidden border border-[#162d45]">
        <div 
          className="h-full bg-gradient-to-r from-[#2d7a4f] to-[#52c27d] transition-all duration-500 ease-out relative"
          style={{ width: `${percentage}%` }}
        >
          {/* Shimmer effect overlay */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
      </div>
    </div>
  );
}
