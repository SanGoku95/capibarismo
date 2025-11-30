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
  nombre: string;
  ideologia?: string;
  headshot?: string;
  fullBody?: string;
  color?: string;
}

export const candidates: Record<string, CandidateBase> = {
  keiko: {
    id: 'keiko',
    nombre: 'Keiko Fujimori',
    ideologia: 'Derecha Populista',
    headshot: 'https://pbs.twimg.com/profile_images/1876955744525856768/1H9ukeEv_400x400.jpg',
    fullBody: '/fotos_candidatos/keiko/full_body_keiko.gif',
  },
  rafael: {
    id: 'rafael',
    nombre: 'Rafael L. Aliaga',
    ideologia: 'Derecha Conservadora',
    headshot: 'https://pbs.twimg.com/profile_images/1372582295987757058/P2yzmjJP_400x400.jpg',
    fullBody: '/fotos_candidatos/rafael/full_body_rafael.gif',
  },
  yonhy: {
    id: 'yonhy',
    nombre: 'Yonhy Lescano',
    ideologia: 'Centro Institucional',
    headshot: 'https://pbs.twimg.com/profile_images/991790180129476608/w-QUgKQT_400x400.jpg',
    fullBody: '/fotos_candidatos/lescano/full_body_lescano.gif',
  },
  'carlos-alvarez': {
    id: 'carlos-alvarez',
    nombre: 'Carlos Álvarez',
    ideologia: 'Derecha Punitiva',
    headshot: '/fotos_candidatos/alvarez/carlos-alvarez.jpg',
    fullBody: '/fotos_candidatos/alvarez/full_body_alvarez.gif',
  },
  'cesar-acuna': {
    id: 'cesar-acuna',
    nombre: 'César Acuña',
    ideologia: 'Populismo Clientelar',
    headshot: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/C%C3%A9sar_Acu%C3%B1a_Peralta.jpg',
    fullBody: '/fotos_candidatos/acuña/full_body_acuña_move.gif',
  },
  phillip: {
    id: 'phillip',
    nombre: 'Phillip Butters',
    ideologia: 'Derecha Conservadora',
    headshot: '/fotos_candidatos/phillip/phillip_headshot.png',
    fullBody: '/fotos_candidatos/phillip/phillip_full_body.gif',
  },
};

export function listCandidates(): CandidateBase[] {
  return Object.values(candidates);
}

export function getCandidateById(id: string): CandidateBase | undefined {
  return candidates[id];
}
