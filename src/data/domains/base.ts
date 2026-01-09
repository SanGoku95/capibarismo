import type { CandidateBase } from '@/data/types';

export const base: Record<string, CandidateBase> = {
  keiko: {
    id: 'keiko',
    nombre: 'Keiko Fujimori',
    ideologia: 'Derecha Populista',
    headshot: 'https://pbs.twimg.com/profile_images/1876955744525856768/1H9ukeEv_400x400.jpg',
    fullBody: '/fotos_candidatos/keiko/full_body_keiko_poster_h432_q80.webp',
  },
  rafael: {
    id: 'rafael',
    nombre: 'Rafael L. Aliaga',
    ideologia: 'Derecha Conservadora',
    headshot: 'https://pbs.twimg.com/profile_images/1372582295987757058/P2yzmjJP_400x400.jpg',
    fullBody: '/fotos_candidatos/rafael/full_body_rafael_poster_h480_q80.webp',
  },
  yonhy: {
    id: 'yonhy',
    nombre: 'Yonhy Lescano',
    ideologia: 'Centro Populista',
    headshot: 'https://pbs.twimg.com/profile_images/991790180129476608/w-QUgKQT_400x400.jpg',
    fullBody: '/fotos_candidatos/lescano/full_body_lescano_poster_h432_q80.webp',
  },
  'carlos-alvarez': {
    id: 'carlos-alvarez',
    nombre: 'Carlos Álvarez',
    ideologia: 'Derecha Punitiva',
    headshot: '/fotos_candidatos/alvarez/carlos-alvarez.jpg',
    fullBody: '/fotos_candidatos/alvarez/full_body_alvarez_poster_h480_q80.webp',
  },
  'cesar-acuna': {
    id: 'cesar-acuna',
    nombre: 'César Acuña',
    ideologia: 'Populismo Clientelar',
    headshot: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/C%C3%A9sar_Acu%C3%B1a_Peralta.jpg',
    fullBody: '/fotos_candidatos/acuna/full_body_acuna_move_poster_h480_q80.webp',
  }
};

