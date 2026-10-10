import React from 'react';

export default function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 gap-4 text-stone-400">
      <div className="text-4xl animate-pulse">🌿</div>
      <div className="font-medium animate-pulse">{message}</div>
    </div>
  );
}
