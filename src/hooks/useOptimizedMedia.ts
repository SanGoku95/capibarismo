import { useState, useEffect, useMemo } from 'react';

type OptimizedAssets = {
  poster: string;
  webm: string;
  animWebp: string;
};

function deriveOptimizedAssets(poster: string): OptimizedAssets | null {
  // expects: /.../NAME_poster_h432_q80.webp
  const m = poster.match(/^(.*\/)([^/]+?)_poster_(h\d+)_q\d+\.webp$/);
  if (!m) return null;

  const [, dir, base, h] = m;

  return {
    poster,
    webm: `${dir}${base}_vp9_alpha_${h}_fps15_crf35.webm`,
    animWebp: `${dir}${base}_anim_${h}_fps15_q60.webp`,
  };
}

// Detect iOS/iPadOS (Safari doesn't properly support VP9 alpha)
const isIOS = (() => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
})();

// Memoized check for WebM VP9 support (excluding iOS which has broken alpha support)
const canPlayWebmVp9WithAlpha = (() => {
  if (typeof window === 'undefined') {
    return false;
  }
  // iOS Safari reports VP9 support but doesn't handle alpha correctly
  if (isIOS) {
    return false;
  }
  try {
    const v = document.createElement('video');
    return v.canPlayType('video/webm; codecs="vp9"') !== '';
  } catch {
    return false;
  }
})();

export enum MediaType {
  Poster,
  Anim,
  Video,
}

export function useOptimizedMedia(mediaUrl: string | undefined, candidateId: string) {
  const assets = useMemo(() => (mediaUrl ? deriveOptimizedAssets(mediaUrl) : null), [mediaUrl]);

  const [mediaType, setMediaType] = useState<MediaType>(MediaType.Poster);
  const [isMotionReady, setMotionReady] = useState(false);

  useEffect(() => {
    setMotionReady(false);
    if (!assets) {
      setMediaType(MediaType.Poster);
      return;
    }

    if (canPlayWebmVp9WithAlpha) {
      setMediaType(MediaType.Video);
    } else {
      setMediaType(MediaType.Anim);
    }
  }, [assets, candidateId]);

  const handleVideoError = () => {
    setMediaType(MediaType.Anim); // Fallback to animated WebP
    setMotionReady(false);
  };

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
    handleVideoError,
    handleAnimError,
    handleMotionReady,
  };
}