import { useState, useEffect, useMemo, useCallback } from 'react';

// ============================================================================
// Types
// ============================================================================

export interface OptimizedAssets {
  poster: string;
  webm: string;
  animWebp: string;
  hevc: string;
}

export enum MediaType {
  Poster = 'poster',
  Anim = 'anim',
  Video = 'video',
  Hevc = 'hevc',
}

// ============================================================================
// Browser Capability Detection
// ============================================================================

const isServer = typeof window === 'undefined';

function detectBrowserCapabilities() {
  if (isServer) {
    return { isSafari: false, isIOS: false, canPlayHevc: false, canPlayVp9: false };
  }

  const ua = navigator.userAgent;
  
  const isSafari = /Safari/.test(ua) && !/Chrome|Chromium/.test(ua);
  
  // NOTE: iOS detection via userAgent can be unreliable due to UA freezing in iOS 13+.
  // The maxTouchPoints check for iPadOS may have false positives on touch-enabled Macs.
  // However, for media format selection, this is acceptable as the fallback (animated WebP)
  // works on all platforms. This detection primarily prevents VP9 alpha on Safari/iOS
  // where it renders incorrectly.
  const isIOS = /iPad|iPhone|iPod/.test(ua) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  const testVideo = document.createElement('video');
  
  // HEVC with alpha: Safari 13+ on macOS/iOS
  const canPlayHevc = (isSafari || isIOS) && 
    testVideo.canPlayType('video/mp4; codecs="hvc1"') !== '';
  
  // VP9 with alpha: Chrome/Android (Safari/iOS don't support VP9 alpha properly)
  const canPlayVp9 = !isSafari && !isIOS && 
    testVideo.canPlayType('video/webm; codecs="vp9"') !== '';

  return { isSafari, isIOS, canPlayHevc, canPlayVp9 };
}

// Computed once at module load
const browserCapabilities = detectBrowserCapabilities();

// ============================================================================
// Asset Path Derivation
// ============================================================================

// Supports both naming conventions
const NEW_POSTER_PATTERN = /^(?<dir>.*\/)(?<base>[^/]+?)_poster\.webp$/;
const OLD_POSTER_PATTERN = /^(?<dir>.*\/)(?<base>[^/]+?)_poster_h\d+_q\d+\.webp$/;

/**
 * Derives all optimized asset paths from a poster URL.
 * Supports both old format (/path/NAME_poster_h480_q80.webp) and 
 * new format (/path/NAME_poster.webp)
 */
function deriveOptimizedAssets(posterUrl: string): OptimizedAssets | null {
  // Try new naming first: NAME_poster.webp
  let match = posterUrl.match(NEW_POSTER_PATTERN);
  if (match?.groups) {
    const { dir, base } = match.groups;
    return {
      poster: posterUrl,
      webm: `${dir}${base}_video.webm`,
      animWebp: `${dir}${base}_anim.webp`,
      hevc: `${dir}${base}_hevc.mov`,
    };
  }

  // Fallback to old naming: NAME_poster_h480_q80.webp
  match = posterUrl.match(OLD_POSTER_PATTERN);
  if (match?.groups) {
    const { dir, base } = match.groups;
    return {
      poster: posterUrl,
      webm: `${dir}${base}_video.webm`,
      animWebp: `${dir}${base}_anim.webp`,
      hevc: `${dir}${base}_hevc.mov`,
    };
  }

  return null;
}

/**
 * Determines the best media type based on browser capabilities.
 * Priority: HEVC (Safari/iOS) > VP9 WebM (Chrome/Android) > Animated WebP
 */
function selectOptimalMediaType(): MediaType {
  if (browserCapabilities.canPlayHevc) return MediaType.Hevc;
  if (browserCapabilities.canPlayVp9) return MediaType.Video;
  return MediaType.Anim;
}

// ============================================================================
// Hook
// ============================================================================

export interface UseOptimizedMediaResult {
  assets: OptimizedAssets | null;
  mediaType: MediaType;
  isMotionReady: boolean;
  handleVideoError: () => void;
  handleAnimError: () => void;
  handleMotionReady: () => void;
}

export function useOptimizedMedia(
  mediaUrl: string | undefined, 
  candidateId: string
): UseOptimizedMediaResult {
  const assets = useMemo(
    () => (mediaUrl ? deriveOptimizedAssets(mediaUrl) : null), 
    [mediaUrl]
  );

  const [mediaType, setMediaType] = useState<MediaType>(MediaType.Poster);
  const [isMotionReady, setMotionReady] = useState(false);

  // Reset and select optimal media type when candidate changes
  useEffect(() => {
    setMotionReady(false);
    setMediaType(assets ? selectOptimalMediaType() : MediaType.Poster);
  }, [assets, candidateId]);

  // Fallback chain: HEVC → VP9 → Anim → Poster
  const handleVideoError = useCallback(() => {
    setMotionReady(false);
    
    if (mediaType === MediaType.Hevc && browserCapabilities.canPlayVp9) {
      setMediaType(MediaType.Video);
    } else {
      setMediaType(MediaType.Anim);
    }
  }, [mediaType]);

  const handleAnimError = useCallback(() => {
    setMotionReady(false);
    setMediaType(MediaType.Poster);
  }, []);

  const handleMotionReady = useCallback(() => {
    setMotionReady(true);
  }, []);

  return {
    assets,
    mediaType,
    isMotionReady,
    handleVideoError,
    handleAnimError,
    handleMotionReady,
  };
}