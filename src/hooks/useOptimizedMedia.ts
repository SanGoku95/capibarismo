import { useState, useEffect, useMemo } from 'react';

/**
 * Simple hook for optimized media loading
 * Uses animated WebP (supported on iPhone iOS 14.5+, Android, and all desktop browsers)
 * with static poster fallback
 */

type OptimizedAssets = {
  poster: string;
  animWebp: string;
};

function deriveOptimizedAssets(poster: string): OptimizedAssets | null {
  // Supports both naming conventions:
  // Old: /path/NAME_poster_h480_q80.webp
  // New: /path/NAME_poster.webp
  const oldPattern = /^(.*\/)([^/]+?)_poster_h\d+_q\d+\.webp$/;
  const newPattern = /^(.*\/)([^/]+?)_poster\.webp$/;
  
  let match = poster.match(newPattern);
  if (match) {
    const [, dir, base] = match;
    return {
      poster,
      animWebp: `${dir}${base}_anim.webp`,
    };
  }

  match = poster.match(oldPattern);
  if (match) {
    const [, dir, base] = match;
    return {
      poster,
      animWebp: `${dir}${base}_anim_h480_fps15_q60.webp`,
    };
  }

  return null;
}

export enum MediaType {
  Poster,
  Anim,
}

export function useOptimizedMedia(mediaUrl: string | undefined, candidateId: string) {
  const assets = useMemo(() => (mediaUrl ? deriveOptimizedAssets(mediaUrl) : null), [mediaUrl]);

  const [mediaType, setMediaType] = useState<MediaType>(MediaType.Poster);
  const [isMotionReady, setMotionReady] = useState(false);

  useEffect(() => {
    setMotionReady(false);
    // Always use animated WebP if assets are available (works on all modern browsers)
    setMediaType(assets ? MediaType.Anim : MediaType.Poster);
  }, [assets, candidateId]);

  const handleAnimError = () => {
    setMediaType(MediaType.Poster); // Fallback to static poster
    setMotionReady(false);
  };

  const handleMotionReady = () => {
    setMotionReady(true);
  };

  return {
    assets,
    mediaType,
    isMotionReady,
    handleAnimError,
    handleMotionReady,
  };
}