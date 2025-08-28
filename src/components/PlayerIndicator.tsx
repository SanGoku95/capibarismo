import { memo } from 'react';
import { cn } from '@/lib/utils';
import { PLAYER_INDICATORS, type CandidateSide } from '@/lib/constants';

interface PlayerIndicatorProps {
  side: CandidateSide;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'circle' | 'badge';
}

const sizeClasses = {
  sm: 'w-4 h-4 text-xs',
  md: 'w-5 h-5 text-xs', 
  lg: 'w-16 h-16 text-xl',
} as const;

export const PlayerIndicator = memo(function PlayerIndicator({ 
  side, 
  size = 'md',
  className = "",
  variant = 'circle'
}: PlayerIndicatorProps) {
  const config = PLAYER_INDICATORS[side];
  
  if (variant === 'badge') {
    return (
      <div className={cn(
        "rounded-full flex items-center justify-center text-white font-bold",
        config.bgColor,
        sizeClasses[size],
        className
      )}>
        {config.label}
      </div>
    );
  }
  
  return (
    <div className={cn(
      "rounded-full flex items-center justify-center text-white font-bold",
      config.bgColor,
      sizeClasses[size],
      className
    )}>
      {config.number}
    </div>
  );
});