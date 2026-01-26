import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNextPair, usePersonalRanking, useSubmitVote, getSessionId, resetSession } from '../useGameAPI';
import { sessionService } from '@/services/sessionService';
import type { ReactNode } from 'react';

// Mock sessionService with all required methods
vi.mock('@/services/sessionService', () => ({
  sessionService: {
    getSessionId: vi.fn(() => 'test-session-id'),
    resetSession: vi.fn(() => 'new-session-id'),
    getSeenPairs: vi.fn(() => new Set()),
    addSeenPair: vi.fn(),
    clearSeenPairs: vi.fn(),
    getVoteCount: vi.fn(() => 0),
    incrementVoteCount: vi.fn(() => 1),
    decrementVoteCount: vi.fn(() => 0),
    getCandidateAppearances: vi.fn(() => ({})),
    incrementCandidateAppearances: vi.fn(),
    getLocalRatings: vi.fn(() => ({})),
    updateLocalRatings: vi.fn(),
    clearLocalRatings: vi.fn(),
    clearCandidateAppearances: vi.fn(),
  },
}));

// Mock pairGenerationService
vi.mock('@/services/pairGenerationService', () => ({
  generateSmartPair: vi.fn(() => ({
    pairId: 'keiko-rafael',
    a: {
      id: 'keiko',
      nombre: 'Keiko Fujimori',
      ideologia: 'Derecha Populista',
      fullBody: '/fotos_candidatos/keiko/full_body_keiko_poster.webp',
      headshot: 'https://example.com/keiko.jpg',
    },
    b: {
      id: 'rafael',
      nombre: 'Rafael López Aliaga',
      ideologia: 'Derecha Conservadora',
      fullBody: '/fotos_candidatos/rafael/rafael_poster.webp',
      headshot: 'https://example.com/rafael.jpg',
    },
    hint: { rationale: 'random' },
  })),
}));

import { generateSmartPair } from '@/services/pairGenerationService';

// Create a wrapper for React Query
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useGameAPI - Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Force production mode so fetch() is actually called
    vi.stubEnv('DEV', false);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('Session Management Functions', () => {
    it('should get session ID', () => {
      const sessionId = getSessionId();
      expect(sessionId).toBe('test-session-id');
      expect(sessionService.getSessionId).toHaveBeenCalled();
    });

    it('should reset session', () => {
      const newSessionId = resetSession();
      expect(newSessionId).toBe('new-session-id');
      expect(sessionService.resetSession).toHaveBeenCalled();
    });
  });

  describe('useNextPair', () => {
    it('should generate a pair of candidates', async () => {
      const { result } = renderHook(() => useNextPair(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const pair = result.current.data;
      expect(pair).toBeDefined();
      expect(pair?.a).toBeDefined();
      expect(pair?.b).toBeDefined();
      expect(pair?.a.id).not.toBe(pair?.b.id);
    });

    it('should generate pair with required candidate fields', async () => {
      const { result } = renderHook(() => useNextPair(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const pair = result.current.data!;

      // Check candidate A
      expect(pair.a.id).toBeTruthy();
      expect(pair.a.nombre).toBeTruthy();

      // Check candidate B
      expect(pair.b.id).toBeTruthy();
      expect(pair.b.nombre).toBeTruthy();
    });

    it('should generate pair with valid pairId format', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });
      
      const { result } = renderHook(() => useNextPair(), {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        ),
      });
      
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const pair = result.current.data!;
      // Updated regex to allow spaces in candidate IDs
      expect(pair.pairId).toMatch(/^[a-z0-9- ]+-[a-z0-9- ]+$/i);
      expect(pair.pairId).toContain('-');
    });

    it('should call generateSmartPair from pairGenerationService', async () => {
      const { result } = renderHook(() => useNextPair(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(generateSmartPair).toHaveBeenCalled();
    });

    it('should return data from generateSmartPair', async () => {
      const { result } = renderHook(() => useNextPair(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const pair = result.current.data!;
      expect(pair.pairId).toBe('keiko-rafael');
      expect(pair.a.id).toBe('keiko');
      expect(pair.b.id).toBe('rafael');
    });
  });

  describe('usePersonalRanking', () => {
    beforeEach(() => {
      global.fetch = vi.fn();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should not fetch when sessionId is empty', async () => {
      const { result } = renderHook(() => usePersonalRanking(''), {
        wrapper: createWrapper(),
      });

      // Query should be disabled
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
    });

    it('should fetch ranking for valid sessionId', async () => {
      const mockRanking = [
        { candidateId: 'keiko', rank: 1, name: 'Keiko', rating: 1250 },
      ];

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRanking),
      } as Response);

      const { result } = renderHook(() => usePersonalRanking('test-session'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockRanking);
    });
  });

  describe('useSubmitVote', () => {
    beforeEach(() => {
      global.fetch = vi.fn();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should submit vote successfully', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ok: true }),
      } as Response);

      const { result } = renderHook(() => useSubmitVote('test-session'), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync({
        sessionId: 'test-session',
        aId: 'keiko',
        bId: 'rafael',
        outcome: 'A',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/game/vote',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  describe('Pair Generation Edge Cases', () => {
    it('should handle generateSmartPair returning different pairs', async () => {
      let callCount = 0;
      vi.mocked(generateSmartPair).mockImplementation(() => {
        callCount++;
        return {
          pairId: callCount === 1 ? 'keiko-rafael' : 'yonhy-cesar-acuna',
          a: {
            id: callCount === 1 ? 'keiko' : 'yonhy',
            nombre: callCount === 1 ? 'Keiko Fujimori' : 'Yonhy Lescano',
          },
          b: {
            id: callCount === 1 ? 'rafael' : 'cesar-acuna',
            nombre: callCount === 1 ? 'Rafael López Aliaga' : 'César Acuña',
          },
          hint: { rationale: 'random' },
        } as any;
      });

      const { result: result1 } = renderHook(() => useNextPair(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      expect(result1.current.data?.pairId).toBe('keiko-rafael');
    });
  });
});
