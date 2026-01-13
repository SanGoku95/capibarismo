import { useState, useEffect, useMemo } from 'react';

const isIOSSafari = (() => {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;

  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPadOS

  const isAppleBrowser = /WebKit/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
  return isIOS && isAppleBrowser;
})();

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

// Memoized check for WebM VP9 support.
const canPlayWebmVp9 = (() => {
  if (typeof window === 'undefined') {
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

    if (canPlayWebmVp9) {
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