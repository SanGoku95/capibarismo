import { useEffect } from 'react';
import { PostHogProvider as PHProvider, usePostHog } from '@posthog/react';
import posthog from 'posthog-js';

// PostHog configuration
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const HOME_FIRST_SEEN_AT_KEY = 'ppp.home_first_seen_at';
const HOME_RETURNING_24H_SENT_KEY = 'ppp.home_returning_24h_sent';

// Initialize PostHog once at app startup
if (typeof window !== 'undefined' && POSTHOG_KEY && !posthog.__loaded) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    
    // Session Replay Configuration
    session_recording: {
      // Mask all inputs by default (passwords are always masked)
      maskAllInputs: true,
      // Capture request headers/body for replay network debugging
      recordHeaders: true,
      recordBody: true,
    },

    // Record console logs for better debugging (replay)
    enable_recording_console_log: true,

    // Autocapture configuration
    autocapture: {
      enabled: true,
      // Capture CSS selectors for better event identification
      css_selector_allowlist: ['[data-ph-capture]'],
    },

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
    
    // Loaded callback
    loaded: (posthog) => {
      if (import.meta.env.DEV) {
        console.log('PostHog loaded successfully');
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
    console.warn('PostHog key not found. Analytics will not be enabled.');
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

// Helper hook for tracking with fallback (for components that can't use hooks)
export const useTrackEvent = () => {
  const posthog = usePostHog();
  return (eventName: string, properties?: Record<string, any>) => {
    try {
      posthog?.capture(eventName, properties);
    } catch {
      // ignore tracking errors
    }
  };
};

// Helper functions that work with or without the hook
export const trackHomeView = (posthogInstance: ReturnType<typeof usePostHog> | typeof posthog, properties?: Record<string, any>) => {
  try {
    posthogInstance?.capture('home_view', properties);
  } catch {
    // ignore
  }
  
  if (typeof window === 'undefined') return;

  const now = Date.now();
  const firstSeenRaw = window.localStorage.getItem(HOME_FIRST_SEEN_AT_KEY);

  if (!firstSeenRaw) {
    window.localStorage.setItem(HOME_FIRST_SEEN_AT_KEY, String(now));
    try {
      posthogInstance?.capture('first_time_home_view');
    } catch {
      // ignore
    }
    return;
  }

  const firstSeenAt = Number(firstSeenRaw);
  if (!Number.isFinite(firstSeenAt)) return;

  if (now - firstSeenAt >= ONE_DAY_MS) {
    const alreadySent = window.localStorage.getItem(HOME_RETURNING_24H_SENT_KEY) === 'true';
    if (!alreadySent) {
      window.localStorage.setItem(HOME_RETURNING_24H_SENT_KEY, 'true');
      try {
        posthogInstance?.capture('returning_home_view_ge_24h');
      } catch {
        // ignore
      }
    }
  }
};

export const trackJugarView = (posthogInstance: ReturnType<typeof usePostHog> | typeof posthog, properties?: Record<string, any>) => {
  try {
    posthogInstance?.capture('jugar_view', properties);
  } catch {
    // ignore
  }
};
