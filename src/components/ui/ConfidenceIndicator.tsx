'use client';

import React, { useEffect, useState } from 'react';

export interface ConfidenceIndicatorProps {
  confidence: number; // 0 to 1
  size?: number;
  className?: string;
}

export function ConfidenceIndicator({ 
  confidence, 
  size = 120,
  className = '' 
}: ConfidenceIndicatorProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  useEffect(() => {
    // Slight delay for entrance animation
    const timer = setTimeout(() => {
      setAnimatedValue(confidence);
    }, 100);
    return () => clearTimeout(timer);
  }, [confidence]);

  const radius = (size - 16) / 2; // subtract padding/stroke width
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedValue * circumference);
  const percentage = Math.round(animatedValue * 100);

  // Determine color based on confidence level
  let colorClass = 'text-[#8b5cf6]'; // Uncertain
  let statusText = 'Uncertain';
  
  if (confidence >= 0.7) {
    colorClass = 'text-[#52c27d]'; // High
    statusText = 'High Confidence';
  } else if (confidence >= 0.5) {
    colorClass = 'text-[#fbbf24]'; // Moderate
    statusText = 'Moderate';
  }

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Background track */}
        <svg className="absolute inset-0 transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-[#162d45]"
            strokeWidth="8"
            fill="none"
          />
        </svg>
        
        {/* Animated progress ring */}
        <svg className="absolute inset-0 transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={`transition-all duration-1000 ease-out ${colorClass} stroke-current`}
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-mono text-2xl font-bold text-white">{percentage}%</span>
        </div>
      </div>
      
      <span className={`mt-3 text-sm font-medium ${colorClass}`}>
        {statusText}
      </span>
    </div>
  );
}
