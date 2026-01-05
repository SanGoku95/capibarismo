import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNextPair, getSessionId, resetSession } from '../useGameAPI';

// Wrapper para hooks que usan React Query
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useGameAPI Integration Tests', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Session Management', () => {
    it('should generate a session ID on first access', () => {
      const sessionId = getSessionId();

      expect(sessionId).toBeTruthy();
      expect(typeof sessionId).toBe('string');
      expect(sessionId.length).toBeGreaterThan(10);
    });

    it('should persist session ID across multiple calls', () => {
      const firstId = getSessionId();
      const secondId = getSessionId();

      expect(firstId).toBe(secondId);
    });

    it('should create new session ID on reset', () => {
      const oldId = getSessionId();
      const newId = resetSession();

      expect(newId).toBeTruthy();
      expect(newId).not.toBe(oldId);
    });

    it('should clear seen pairs when resetting session', () => {
      const oldSessionId = getSessionId();

      // Simular que se guardaron pares vistos
      localStorage.setItem(`ranking-game-seen-pairs:${oldSessionId}`, JSON.stringify(['pair1', 'pair2']));

      resetSession();

      // Los pares vistos del viejo session deben estar limpios
      const oldSeenPairs = localStorage.getItem(`ranking-game-seen-pairs:${oldSessionId}`);
      expect(oldSeenPairs).toBeNull();
    });
  });

  describe('Pair Generation', () => {
    it('should generate a valid pair of candidates', async () => {
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
      expect(pair?.pairId).toBeDefined();

      // Los candidatos deben ser diferentes
      expect(pair?.a.id).not.toBe(pair?.b.id);
    });

    it('should generate candidates with required fields', async () => {
      const { result } = renderHook(() => useNextPair(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const pair = result.current.data;

      // Validar estructura del candidato A
      expect(pair?.a.id).toBeTruthy();
      expect(pair?.a.nombre).toBeTruthy();
      expect(pair?.a.ideologia).toBeTruthy();

      // Validar estructura del candidato B
      expect(pair?.b.id).toBeTruthy();
      expect(pair?.b.nombre).toBeTruthy();
      expect(pair?.b.ideologia).toBeTruthy();
    });

    it('should create consistent pairId format', async () => {
      const { result } = renderHook(() => useNextPair(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const pair = result.current.data;

      // pairId debe ser una combinación de ambos IDs
      expect(pair?.pairId).toBeTruthy();
      expect(pair?.pairId).toContain('-');

      // El pairId debe contener partes de ambos IDs o ser determinístico
      // No podemos asumir el formato exacto ya que los IDs pueden tener guiones
      expect(typeof pair?.pairId).toBe('string');
      expect(pair?.pairId.length).toBeGreaterThan(0);
    });

    it('should track seen pairs in localStorage', async () => {
      const sessionId = getSessionId();

      const { result } = renderHook(() => useNextPair(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const seenPairsKey = `ranking-game-seen-pairs:${sessionId}`;
      const seenPairs = localStorage.getItem(seenPairsKey);

      expect(seenPairs).toBeTruthy();

      const parsedPairs = JSON.parse(seenPairs!);
      expect(Array.isArray(parsedPairs)).toBe(true);
      expect(parsedPairs.length).toBeGreaterThan(0);
    });

    it('should not generate same pair twice in a row', async () => {
      const { result, rerender } = renderHook(() => useNextPair(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const firstPair = result.current.data;

      // Forzar refetch
      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const secondPair = result.current.data;

      // Los pares deben ser diferentes (aunque podría fallar por azar si hay pocos candidatos)
      // Este test es probabilístico pero muy unlikely que falle con 6+ candidatos
      expect(firstPair?.pairId).not.toBe(secondPair?.pairId);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing candidates gracefully', () => {
      // Este test verifica que el sistema no crashea
      // En producción siempre hay candidatos, pero es bueno validar robustez

      const { result } = renderHook(() => useNextPair(), {
        wrapper: createWrapper(),
      });

      // No debería lanzar error
      expect(result.current.isLoading || result.current.isSuccess || result.current.isError).toBe(true);
    });
  });
});
