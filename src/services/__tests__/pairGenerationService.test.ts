import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

function makeCandidates(ids: string[]) {
  const base: Record<string, any> = {};
  for (const id of ids) {
    base[id] = {
      id,
      nombre: `Nombre ${id}`,
      ideologia: `Ideologia ${id}`,
      fullBody: `/img/${id}.webp`,
      headshot: `/head/${id}.webp`,
    };
  }
  return base;
}

type SetupOptions = {
  candidateIds: string[];
  initialSeenPairs?: string[];
  initialAppearances?: Record<string, number>;
  initialRatings?: Record<string, number>;
};

async function setupPairGenerationService(options: SetupOptions) {
  const {
    candidateIds,
    initialSeenPairs = [],
    initialAppearances = {},
    initialRatings = {},
  } = options;

  vi.resetModules();

  const candidatesBase = makeCandidates(candidateIds);

  const seenPairsState = new Set<string>(initialSeenPairs);
  const appearancesState: Record<string, number> = { ...initialAppearances };

  const sessionServiceMock = {
    getSeenPairs: vi.fn(() => new Set<string>(Array.from(seenPairsState))),
    addSeenPair: vi.fn((pairId: string) => {
      seenPairsState.add(pairId);
    }),
    clearSeenPairs: vi.fn(() => {
      seenPairsState.clear();
    }),

    getCandidateAppearances: vi.fn(() => ({ ...appearancesState })),
    incrementCandidateAppearances: vi.fn((candidateIdsToInc: string[]) => {
      for (const id of candidateIdsToInc) {
        appearancesState[id] = (appearancesState[id] ?? 0) + 1;
      }
    }),

    getLocalRatings: vi.fn(() => ({ ...initialRatings })),
  };

  vi.doMock('@/data/domains/base', () => ({ base: candidatesBase }));
  vi.doMock('@/services/sessionService', () => ({ sessionService: sessionServiceMock }));

  const mod = await import('../pairGenerationService');

  return {
    generateSmartPair: mod.generateSmartPair,
    sessionServiceMock,
    seenPairsState,
    appearancesState,
  };
}

describe('pairGenerationService', () => {
  const originalMathRandom = Math.random;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    Math.random = originalMathRandom;
  });

  it('throws when window is undefined (SSR guard)', async () => {
    const originalWindow = (globalThis as any).window;
    (globalThis as any).window = undefined;

    const { generateSmartPair } = await setupPairGenerationService({
      candidateIds: ['a', 'b'],
    });

    expect(() => generateSmartPair()).toThrow(/browser environment/i);

    (globalThis as any).window = originalWindow;
  });

  it('coverage phase: when 2+ candidates are unseen, returns a pair of unseen candidates', async () => {
    Math.random = vi.fn(() => 0);

    const { generateSmartPair, sessionServiceMock, appearancesState } =
      await setupPairGenerationService({
        candidateIds: ['a', 'b', 'c', 'd'],
        initialAppearances: {},
      });

    const pair = generateSmartPair();

    expect(pair.hint?.rationale).toBe('coverage-both-new');
    expect(pair.a.id).not.toBe(pair.b.id);

    // Since everyone starts unseen, both selected must have had 0 appearances.
    expect((appearancesState[pair.a.id] ?? 0)).toBeGreaterThanOrEqual(1);
    expect((appearancesState[pair.b.id] ?? 0)).toBeGreaterThanOrEqual(1);

    expect(sessionServiceMock.addSeenPair).toHaveBeenCalledWith(pair.pairId);
    expect(sessionServiceMock.incrementCandidateAppearances).toHaveBeenCalledWith([
      pair.a.id,
      pair.b.id,
    ]);
  });

  it('coverage phase: when exactly 1 candidate is unseen, that candidate is always included', async () => {
    Math.random = vi.fn(() => 0);

    const { generateSmartPair } = await setupPairGenerationService({
      candidateIds: ['a', 'b', 'c'],
      initialAppearances: {
        a: 1,
        b: 2,
        c: 0,
      },
    });

    const pair = generateSmartPair();

    expect(pair.hint?.rationale).toBe('coverage-one-new');
    expect([pair.a.id, pair.b.id]).toContain('c');
  });

  it('adaptive phase: with no unseen candidates, pairs similar ratings first (adjacent in sorted ratings)', async () => {
    const { generateSmartPair } = await setupPairGenerationService({
      candidateIds: ['a', 'b', 'c', 'd'],
      initialAppearances: {
        a: 1,
        b: 1,
        c: 1,
        d: 1,
      },
      initialRatings: {
        a: 1500,
        b: 1490,
        c: 1200,
        d: 800,
      },
    });

    const pair = generateSmartPair();

    expect(pair.hint?.rationale).toBe('adaptive-similar-rating');

    const ids = [pair.a.id, pair.b.id];
    expect(ids).toEqual(expect.arrayContaining(['a', 'b']));
  });

  it('never repeats an already-seen pairId when an alternative is available', async () => {
    const { generateSmartPair } = await setupPairGenerationService({
      candidateIds: ['a', 'b', 'c'],
      initialAppearances: { a: 1, b: 1, c: 1 },
      // Pre-mark a-b as already seen
      initialSeenPairs: ['a-b'],
      // Keep ratings equal to make sort order rely on base order; V8 sort is stable.
      initialRatings: { a: 1200, b: 1200, c: 1200 },
    });

    const pair = generateSmartPair();

    expect(pair.pairId).not.toBe('a-b');
    expect(new Set([pair.a.id, pair.b.id])).not.toEqual(new Set(['a', 'b']));
  });

  it('clears seenPairs when all possible pairs have been shown (prevents dead-ends)', async () => {
    Math.random = vi.fn(() => 0);

    // With 3 candidates there are 3 total pairs.
    const { generateSmartPair, sessionServiceMock } = await setupPairGenerationService({
      candidateIds: ['a', 'b', 'c'],
      initialSeenPairs: ['a-b', 'a-c', 'b-c'],
      initialAppearances: { a: 1, b: 1, c: 1 },
    });

    const pair = generateSmartPair();

    expect(sessionServiceMock.clearSeenPairs).toHaveBeenCalled();
    expect(pair.pairId).toBeTruthy();
  });
});
