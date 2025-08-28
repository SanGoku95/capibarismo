import { memo, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Optimized image component with loading states and error handling
 */
export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  className = "",
  loading = "lazy",
  sizes,
  fallbackSrc = "/placeholder.svg",
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);
  
  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  }, [onError]);
  
  const imageSrc = hasError ? fallbackSrc : src;
  
  return (
    <div className={cn("relative", className)}>
      {isLoading && (
        <div className={cn(
          "absolute inset-0 bg-muted/20 animate-pulse rounded-md",
          "flex items-center justify-center"
        )}>
          <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/20 border-t-muted-foreground animate-spin" />
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        loading={loading}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        decoding="async"
      />
    </div>
  );
});