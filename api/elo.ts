// Shared Elo calculation logic
// NOTE: These constants are also defined in src/lib/gameConstants.ts
// We duplicate them here to avoid introducing a dependency from API to src
// Keep these values in sync manually
export const ELO_K = 32;
export const INITIAL_ELO = 1200;

export function calculateExpected(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

export function updateElo(ratingA: number, ratingB: number, aWon: boolean): [number, number] {
  const expectedA = calculateExpected(ratingA, ratingB);
  const expectedB = calculateExpected(ratingB, ratingA);
  
  const newA = ratingA + ELO_K * ((aWon ? 1 : 0) - expectedA);
  const newB = ratingB + ELO_K * ((aWon ? 0 : 1) - expectedB);
  
  return [newA, newB];
}
