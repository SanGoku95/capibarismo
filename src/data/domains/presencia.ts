import type { PresenciaDigital } from '../types';

// Presencia digital por id de candidato.
export const presencia: Record<string, PresenciaDigital> = {
  keiko: {
    plataformas: [
      {
        nombre: 'tiktok',
        handle: '@keikofujimorih',
        url: 'https://www.tiktok.com/@keikofujimorih',
        estrategia:
          'Su plataforma más dinámica. Mezcla contenido político con videos personales (cocinando, bailando) para humanizar su figura y conectar con un público más joven.',
      },
      {
        nombre: 'youtube',
        handle: '@keikofujimorih',
        url: 'https://www.youtube.com/@keikofujimorih',
        estrategia:
          "Utiliza formatos largos como la serie 'Konfesiones' para contar su propia versión de su vida y batallas legales, en un intento de controlar la narrativa y apelar a la empatía.",
      },
    ],
  },
  rafael: {
    plataformas: [
      {
        nombre: 'twitter',
        handle: '@rlopezaliaga_',
        url: 'https://x.com/rlopezaliaga_',
        estrategia:
          "Estilo confrontacional. Ha usado las cuentas oficiales de la municipalidad para atacar a los medios de comunicación ('pasquines mermeleros') y bloquear a críticos, como la Red de Ollas Comunes.",
      },
      {
        nombre: 'facebook',
        handle: 'RafaelLopezAliaga',
        url: 'https://www.facebook.com/RafaelLopezAliaga/',
        estrategia:
          'Comunica los avances de su gestión y mantiene una línea de mensajes de corte conservador y populista para movilizar a su base electoral.',
      },
    ],
  },
  yonhy: {
    plataformas: [
      {
        nombre: 'twitter',
        handle: '@yonhy_lescano',
        url: 'https://x.com/yonhy_lescano',
        estrategia:
          'Canal principal para posicionamiento político y comentarios de coyuntura.',
      },
      {
        nombre: 'facebook',
        handle: 'YonhyLescanoOficial',
        url: 'https://www.facebook.com/YonhyLescanoOficial',
        estrategia:
          'Publicación de actividades, posiciones y transmisiones en vivo para base regional.',
      },
    ],
  },
  'carlos-alvarez': {
    plataformas: [
      {
        nombre: 'tiktok',
        handle: '@carlosalvarez_tiktok',
        url: 'https://www.tiktok.com/@carlosalvarez_tiktok',
        estrategia:
          'Canal principal (≈565k seguidores) para posicionar discurso de orden.',
      },
      {
        nombre: 'instagram',
        handle: 'carlosalvarezoficial_',
        url: 'https://www.instagram.com/carlosalvarezoficial_/',
        estrategia:
          'Clips de coyuntura y antiprivilegios; movilización de base.',
      },
      {
        nombre: 'facebook',
        handle: 'Carlos Alvarez Oficial',
        url: 'https://www.facebook.com/CARLOSALVAREZYLASMILVOCES/',
        estrategia:
          'Comunicados, transmisiones y reacciones a hechos de seguridad.',
      },
      {
        nombre: 'web',
        handle: 'Partido País Para Todos',
        url: 'https://partidopaisparatodos.org.pe/',
        estrategia: 'Estructura y documentos orgánicos del partido.',
      },
    ],
  },
  'cesar-acuna': {
    plataformas: [
      {
        nombre: 'tiktok',
        handle: '@cesaracunap',
        url: 'https://www.tiktok.com/@cesaracunap',
        estrategia:
          'Adopta un tono informal y participa en tendencias virales para conectar con audiencias más jóvenes que no consumen medios tradicionales.',
      },
      {
        nombre: 'facebook',
        handle: 'CesarAcunaP',
        url: 'https://www.facebook.com/CesarAcunaP/',
        estrategia:
          'Es uno de los políticos peruanos con mayor inversión en publicidad pagada en Facebook e Instagram, lo que le permite mantener una presencia constante y dirigir mensajes segmentados.',
      },
    ],
  },
  'lopez-chau': {
    plataformas: [
      {
        nombre: 'twitter',
        handle: '@AlfonsoLopezCh',
        url: 'https://twitter.com/AlfonsoLopezCh',
        estrategia:
          'Usa Twitter para expresar opiniones sobre coyuntura política y defender la autonomía universitaria.',
      },
      {
        nombre: 'facebook',
        handle: 'Alfonso Lopez Chau',
        url: 'https://www.facebook.com/AlfonsoLopezChauOficial',
        estrategia:
          'Comparte videos de entrevistas, discursos en la UNI y actividades académicas.',
      },
    ],
  },
  belmont: {
    plataformas: [],
  },
  cerron: {
    plataformas: [],
  },
  guevara: {
    plataformas: [],
  },
  olivera: {
    plataformas: [],
  },
  sanchez: {
    plataformas: [],
  },
};
