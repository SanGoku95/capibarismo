import { useEffect } from 'react';
import posthog from 'posthog-js';

// PostHog configuration
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

let _initAttempted = false;

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const HOME_FIRST_SEEN_AT_KEY = 'ppp.home_first_seen_at';
const HOME_RETURNING_24H_SENT_KEY = 'ppp.home_returning_24h_sent';

// Initialize PostHog
export const initPostHog = () => {
  if (_initAttempted) return;
  _initAttempted = true;

  if (!POSTHOG_KEY) {
    console.warn('PostHog key not found. Analytics will not be enabled.');
    return;
  }

  if (typeof window !== 'undefined' && !posthog.__loaded) {
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
        // Automatically capture clicks, form submissions, etc.
        // Capture CSS selectors for better event identification
        css_selector_allowlist: ['[data-ph-capture]'],
      },

      // Capture pageviews automatically
      capture_pageview: true,
      
      // Capture page leave events
      capture_pageleave: true,

      // Advanced privacy settings
      mask_all_text: false,
      
      // Disable in development if needed (optional)
      // disable_session_recording: import.meta.env.DEV,
      
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
};

// PostHog Provider Component
export const PostHogProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    initPostHog();
  }, []);

  return <>{children}</>;
};

// Export posthog instance for manual event tracking
export { posthog };

// Utility functions for common tracking patterns
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  initPostHog();
  if (!POSTHOG_KEY || typeof window === 'undefined') return;

  try {
    posthog.capture(eventName, properties);
  } catch {
    // ignore tracking errors
  }
};

export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  initPostHog();
  if (!POSTHOG_KEY || typeof window === 'undefined') return;

  try {
    posthog.identify(userId, properties);
  } catch {
    // ignore
  }
};

export const resetUser = () => {
  initPostHog();
  if (!POSTHOG_KEY || typeof window === 'undefined') return;

  try {
    posthog.reset();
  } catch {
    // ignore
  }
};

// Feature flag utilities
export const isFeatureEnabled = (flagKey: string): boolean => {
  initPostHog();
  if (!POSTHOG_KEY || typeof window === 'undefined') return false;

  try {
    return posthog.isFeatureEnabled(flagKey) || false;
  } catch {
    return false;
  }
};

export const trackHomeView = (properties?: Record<string, any>) => {
  trackEvent('home_view', properties);
  if (typeof window === 'undefined') return;

  const now = Date.now();
  const firstSeenRaw = window.localStorage.getItem(HOME_FIRST_SEEN_AT_KEY);

  if (!firstSeenRaw) {
    window.localStorage.setItem(HOME_FIRST_SEEN_AT_KEY, String(now));
    trackEvent('first_time_home_view');
    return;
  }

  const firstSeenAt = Number(firstSeenRaw);
  if (!Number.isFinite(firstSeenAt)) return;

  if (now - firstSeenAt >= ONE_DAY_MS) {
    const alreadySent = window.localStorage.getItem(HOME_RETURNING_24H_SENT_KEY) === 'true';
    if (!alreadySent) {
      window.localStorage.setItem(HOME_RETURNING_24H_SENT_KEY, 'true');
      trackEvent('returning_home_view_ge_24h');
    }
  }
};

export const trackJugarView = (properties?: Record<string, any>) => {
  trackEvent('jugar_view', properties);
};
