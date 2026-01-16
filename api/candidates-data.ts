// Candidate base data for API use

export interface CandidateBase {
  id: string;
  nombre: string;
  ideologia?: string;
  partido?: string;
  partyIcon?: string;
}

export const candidates: Record<string, CandidateBase> = {
  keiko: {
    id: 'keiko',
    nombre: 'Keiko Fujimori',
    ideologia: 'Derecha Populista',
    partido: 'Fuerza Popular',
    partyIcon: '/iconos_partidos/fuerza_popular.jpg',
  },
  rafael: {
    id: 'rafael',
    nombre: 'Rafael L. Aliaga',
    ideologia: 'Derecha Conservadora',
    partido: 'Renovación Popular',
    partyIcon: '/iconos_partidos/renovacion_popular.jpg',
  },
  yonhy: {
    id: 'yonhy',
    nombre: 'Yonhy Lescano',
    ideologia: 'Centro Populista',
    partido: 'Cooperación Popular',
    partyIcon: '/iconos_partidos/cooperacion_popular.jpg',
  },
  'carlos-alvarez': {
    id: 'carlos-alvarez',
    nombre: 'Carlos Álvarez',
    ideologia: 'Derecha Punitiva',
    partido: 'País Para Todos',
    partyIcon: '/iconos_partidos/pais_para_todos.jpg',
  },
  'cesar-acuna': {
    id: 'cesar-acuna',
    nombre: 'César Acuña',
    ideologia: 'Populismo Clientelar',
    partido: 'Alianza Para el Progreso',
    partyIcon: '/iconos_partidos/alianza_progreso.png',
  },
  'lopez-chau': {
    id: 'lopez-chau',
    nombre: 'Alfonso Lopez Chau',
    ideologia: 'Centro Izquierda',
    partido: 'Ahora Nación',
    partyIcon: '/iconos_partidos/ahora_nacion.jpg',
  },
  // belmont: {
  //   id: 'belmont',
  //   nombre: 'Ricardo Belmont Cassinelli',
  //   ideologia: 'Próximamente',
  //   partido: 'Obras',
  //   partyIcon: '/iconos_partidos/obras.jpg',
  // },
  // cerron: {
  //   id: 'cerron',
  //   nombre: 'Vladimir Cerrón Rojas',
  //   ideologia: 'Próximamente',
  //   partido: 'Perú Libre',
  //   partyIcon: '/iconos_partidos/peru_libre.jpg',
  // },
  // guevara: {
  //   id: 'guevara',
  //   nombre: 'Mesías Guevara Amasifuén',
  //   ideologia: 'Próximamente',
  //   partido: 'Partido Morado',
  //   partyIcon: '/iconos_partidos/morado.jpg',
  // },
  // olivera: {
  //   id: 'olivera',
  //   nombre: 'Fernando Olivera Vega',
  //   ideologia: 'Próximamente',
  //   partido: 'Frente Esperanza',
  //   partyIcon: '/iconos_partidos/frente_esperanza.jpg',
  // },
  // sanchez: {
  //   id: 'sanchez',
  //   nombre: 'Roberto Sánchez Palomino',
  //   ideologia: 'Próximamente',
  //   partido: 'Juntos por el Perú',
  //   partyIcon: '/iconos_partidos/juntos_peru.jpg',
  // },
};

export function listCandidates(): CandidateBase[] {
  return Object.values(candidates);
}

export function getCandidateById(id: string): CandidateBase | undefined {
  return candidates[id];
}
