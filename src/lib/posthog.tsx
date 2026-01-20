import { PostHogProvider as PHProvider, usePostHog } from '@posthog/react';
import posthog from 'posthog-js';
import { useRef, useEffect } from 'react';

// PostHog configuration
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = '/_capi';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const HOME_FIRST_SEEN_AT_KEY = 'ppp.home_first_seen_at';
const HOME_RETURNING_24H_SENT_KEY = 'ppp.home_returning_24h_sent';

// Initialize PostHog once at app startup
if (typeof window !== 'undefined' && POSTHOG_KEY && !posthog.__loaded) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    
    // Only enable debug in development
    debug: import.meta.env.DEV,
    
    // Session Replay Configuration
    session_recording: {
      maskAllInputs: true,
      recordHeaders: true,
      recordBody: true,
    },

    // Record console logs for better debugging (replay)
    enable_recording_console_log: true,

    // Autocapture configuration
    autocapture: true,

    // Capture pageviews automatically
    capture_pageview: true,
    
    // Capture page leave events
    capture_pageleave: true,

    // Advanced privacy settings
    mask_all_text: false,
    
    // Better error tracking
    capture_performance: true,
    
    // Persistence configuration
    persistence: 'localStorage',
    
    // Loaded callback (dev only logging)
    loaded: (posthog) => {
      if (import.meta.env.DEV) {
        console.log('[PostHog] ✅ Loaded. Distinct ID:', posthog.get_distinct_id());
      }
    },
  });

  // Set up error tracking
  window.addEventListener('error', (event) => {
    posthog.capture('$exception', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error?.stack,
    });
  });

  // Set up unhandled promise rejection tracking
  window.addEventListener('unhandledrejection', (event) => {
    posthog.capture('$exception', {
      message: event.reason?.message || 'Unhandled Promise Rejection',
      error: event.reason?.stack,
    });
  });
}

// PostHog Provider Component using official package
export const PostHogProvider = ({ children }: { children: React.ReactNode }) => {
  if (!POSTHOG_KEY) {
    if (import.meta.env.DEV) {
      console.warn('[PostHog] Key not found. Analytics disabled.');
    }
    return <>{children}</>;
  }

  return (
    <PHProvider client={posthog}>
      {children}
    </PHProvider>
  );
};

// Export the usePostHog hook from the official package
export { usePostHog };

// Export posthog instance for manual event tracking
export { posthog };

/**
 * Helper to capture events with sessionId automatically included.
 * Uses requestIdleCallback to avoid blocking INP.
 */
export function captureDeferred(
  posthogInstance: ReturnType<typeof usePostHog> | null | undefined,
  eventName: string,
  properties: Record<string, unknown>
): void {
  if (!posthogInstance) return;
  
  // Capture a snapshot of properties to avoid stale closures
  const propsSnapshot = { ...properties };
  
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(() => {
      posthogInstance.capture(eventName, propsSnapshot);
    });
  } else {
    setTimeout(() => {
      posthogInstance.capture(eventName, propsSnapshot);
    }, 0);
  }
}

// Helper hook for tracking with fallback (for components that can't use hooks)
export const useTrackEvent = () => {
  const posthog = usePostHog();
  return (eventName: string, properties?: Record<string, unknown>) => {
    posthog?.capture(eventName, properties);
  };
};

/**
 * Hook to link PostHog identity with game sessionId.
 * Call this once when the game session is established.
 */
export const useIdentifyGameSession = (gameSessionId: string | null) => {
  const posthog = usePostHog();
  const identifiedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!posthog || !gameSessionId) return;
    
    // Only identify once per sessionId
    if (identifiedRef.current === gameSessionId) return;
    identifiedRef.current = gameSessionId;
    
    // Set game session as a property on the user
    posthog.people?.set({ game_session_id: gameSessionId });
    
    // Register as super property so it's included in all events
    posthog.register({ game_session_id: gameSessionId });
    
    if (import.meta.env.DEV) {
      console.log('[PostHog] Registered game session:', gameSessionId);
    }
  }, [posthog, gameSessionId]);
};

// Hook to track home view once per mount (avoids StrictMode duplicates)
export const useTrackHomeView = () => {
  const posthog = usePostHog();
  const hasFired = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (hasFired.current) return;
    hasFired.current = true;

    posthog?.capture('home_view');

    // Handle first-time vs returning visitor
    const now = Date.now();
    const firstSeenRaw = window.localStorage.getItem(HOME_FIRST_SEEN_AT_KEY);

    if (!firstSeenRaw) {
      window.localStorage.setItem(HOME_FIRST_SEEN_AT_KEY, String(now));
      posthog?.capture('first_time_home_view');
      return;
    }

    const firstSeenAt = Number(firstSeenRaw);
    if (!Number.isFinite(firstSeenAt)) return;

    if (now - firstSeenAt >= ONE_DAY_MS) {
      const alreadySent = window.localStorage.getItem(HOME_RETURNING_24H_SENT_KEY) === 'true';
      if (!alreadySent) {
        window.localStorage.setItem(HOME_RETURNING_24H_SENT_KEY, 'true');
        posthog?.capture('returning_home_view_ge_24h');
      }
    }
  }, [posthog]);
};

// Hook to track jugar view once per mount
export const useTrackJugarView = (properties?: Record<string, unknown>) => {
  const posthog = usePostHog();
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;

    posthog?.capture('jugar_view', properties);
  }, [posthog, properties]);
};

// Legacy function exports (for backward compatibility)
export const trackHomeView = (posthogInstance: ReturnType<typeof usePostHog> | typeof posthog, properties?: Record<string, unknown>) => {
  posthogInstance?.capture('home_view', properties);
};

export const trackJugarView = (posthogInstance: ReturnType<typeof usePostHog> | typeof posthog, properties?: Record<string, unknown>) => {
  posthogInstance?.capture('jugar_view', properties);
};
