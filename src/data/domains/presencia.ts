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
  antauro: {
    plataformas: [
      {
        nombre: 'tiktok',
        handle: '@antauroigorhumalatasso',
        url: 'https://www.tiktok.com/@antauroigorhumalatasso',
        estrategia:
          'Ha lanzado una campaña para mostrar un lado más personal y humano, en respuesta a los juicios en curso. Los videos suelen ser cortos, con música de tendencia y enfocados en su vida familiar.',
      },
      {
        nombre: 'youtube',
        handle: '@antaurohumalaoficial',
        url: 'https://www.youtube.com/@antaurohumalaoficial',
        estrategia:
          'Mantiene un canal con entrevistas y resúmenes de sus actividades políticas. El contenido es más formal y dirigido a un público politizado.',
      },
      {
        nombre: 'web',
        handle: 'antaurohumala.pe',
        url: 'https://antaurohumala.pe/',
        estrategia:
          'El sitio web oficial presenta su plataforma política, noticias y eventos relacionados con su campaña.',
      },
    ],
  },
  'martin-vizcarra': {
    plataformas: [
      {
        nombre: 'tiktok',
        handle: '@mvizcarraperu',
        url: 'https://www.tiktok.com/@mvizcarraperu',
        estrategia:
          'Video corto y directo para saltarse intermediarios; mezcla de vida cotidiana, mensajes políticos y defensa frente a procesos.',
      },
      {
        nombre: 'twitter',
        handle: '@MartinVizcarraC',
        url: 'https://x.com/martinvizcarrac',
        estrategia:
          'Mensajería política y confrontación con el Congreso/Gobierno; mantiene narrativa anticorrupción.',
      },
      {
        nombre: 'web',
        handle: 'peruprimero.pe',
        url: 'https://peruprimero.pe/',
        estrategia:
          'Plataforma de propuestas y orgánica del partido; reclutamiento y agenda.',
      },
    ],
  },
  'guillermo-bermejo': {
    plataformas: [
      {
        nombre: 'tiktok',
        handle: '@guillebermejor',
        url: 'https://www.tiktok.com/@guillebermejor',
        estrategia:
          'Publica contenido relacionado con su vida política y social, utilizando un enfoque humorístico y crítico.',
      },
      {
        nombre: 'facebook',
        handle: 'GuilleBermejoR',
        url: 'https://www.facebook.com/GuilleBermejoR',
        estrategia:
          "Se identifica como socialista y miembro de 'Movimiento Todas Las Voces' y 'Bancada Juntos por el Perú - Voces del Pueblo'. Publica sobre la promoción de una Asamblea Constituyente, la defensa de los derechos laborales y sociales, y los derechos de los animales. Es un crítico vocal de la presidenta Dina Boluarte.",
      },
      {
        nombre: 'instagram',
        handle: 'guillebermejor',
        url: 'https://www.instagram.com/guillebermejor',
        estrategia: 'No se pudo acceder a la información de este perfil.',
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
  phillip: {
    plataformas: [
      {
        nombre: 'web',
        url: 'https://pbo.pe/',
        estrategia:
          'Centro de operaciones: streaming en vivo, agenda y posicionamiento.',
      },
      {
        nombre: 'youtube',
        url: 'https://www.youtube.com/channel/UCgR0st4ZLABi-LQcWNu3wnQ',
        estrategia:
          "Programas diarios y lives como vehículo de campaña (‘Combutters’/PBO).",
      },
      {
        nombre: 'instagram',
        handle: '@phillipbuttersperu',
        url: 'https://www.instagram.com/phillipbuttersperu/',
        estrategia: 'Narrativa de precandidatura y microclips de propuestas.',
      },
      {
        nombre: 'facebook',
        url: 'https://www.facebook.com/PBOPeru/',
        estrategia:
          'Amplificación de contenidos de PBO y posicionamiento político.',
      },
      {
        nombre: 'twitter',
        url: 'https://x.com/pboperu',
        estrategia: 'Mensajería rápida y enlaces a transmisiones.',
      },
    ],
  },
};
