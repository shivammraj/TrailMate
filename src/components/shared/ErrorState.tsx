import React from 'react';

export default function ErrorState({ message = 'Something went wrong.', onRetry }: { message?: string, onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 gap-4 text-center">
      <div className="text-4xl">🍂</div>
      <h3 className="font-bold text-red-400">{message}</h3>
      {onRetry && (
        <button onClick={onRetry} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors mt-2">
          Try Again
        </button>
      )}
    </div>
  );
}
