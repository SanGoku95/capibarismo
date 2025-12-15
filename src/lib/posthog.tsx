import { useEffect } from 'react';
import posthog from 'posthog-js';

// PostHog configuration
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

// Initialize PostHog
export const initPostHog = () => {
  if (!POSTHOG_KEY) {
    console.warn('PostHog key not found. Session replay will not be enabled.');
    return;
  }

  if (typeof window !== 'undefined' && !posthog.__loaded) {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      
      // Session Replay Configuration
      session_recording: {
        enabled: true,
        // Record console logs for better debugging
        recordConsoleLog: true,
        // Record network requests (useful for debugging API issues)
        recordNetwork: true,
        // Mask all text content for privacy (can be toggled off if needed)
        maskAllText: false,
        // Mask all inputs by default (passwords are always masked)
        maskAllInputs: true,
        // Sample rate: 1.0 = 100% of sessions (adjust for production)
        sampleRate: 1.0,
        // Minimum duration before recording starts (in ms)
        minimumDuration: 1000,
      },

      // Autocapture configuration
      autocapture: {
        // Automatically capture clicks, form submissions, etc.
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
      mask_all_inputs: true,
      
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
  if (posthog.__loaded) {
    posthog.capture(eventName, properties);
  }
};

export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (posthog.__loaded) {
    posthog.identify(userId, properties);
  }
};

export const resetUser = () => {
  if (posthog.__loaded) {
    posthog.reset();
  }
};

// Feature flag utilities
export const isFeatureEnabled = (flagKey: string): boolean => {
  if (posthog.__loaded) {
    return posthog.isFeatureEnabled(flagKey) || false;
  }
  return false;
};
