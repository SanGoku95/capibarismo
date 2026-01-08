import type { MapaDePoder } from '../types';

// Mapa de poder por id de candidato.
export const mapaDePoder: Record<string, MapaDePoder> = {
  keiko: {
    alianzas: [
      {
        nombre: 'Fuerza Popular',
        descripcion:
          'Su partido político, que se convirtió en la principal fuerza de oposición con mayoría absoluta en el Congreso entre 2016 y 2019.',
      },
      {
        nombre: 'Núcleo duro fujimorista',
        descripcion:
          'Una base electoral leal y sólida, heredada de su padre, que le ha garantizado consistentemente el paso a la segunda vuelta presidencial.',
      },
      {
        nombre: 'Grupos empresariales',
        descripcion:
          'La fiscalía la acusa de recibir aportes clandestinos de importantes corporaciones como Odebrecht y Credicorp para financiar sus campañas.',
      },
    ],
    opositores: [
      {
        nombre: 'Movimiento Antifujimorista',
        descripcion:
          'Una diversa y poderosa coalición de ciudadanos y grupos políticos de diferentes ideologías que se activa electoralmente con el objetivo principal de impedir su llegada al poder.',
      },
      {
        nombre: 'Equipo de Fiscalía',
        descripcion:
          "El equipo de fiscales, liderado por José Domingo Pérez, que ha investigado el 'Caso Cócteles' y la acusa de liderar una organización criminal.",
      },
      {
        nombre: 'Rafael López Aliaga',
        descripcion:
          'Su principal rival por la hegemonía y el liderazgo del voto de la derecha en el Perú.',
      },
    ],
  },
  rafael: {
    alianzas: [
      {
        nombre: 'Renovación Popular',
        descripcion:
          'Su vehículo político personal, refundado para promover una agenda ultraconservadora y servir como plataforma para sus ambiciones.',
      },
      {
        nombre: 'Conglomerado corporativo',
        descripcion:
          "Su imperio empresarial (Grupo Acres, PeruRail, etc.) le proporciona los recursos financieros y la imagen de 'gestor exitoso' que son la base de su poder político.",
      },
      {
        nombre: 'Derecha radical internacional (Vox)',
        descripcion:
          'Se ha alineado con otras figuras de la derecha radical en Iberoamérica, como José Antonio Kast y Javier Milei, a través de su adhesión a la Carta de Madrid, una iniciativa del partido español Vox.',
      },
    ],
    opositores: [
      {
        nombre: 'Keiko Fujimori / Fujimorismo',
        descripcion:
          'Su principal rival en la contienda por la hegemonía de la derecha peruana. Representa un modelo de poder (ultraconservadurismo corporativo) que choca con el del fujimorismo (populismo de legado).',
      },
      {
        nombre: 'Prensa de investigación',
        descripcion:
          'Medios como IDL-Reporteros y OjoPúblico han publicado investigaciones exhaustivas sobre sus estructuras offshore, deudas tributarias y la gestión de sus empresas, a las que él ataca constantemente.',
      },
    ],
  },
  yonhy: {
    alianzas: [
      {
        nombre: 'Bases de Acción Popular',
        descripcion:
          'Estructura partidaria y capital político construido en Puno y el sur andino.',
      },
      {
        nombre: 'Asociaciones de consumidores',
        descripcion:
          'Redes vinculadas a agendas de regulación y protección al usuario.',
      },
    ],
    opositores: [
      {
        nombre: 'Bancadas y liderazgos de derecha',
        descripcion:
          'Choques discursivos por regulación económica y control a posiciones dominantes.',
      },
      {
        nombre: 'Grupos empresariales regulados (telcos, finanzas)',
        descripcion:
          'Resistencia a medidas pro‑consumidor y mayor fiscalización.',
      },
    ],
  },
  'carlos-alvarez': {
    alianzas: [
      {
        nombre: 'País Para Todos',
        descripcion:
          'Vehículo político (agrupación nº34 habilitada para EG-2026).',
      },
      {
        nombre: 'Vladimir Meza',
        descripcion:
          'Lidera orgánica; convoca Congreso Nacional Extraordinario 2025.',
      },
    ],
    opositores: [
      {
        nombre: 'ONGs y juristas de DD.HH.',
        descripcion:
          'Crítica a retiro del Pacto de San José y agenda punitiva.',
      },
      {
        nombre: 'Investigación fiscal al partido (2025)',
        descripcion:
          'Fiscalía abrió diligencias preliminares sobre legalidad del partido.',
      },
    ],
  },
  'cesar-acuna': {
    alianzas: [
      {
        nombre: 'Alianza para el Progreso',
        descripcion:
          'Partido político que él mismo fundó en 2001, que funciona como el brazo político de su conglomerado empresarial y vehículo para sus ambiciones.',
      },
      {
        nombre: 'Consorcio educativo',
        descripcion:
          'El motor económico y la base social de su poder. La red de estudiantes, egresados y personal constituye una base política natural y un canal de difusión de su mensaje.',
      },
    ],
    opositores: [
      {
        nombre: 'Prensa nacional y limeña',
        descripcion:
          'El intenso escrutinio de los medios de comunicación nacionales magnifica los escándalos que a nivel regional son minimizados, actuando como una barrera para sus aspiraciones presidenciales.',
      },
      {
        nombre: 'Opositores políticos regionales (Ej. Partido Aprista)',
        descripcion:
          'Su irrupción en Trujillo rompió una hegemonía de 44 años del APRA, consolidándolo como un rival directo del aprismo en el norte del país.',
      },
    ],
  }
};
