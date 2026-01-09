// Candidate base data for API use
// NOTE: This is intentionally duplicated from src/data/domains/base.ts
// to make API functions self-contained for Vercel serverless functions.
// In a production setup, consider:
// 1. Using a shared npm package for both frontend and API
// 2. Code generation from a single source
// 3. Fetching from a database
// For MVP, manual sync is acceptable given the small dataset.

export interface CandidateBase {
  id: string;
}

export const candidates: Record<string, CandidateBase> = {
  keiko: {
    id: 'keiko'
  },
  rafael: {
    id: 'rafael'
  },
  yonhy: {
    id: 'yonhy'
  },
  'carlos-alvarez': {
    id: 'carlos-alvarez'
  },
  'cesar-acuna': {
    id: 'cesar-acuna'
  },
  phillip: {
    id: 'phillip'
  },
};

export function listCandidates(): CandidateBase[] {
  return Object.values(candidates);
}

export function getCandidateById(id: string): CandidateBase | undefined {
  return candidates[id];
}
