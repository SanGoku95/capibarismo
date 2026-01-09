// Candidate base data for API use

export interface CandidateBase {
  id: string;
  nombre: string;
  ideologia?: string;
}

export const candidates: Record<string, CandidateBase> = {
  keiko: {
    id: 'keiko',
    nombre: 'Keiko Fujimori',
    ideologia: 'Derecha Populista',
  },
  rafael: {
    id: 'rafael',
    nombre: 'Rafael L. Aliaga',
    ideologia: 'Derecha Conservadora',
  },
  yonhy: {
    id: 'yonhy',
    nombre: 'Yonhy Lescano',
    ideologia: 'Centro Populista',
  },
  'carlos-alvarez': {
    id: 'carlos-alvarez',
    nombre: 'Carlos Álvarez',
    ideologia: 'Derecha Punitiva',
  },
  'cesar-acuna': {
    id: 'cesar-acuna',
    nombre: 'César Acuña',
    ideologia: 'Populismo Clientelar',
  },
};

export function listCandidates(): CandidateBase[] {
  return Object.values(candidates);
}

export function getCandidateById(id: string): CandidateBase | undefined {
  return candidates[id];
}
