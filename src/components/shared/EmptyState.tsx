import React from 'react';
import { Trees } from 'lucide-react';

export interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="glass-panel p-10 rounded-2xl flex flex-col items-center justify-center text-center w-full max-w-lg mx-auto">
      <div className="w-20 h-20 mb-6 flex items-center justify-center bg-gradient-to-br from-[#162d45] to-[#0f2137] rounded-full border border-[#1e3d5c]">
        {icon || <Trees className="text-[#52c27d] opacity-80" size={40} />}
      </div>
      
      <h3 className="text-xl font-bold text-white mb-3 font-outfit">{title}</h3>
      <p className="text-stone-400 mb-8 max-w-sm">{description}</p>
      
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
}
