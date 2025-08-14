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
}

export const candidates: Candidate[] = [
  {
    id: "keiko",
    nombre: "Keiko Fujimori",
    ideologia: "Centro-derecha",
    proyectoPolitico: {
      titulo: "Plan Perú Seguro",
      resumen: "Propuesta de gobierno basada en la experiencia y estabilidad económica para recuperar el orden y la seguridad en el país.",
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
    headshot: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "veronika",
    nombre: "Verónika Mendoza",
    ideologia: "Izquierda",
    proyectoPolitico: {
      titulo: "Cambio y Dignidad",
      resumen: "Transformación social y justicia económica para todos los peruanos, con un nuevo pacto social."
    },
    creenciasClave: [
      { id: "justicia-social", nombre: "Justicia social", resumen: "Busca una distribución más equitativa de la riqueza y oportunidades.", detalle: "Propone reformas fiscales progresivas, aumento del salario mínimo y fortalecimiento de programas sociales para los más necesitados." },
      { id: "medio-ambiente", nombre: "Medio ambiente", resumen: "Defiende políticas de desarrollo sostenible y protección de recursos naturales.", detalle: "Impulsa el uso de energías renovables, reforestación y conservación de áreas protegidas. Promueve una economía circular y la reducción de residuos." },
      { id: "derechos-humanos", nombre: "Derechos humanos", resumen: "Promueve el respeto y garantía de los derechos fundamentales de todas las personas.", detalle: "Busca la eliminación de la violencia de género, la protección de los derechos de los pueblos indígenas y la promoción de los derechos laborales." },
      { id: "nueva-constitucion", nombre: "Nueva Constitución", resumen: "Aboga por una nueva constitución que refleje los valores y necesidades actuales del país.", detalle: "Propone un proceso constituyente participativo, donde la ciudadanía defina los ejes de la nueva carta magna. Busca incluir derechos sociales, ambientales y de género." }
    ],
    trayectoria: [
      { id: "candidata-presidencial-2016", rol: "Candidata Presidencial", periodo: "2016 - Presente", descripcion: "Figura principal de la izquierda peruana en las últimas elecciones." },
      { id: "congresista-2011", rol: "Congresista", periodo: "2011 - 2016", descripcion: "Electa por Cusco, con una agenda de fiscalización y derechos sociales." },
      { id: "activista-2008", rol: "Activista", periodo: "2008 - 2011", descripcion: "Defensora de derechos humanos y medio ambiente en la sociedad civil." }
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
        { nombre: "Sindicatos", descripcion: "Organizaciones que agrupan a trabajadores y buscan mejorar sus condiciones laborales." },
        { nombre: "Organizaciones ecologistas", descripcion: "Grupos que defienden la protección del medio ambiente y los recursos naturales." },
        { nombre: "Movimientos feministas", descripcion: "Colectivos que luchan por los derechos de las mujeres y la igualdad de género." }
      ],
      opositores: [
        { nombre: "Gremios empresariales", descripcion: "Organizaciones que agrupan a empresarios y que se oponen a sus políticas laborales y ambientales." },
        { nombre: "Sectores conservadores", descripcion: "Grupos que defienden valores tradicionales y se oponen a cambios en la estructura social y económica." }
      ],
      seguidores: "Aprox. 1.8M en redes"
    },
    headshot: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=600&fit=crop&auto=format"
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
    headshot: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&auto=format"
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
    headshot: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "antauro",
    nombre: "Antauro Humala Tasso",
    ideologia: "Etnocacerismo Nacionalismo Radical de Izquierda",
    headshot: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=400&h=600&fit=crop&auto=format",
    proyectoPolitico: {
      titulo: "Refundación Nacional Etnocacerista",
      resumen:
        "Propone reestructurar el Estado para devolver soberanía política, económica y cultural al Perú, con énfasis en identidad andina y disciplina militar.",
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
        nombre: "Etnocacerismo/ velasquimo como Doctrina",
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
  fullBody: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop&auto=format",

  proyectoPolitico: {
    titulo: "Reforma Institucional Anticorrupción y Descentralización (Perú Primero)",
    resumen:
      "Agenda marcada por el referéndum 2018, la disolución del Congreso 2019 para destrabar reformas y, hoy, por el intento de reposicionarse con Perú Primero pese a inhabilitaciones múltiples.",
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
      fuente: "https://comunicaciones.congreso.gob.pe/noticias/congreso-inhabilita-por-10-anos-al-expresidente-martin-vizcarra-por-cierre-del-congreso/"
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
    ideologia: "Marxista-Leninista, Socialista, Izquierda Radical",
    headshot: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop&auto=format",
    proyectoPolitico: {
      titulo: "Refundación del Perú a través de una Asamblea Constituyente",
      resumen: "Propone una transformación profunda del Estado peruano mediante una nueva Constitución, criticando el modelo neoliberal y abogando por un rol más activo del Estado en la economía y la sociedad, con énfasis en la industrialización y la justicia social.",
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
  },
  {
    id: "patricia",
    nombre: "Patricia Chirinos",
    ideologia: "Liberal",
    proyectoPolitico: {
      titulo: "Libertad y Desarrollo",
      resumen: "Promoción de un liberalismo económico y social que garantice los derechos individuales y el emprendimiento."
    },
    creenciasClave: [
      { id: "libertad-economica", nombre: "Libertad económica", resumen: "Defiende la libre empresa y la reducción del tamaño del estado.", detalle: "Propone eliminar regulaciones que considera innecesarias y reducir impuestos a empresas y personas naturales." },
      { id: "derechos-civiles", nombre: "Derechos civiles", resumen: "Promueve el respeto y garantía de los derechos individuales.", detalle: "Busca despenalizar la marihuana, regular el trabajo sexual y garantizar derechos a la comunidad LGBTQ+." },
      { id: "emprendimiento", nombre: "Emprendimiento", resumen: "Fomenta la creación de empresas y la innovación como motores del desarrollo.", detalle: "Propone la creación de un fondo de garantía para emprendedores y la simplificación de trámites para la formalización de empresas." },
      { id: "igualdad-oportunidades", nombre: "Igualdad de oportunidades", resumen: "Cree en un sistema educativo y laboral que ofrezca las mismas oportunidades a todos.", detalle: "Busca implementar becas y programas de capacitación para jóvenes de bajos recursos." }
    ],
    trayectoria: [
      { id: "congresista-2021", rol: "Congresista", periodo: "2021 - Presente", descripcion: "Voz activa en temas de derechos humanos y libertades individuales." },
      { id: "empresaria-2010", rol: "Empresaria", periodo: "2010 - 2021", descripcion: "Desarrollo de negocios con enfoque en la innovación y la sostenibilidad." },
      { id: "abogada-1995", rol: "Abogada", periodo: "1995 - 2010", descripcion: "Ejercicio de la abogacía con énfasis en derechos humanos y derecho empresarial." }
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
        { nombre: "Organizaciones de derechos humanos", descripcion: "Grupos que defienden los derechos fundamentales y luchan contra la corrupción." },
        { nombre: "Movimientos estudiantiles", descripcion: "Colectivos que representan a estudiantes y luchan por sus derechos e intereses." }
      ],
      opositores: [
        { nombre: "Sectores conservadores", descripcion: "Grupos que se oponen a sus políticas de derechos civiles y libertades individuales." },
        { nombre: "Gremios sindicales", descripcion: "Organizaciones que agrupan a trabajadores y que se oponen a sus políticas laborales." }
      ],
      seguidores: "Aprox. 850K en redes"
    },
    headshot: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "george",
    nombre: "George Forsyth",
    ideologia: "Centro-derecha",
    proyectoPolitico: {
      titulo: "Gestión y Progreso",
      resumen: "Una propuesta centrada en la gestión eficiente y la modernización del estado para el desarrollo integral del país."
    },
    creenciasClave: [
      { id: "gestion-eficiente", nombre: "Gestión eficiente", resumen: "Cree en la importancia de una administración pública eficaz y transparente.", detalle: "Propone la implementación de un sistema de evaluación y monitoreo de la gestión pública basado en indicadores claros y accesibles a la ciudadanía." },
      { id: "modernizacion", nombre: "Modernización", resumen: "Defiende la actualización y mejora continua de la infraestructura y servicios del estado.", detalle: "Busca priorizar proyectos de infraestructura que tengan un alto impacto en el desarrollo económico y social del país." },
      { id: "deportes", nombre: "Deportes", resumen: "Promueve el deporte como herramienta de inclusión y desarrollo social.", detalle: "Propone la construcción y mantenimiento de infraestructuras deportivas en todo el país, así como la promoción de eventos deportivos internacionales en Perú." },
      { id: "transparencia", nombre: "Transparencia", resumen: "Defiende la apertura y el acceso a la información pública.", detalle: "Busca implementar políticas de gobierno abierto y rendición de cuentas. Promueve el uso de tecnología para facilitar el acceso a la información." }
    ],
    trayectoria: [
      { id: "alcalde-la-victoria-2019", rol: "Alcalde La Victoria", periodo: "2019 - 2022", descripcion: "Gestión enfocada en la seguridad ciudadana y el desarrollo urbano." },
      { id: "futbolista-profesional-1997", rol: "Futbolista Profesional", periodo: "1997 - 2015", descripcion: "Carrera destacada en el fútbol profesional, con reconocimiento internacional." },
      { id: "politico-2019", rol: "Político", periodo: "2019 - 2026", descripcion: "Participación activa en la política peruana, con énfasis en la gestión pública." }
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
        { nombre: "Organizaciones deportivas", descripcion: "Grupos que promueven el deporte y la actividad física como parte del desarrollo integral." },
        { nombre: "Grupos de jóvenes", descripcion: "Organizaciones que representan los intereses de la juventud y promueven su participación en la política." }
      ],
      opositores: [
        { nombre: "Sectores de izquierda", descripcion: "Grupos que se oponen a su modelo económico y a sus posiciones sobre derechos sociales." },
        { nombre: "Críticos de su gestión", descripcion: "Personas u organizaciones que han cuestionado su desempeño como alcalde y político." }
      ],
      seguidores: "Aprox. 1.1M en redes"
    },
    headshot: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "ciro",
    nombre: "Ciro Gálvez",
    ideologia: "Conservador",
    proyectoPolitico: {
      titulo: "Cultura y Desarrollo",
      resumen: "Defensa de los valores tradicionales y promoción del desarrollo regional con un enfoque en la cultura nacional."
    },
    creenciasClave: [
      { id: "cultura-nacional", nombre: "Cultura nacional", resumen: "Promueve la defensa y difusión de la cultura e identidad peruana.", detalle: "Busca implementar políticas que fomenten el uso del idioma quechua y la celebración de fiestas patrias y costumbres locales." },
      { id: "desarrollo-regional", nombre: "Desarrollo regional", resumen: "Aboga por un enfoque descentralizado que potencie las economías locales.", detalle: "Propone la creación de fondos concursables para proyectos de desarrollo en regiones y la promoción de ferias regionales." },
      { id: "tradiciones", nombre: "Tradiciones", resumen: "Defiende la importancia de las tradiciones en la construcción de la identidad y cohesión social.", detalle: "Busca promover el turismo cultural y la protección del patrimonio cultural inmaterial." },
      { id: "familia", nombre: "Familia", resumen: "Cree en la familia como núcleo fundamental de la sociedad.", detalle: "Propone políticas de apoyo a la familia, como licencias parentales ampliadas y subsidios por hijos." }
    ],
    trayectoria: [
      { id: "escritor-1980", rol: "Escritor", periodo: "1980 - Presente", descripcion: "Obra literaria centrada en la identidad y cultura peruana." },
      { id: "gobernador-regional-2015", rol: "Gobernador Regional", periodo: "2015 - 2018", descripcion: "Gestión regional con énfasis en el desarrollo cultural y turístico." },
      { id: "politico-regional-2010", rol: "Político Regional", periodo: "2010 - 2026", descripcion: "Participación activa en la política regional, promoviendo el desarrollo sostenible." }
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
        { nombre: "Organizaciones culturales", descripcion: "Grupos que promueven la cultura y el arte como parte del desarrollo social." },
        { nombre: "Grupos de escritores", descripcion: "Colectivos que agrupan a escritores y promueven la lectura y la escritura." },
        { nombre: "Movimientos conservadores", descripcion: "Grupos que defienden valores tradicionales y se oponen a cambios en la estructura social y económica." }
      ],
      opositores: [
        { nombre: "Sectores progresistas", descripcion: "Grupos que se oponen a su visión conservadora y a sus propuestas de desarrollo." },
        { nombre: "Críticos de su gestión", descripcion: "Personas u organizaciones que han cuestionado su desempeño como gobernador y político." }
      ],
      seguidores: "Aprox. 600K en redes"
    },
    headshot: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "daniel",
    nombre: "Daniel Urresti",
    ideologia: "Centro-izquierda",
    proyectoPolitico: {
      titulo: "Seguridad y Desarrollo",
      resumen: "Un enfoque en la seguridad ciudadana y el desarrollo social para construir un Perú más justo y seguro."
    },
    creenciasClave: [
      { id: "seguridad-ciudadana", nombre: "Seguridad ciudadana", resumen: "Cree en la importancia de la seguridad para el desarrollo.", detalle: "Propone la implementación de un sistema de patrullaje integrado y el uso de tecnología para la prevención del delito." },
      { id: "orden-publico", nombre: "Orden público", resumen: "Defiende la necesidad de mantener el orden y la paz social.", detalle: "Busca fortalecer las capacidades de la Policía Nacional y mejorar la coordinación entre las fuerzas del orden." },
      { id: "justicia-social", nombre: "Justicia social", resumen: "Promueve la equidad y la inclusión social como pilares del desarrollo.", detalle: "Propone la creación de programas de apoyo a poblaciones vulnerables y la promoción de la igualdad de oportunidades." },
      { id: "desarrollo-humano", nombre: "Desarrollo humano", resumen: "Cree en el potencial de las personas como motor del desarrollo.", detalle: "Busca implementar políticas de educación y capacitación para el trabajo, así como programas de salud y bienestar." }
    ],
    trayectoria: [
      { id: "congresista-2020", rol: "Congresista", periodo: "2020 - Presente", descripcion: "Trabajo en comisiones de defensa y seguridad ciudadana." },
      { id: "ministro-interior-2014", rol: "Ministro del Interior", periodo: "2014 - 2015", descripcion: "Implementación de políticas de seguridad y lucha contra la corrupción." },
      { id: "general-ep-1978", rol: "General EP", periodo: "1978 - 2014", descripcion: "Carrera militar con énfasis en la seguridad y el orden interno." }
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
        { nombre: "Fuerzas Armadas", descripcion: "Instituciones militares que apoyan su enfoque en la seguridad y el orden interno." },
        { nombre: "Policía Nacional", descripcion: "Institución encargada de mantener el orden y la seguridad ciudadana." },
        { nombre: "Organizaciones de seguridad", descripcion: "Grupos que respaldan su enfoque en la seguridad ciudadana y el orden público." }
      ],
      opositores: [
        { nombre: "Sectores de izquierda", descripcion: "Grupos que se oponen a su modelo de seguridad y a sus posiciones sobre derechos humanos." },
        { nombre: "Críticos de su gestión", descripcion: "Personas u organizaciones que han cuestionado su desempeño como ministro y político." }
      ],
      seguidores: "Aprox. 750K en redes"
    },
    headshot: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "julio",
    nombre: "Julio Guzmán",
    ideologia: "Centro",
    proyectoPolitico: {
      titulo: "Innovación y Competitividad",
      resumen: "Impulso de la tecnología y la modernización para un Perú digital y competitivo en el mundo."
    },
    creenciasClave: [
      { id: "innovacion-tecnologica", nombre: "Innovación tecnológica", resumen: "Cree en el desarrollo y la adopción de nuevas tecnologías como motor del crecimiento.", detalle: "Propone la creación de un fondo nacional de innovación y la promoción de clústeres tecnológicos." },
      { id: "competitividad", nombre: "Competitividad", resumen: "Defiende la necesidad de hacer más competitiva la economía peruana.", detalle: "Busca implementar políticas que fomenten la inversión en infraestructura y la capacitación laboral." },
      { id: "educacion-digital", nombre: "Educación digital", resumen: "Promueve la inclusión de la educación digital en todos los niveles educativos.", detalle: "Propone la capacitación de docentes en herramientas digitales y la dotación de infraestructura tecnológica a las escuelas." },
      { id: "emprendimiento", nombre: "Emprendimiento", resumen: "Fomenta la creación de empresas y la innovación como motores del desarrollo.", detalle: "Propone la creación de un fondo de garantía para emprendedores y la simplificación de trámites para la formalización de empresas." }
    ],
    trayectoria: [
      { id: "candidato-presidencial-2016", rol: "Candidato Presidencial", periodo: "2016 - Presente", descripcion: "Promotor de una agenda de modernización y desarrollo tecnológico." },
      { id: "consultor-internacional-2005", rol: "Consultor Internacional", periodo: "2005 - 2016", descripcion: "Asesoría en proyectos de desarrollo y modernización en diversos países." },
      { id: "economista-1995", rol: "Economista", periodo: "1995 - 2005", descripcion: "Ejercicio de la profesión con énfasis en el desarrollo económico y social." }
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
        { nombre: "Empresas de tecnología", descripcion: "Grupos que promueven el desarrollo y la adopción de nuevas tecnologías." },
        { nombre: "Organizaciones de desarrollo económico", descripcion: "Grupos que buscan promover el crecimiento económico sostenible." },
        { nombre: "Universidades", descripcion: "Instituciones de educación superior que apoyan la investigación y la innovación." }
      ],
      opositores: [
        { nombre: "Sectores conservadores", descripcion: "Grupos que se oponen a la modernización y a la adopción de nuevas tecnologías." },
        { nombre: "Críticos de la modernización", descripcion: "Personas u organizaciones que han cuestionado su enfoque tecnocrático." }
      ],
      seguidores: "Aprox. 950K en redes"
    },
    headshot: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "alberto",
    nombre: "Alberto Beingolea",
    ideologia: "Socialdemócrata",
    proyectoPolitico: {
      titulo: "Desarrollo Sostenible",
      resumen: "Promoción de un desarrollo sostenible y equidad social para el progreso nacional."
    },
    creenciasClave: [
      { id: "desarrollo-sostenible", nombre: "Desarrollo sostenible", resumen: "Promueve un equilibrio entre el crecimiento económico, la inclusión social y la protección del medio ambiente.", detalle: "Busca implementar políticas que fomenten el uso responsable de los recursos naturales y la inversión en energías renovables." },
      { id: "equidad-social", nombre: "Equidad social", resumen: "Cree en la justicia social y la reducción de las desigualdades.", detalle: "Propone reformas fiscales progresivas y el fortalecimiento de programas sociales." },
      { id: "medio-ambiente", nombre: "Medio ambiente", resumen: "Defiende políticas de protección y conservación del medio ambiente.", detalle: "Impulsa la reforestación, la conservación de áreas naturales y la promoción de energías limpias." },
      { id: "derechos-laborales", nombre: "Derechos laborales", resumen: "Promueve el respeto y garantía de los derechos de los trabajadores.", detalle: "Busca fortalecer los sindicatos y garantizar condiciones laborales justas." }
    ],
    trayectoria: [
      { id: "politico-veterano-1985", rol: "Político Veterano", periodo: "1985 - Presente", descripcion: "Amplia trayectoria en la política peruana, promoviendo el desarrollo sostenible." },
      { id: "ingeniero-1970", rol: "Ingeniero", periodo: "1970 - 1985", descripcion: "Ejercicio de la ingeniería con énfasis en proyectos sostenibles y de impacto social." },
      { id: "candidato-2006", rol: "Candidato", periodo: "2006 - 2026", descripcion: "Participación en múltiples elecciones con una agenda socialdemócrata." }
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
        { nombre: "Organizaciones ambientalistas", descripcion: "Grupos que defienden la protección del medio ambiente y los recursos naturales." },
        { nombre: "Sindicatos", descripcion: "Organizaciones que agrupan a trabajadores y defienden sus derechos laborales." },
        { nombre: "Movimientos sociales", descripcion: "Colectivos que representan a diversos sectores sociales y luchan por sus derechos e intereses." }
      ],
      opositores: [
        { nombre: "Sectores empresariales", descripcion: "Grupos que se oponen a sus políticas de desarrollo sostenible y equidad social." },
        { nombre: "Críticos del estado", descripcion: "Personas u organizaciones que han cuestionado su enfoque socialdemócrata." }
      ],
      seguidores: "Aprox. 800K en redes"
    },
    headshot: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "marco",
    nombre: "Marco Arana",
    ideologia: "Ecologista",
    proyectoPolitico: {
      titulo: "Ecología y Justicia",
      resumen: "Protección ambiental y desarrollo humano sostenible como ejes de un nuevo modelo de país."
    },
    creenciasClave: [
      { id: "ecologia-integral", nombre: "Ecología integral", resumen: "Promueve una visión holística de la ecología que incluye lo social, económico y ambiental.", detalle: "Busca implementar políticas que integren la conservación de la naturaleza con el desarrollo humano." },
      { id: "derechos-humanos", nombre: "Derechos humanos", resumen: "Defiende los derechos fundamentales de todas las personas, especialmente de los más vulnerables.", detalle: "Promueve la igualdad de derechos sin distinción de raza, género, orientación sexual o condición económica." },
      { id: "espiritualidad", nombre: "Espiritualidad", resumen: "Cree en la importancia de la dimensión espiritual en la vida humana.", detalle: "Propone el respeto por todas las creencias y la promoción de valores espirituales como la solidaridad y el amor al prójimo." },
      { id: "justicia-social", nombre: "Justicia social", resumen: "Busca una distribución más equitativa de la riqueza y oportunidades.", detalle: "Propone reformas fiscales progresivas, aumento del salario mínimo y fortalecimiento de programas sociales para los más necesitados." }
    ],
    trayectoria: [
      { id: "ambientalista-2000", rol: "Ambientalista", periodo: "2000 - Presente", descripcion: "Defensor de la ecología integral y los derechos humanos." },
      { id: "sacerdote-1986", rol: "Sacerdote", periodo: "1986 - 2000", descripcion: "Labor pastoral con énfasis en la justicia social y la defensa de los pobres." },
      { id: "activista-2005", rol: "Activista", periodo: "2005 - 2026", descripcion: "Participación activa en movimientos sociales y políticos por la justicia ambiental y social." }
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
        { nombre: "Organizaciones ecologistas", descripcion: "Grupos que defienden la protección del medio ambiente y los recursos naturales." },
        { nombre: "Movimientos sociales", descripcion: "Colectivos que representan a diversos sectores sociales y luchan por sus derechos e intereses." },
        { nombre: "Iglesia progresista", descripcion: "Organización religiosa que apoya su visión de justicia social y defensa de los pobres." }
      ],
      opositores: [
        { nombre: "Empresarios", descripcion: "Grupos que se oponen a sus políticas de protección ambiental y justicia social." },
        { nombre: "Medios de comunicación", descripcion: "Organizaciones que critican su enfoque radical y su pasado como sacerdote." }
      ],
      seguidores: "Aprox. 650K en redes"
    },
    headshot: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "maria",
    nombre: "María Rivera",
    ideologia: "Feminista",
    proyectoPolitico: {
      titulo: "Igualdad y Oportunidad",
      resumen: "Lucha por la igualdad de género y el empoderamiento de la mujer peruana en todos los ámbitos."
    },
    creenciasClave: [
      { id: "igualdad-genero", nombre: "Igualdad de género", resumen: "Promueve la igualdad de derechos y oportunidades entre hombres y mujeres.", detalle: "Busca eliminar la brecha salarial de género y garantizar la representación equitativa en todos los ámbitos." },
      { id: "empoderamiento-femenino", nombre: "Empoderamiento femenino", resumen: "Defiende el derecho de las mujeres a participar plenamente en la sociedad.", detalle: "Propone programas de liderazgo y capacitación para mujeres en todos los niveles." },
      { id: "justicia-reproductiva", nombre: "Justicia reproductiva", resumen: "Aboga por el derecho de las mujeres a decidir sobre sus cuerpos y vidas reproductivas.", detalle: "Busca garantizar el acceso a servicios de salud reproductiva y educación sexual integral." },
      { id: "derechos-laborales", nombre: "Derechos laborales", resumen: "Promueve el respeto y garantía de los derechos de los trabajadores.", detalle: "Busca fortalecer los sindicatos y garantizar condiciones laborales justas." }
    ],
    trayectoria: [
      { id: "activista-2010", rol: "Activista", periodo: "2010 - Presente", descripcion: "Defensora de los derechos de las mujeres y la igualdad de género." },
      { id: "sociologa-2005", rol: "Socióloga", periodo: "2005 - 2010", descripcion: "Investigación y análisis sobre la situación de las mujeres en Perú." },
      { id: "candidata-2024", rol: "Candidata", periodo: "2024 - 2026", descripcion: "Participación en las elecciones con una agenda feminista." }
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
        { nombre: "Organizaciones feministas", descripcion: "Grupos que luchan por los derechos de las mujeres y la igualdad de género." },
        { nombre: "Sindicatos de mujeres", descripcion: "Organizaciones que agrupan a mujeres trabajadoras y defienden sus derechos laborales." },
        { nombre: "Movimientos sociales", descripcion: "Colectivos que representan a diversos sectores sociales y luchan por sus derechos e intereses." }
      ],
      opositores: [
        { nombre: "Sectores conservadores", descripcion: "Grupos que se oponen a sus políticas de igualdad de género y derechos reproductivos." },
        { nombre: "Críticos del feminismo", descripcion: "Personas u organizaciones que han cuestionado su enfoque feminista." }
      ],
      seguidores: "Aprox. 1.3M en redes"
    },
    headshot: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "pedro",
    nombre: "Pedro Castillo Jr",
    ideologia: "Izquierda rural",
    proyectoPolitico: {
      titulo: "Perú Profundo",
      resumen: "Representación campesina y desarrollo del Perú profundo, con énfasis en la educación y derechos campesinos."
    },
    creenciasClave: [
      { id: "educacion-rural", nombre: "Educación rural", resumen: "Cree en la importancia de una educación de calidad para todos, sin importar su ubicación geográfica.", detalle: "Propone la construcción de más escuelas rurales y la capacitación de docentes en zonas rurales." },
      { id: "derechos-campesinos", nombre: "Derechos campesinos", resumen: "Defiende los derechos de los campesinos y su acceso a recursos básicos.", detalle: "Busca implementar políticas que garanticen la propiedad comunal de la tierra y el acceso a mercados justos." },
      { id: "descentralizacion", nombre: "Descentralización", resumen: "Promueve un estado más cercano a la gente, con mayor autonomía para las regiones.", detalle: "Propone la creación de gobiernos regionales fuertes y con capacidad de decisión." },
      { id: "desarrollo-sostenible", nombre: "Desarrollo sostenible", resumen: "Cree en un desarrollo que respete el medio ambiente y las comunidades locales.", detalle: "Busca promover prácticas agrícolas sostenibles y la conservación de recursos naturales." }
    ],
    trayectoria: [
      { id: "profesor-1995", rol: "Profesor", periodo: "1995 - Presente", descripcion: "Enseñanza y defensa de los derechos educativos en zonas rurales." },
      { id: "sindicalista-2010", rol: "Sindicalista", periodo: "2010 - 2026", descripcion: "Liderazgo en la defensa de los derechos laborales y sociales de los campesinos." },
      { id: "politico-2021", rol: "Político", periodo: "2021 - 2026", descripcion: "Representación política de las comunidades rurales y campesinas." }
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
        { nombre: "Sindicatos campesinos", descripcion: "Organizaciones que agrupan a trabajadores del campo y defienden sus derechos laborales." },
        { nombre: "Organizaciones de derechos humanos", descripcion: "Grupos que defienden los derechos fundamentales y luchan contra la corrupción." },
        { nombre: "Movimientos sociales", descripcion: "Colectivos que representan a diversos sectores sociales y luchan por sus derechos e intereses." }
      ],
      opositores: [
        { nombre: "Empresarios", descripcion: "Grupos que se oponen a sus políticas de control estatal y nacionalización de recursos." },
        { nombre: "Medios de comunicación", descripcion: "Organizaciones que critican su enfoque autoritario y su pasado militar." }
      ],
      seguidores: "Aprox. 700K en redes"
    },
    headshot: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "luis",
    nombre: "Luis Valdez",
    ideologia: "Tecnocrático",
    proyectoPolitico: {
      titulo: "Gestión Basada en Evidencia",
      resumen: "Implementación de políticas públicas eficaces y eficientes, basadas en evidencia científica y datos abiertos."
    },
    creenciasClave: [
      { id: "politicas-basadas-en-evidencia", nombre: "Políticas basadas en evidencia", resumen: "Cree en la importancia de tomar decisiones basadas en datos y evidencia científica.", detalle: "Propone la creación de un sistema nacional de datos abiertos y la capacitación de funcionarios en el uso de datos para la toma de decisiones." },
      { id: "eficiencia-gubernamental", nombre: "Eficiencia gubernamental", resumen: "Defiende la necesidad de una administración pública eficaz y transparente.", detalle: "Busca implementar un sistema de evaluación y monitoreo de la gestión pública basado en indicadores claros y accesibles a la ciudadanía." },
      { id: "meritocracia", nombre: "Meritocracia", resumen: "Promueve un sistema en el que las personas accedan a posiciones y beneficios por sus méritos y capacidades.", detalle: "Propone la eliminación de los nombramientos a dedo y la implementación de concursos públicos para todos los cargos públicos." },
      { id: "transparencia", nombre: "Transparencia", resumen: "Defiende la apertura y el acceso a la información pública.", detalle: "Busca implementar políticas de gobierno abierto y rendición de cuentas. Promueve el uso de tecnología para facilitar el acceso a la información." }
    ],
    trayectoria: [
      { id: "consultor-2010", rol: "Consultor", periodo: "2010 - Presente", descripcion: "Asesoría en la formulación e implementación de políticas públicas." },
      { id: "economista-2000", rol: "Economista", periodo: "2000 - 2010", descripcion: "Ejercicio de la profesión con énfasis en el análisis y evaluación de políticas públicas." },
      { id: "academico-1995", rol: "Académico", periodo: "1995 - 2000", descripcion: "Docencia e investigación en economía y políticas públicas." }
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
        { nombre: "Academia", descripcion: "Instituciones educativas que apoyan la investigación y la formación de capital humano." },
        { nombre: "Organizaciones internacionales", descripcion: "Entidades que promueven la cooperación y el desarrollo a nivel global." },
        { nombre: "Grupos de expertos en políticas públicas", descripcion: "Colectivos que agrupan a especialistas en la formulación e implementación de políticas públicas." }
      ],
      opositores: [
        { nombre: "Sectores políticos tradicionales", descripcion: "Grupos que se oponen a su enfoque tecnocrático y a la reducción del tamaño del estado." },
        { nombre: "Críticos de la tecnocracia", descripcion: "Personas u organizaciones que han cuestionado su enfoque tecnocrático." }
      ],
      seguidores: "Aprox. 500K en redes"
    },
    headshot: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1556474835-a7ed57b0b9c7?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "carmen",
    nombre: "Carmen Salinas",
    ideologia: "Populista",
    proyectoPolitico: {
      titulo: "Gobierno del Pueblo",
      resumen: "Un enfoque en la participación ciudadana y el gobierno popular para atender las necesidades del pueblo."
    },
    creenciasClave: [
      { id: "participacion-ciudadana", nombre: "Participación ciudadana", resumen: "Cree en la importancia de la involucración de la ciudadanía en la política.", detalle: "Propone la creación de presupuestos participativos y la consulta previa para proyectos que afecten a las comunidades." },
      { id: "gobierno-popular", nombre: "Gobierno popular", resumen: "Defiende un modelo de gobierno cercano a la gente, que escuche y atienda sus demandas.", detalle: "Busca implementar políticas de atención directa al ciudadano y la eliminación de trámites burocráticos." },
      { id: "economia-familiar", nombre: "Economía familiar", resumen: "Promueve el fortalecimiento de la economía familiar y el apoyo a las pequeñas y microempresas.", detalle: "Propone la creación de un banco de la mujer y programas de capacitación para emprendedores." },
      { id: "solidaridad", nombre: "Solidaridad", resumen: "Cree en la importancia de la ayuda mutua y el apoyo entre peruanos.", detalle: "Busca promover el voluntariado y la responsabilidad social empresarial." }
    ],
    trayectoria: [
      { id: "lider-social-2015", rol: "Líder Social", periodo: "2015 - Presente", descripcion: "Trabajo comunitario y liderazgo en la defensa de los derechos sociales." },
      { id: "comerciante-2000", rol: "Comerciante", periodo: "2000 - 2015", descripcion: "Desarrollo de un negocio familiar y participación en la economía local." },
      { id: "activista-2010", rol: "Activista", periodo: "2010 - 2026", descripcion: "Participación activa en movimientos sociales y políticos." }
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
        { nombre: "Organizaciones sociales", descripcion: "Grupos que trabajan en la defensa de los derechos sociales y la promoción de la justicia social." },
        { nombre: "Sindicatos", descripcion: "Organizaciones que agrupan a trabajadores y defienden sus derechos laborales." },
        { nombre: "Movimientos populares", descripcion: "Colectivos que representan a diversos sectores sociales y luchan por sus derechos e intereses." }
      ],
      opositores: [
        { nombre: "Sectores empresariales", descripcion: "Grupos que se oponen a sus políticas de apoyo a la economía familiar y regulación empresarial." },
        { nombre: "Críticos del populismo", descripcion: "Personas u organizaciones que han cuestionado su enfoque populista." }
      ],
      seguidores: "Aprox. 900K en redes"
    },
    headshot: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "miguel",
    nombre: "Miguel Torres",
    ideologia: "Regionalista",
    proyectoPolitico: {
      titulo: "Desarrollo Regional",
      resumen: "Fortalecimiento de las regiones y promoción de un desarrollo descentralizado y autónomo."
    },
    creenciasClave: [
      { id: "descentralizacion", nombre: "Descentralización", resumen: "Promueve un estado más cercano a la gente, con mayor autonomía para las regiones.", detalle: "Propone la creación de gobiernos regionales fuertes y con capacidad de decisión." },
      { id: "desarrollo-regional", nombre: "Desarrollo regional", resumen: "Aboga por un enfoque descentralizado que potencie las economías locales.", detalle: "Busca implementar políticas que integren la conservación de la naturaleza con el desarrollo humano." },
      { id: "autonomia-local", nombre: "Autonomía local", resumen: "Defiende el derecho de las comunidades a autogobernarse y gestionar sus recursos.", detalle: "Propone la creación de presupuestos participativos y la consulta previa para proyectos que afecten a las comunidades." },
      { id: "identidad-regional", nombre: "Identidad regional", resumen: "Cree en la importancia de valorar y promover las identidades locales y regionales.", detalle: "Busca implementar políticas que fomenten el uso del idioma quechua y la celebración de fiestas patrias y costumbres locales." }
    ],
    trayectoria: [
      { id: "alcalde-provincial-2019", rol: "Alcalde Provincial", periodo: "2019 - 2026", descripcion: "Gestión provincial con énfasis en el desarrollo local y la descentralización." },
      { id: "regidor-2015", rol: "Regidor", periodo: "2015 - 2019", descripcion: "Trabajo en la municipalidad provincial, promoviendo el desarrollo regional." },
      { id: "gestor-publico-2010", rol: "Gestor Público", periodo: "2010 - 2015", descripcion: "Gestión de proyectos públicos en diversas áreas." }
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
        { nombre: "Gobiernos regionales", descripcion: "Entidades que representan el gobierno en las diferentes regiones del país." },
        { nombre: "Organizaciones de desarrollo local", descripcion: "Grupos que trabajan en el fortalecimiento de las capacidades locales y la promoción del desarrollo sostenible." },
        { nombre: "Movimientos regionalistas", descripcion: "Colectivos que promueven la identidad y los intereses de las regiones frente a un estado centralista." }
      ],
      opositores: [
        { nombre: "Sectores centralistas", descripcion: "Grupos que defienden un estado centralizado y se oponen a la descentralización." },
        { nombre: "Críticos de su gestión", descripcion: "Personas u organizaciones que han cuestionado su desempeño como alcalde y político." }
      ],
      seguidores: "Aprox. 600K en redes"
    },
    headshot: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "ana",
    nombre: "Ana Jara",
    ideologia: "Aprista",
    proyectoPolitico: {
      titulo: "Renovación Aprista",
      resumen: "Tradición aprista renovada para los nuevos tiempos, con énfasis en la justicia social y la integración latinoamericana."
    },
    creenciasClave: [
      { id: "tradicion-aprista", nombre: "Tradición aprista", resumen: "Defiende los valores y principios del aprismo como guía para el desarrollo del país.", detalle: "Busca revitalizar el partido aprista como una fuerza política relevante y moderna." },
      { id: "justicia-social", nombre: "Justicia social", resumen: "Promueve la equidad y la inclusión social como pilares del desarrollo.", detalle: "Propone la creación de programas de apoyo a poblaciones vulnerables y la promoción de la igualdad de oportunidades." },
      { id: "latinoamericanismo", nombre: "Latinoamericanismo", resumen: "Cree en la importancia de la integración y cooperación entre los países de América Latina.", detalle: "Busca promover políticas de integración regional y solidaridad entre los pueblos latinoamericanos." },
      { id: "solidaridad", nombre: "Solidaridad", resumen: "Cree en la importancia de la ayuda mutua y el apoyo entre peruanos.", detalle: "Busca promover el voluntariado y la responsabilidad social empresarial." }
    ],
    trayectoria: [
      { id: "ex-ministra-2014", rol: "Ex-Ministra", periodo: "2014 - 2016", descripcion: "Gestión en el Ministerio de la Mujer y Poblaciones Vulnerables." },
      { id: "abogada-1990", rol: "Abogada", periodo: "1990 - 2014", descripcion: "Ejercicio de la abogacía con énfasis en derechos humanos y derecho de familia." },
      { id: "dirigente-aprista-2000", rol: "Dirigente Aprista", periodo: "2000 - 2026", descripcion: "Participación activa en la política peruana, promoviendo los valores apristas." }
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
        { nombre: "Partido Aprista", descripcion: "Organización política que defiende los valores apristas y busca el bienestar del pueblo peruano." },
        { nombre: "Organizaciones de derechos humanos", descripcion: "Grupos que defienden los derechos fundamentales y luchan contra la corrupción." },
        { nombre: "Movimientos sociales", descripcion: "Colectivos que representan a diversos sectores sociales y luchan por sus derechos e intereses." }
      ],
      opositores: [
        { nombre: "Sectores conservadores", descripcion: "Grupos que se oponen a sus políticas de justicia social y derechos reproductivos." },
        { nombre: "Críticos del aprismo", descripcion: "Personas u organizaciones que han cuestionado su enfoque aprista." }
      ],
      seguidores: "Aprox. 500K en redes"
    },
    headshot: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "ricardo",
    nombre: "Ricardo Belmont Jr",
    ideologia: "Independiente",
    proyectoPolitico: {
      titulo: "Nueva Política",
      resumen: "Independencia política y gestión moderna sin partidos tradicionales, enfocada en el ciudadano."
    },
    creenciasClave: [
      { id: "independencia-politica", nombre: "Independencia política", resumen: "Cree en la importancia de una política libre de ataduras partidarias.", detalle: "Propone la creación de un movimiento político independiente que represente verdaderamente a la ciudadanía." },
      { id: "comunicacion-directa", nombre: "Comunicación directa", resumen: "Defiende la necesidad de una comunicación clara y directa entre el político y el ciudadano.", detalle: "Busca eliminar los intermediarios y fomentar el contacto directo con la población." },
      { id: "gestion-moderna", nombre: "Gestión moderna", resumen: "Promueve el uso de tecnología y nuevas formas de gestión en la administración pública.", detalle: "Propone la implementación de plataformas digitales para la gestión de trámites y servicios públicos." },
      { id: "transparencia", nombre: "Transparencia", resumen: "Defiende la apertura y el acceso a la información pública.", detalle: "Busca implementar políticas de gobierno abierto y rendición de cuentas. Promueve el uso de tecnología para facilitar el acceso a la información." }
    ],
    trayectoria: [
      { id: "comunicador-2000", rol: "Comunicador", periodo: "2000 - Presente", descripcion: "Labor en medios de comunicación, promoviendo la independencia y la transparencia." },
      { id: "empresario-1995", rol: "Empresario", periodo: "1995 - 2000", descripcion: "Desarrollo de proyectos empresariales en el sector privado." },
      { id: "independiente-2020", rol: "Independiente", periodo: "2020 - 2026", descripcion: "Participación en la política como candidato independiente." }
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
        { nombre: "Organizaciones de la sociedad civil", descripcion: "Grupos que trabajan en la defensa de los derechos civiles y políticos." },
        { nombre: "Grupos de independientes", descripcion: "Colectivos que agrupan a personas que no pertenecen a partidos tradicionales." }
      ],
      opositores: [
        { nombre: "Partidos tradicionales", descripcion: "Organizaciones políticas establecidas que se oponen a su enfoque independiente." },
        { nombre: "Críticos de su gestión", descripcion: "Personas u organizaciones que han cuestionado su desempeño como comunicador y político." }
      ],
      seguidores: "Aprox. 400K en redes"
    },
    headshot: "https://images.unsplash.com/photo-1537511446984-935f663eb1f4?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=400&h=600&fit=crop&auto=format"
  }
];