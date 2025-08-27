export interface Candidate {
  id: string;
  nombre: string;
  ideologia: string;
  headshot: string;
  fullBody: string;

  proyectoPolitico: {
    titulo: string;
    resumen: string;
    detalles?: {
      subtitulo: string;
      texto: string;
      fuente?: string;
    }[];
  };
  creenciasClave: {
    id: string;
    nombre: string;
    resumen: string;
    detalle?: string;
    fuente?: string;
  }[];
  trayectoria: {
    id: string;
    rol: string;
    periodo: string;
    descripcion: string;
    detalles?: {
      subtitulo: string;
      texto: string;
      fuente?: string;
    }[];
    fuente?: string;
  }[];
  presenciaDigital: {
    plataformas: {
      nombre: 'tiktok' | 'youtube' | 'instagram' | 'facebook' | 'twitter' | 'web';
      handle?: string;
      url: string;
      estrategia: string;
    }[];
  };
  mapaDePoder: {
    alianzas: {
      nombre: string;
      descripcion: string;
    }[];
    opositores: {
      nombre: string;
      descripcion: string;
    }[];
    seguidores: string;
  };
  // Compass coordinates
  econ?: number;
  social?: number;
  education?: string;
  security?: string;
  health?: string;
}

export const candidates: Candidate[] = [
  {
    id: "keiko",
    nombre: "Keiko Fujimori",
    ideologia: "Centro-derecha",
    proyectoPolitico: {
      titulo: "Plan Keiko Libre",
      resumen: "Estabilidad económica para recuperar el orden y la seguridad en el país.",
      detalles: [
        {
          subtitulo: "Seguridad Ciudadana 'Mano Dura'",
          texto: "Implementación de políticas de seguridad más estrictas, aumentando la presencia policial y militar en zonas de alta criminalidad. Propone reformar el sistema penitenciario para reducir el hacinamiento y controlar las operaciones delictivas desde las cárceles."
        },
        {
          subtitulo: "Reactivación Económica",
          texto: "Fomento de la inversión privada a través de la simplificación de trámites y la creación de zonas económicas especiales. Propone un shock de inversión en infraestructura para generar empleo a corto plazo."
        }
      ]
    },
    creenciasClave: [
      { id: "estabilidad-economica", nombre: "Estabilidad económica", resumen: "Prioriza un modelo de libre mercado, control de la inflación y responsabilidad fiscal.", detalle: "Defiende la autonomía del Banco Central de Reserva y busca atraer inversión extranjera directa como pilar del crecimiento, manteniendo los tratados de libre comercio existentes y buscando nuevos mercados." },
      { id: "seguridad-ciudadana", nombre: "Seguridad ciudadana", resumen: "Cree en una política de 'mano dura' contra la delincuencia.", detalle: "Propone equipar mejor a la Policía Nacional, reformar el sistema de inteligencia y aplicar sentencias más severas para delitos graves. Considera la participación de las Fuerzas Armadas en roles de seguridad interna." },
      { id: "inversion-privada", nombre: "Inversión privada", resumen: "Considera a la inversión privada como el principal motor del desarrollo.", detalle: "Busca reducir la burocracia para las empresas y ofrecer garantías jurídicas a los inversores. Su plan incluye la promoción de Asociaciones Público-Privadas (APP) para grandes proyectos." }
    ],
    trayectoria: [
      {
        id: "lider-fuerza-popular",
        rol: "Líder de Fuerza Popular",
        periodo: "2011 - Presente",
        descripcion: "Candidata presidencial en 2011, 2016 y 2021, consolidando un bloque político importante.",
        detalles: [
          {
            subtitulo: "Campañas Presidenciales",
            texto: "Ha sido la figura central del fujimorismo post-dictadura, llegando a segunda vuelta en dos ocasiones. Su liderazgo ha mantenido al partido como una fuerza relevante en el Congreso, aunque también ha enfrentado un fuerte rechazo (antifujimorismo)."
          }
        ]
      },
      { id: "congresista-2006", rol: "Congresista", periodo: "2006 - 2011", descripcion: "La congresista más votada en las elecciones de 2006." },
      { id: "primera-dama-1994", rol: "Primera Dama", periodo: "1994 - 2000", descripcion: "Asumió el rol tras la separación de sus padres, enfocándose en temas sociales." }
    ],
    presenciaDigital: {
      plataformas: [
        { nombre: "tiktok", handle: "@candidata1", url: "", estrategia: "Ha lanzado una campaña para mostrar un lado más personal y humano, en respuesta a los juicios en curso. Los videos suelen ser cortos, con música de tendencia y enfocados en su vida familiar." },
        { nombre: "youtube", handle: "@candidata1", url: "", estrategia: "Mantiene un canal con entrevistas y resúmenes de sus actividades políticas. El contenido es más formal y dirigido a un público politizado." },
        { nombre: "twitter", handle: "@candidata1", url: "", estrategia: "Activa con comunicados oficiales y respuestas a la coyuntura política. Es su principal canal para fijar la posición del partido." }
      ]
    },
    mapaDePoder: {
      alianzas: [
        { nombre: "Sector empresarial conservador", descripcion: "Grupos económicos que buscan estabilidad, políticas pro-mercado y predictibilidad." },
        { nombre: "Grupos religiosos", descripcion: "Organizaciones que coinciden con su agenda de valores tradicionales y conservadurismo social." }
      ],
      opositores: [
        { nombre: "Antifujimorismo", descripcion: "Un movimiento social y político diverso que se opone a su figura por el legado del gobierno de su padre." },
        { nombre: "Sectores de izquierda", descripcion: "Partidos y movimientos que se oponen a su modelo económico y social." }
      ],
      seguidores: "Aprox. 2.5M en redes"
    },
    headshot: "https://pbs.twimg.com/profile_images/1876955744525856768/1H9ukeEv_400x400.jpg",
    fullBody: "/src/data/fotos_candidatos/keiko/full_body_keiko.png",
    education: "pro",
    security: "pro",
    health: "anti"
  },
  {
    id: "rafael",
    nombre: "Rafael López Aliaga",
    ideologia: "Derecha",
    proyectoPolitico: {
      titulo: "Orden y Desarrollo",
      resumen: "Gobierno empresarial con enfoque en desarrollo económico y valores tradicionales para un Perú seguro y próspero."
    },
    creenciasClave: [
      { id: "libre-mercado", nombre: "Libre mercado", resumen: "Promueve la menor intervención del estado en la economía.", detalle: "Busca eliminar regulaciones que considera excesivas y fomentar la competencia. Defiende la propiedad privada y la libertad de empresa como pilares del desarrollo." },
      { id: "valores-familiares", nombre: "Valores familiares", resumen: "Defiende la familia tradicional como base de la sociedad.", detalle: "Se opone a la legalización de uniones no tradicionales y busca promover políticas que fortalezcan a la familia nuclear." },
      { id: "crecimiento-economico", nombre: "Crecimiento económico", resumen: "Considera esencial el aumento sostenido del PIB y la inversión en infraestructura.", detalle: "Propone grandes proyectos de infraestructura pública y privada, así como incentivos fiscales para empresas." },
      { id: "seguridad", nombre: "Seguridad", resumen: "Cree en un enfoque integral que incluya prevención, control y reinserción.", detalle: "Propone programas de capacitación y empleo para reclusos, así como medidas de protección a víctimas de la delincuencia." }
    ],
    trayectoria: [
      { id: "alcalde-lima-2023", rol: "Alcalde de Lima", periodo: "2023 - Presente", descripcion: "Enfocado en la recuperación económica y la seguridad ciudadana." },
      { id: "empresario-1990", rol: "Empresario", periodo: "1990 - 2023", descripcion: "Desarrollo de proyectos empresariales exitosos en diversos sectores." },
      { id: "candidato-2021", rol: "Candidato", periodo: "2021 - 2021", descripcion: "Participación en las elecciones presidenciales de 2021." }
    ],
    presenciaDigital: {
      plataformas: [
        { nombre: "tiktok", handle: "@candidata1", url: "", estrategia: "Ha lanzado una campaña para mostrar un lado más personal y humano, en respuesta a los juicios en curso. Los videos suelen ser cortos, con música de tendencia y enfocados en su vida familiar." },
        { nombre: "youtube", handle: "@candidata1", url: "", estrategia: "Mantiene un canal con entrevistas y resúmenes de sus actividades políticas. El contenido es más formal y dirigido a un público politizado." },
        { nombre: "twitter", handle: "@candidata1", url: "", estrategia: "Activa con comunicados oficiales y respuestas a la coyuntura política. Es su principal canal para fijar la posición del partido." }
      ]
    },
    mapaDePoder: {
      alianzas: [
        { nombre: "Empresarios", descripcion: "Grupos que apoyan políticas pro-mercado y buscan estabilidad económica." },
        { nombre: "Iglesia Católica", descripcion: "Organización religiosa que apoya su visión conservadora y su enfoque en valores familiares." },
        { nombre: "Organizaciones de seguridad", descripcion: "Grupos que respaldan su enfoque en la seguridad ciudadana y el orden público." }
      ],
      opositores: [
        { nombre: "Sectores progresistas", descripcion: "Grupos que se oponen a su modelo económico y a sus posiciones sobre derechos sociales." },
        { nombre: "Sindicalistas", descripcion: "Organizaciones que agrupan a trabajadores y que se oponen a sus políticas laborales." }
      ],
      seguidores: "Aprox. 1.2M en redes"
    },
    headshot: "https://pbs.twimg.com/profile_images/1372582295987757058/P2yzmjJP_400x400.jpg",
    fullBody: "/src/data/fotos_candidatos/rafael/full_body_rafael.png",
    econ: 8,
    social: 7,
    education: "neutral",
    security: "pro",
    health: "anti"
  },
  {
    id: "yonhy",
    nombre: "Yonhy Lescano",
    ideologia: "Centro",
    proyectoPolitico: {
      titulo: "Propuesta Centrista",
      resumen: "Un enfoque equilibrado que prioriza la institucionalidad y el diálogo nacional para el desarrollo del país."
    },
    creenciasClave: [
      { id: "institucionalidad", nombre: "Institucionalidad", resumen: "Cree en el fortalecimiento de las instituciones del estado.", detalle: "Propone reformas para garantizar la independencia y eficiencia del poder judicial, así como el fortalecimiento de organismos autónomos." },
      { id: "transparencia", nombre: "Transparencia", resumen: "Defiende la apertura y el acceso a la información pública.", detalle: "Busca implementar políticas de gobierno abierto y rendición de cuentas. Promueve el uso de tecnología para facilitar el acceso a la información." },
      { id: "dialogo-nacional", nombre: "Diálogo nacional", resumen: "Considera esencial la comunicación entre todos los sectores de la sociedad.", detalle: "Propone la creación de espacios de diálogo entre el gobierno, la empresa privada y la sociedad civil." },
      { id: "desarrollo-sostenible", nombre: "Desarrollo sostenible", resumen: "Promueve un equilibrio entre el crecimiento económico, la inclusión social y la protección del medio ambiente.", detalle: "Busca implementar políticas que fomenten el uso responsable de los recursos naturales y la inversión en energías renovables." }
    ],
    trayectoria: [
      { id: "congresista-2020", rol: "Congresista", periodo: "2020 - Presente", descripcion: "Trabajo en comisiones de justicia y defensa del consumidor." },
      { id: "periodista-2000", rol: "Periodista", periodo: "2000 - 2020", descripcion: "Labor en medios de comunicación y análisis político." },
      { id: "abogado-1985", rol: "Abogado", periodo: "1985 - 2000", descripcion: "Ejercicio de la abogacía y defensa de derechos humanos." }
    ],
    presenciaDigital: {
      plataformas: [
        { nombre: "tiktok", handle: "@candidata1", url: "", estrategia: "Ha lanzado una campaña para mostrar un lado más personal y humano, en respuesta a los juicios en curso. Los videos suelen ser cortos, con música de tendencia y enfocados en su vida familiar." },
        { nombre: "youtube", handle: "@candidata1", url: "", estrategia: "Mantiene un canal con entrevistas y resúmenes de sus actividades políticas. El contenido es más formal y dirigido a un público politizado." },
        { nombre: "twitter", handle: "@candidata1", url: "", estrategia: "Activa con comunicados oficiales y respuestas a la coyuntura política. Es su principal canal para fijar la posición del partido." }
      ]
    },
    mapaDePoder: {
      alianzas: [
        { nombre: "Organizaciones de derechos humanos", descripcion: "Grupos que defienden los derechos fundamentales y luchan contra la corrupción." },
        { nombre: "Medios de comunicación", descripcion: "Organizaciones que apoyan la libertad de prensa y expresión." }
      ],
      opositores: [
        { nombre: "Corrupción", descripcion: "Prácticas corruptas en la política y la administración pública." },
        { nombre: "Abusos de poder", descripcion: "Acciones de autoridades que violan los derechos de los ciudadanos." }
      ],
      seguidores: "Aprox. 900K en redes"
    },
    headshot: "https://pbs.twimg.com/profile_images/991790180129476608/w-QUgKQT_400x400.jpg",
    fullBody: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Yonhy_Lescano_4.jpg/1280px-Yonhy_Lescano_4.jpg",
    econ: 2,
    social: 1,
    education: "pro",
    security: "neutral",
    health: "pro"
  },
  {
    id: "antauro",
    nombre: "Antauro Humala Tasso",
    ideologia: "Izquierda Autoritaria",
    headshot: "https://pbs.twimg.com/profile_images/1561766942150737923/BJmWxtlq_400x400.jpg",
    fullBody: "/src/data/fotos_candidatos/antauro/full_body_antauro.jpg",
    proyectoPolitico: {
      titulo: "Refundación Etnocacerista y Socialista",
      resumen: "Estatismo con énfasis en identidad andina y disciplina militar.",
      detalles: [
        {
          subtitulo: "Asamblea Constituyente y Nueva Constitución",
          texto:
            "Derogar la Carta de 1993 y redactar una Constitución que reconozca a la 'raza cobriza' como eje identitario y declare al Estado soberano sobre recursos estratégicos.",
          fuente: "https://isbn.bnp.gob.pe/catalogo.php?mode=detalle&nt=23661"
        },
        {
          subtitulo: "Pena de Muerte por 'Traición a la Patria'",
          texto:
            "Aplicar pena capital a presidentes y altos funcionarios corruptos, violadores de niños y narcotraficantes calificados.",
          fuente: "https://www.youtube.com/watch?v=ox4vL808Ba4"
        },
        {
          subtitulo: "Modelo Económico: Socialismo, Soberanía y Nacionalización",
          texto:
            "Revisar concesiones de gas, minería y pesca, nacionalizar sectores clave y formalizar la minería informal bajo tutela estatal; defensa abierta de mineros artesanales frente a transnacionales.",
          fuente: "https://antaurohumala.pe/"
        },
        {
          subtitulo: "Reforma Agraria y Redistribución Demográfica",
          texto:
            "Impulsar una segunda reforma agraria, relocalizar población desde la costa a zonas alto‑andinas y amazónicas para reducir desempleo y desnutrición.",
          fuente: "https://antaurohumala.pe/"
        },
        {
          subtitulo: "Unidad Nacionalismo‑Izquierda y RUNASUR",
          texto:
            "Construir un bloque nacionalista‑socialista interno y promover la integración latinoamericana vía RUNASUR contra el neoliberalismo y la injerencia extranjera.",
          fuente: "https://www.youtube.com/watch?v=gf17QftscYU"
        }
      ]
    },

    creenciasClave: [
      {
        id: "etnocacerismo",
        nombre: "Etnocacerismo y velasquimo como doctrina",
        resumen: "Identidad andina (‘raza cobriza’) como base de la nación.",
        detalle: "Nacionalismo étnico‑militar inspirado en Andrés Avelino Cáceres.",
        fuente: "https://antaurohumala.pe/libros/"
      },
      {
        id: "democracia-directa",
        nombre: "Crítica a la 'Falsa Democracia'",
        resumen: "Sistema capturado por élites criollas y extranjeras.",
        detalle: "Aboga por control popular permanente y revocatoria de autoridades.",
        fuente: "https://antaurohumala.pe/libros/"
      },
      {
        id: "orden-militarista",
        nombre: "Orden y Disciplina Militar",
        resumen: "Autoridad firme como remedio a la corrupción.",
        detalle: "Valores castrenses para imponer disciplina social y administrativa.",
        fuente: "https://antaurohumala.pe/libros/"
      },
      {
        id: "antiimperialismo",
        nombre: "Unidad Latinoamericana Anti Imperialismo",
        resumen: "Confluencia de pueblos del Sur contra neoliberalismo y hegemonía extranjera.",
        detalle: "Promueve Runasur y alianzas con Evo Morales para un bloque socialista andino‑amazónico.",
        fuente: "https://www.youtube.com/watch?v=gf17QftscYU"
      }
    ],

    trayectoria: [
      {
        id: "infancia-formacion",
        rol: "Niñez y formación",
        periodo: "1963 – 1980",
        descripcion: "Creció en familia nacionalista; educación bilingüe en Lima y Cusco con énfasis andino.",
        fuente: "https://es.wikipedia.org/wiki/Antauro_Humala",
        detalles: [
          {
            subtitulo: "Influencias familiares",
            texto: "Padre Isaac Humala inculcó misión política y nombres incaicos."
          },
          {
            subtitulo: "Educación escolar",
            texto: "Peruano Japonés, Franco Peruano y Ciencias del Cusco; contacto temprano con historia incaica."
          },
          {
            subtitulo: "Logia de tenientes",
            texto: "Fundó la primera célula etnocacerista en 1989 dentro del Ejército."
          }
        ]
      },
      {
        id: "militar",
        rol: "Mayor del Ejército Peruano (en retiro)",
        periodo: "1980 – 2000",
        descripcion: "Combatió a Sendero Luminoso y en el Cenepa; baja en 1998 por activismo doctrinario.",
        fuente: "https://es.wikipedia.org/wiki/Antauro_Humala"
      },
      {
        id: "lider-etnocacerista",
        rol: "Fundador del Movimiento Etnocacerista (MEC)",
        periodo: "2000 – Presente",
        descripcion: "Ideólogo; levantamientos de Locumba (2000) y Andahuaylazo (2005) con 6 muertos.",
        fuente: "https://es.wikipedia.org/wiki/Antauro_Humala",
        detalles: [
          {
            subtitulo: "Levantamientos Armados",
            texto: "Objetaron legitimidad de Fujimori y Toledo; resultaron en condena de 19 años."
          }
        ]
      },
      {
        id: "prision-liberacion",
        rol: "Reo y excarcelado",
        periodo: "2005 – 2022",
        descripcion: "Cumplió 17 años y salió por redención de pena; desde la cárcel articuló base reservista.",
        fuente: "https://es.wikipedia.org/wiki/Antauro_Humala"
      },
      {
        id: "lider-partido-antauro",
        rol: "Líder del partido A.N.T.A.U.R.O.",
        periodo: "2023 – Presente",
        descripcion: "Intento de inscripción anulado por JNE; busca alianza con Juntos por el Perú para 2026.",
        fuente: "https://es.wikipedia.org/wiki/Antauro_Humala"
      }
    ],

    presenciaDigital: {
      plataformas: [
        { nombre: "tiktok", handle: "@antauroigorhumalatasso", url: "https://www.tiktok.com/@antauroigorhumalatasso", estrategia: "Ha lanzado una campaña para mostrar un lado más personal y humano, en respuesta a los juicios en curso. Los videos suelen ser cortos, con música de tendencia y enfocados en su vida familiar." },
        { nombre: "youtube", handle: "@antaurohumalaoficial", url: "https://www.youtube.com/@antaurohumalaoficial", estrategia: "Mantiene un canal con entrevistas y resúmenes de sus actividades políticas. El contenido es más formal y dirigido a un público politizado." },
        { nombre: "web", handle: "antaurohumala.pe", url: "https://antaurohumala.pe/", estrategia: "El sitio web oficial presenta su plataforma política, noticias y eventos relacionados con su campaña." }]
    },

    mapaDePoder: {
      alianzas: [
        {
          nombre: "Ina Andrade de Humala, Máximo Grillo, Edwin Morales, Luzmila Ayay, Armando Masse, Fabian Quispe, Carmen Huidobro, Pilar Roca",
          descripcion: "Columna vertebral del movimiento; redes de excombatientes."
        },
        {
          nombre: "Reservistas y Veteranos de las FFAA",
          descripcion: "Columna vertebral del movimiento; redes de excombatientes."
        },
        {
          nombre: "Juntos por el Perú (Verónika Mendoza), Partido Democrático Federal",
          descripcion: "Alianza electoral para Asamblea Constituyente y programa anticorrupción."
        },
        {
          nombre: "Sindicatos y Gremios de Base",
          descripcion: "Trabajadores agrícolas, mineros informales y obreros que respaldan agenda soberanista."
        }
      ],
      opositores: [
        {
          nombre: "Grandes Grupos de Medios",
          descripcion: "Acusados de encubrir corrupción; amenazados con expropiación."
        },
        {
          nombre: "Ollanta Humala y Partido Nacionalista",
          descripcion: "Ruptura fraterna irreversible tras Andahuaylazo y caso Odebrecht."
        }
      ],
      seguidores:
        "Reservistas, etnocaceristas y sectores rurales andinos sensibles al discurso punitivo y anti‑establishment."
    }
  },
  {
  id: "martin-vizcarra",
  nombre: "Martín Alberto Vizcarra Cornejo",
  ideologia: "Centrista tecnocrático, descentralización",
  headshot: "https://commons.wikimedia.org/wiki/Special:FilePath/Mart%C3%ADn%20Vizcarra%20Cornejo%20(square%20portrait).png?width=150&height=150",
  fullBody: "https://www.perureports.com/wp-content/uploads/2018/03/vizcarra-768x513.jpg",

  proyectoPolitico: {
    titulo: "Reforma institucional anticorrupción y descentralización",
    resumen:
      "Reformas al sistema político y promocionando la descentralización del Perú.",
    detalles: [
      {
        subtitulo: "Indulto a Pedro Castillo y PPK",
        texto:
          "Vizcarra declara que si él fuera presidente y Castillo estuviera condenado, le otorgaría un indulto.",
        fuente: "https://www.youtube.com/watch?v=63KPi2KAvNk&t=817s"
      },
      {
        subtitulo: "Minería: 'licencia social' y manejo de conflictos",
        texto:
          "Suspendió la licencia de construcción de Tía María en 2019 mientras no hubiera condiciones sociales; en Moquegua promovió diálogo y acuerdos con Anglo American (Quellaveco).",
        fuente: "https://www.nodal.am/2019/08/peru-el-gobierno-suspende-la-licencia-de-construccion-al-proyecto-minero-tia-maria-tras-semanas-de-protestas/"
      },
      {
        "subtitulo": "Seguridad ciudadana: Expulsión de delincuentes extranjeros e intervención de FFAA",
        "texto": "Propone no permitir que delincuentes venezolanos se queden en el país y expulsarlos en aviones, como afirma que se hacía durante su gobierno.En caso de asumir la presidencia, declararía el 'estado de sitio' para una intervención inmediata de las Fuerzas Armadas en problemas internos.",
        "fuente": "https://www.youtube.com/watch?v=qBnBVfMoPbs"
      }
    ]
  },

  creenciasClave: [
    {
      id: "anticorrupcion-institucional",
      nombre: "Anticorrupción por rediseño institucional",
      resumen: "Usó referéndum y cuestión de confianza para forzar cambios.",
      detalle: "Reformas a financiamiento político, eliminación de reelección inmediata de congresistas y pulso constante con un Congreso opositor.",
      fuente: "https://www.reuters.com/article/world/peruvians-back-anti-corruption-reforms-in-referendum-exit-poll-idUSKBN1O80L9/"
    },
    {
      id: "descentralizacion",
      nombre: "Descentralización pragmática",
      resumen: "Formado políticamente en Moquegua; enfoque en gestión regional.",
      detalle: "Mesa de diálogo en conflictos mineros; negociación para beneficios locales en Quellaveco.",
      fuente: "https://www.sciencedirect.com/science/article/am/pii/S2214790X20301441"
    },
    {
      id: "mineria-licencia-social",
      nombre: "Crecimiento con 'licencia social'",
      resumen: "No imponer proyectos con rechazo social activo.",
      detalle: "Suspensión de Tía María mientras no existan condiciones; simultáneamente impulso de Quellaveco.",
      fuente: "https://conexionambiental.pe/tia-maria-un-conflicto-con-final-inesperado/"
    }
  ],

  trayectoria: [
    {
      id: "formacion",
      rol: "Ingeniero civil (UNI) y gestor",
      periodo: "1963 – 2010",
      descripcion: "Nacido en Lima; carrera técnica y activismo regional en Moquegua.",
      fuente: "https://en.wikipedia.org/wiki/Mart%C3%ADn_Vizcarra"
    },
    {
      id: "gobernador-moquegua",
      rol: "Gobernador Regional de Moquegua",
      periodo: "2011 – 2014",
      descripcion: "Gestión con diálogo minero y mejora en indicadores sociales.",
      fuente: "https://en.wikipedia.org/wiki/Mart%C3%ADn_Vizcarra"
    },
    {
      id: "mtc-chinchero",
      rol: "Ministro de Transportes y Comunicaciones",
      periodo: "2016 – 2017",
      descripcion: "Renunció en medio de la controversia por la adenda del Aeropuerto de Chinchero.",
      fuente: "https://es.wikipedia.org/wiki/Caso_Chinchero"
    },
    {
      id: "vice-embajador",
      rol: "Primer Vicepresidente / Embajador en Canadá",
      periodo: "2016 – 2018",
      descripcion: "Sale del MTC, pasa a la embajada; regresa al suceder a PPK.",
      fuente: "https://en.wikipedia.org/wiki/Mart%C3%ADn_Vizcarra"
    },
    {
      id: "presidencia",
      rol: "Presidente del Perú (60.º)",
      periodo: "2018 – 2020",
      descripcion: "Referéndum de reformas (2018) y cierre del Congreso (2019) para destrabar agenda; COVID-19 golpea duro.",
      fuente: "https://www.theguardian.com/world/2019/oct/01/perus-president-dissolves-congress-to-push-through-anti-corruption-reforms"
    },
    {
      id: "vacancia-2020",
      rol: "Destituido por 'incapacidad moral'",
      periodo: "Nov 2020",
      descripcion: "Congreso vota 105–16 para removerlo; protestas masivas; Merino dura 6 días.",
      fuente: "https://en.wikipedia.org/wiki/Second_impeachment_and_removal_of_Mart%C3%ADn_Vizcarra"
    },
    {
      id: "vacunagate-inhabilitacion",
      rol: "Inhabilitado por 10 años (Vacunagate)",
      periodo: "2021 – 2031 (vigente)",
      descripcion: "Congreso lo sanciona por vacunación irregular con Sinopharm.",
      fuente: "https://www.reuters.com/world/americas/peruvian-ex-president-vizcarra-banned-public-office-over-vaccines-scandal-2021-04-17/"
    },
    {
      id: "peru-primero",
      rol: "Fundador de Perú Primero",
      periodo: "2021 – Presente",
      descripcion: "Partido inscrito; Vizcarra no puede postular mientras rija la inhabilitación.",
      fuente: "https://rpp.pe/politica/elecciones/martin-vizcarra-rechazan-anular-inscripcion-del-partido-peru-primero-al-registro-de-organizaciones-politicas-noticia-1639174"
    },
    {
      id: "nueva-inhabilitacion-2025",
      rol: "Tercera inhabilitación (10 años) por cierre del Congreso en 2019",
      periodo: "Jun 2025 – 2035 (si queda firme)",
      descripcion: "El Congreso oficializa otra inhabilitación por infracción al art. 134.",
      fuente: "https://comunicaciones.congreso.gob.pe/noticias/congreso-inhabilita-por-10-anos-al-expresidente-martin_vizcarra-por-cierre-del-congreso/"
    },
    {
      id: "juicio-lomas-hospital",
      rol: "Juicio oral por presuntos sobornos (Moquegua)",
      periodo: "2024 – Presente",
      descripcion: "Fiscalía pide 15 años por cohecho (Lomas de Ilo y Hospital de Moquegua). En junio 2025 un juez niega prisión preventiva y le impone impedimento de salida por 6 meses.",
      fuente: "https://gestion.pe/peru/politica/martin-vizcarra-conoce-la-cronologia-del-caso-lomas-de-ilo-y-hospital-de-moquegua-noticia/"
    },
    {
      id: "audiencia-2025",
      rol: "Medidas restrictivas en vez de preventiva",
      periodo: "Jun 2025",
      descripcion: "Juez rechaza preventiva; mantiene restricciones mientras sigue el juicio.",
      fuente: "https://www.reuters.com/latam/domestico/WSUYDLDSGNI3RCZBGDVZAYYMVE-2025-06-28/"
    }
  ],
  presenciaDigital: {
    plataformas: [
      {
        nombre: "tiktok",
        handle: "@mvizcarraperu",
        url: "https://www.tiktok.com/@mvizcarraperu",
        estrategia:
          "Video corto y directo para saltarse intermediarios; mezcla de vida cotidiana, mensajes políticos y defensa frente a procesos."
      },
      {
        nombre: "twitter",
        handle: "@MartinVizcarraC",
        url: "https://x.com/martinvizcarrac",
        estrategia:
          "Mensajería política y confrontación con el Congreso/Gobierno; mantiene narrativa anticorrupción."
      },
      {
        nombre: "web",
        handle: "peruprimero.pe",
        url: "https://peruprimero.pe/",
        estrategia:
          "Plataforma de propuestas y orgánica del partido; reclutamiento y agenda."
      }
    ]
  },

  mapaDePoder: {
    alianzas: [
      {
        nombre: "Perú Primero",
        descripcion: "Estructura partidaria propia (inscrita) usada como vehículo de retorno político, aunque él esté inhabilitado."
      },
      {
        nombre: "Redes de técnicos/gestores regionales",
        descripcion: "Afinidades con perfiles tecnocráticos y cuadros subnacionales (herencia moqueguana/mesa de diálogo)."
      },
      {
        nombre: "Somos Perú (elecciones 2021)",
        descripcion: "Alianza táctica para postular al Congreso; ganó curul pero no pudo asumir por inhabilitación 2021."
      }
    ],
    opositores: [
      {
        nombre: "Bloque congresal opositor (varias bancadas, incluido fujimorismo)",
        descripcion: "Confrontación desde 2018–2020; lideró la vacancia 2020 y posteriores inhabilitaciones 2021 y 2025."
      },
      {
        nombre: "Sectores pro-Tía María",
        descripcion: "Crítica empresarial y política por suspensión de licencia en 2019."
      }
    ],
    seguidores:
      "Base digital jóven/urbano, electorado anticorrupción y parte del sur andino con memoria favorable de su gestión regional."
  }
},
  {
    id: "guillermo-bermejo",
    nombre: "Guillermo Bermejo Rojas",
    ideologia: "Marxista-Leninista, Socialista, Izquierda",
    headshot: "https://pbs.twimg.com/profile_images/1711746019795382272/ROaxERZY_400x400.jpg",
    fullBody: "https://cloudfront-us-east-1.images.arcpublishing.com/infobae/4HNCFGPR7ZHC7BABQDM7ADFTXE.jpg",
    proyectoPolitico: {
      titulo: "Refundación socialista",
      resumen: "Nueva Constitución, criticando el modelo neoliberal y abogando por un rol más activo del Estado en la economía y la sociedad.",
      detalles: [
        {
          subtitulo: "Asamblea Constituyente y Nueva Constitución",
          texto: "Considera la Constitución de 1993 inadecuada y aboga por una nueva Constitución creada por el pueblo peruano a través de recolección de firmas, enfatizando la democracia participativa.",
          fuente: "https://www.youtube.com/watch?v=idwJ4xaDfZE"
        },
        {
          subtitulo: "Modelo Económico: Industrialización y Crítica al Neoliberalismo",
          texto: "Defiende la industrialización de los recursos naturales para generar valor agregado, crear empleos y atraer inversiones, en lugar de ser solo un exportador de materias primas. Rechaza el neoliberalismo y la 'rancia oligarquía' del país, abogando por un papel más protagónico del Estado en la economía.",
          fuente: "https://www.youtube.com/watch?v=PMm960A6ZHA"
        },
        {
          subtitulo: "Propuestas Sociales y Legislativas",
          texto: "Apoya la reforma agraria y la atención a la crisis alimentaria, señalando la baja producción de fertilizantes. Propone programas sociales eficientes, acceso a agua potable y educación. Ha presentado proyectos de ley para aumentar penas por contaminación ambiental, garantizar posesión de inmuebles en procesos judiciales y establecer asignaciones económicas para licenciados de las Fuerzas Armadas y rondas campesinas. También impulsó la derogación del aumento salarial de la Presidenta.",
          fuente: "https://www.youtube.com/watch?v=PMm960A6ZHA"
        }
      ]
    },
    creenciasClave: [
      {
        id: "democracia-participativa",
        nombre: "Democracia Participativa",
        resumen: "Defiende una democracia que se practique siempre, no solo representativa, sino también participativa, con mayor implicación ciudadana.",
        detalle: "Impulsa la Asamblea Constituyente como una creación del pueblo peruano, a través de la recolección de firmas, para una mayor participación en la toma de decisiones.",
        fuente: "https://www.youtube.com/watch?v=idwJ4xaDfZE"
      },
      {
        id: "anti-neoliberalismo",
        nombre: "Anti-neoliberalismo y Crítica a la Oligarquía",
        resumen: "Rechaza el modelo económico neoliberal y critica a las élites económicas y políticas tradicionales.",
        detalle: "Su postura antisistema lo posiciona como opositor a las estructuras de poder establecidas, buscando un mayor control estatal sobre los recursos y sectores estratégicos.",
        fuente: "https://www.youtube.com/watch?v=PMm960A6ZHA"
      },
      {
        id: "estabilidad-politica",
        nombre: "Estabilidad Política y Rechazo a la Vacancia",
        resumen: "Expresa su rechazo a las mociones de 'vacancia' presidencial y a la inestabilidad política recurrente, defendiendo la legitimidad del mandato de cinco años.",
        detalle: "Critica la confrontación constante entre poderes ejecutivo y legislativo, abogando por la coordinación. Su lealtad al presidente está condicionada a la probidad.",
        fuente: "https://www.youtube.com/watch?v=PMm960A6ZHA"
      }
    ],
    trayectoria: [
      {
        id: "infancia-formacion",
        rol: "Niñez, estudios y activismo temprano",
        periodo: "1975 - 2011",
        descripcion: "Nacido en Lima, de madre trujillana, estudió en el colegio Claretiano y luego la carrera de Derecho en la Universidad Inca Garcilaso de la Vega, la cual no concluyó. En este periodo, inició su activismo político y trabajó como asistente administrativo en el Parlamento Andino.",
        fuente: "https://es.wikipedia.org/wiki/Guillermo_Bermejo",
        detalles: [
          {
            subtitulo: "Estudios y trabajo",
            texto: "Creció en Lima, asistió al colegio Claretiano y, aunque comenzó a estudiar Derecho, no obtuvo un título universitario. Entre 2010 y 2011, se desempeñó como asistente administrativo en el Parlamento Andino."
          },
          {
            subtitulo: "Activismo y 'Todas las Voces'",
            texto: "En 2004, fundó el movimiento marxista-leninista 'Todas las Voces', que formaba parte de la Coordinadora Continental Bolivariana-Perú (CCB-CP). Bajo su liderazgo, realizó viajes a países como Bolivia y Venezuela para eventos con círculos afines."
          }
        ]
      },
      {
        id: "congresista-peru-libre",
        rol: "Congresista por Perú Libre",
        periodo: "2021 – 2021",
        descripcion: "Fue elegido congresista por Perú Libre para el período 2021-2026, siendo el candidato más votado del partido en Lima. Poco antes de la campaña, 'Todas las Voces' se integró a Perú Libre. Una grabación de audio de 2020 reveló su afirmación: 'Si tomamos el poder, no lo vamos a dejar'.",
        fuente: "https://en.wikipedia.org/wiki/Guillermo_Bermejo"
      },
      {
        id: "ruptura-peru-libre",
        rol: "Fundador de Perú Democrático y Afiliación Actual",
        periodo: "2021 – Presente",
        descripcion: "Renunció a Perú Libre en diciembre de 2021, criticando a Vladimir Cerrón por 'personalizar la política' y la falta de liderazgo del partido. Formó el grupo Perú Democrático con Héctor Valer para promover una nueva constitución. Actualmente, forma parte de la bancada 'Juntos por el Perú - Voces del Pueblo' y preside la Comisión de Pueblos Andinos.",
        fuente: "https://en.wikipedia.org/wiki/Guillermo_Bermejo"
      },
      {
        id: "desafios-legales-actuales",
        rol: "Figura con Desafíos Legales Recurrentes",
        periodo: "2017 – Presente",
        descripcion: "A pesar de su absolución en 2017, la Fiscalía ha continuado con nuevas acusaciones. Se le ha acusado de obstrucción a la justicia y de recibir sobornos, con una nueva acusación de la Fiscalía en 2025 que solicita 20 años de cárcel. Bermejo también ha denunciado a la fiscal Marita Barreto por presunta filtración de información.",
        fuente: "https://es.wikipedia.org/wiki/Guillermo_Bermejo"
      }
    ],
    presenciaDigital: {
      plataformas: [
        {
          nombre: "tiktok",
          handle: "@guillebermejor",
          url: "https://www.tiktok.com/@guillebermejor",
          estrategia: "Publica contenido relacionado con su vida política y social, utilizando un enfoque humorístico y crítico."
        },
        {
          nombre: "facebook",
          handle: "GuilleBermejoR",
          url: "https://www.facebook.com/GuilleBermejoR",
          estrategia: "Se identifica como socialista y miembro de 'Movimiento Todas Las Voces' y 'Bancada Juntos por el Perú - Voces del Pueblo'. Publica sobre la promoción de una Asamblea Constituyente, la defensa de los derechos laborales y sociales, y los derechos de los animales. Es un crítico vocal de la presidenta Dina Boluarte.",
        },
        {
          nombre: "instagram",
          handle: "guillebermejor",
          url: "https://www.instagram.com/guillebermejor",
          estrategia: "No se pudo acceder a la información de este perfil."
        }
      ]
    },
    mapaDePoder: {
      alianzas: [
        {
          nombre: "Coordinadora Continental Bolivariana-Perú (CCB-CP)",
          descripcion: "Organización de la que 'Todas las Voces' fue parte, con la que Bermejo realizó viajes internacionales a Bolivia y Venezuela para eventos con círculos afines. ",
        },
        {
          nombre: "Perú Libre (anterior)",
          descripcion: "Partido por el que fue elegido congresista en 2021, siendo el más votado en Lima. 'Todas las Voces' se integró a Perú Libre antes de la campaña.",
        },
        {
          nombre: "Perú Democrático (fundador)",
          descripcion: "Grupo formado por Bermejo junto a Héctor Valer tras su salida de Perú Libre en 2021, con el objetivo de promover una nueva constitución.",
        },
        {
          nombre: "Juntos por el Perú - Voces del Pueblo (actual)",
          descripcion: "Bancada a la que actualmente pertenece en el Congreso.",
        },
        {
          nombre: "Pedro Castillo (expresidente)",
          descripcion: "Mantuvo una buena relación con el expresidente Pedro Castillo, reuniéndose con él con frecuencia, a pesar de su ruptura con Perú Libre.",
        }
      ],
      opositores: [
        {
          nombre: "Guido Bellido",
          descripcion: "Calificado por Bermejo como 'pirañita' y 'chupamedias' de Cerrón. También ha sido acusado junto a Bermejo por la Fiscalía por presunta afiliación terrorista y obstrucción a la justicia.",
        },
        {
          nombre: "Sectores de derecha y el 'establishment'",
          descripcion: "Bermejo critica la 'rancia oligarquía' y la confrontación constante entre poderes, posicionándose como opositor a las élites económicas y políticas tradicionales.",
        },
        {
          nombre: "Fiscalía y Procuraduría",
          descripcion: "Han presentado acusaciones por afiliación terrorista y obstrucción a la justicia, solicitando penas de cárcel. Bermejo también ha denunciado a la fiscal Marita Barreto.",
        }
      ],
      seguidores: "Sectores populares, votantes de izquierda, ciudadanos descontentos con el sistema y las élites tradicionales, y aquellos que buscan una transformación profunda del Estado y la sociedad peruana. Su base incluye militantes y líderes sociales en diversas regiones del Perú.",
    }
  }
  ,
  {
  id: "carlos-alvarez",
  nombre: "Carlos Álvarez",
  ideologia: "Derecha punitiva",
  headshot: "https://portal.andina.pe/EDPfotografia3/Thumbnail/2018/05/03/000501027W.jpg",
  fullBody: "/src/data/fotos_candidatos/alvarez/full_body_alvarez.png",
  proyectoPolitico: {
    titulo: "Orden y mano de hierro contra el crimen",
    resumen:
      "Prioriza seguridad con pena de muerte, megacárceles, estados de excepción y expulsión de delincuentes extranjeros.",
    detalles: [
      {
        subtitulo: "Pena de muerte, salida del Pacto de San José, 'Mano de Hierro'",
        texto:
          "Propone viabilizar la pena capital denunciando la Convención Americana de DD.HH. Utilizar Megacárceles y a las FFAA/PNP para recuperar el control territorial.",
        fuente:
          "https://rpp.pe/peru/actualidad/carlos-alvarez-anuncia-su-disposicion-de-postular-a-la-presidencia-y-propone-pena-de-muerte-contra-criminales-noticia-1625714"
      },
      {
        subtitulo: "Expulsión de delincuentes extranjeros",
        texto:
          "Insiste en expulsiones inmediatas de extranjeros que cometan delitos.",
        fuente: "https://www.youtube.com/watch?v=hb5PHqWNTqk"
      },
      {
        subtitulo: "Cooperación punitiva internacional (modelo Bukele)",
        texto:
          "Ha sugerido convenios con El Salvador para encerrar a los delincuentes más peligrosos.",
        fuente: "https://trome.com/actualidad/politica/carlos-alvarez-dina-debe-hacer-un-convenio-con-bukele-y-mandar-a-los-criminales-mas-peligrosos-a-el-salvador-video-entrevista-noticia/"
      }
    ]
  },

  creenciasClave: [
    {
      id: "orden-sobre-garantismo",
      nombre: "El orden público por encima del garantismo",
      resumen:
        "El fin (recuperar orden) justifica endurecer reglas procesales y excepciones.",
      detalle:
        "Toques de queda, ingreso forzoso, y tratar al delincuente violento como 'objetivo militar' se priorizan si el Estado pierde control territorial.",
      fuente:
        "https://trome.com/actualidad/politica/carlos-alvarez-entrevista-candidato-presidencial-por-que-pide-pena-de-muerte-para-los-delincuentes-y-que-otras-medidas-plantea-para-la-inseguridad-video-historia-de-policiales-noticia/"
    },
    {
      id: "soberania-punitiva",
      nombre: "Soberanía punitiva frente a tratados",
      resumen:
        "Si un tratado limita sanciones máximas, se privilegia la soberanía.",
      detalle:
        "Defiende salir del Pacto de San José para habilitar la pena de muerte.",
      fuente:
        "https://rpp.pe/peru/actualidad/carlos-alvarez-anuncia-su-disposicion-de-postular-a-la-presidencia-y-propone-pena-de-muerte-contra-criminales-noticia-1625714"
    },
    {
      id: "ejemplaridad-castigo",
      nombre: "Castigo ejemplar y disuasión",
      resumen:
        "Megacárceles, régimen severo y mensajes de 'mano de hierro' como disuasores.",
      detalle:
        "El énfasis punitivo es la herramienta preferida para bajar crimen.",
      fuente: "https://www.youtube.com/watch?v=lyNkd_EtUsU"
    },
    {
      id: "prioridad-nacional-frente-migracion-delictiva",
      nombre: "Prioridad nacional ante delincuencia extranjera",
      resumen:
        "Expulsión como política inmediata para no ciudadanos que delinquen.",
      detalle:
        "Énfasis reiterado en 'sacar del país' a extranjeros vinculados al crimen.",
      fuente: "https://www.youtube.com/watch?v=hb5PHqWNTqk"
    },
    {
      id: "antiprivilegios-estatales",
      nombre: "Austeridad y antiprivilegios del Estado",
      resumen:
        "Rechazo a aumentos y privilegios de autoridades como señal política.",
      detalle:
        "Retórica de recorte de privilegios; no existe aún marco fiscal detallado.",
      fuente: "https://www.instagram.com/reel/DNZ8eUcumTw/"
    }
  ],

  trayectoria: [
    {
      id: "afiliacion-2024",
      rol: "Afiliado a País Para Todos",
      periodo: "jul 2024 – Presente",
      descripcion:
        "Anuncia afiliación y su eventual postulación interna para 2026.",
      fuente:
        "https://elcomercio.pe/politica/partidos/carlos-alvarez-anuncia-que-se-afiliara-como-militante-al-partido-pais-para-todos-elecciones-2026-jne-ultimas-noticia/"
    },
    {
      id: "precandidato-2025",
      rol: "Precandidato / aspirante presidencial",
      periodo: "2025 – Presente",
      descripcion:
        "Declara disposición a postular; fija agenda punitiva en medios.",
      fuente:
        "https://rpp.pe/peru/actualidad/carlos-alvarez-anuncia-su-disposicion-de-postular-a-la-presidencia-y-propone-pena-de-muerte-contra-criminales-noticia-1625714"
    },
    {
      id: "carrera-artistica",
      rol: "Comediante y presentador",
      periodo: "1983 – Presente",
      descripcion:
        "Figura de sátira política en TV y redes; capital comunicacional.",
      fuente:
        "https://www.youtube.com/watch?v=XSlKGdApdQw"
    }
  ],

  presenciaDigital: {
    plataformas: [
      {
        nombre: "tiktok",
        handle: "@carlosalvarez_tiktok",
        url: "https://www.tiktok.com/@carlosalvarez_tiktok",
        estrategia:
          "Canal principal (≈565k seguidores) para posicionar discurso de orden."
      },
      {
        nombre: "instagram",
        handle: "carlosalvarezoficial_",
        url: "https://www.instagram.com/carlosalvarezoficial_/",
        estrategia:
          "Clips de coyuntura y antiprivilegios; movilización de base."
      },
      {
        nombre: "facebook",
        handle: "Carlos Alvarez Oficial",
        url: "https://www.facebook.com/CARLOSALVAREZYLASMILVOCES/",
        estrategia:
          "Comunicados, transmisiones y reacciones a hechos de seguridad."
      },
      {
        nombre: "web",
        handle: "Partido País Para Todos",
        url: "https://partidopaisparatodos.org.pe/",
        estrategia:
          "Estructura y documentos orgánicos del partido."
      }
    ]
  },

  mapaDePoder: {
    alianzas: [
      {
        nombre: "País Para Todos (inscrito ante JNE)",
        descripcion:
          "Vehículo político (agrupación nº34 habilitada para EG-2026)."
      },
      {
        nombre: "Vladimir Meza (presidente del partido)",
        descripcion:
          "Lidera orgánica; convoca Congreso Nacional Extraordinario 2025."
      }
    ],
    opositores: [
      {
        nombre: "ONGs y juristas de DD.HH.",
        descripcion:
          "Crítica a retiro del Pacto de San José y agenda punitiva."
      },
      {
        nombre: "Investigación fiscal al partido (2025)",
        descripcion:
          "Fiscalía abrió diligencias preliminares sobre legalidad del partido."
      }
    ],
    seguidores:
      "Audiencia digital grande (TikTok, Facebook); electorado pro-mano dura."
  },

  // Compass (estimación con la evidencia disponible)
  econ: 2,          // no hay plan económico; retórica de austeridad sin estatismo → ligera derecha
  social: 9,        // pena de muerte, megacárceles, estados de excepción → autoritarismo alto
  security: "pro",
  health: "neutral",
  education: "neutral"
}
];