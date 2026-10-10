import React from 'react';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  onRemove?: () => void;
}

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className = '', active = false, onRemove, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm transition-colors border focus:outline-none';
    
    const activeStyles = active 
      ? 'bg-[#2d7a4f]/30 border-[#3a9b63] text-white' 
      : 'glass-panel text-[#a8a29e] hover:text-white hover:border-[#a8a29e]';

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${activeStyles} ${className}`}
        {...props}
      >
        <span>{children}</span>
        {onRemove && (
          <span 
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="ml-1 hover:text-red-400 focus:text-red-400 p-0.5 rounded-full"
          >
            &times;
          </span>
        )}
      </button>
    );
  }
);

Chip.displayName = 'Chip';
