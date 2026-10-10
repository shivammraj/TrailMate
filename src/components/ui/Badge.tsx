import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant | 'easy' | 'medium' | 'hard';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'default', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold';
    
    // Map semantic variants
    let mappedVariant: BadgeVariant = 'default';
    if (variant === 'easy') mappedVariant = 'success';
    else if (variant === 'medium') mappedVariant = 'warning';
    else if (variant === 'hard') mappedVariant = 'error';
    else mappedVariant = variant as BadgeVariant;

    const variants = {
      success: 'bg-[#3a9b63]/20 text-[#86daa6] border border-[#3a9b63]/30',
      warning: 'bg-[#f59e0b]/20 text-[#fcd34d] border border-[#f59e0b]/30',
      error: 'bg-red-500/20 text-red-300 border border-red-500/30',
      info: 'bg-[#0ea5e9]/20 text-[#38bdf8] border border-[#0ea5e9]/30',
      default: 'bg-[#1e3d5c]/50 text-[#e7e5e4] border border-[#1e3d5c]',
    };

    return (
      <span
        ref={ref}
        className={`${baseStyles} ${variants[mappedVariant]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
