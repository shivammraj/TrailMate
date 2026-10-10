import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'solid' | 'highlight';
  hoverEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', hoverEffect = true, children, ...props }, ref) => {
    const baseStyles = 'rounded-2xl overflow-hidden transition-all duration-200';
    
    const variants = {
      default: 'glass-panel',
      glass: 'glass-panel',
      solid: 'bg-[#0f2137] border border-[#162d45]',
      highlight: 'glass-panel border-[#fbbf24]/40 shadow-[0_0_20px_rgba(245,158,11,0.1)]',
    };

    const hoverStyles = hoverEffect ? 'hover:-translate-y-[2px] hover:shadow-lg' : '';

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
