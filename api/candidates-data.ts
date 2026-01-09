// Candidate base data for API use

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
