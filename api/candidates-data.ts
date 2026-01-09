// Candidate base data for API use

export interface CandidateBase {
  id: string;
  nombre: string;
}

export const candidates: Record<string, CandidateBase> = {
  keiko: {
    id: 'keiko',
    nombre: 'Keiko Fujimori',
  },
  rafael: {
    id: 'rafael',
    nombre: 'Rafael L. Aliaga',
  },
  yonhy: {
    id: 'yonhy',
    nombre: 'Yonhy Lescano',
  },
  'carlos-alvarez': {
    id: 'carlos-alvarez',
    nombre: 'Carlos Álvarez',
  },
  'cesar-acuna': {
    id: 'cesar-acuna',
    nombre: 'César Acuña',
  },
};

export function listCandidates(): CandidateBase[] {
  return Object.values(candidates);
}

export function getCandidateById(id: string): CandidateBase | undefined {
  return candidates[id];
}
