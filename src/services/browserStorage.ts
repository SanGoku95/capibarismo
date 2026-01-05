/**
 * Abstraction layer for browser storage APIs.
 * This makes the code testable without mocking global objects.
 */

export interface StorageService {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

/**
 * Implementation of StorageService for localStorage.
 * Safe to use in SSR environments (returns null/noop when window is undefined).
 */
export const localStorageService: StorageService = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  },

  setItem: (key: string, value: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
  },

  removeItem: (key: string) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },

  clear: () => {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  },
};

/**
 * Implementation of StorageService for sessionStorage.
 * Safe to use in SSR environments (returns null/noop when window is undefined).
 */
export const sessionStorageService: StorageService = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(key);
  },

  setItem: (key: string, value: string) => {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(key, value);
  },

  removeItem: (key: string) => {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(key);
  },

  clear: () => {
    if (typeof window === 'undefined') return;
    sessionStorage.clear();
  },
};

/**
 * Create a mock storage service for testing.
 * This is exported for use in tests.
 */
export function createMockStorage(): StorageService {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
}
