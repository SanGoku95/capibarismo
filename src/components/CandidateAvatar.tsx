import { memo } from 'react';
import { cn } from '@/lib/utils';
import { UI_CLASSES } from '@/lib/constants';
import { OptimizedImage } from './OptimizedImage';

interface CandidateAvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12', 
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
} as const;

export const CandidateAvatar = memo(function CandidateAvatar({ 
  src, 
  alt, 
  size = 'md', 
  className = "" 
}: CandidateAvatarProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={cn(
        UI_CLASSES.ROUNDED_FULL_IMG,
        sizeClasses[size],
        className
      )}
      loading="lazy"
      sizes="(max-width: 768px) 48px, 64px"
    />
  );
});