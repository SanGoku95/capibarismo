/**
 * Tournament service — pure functions for bracket generation and state advancement.
 *
 * No side effects. All functions take state in, return new state out.
 * Storage/persistence is handled by the Zustand store layer.
 *
 * New format (v2):
 *   R0: 12x pick-1-from-3  (36 → 12)
 *   R1:  4x pick-1-from-3  (12 →  4)
 *   R2:  2x 1v1 semifinals  ( 4 →  2)
 *   R3:  1x 1v1 final       ( 2 →  1)
 */

import { nanoid } from 'nanoid';
import type { CandidateBase } from '@/data/types';
import type {
  TournamentState,
  TournamentBracket,
  TournamentRound,
  TournamentMatch,
  MatchProgress,
} from '@/lib/tournamentTypes';
import { ROUND_CONFIG, TOTAL_CANDIDATES } from '@/lib/tournamentConstants';

// =============================================================================
// Public API
// =============================================================================

/**
 * Create a fresh tournament state with a randomly-seeded bracket.
 */
export function createTournamentState(candidates: CandidateBase[]): TournamentState {
  if (candidates.length !== TOTAL_CANDIDATES) {
    throw new Error(`Expected ${TOTAL_CANDIDATES} candidates, got ${candidates.length}`);
  }

  return {
    id: nanoid(),
    bracket: generateBracket(candidates),
    currentRound: 0,
    currentMatchIndex: 0,
    phase: 'onboarding',
    podium: null,
    createdAt: Date.now(),
  };
}

/**
 * Create a tournament state starting at R2 (semifinals) with 4 pre-selected candidates.
 * R0 and R1 are empty stub rounds (completed). R3 is a stub awaiting R2 winners.
 */
export function createSemifinalTournament(candidates: CandidateBase[]): TournamentState {
  if (candidates.length !== 4) {
    throw new Error(`Expected 4 candidates for semifinal, got ${candidates.length}`);
  }

  const round0: TournamentRound = { roundIndex: 0, type: 'pick-one-from-three', matches: [], completed: true };
  const round1: TournamentRound = { roundIndex: 1, type: 'pick-one-from-three', matches: [], completed: true };

  const round2: TournamentRound = {
    roundIndex: 2,
    type: '1v1',
    matches: [
      { id: 'r2-m0', candidates: [candidates[0].id, candidates[1].id], winner: null, eliminated: [] },
      { id: 'r2-m1', candidates: [candidates[2].id, candidates[3].id], winner: null, eliminated: [] },
    ],
    completed: false,
  };

  // Stub required so propagateWinner (R2→R3) and BracketTree don't crash
  const round3: TournamentRound = {
    roundIndex: 3,
    type: '1v1',
    matches: [{ id: 'r3-m0', candidates: [], winner: null, eliminated: [] }],
    completed: false,
  };

  return {
    id: nanoid(),
    bracket: { rounds: [round0, round1, round2, round3] },
    currentRound: 2,
    currentMatchIndex: 0,
    phase: 'bracket-preview',
    podium: null,
    createdAt: Date.now(),
  };
}

/**
 * Advance the tournament by recording a vote. Returns a new TournamentState.
 */
export function advanceTournament(
  state: TournamentState,
  winnerId: string
): TournamentState {
  const next = structuredClone(state);
  const round = next.bracket.rounds[next.currentRound];
  const match = round.matches[next.currentMatchIndex];

  // Validate that the winner is actually in this match
  if (!match.candidates.includes(winnerId)) {
    throw new Error(`Candidate ${winnerId} is not in match ${match.id}`);
  }

  // Record the result
  match.winner = winnerId;
  match.eliminated = match.candidates.filter((id) => id !== winnerId);

  // Propagate winner to the next round's match slot
  propagateWinner(next, winnerId);

  // Advance to the next match or transition
  return advanceToNext(next);
}

/**
 * Get progress info for the HUD.
 */
export function getMatchProgress(state: TournamentState): MatchProgress {
  const roundConfig = ROUND_CONFIG[state.currentRound];
  const round = state.bracket.rounds[state.currentRound];

  // Count completed matches across all rounds
  let completedTotal = 0;
  let totalMatches = 0;
  for (const r of state.bracket.rounds) {
    for (const m of r.matches) {
      totalMatches++;
      if (m.winner) completedTotal++;
    }
  }

  const overallPercent = totalMatches > 0
    ? Math.round((completedTotal / totalMatches) * 100)
    : 0;

  const matchIndex = state.currentMatchIndex;
  const matchCount = round?.matches.length ?? 0;

  return {
    current: completedTotal,
    total: totalMatches,
    roundLabel: roundConfig?.label ?? 'Final',
    arcadeRoundLabel: roundConfig?.arcadeLabel ?? 'FINAL',
    matchLabel: `Grupo ${matchIndex + 1} de ${matchCount}`,
    overallPercent,
  };
}

/**
 * Get the current match that needs a vote.
 */
export function getCurrentMatch(state: TournamentState): TournamentMatch | null {
  const round = state.bracket.rounds[state.currentRound];
  if (!round) return null;
  return round.matches[state.currentMatchIndex] ?? null;
}

/**
 * Get candidates that were eliminated in a specific round.
 */
export function getEliminatedInRound(state: TournamentState, roundIndex: number): string[] {
  const round = state.bracket.rounds[roundIndex];
  if (!round) return [];
  return round.matches.flatMap((m) => m.eliminated);
}

/**
 * Get candidates that advanced (won) in a specific round.
 */
export function getAdvancingFromRound(state: TournamentState, roundIndex: number): string[] {
  const round = state.bracket.rounds[roundIndex];
  if (!round) return [];
  return round.matches.map((m) => m.winner).filter((id): id is string => id !== null);
}

// =============================================================================
// Bracket Generation
// =============================================================================

function generateBracket(candidates: CandidateBase[]): TournamentBracket {
  const shuffled = shuffleArray(candidates);
  const ids = shuffled.map((c) => c.id);

  // Round 0: 12 x pick-one-from-three (group into 12 groups of 3)
  const round0Matches: TournamentMatch[] = [];
  for (let i = 0; i < 12; i++) {
    round0Matches.push({
      id: `r0-m${i}`,
      candidates: [ids[i * 3], ids[i * 3 + 1], ids[i * 3 + 2]],
      winner: null,
      eliminated: [],
    });
  }

  // Round 1: 4 x pick-one-from-three (filled by R0 winners: 3 per group)
  const round1Matches: TournamentMatch[] = Array.from({ length: 4 }, (_, i) => ({
    id: `r1-m${i}`,
    candidates: [],
    winner: null,
    eliminated: [],
  }));

  // Round 2: 2 x 1v1 semifinals (filled by R1 winners: 2 per match)
  const round2Matches: TournamentMatch[] = Array.from({ length: 2 }, (_, i) => ({
    id: `r2-m${i}`,
    candidates: [],
    winner: null,
    eliminated: [],
  }));

  // Round 3: 1 x 1v1 final (filled by R2 winners)
  const round3Matches: TournamentMatch[] = [{
    id: 'r3-m0',
    candidates: [],
    winner: null,
    eliminated: [],
  }];

  const rounds: TournamentRound[] = [
    { roundIndex: 0, type: 'pick-one-from-three', matches: round0Matches, completed: false },
    { roundIndex: 1, type: 'pick-one-from-three', matches: round1Matches, completed: false },
    { roundIndex: 2, type: '1v1',                 matches: round2Matches, completed: false },
    { roundIndex: 3, type: '1v1',                 matches: round3Matches, completed: false },
  ];

  return { rounds };
}

// =============================================================================
// Winner Propagation
// =============================================================================

/**
 * After a match is won, propagate the winner into the correct slot in the next round.
 *
 * R0→R1: every 3 R0 matches feed 1 R1 match (pick-from-3)
 * R1→R2: every 2 R1 matches feed 1 R2 match (1v1)
 * R2→R3: both R2 winners go into R3 final (1v1)
 */
function propagateWinner(state: TournamentState, winnerId: string): void {
  const roundIndex = state.currentRound;
  const matchIndex = state.currentMatchIndex;

  if (roundIndex === 0) {
    // R0 → R1: groups of 3
    const r1MatchIndex = Math.floor(matchIndex / 3);
    state.bracket.rounds[1].matches[r1MatchIndex].candidates.push(winnerId);
  } else if (roundIndex === 1) {
    // R1 → R2: groups of 2
    const r2MatchIndex = Math.floor(matchIndex / 2);
    state.bracket.rounds[2].matches[r2MatchIndex].candidates.push(winnerId);
  } else if (roundIndex === 2) {
    // R2 → R3: both semifinal winners into final
    state.bracket.rounds[3].matches[0].candidates.push(winnerId);
  }
  // roundIndex === 3 (final): no propagation, handled by advanceToNext
}

// =============================================================================
// State Advancement
// =============================================================================

function advanceToNext(state: TournamentState): TournamentState {
  const round = state.bracket.rounds[state.currentRound];
  const isLastMatchInRound = state.currentMatchIndex >= round.matches.length - 1;

  if (state.currentRound === 3 && isLastMatchInRound) {
    // Final round completed → build podium
    round.completed = true;
    const finalMatch = round.matches[0];
    const champion = finalMatch.winner!;
    const runnerUp = finalMatch.eliminated[0];

    // Find semifinal losers for 3rd place
    const semiRound = state.bracket.rounds[2];
    const semiLosers = semiRound.matches.flatMap((m) => m.eliminated);
    const third = semiLosers[0] ?? runnerUp; // fallback

    state.podium = { first: champion, second: runnerUp, third };
    state.phase = 'podium';
    return state;
  }

  if (isLastMatchInRound) {
    // Round complete → transition
    round.completed = true;
    state.phase = 'round-transition';
    return state;
  }

  // More matches in current round
  state.currentMatchIndex++;
  return state;
}

/**
 * Advance from round-transition to the next round's playing phase.
 */
export function advanceFromTransition(state: TournamentState): TournamentState {
  const next = structuredClone(state);
  const nextRoundIndex = next.currentRound + 1;

  if (nextRoundIndex >= next.bracket.rounds.length) {
    next.phase = 'podium';
    return next;
  }

  next.currentRound = nextRoundIndex;
  next.currentMatchIndex = 0;

  const nextRound = next.bracket.rounds[nextRoundIndex];
  if (nextRound.type === 'pick-one-from-three') {
    next.phase = 'playing-pick-three';
  } else {
    next.phase = 'playing-1v1';
  }

  return next;
}

/**
 * Transition from onboarding to bracket preview.
 */
export function startFromOnboarding(state: TournamentState): TournamentState {
  const next = structuredClone(state);
  next.phase = 'bracket-preview';
  return next;
}

/**
 * Transition from bracket preview to the first match of the current round.
 */
export function startFromBracketPreview(state: TournamentState): TournamentState {
  const next = structuredClone(state);
  const round = next.bracket.rounds[next.currentRound];
  next.phase = round?.type === '1v1' ? 'playing-1v1' : 'playing-pick-three';
  return next;
}

// =============================================================================
// Utility
// =============================================================================

/** Fisher-Yates shuffle */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
