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
    "proyectoPolitico": {
      "titulo": "Restauración del legado fujimorista: Orden y 'mano dura'",
      "resumen": "Su carrera es un esfuerzo continuo por reivindicar y heredar el proyecto político de su padre, Alberto Fujimori, basado en un discurso de 'mano dura' y políticas de mercado. Su principal desafío es superar el 'techo de cristal' del antifujimorismo.",
      "detalles": [
        {
          "subtitulo": "Legislación de 'mano dura'",
          "texto": "Durante su tiempo como congresista, su labor se centró en la promoción de proyectos de ley punitivos, como la restricción de beneficios penitenciarios para delitos graves, en línea con la plataforma ideológica de su padre.",
          "fuente": "https://es.wikipedia.org/wiki/Keiko_Fujimori"
        },
        {
          "subtitulo": "Obstrucción parlamentaria como estrategia",
          "texto": "Tras ganar una mayoría absoluta en el Congreso en 2016, lideró una estrategia de obstrucción sistemática contra los gobiernos de PPK y Vizcarra, lo que agudizó la inestabilidad política del país.",
          "fuente": "https://www.cidob.org/lider-politico/keiko-fujimori-higuchi"
        },
        {
          "subtitulo": "Desconocimiento de resultados electorales",
          "texto": "Después de su derrota en 2021, se embarcó en una agresiva campaña para desconocer los resultados, alegando un 'fraude electoral' sistemático que no fue respaldado por pruebas y fue desestimado por observadores.",
          "fuente": "https://www.wola.org/es/analysis/peru-tiene-nuevo-presidente-fujimori-empeligra-democracia/"
        }
      ]
    },
    "creenciasClave": [
      {
        "id": "legado-paterno",
        "nombre": "Heredera y defensora del legado Fujimori",
        "resumen": "Su capital político emana del legado de su padre, lo que es a la vez su mayor activo y su principal lastre.",
        "detalle": "Toda su carrera se define por su lealtad al proyecto político de su padre. Tomó el lugar de su madre como Primera Dama, asumió el liderazgo del movimiento y ha hecho de la defensa de su padre una bandera política.",
        "fuente": "https://es.wikipedia.org/wiki/Keiko_Fujimori"
      },
      {
        "id": "antifujimorismo",
        "nombre": "El 'techo de cristal' del antifujimorismo",
        "resumen": "Es la encarnación de la polarización; su figura activa una poderosa coalición opositora en su contra.",
        "detalle": "El patrón de sus tres derrotas presidenciales es claro: su base leal la lleva a la segunda vuelta, pero el sentimiento 'antifujimorista' aglutina a una diversa mayoría de votantes con el único fin de impedir su victoria.",
        "fuente": "https://en.wikipedia.org/wiki/Keiko_Fujimori"
      },
      {
        "id": "lawfare",
        "nombre": "Uso del sistema legal como campo de batalla ('Lawfare')",
        "resumen": "Su estrategia de defensa se ha centrado en atacar la validez del proceso judicial en su contra.",
        "detalle": "El juicio en su contra fue anulado y retrocedido a una etapa anterior gracias a fallos del Tribunal Constitucional basados en tecnicismos procesales, lo que sugiere una estrategia deliberada para dilatar el proceso hasta su eventual prescripción.",
        "fuente": "https://es.wikipedia.org/wiki/Juicio_a_Keiko_Fujimori"
      }
    ],
    "trayectoria": [
      {
        "id": "primera-dama",
        "rol": "Primera Dama del Perú",
        "periodo": "1994 – 2000",
        "descripcion": "Con solo 19 años, es nombrada Primera Dama por su padre, tras la destitución de su madre, Susana Higuchi. Se alinea indeleblemente con el proyecto político paterno.",
        "fuente": "https://es.wikipedia.org/wiki/Keiko_Fujimori"
      },
      {
        "id": "congresista-record",
        "rol": "Una de las congresistas más votadas de la historia",
        "periodo": "2006 – 2011",
        "descripcion": "Obtiene 602,869 votos, la tercera cifra más alta para un legislador en la historia del Perú, considerando los resultados de las elecciones del 2000",
        "fuente": "https://en.wikipedia.org/wiki/Keiko_Fujimori"
      },
      {
        "id": "fundacion-fuerza-popular",
        "rol": "Fundadora y Presidenta de Fuerza Popular",
        "periodo": "2010 – Presente",
        "descripcion": "Funda su propio partido, Fuerza 2011 (luego Fuerza Popular), creando un vehículo político a su medida para sus tres intentos presidenciales.",
        "fuente": "https://www.cidob.org/lider-politico/keiko-fujimori-higuchi"
      },
      {
        "id": "campanas-presidenciales",
        "rol": "Candidata presidencial derrotada (3 veces)",
        "periodo": "2011, 2016, 2021",
        "descripcion": "Llega a la segunda vuelta en tres elecciones consecutivas, pero es derrotada por Ollanta Humala (2011), PPK (2016) y Pedro Castillo (2021).",
        "fuente": "https://es.wikipedia.org/wiki/Keiko_Fujimori"
      },
      {
        "id": "prision-preventiva",
        "rol": "Encarcelada por el 'Caso Cócteles'",
        "periodo": "2018 – 2020",
        "descripcion": "Cumple más de 16 meses de prisión preventiva en varios periodos, acusada de liderar una organización criminal para lavar dinero de aportes de campaña ilícitos (Odebrecht, etc.).",
        "fuente": "https://en.wikipedia.org/wiki/Keiko_Fujimori"
      },
      {
        "id": "juicio-oral",
        "rol": "Enjuiciada por organización criminal",
        "periodo": "2024 – Presente",
        "descripcion": "Se inicia el juicio oral donde la fiscalía pide 30 años de prisión. El proceso es posteriormente anulado por el TC y retrocedido a una etapa anterior, quedando en un limbo legal.",
        "fuente": "https://es.wikipedia.org/wiki/Juicio_a_Keiko_Fujimori"
      }
    ],
    "presenciaDigital": {
      "plataformas": [
        {
          "nombre": "tiktok",
          "handle": "@keikofujimorih",
          "url": "https://www.tiktok.com/@keikofujimorih",
          "estrategia": "Su plataforma más dinámica. Mezcla contenido político con videos personales (cocinando, bailando) para humanizar su figura y conectar con un público más joven."
        },
        {
          "nombre": "youtube",
          "handle": "@keikofujimorih",
          "url": "https://www.youtube.com/@keikofujimorih",
          "estrategia": "Utiliza formatos largos como la serie 'Konfesiones' para contar su propia versión de su vida y batallas legales, en un intento de controlar la narrativa y apelar a la empatía."
        }
      ]
    },
    "mapaDePoder": {
      "alianzas": [
        {
          "nombre": "Fuerza Popular",
          "descripcion": "Su partido político, que se convirtió en la principal fuerza de oposición con mayoría absoluta en el Congreso entre 2016 y 2019."
        },
        {
          "nombre": "Núcleo duro fujimorista",
          "descripcion": "Una base electoral leal y sólida, heredada de su padre, que le ha garantizado consistentemente el paso a la segunda vuelta presidencial."
        },
        {
          "nombre": "Grupos empresariales",
          "descripcion": "La fiscalía la acusa de recibir aportes clandestinos de importantes corporaciones como Odebrecht y Credicorp para financiar sus campañas."
        }
      ],
      "opositores": [
        {
          "nombre": "Movimiento Antifujimorista",
          "descripcion": "Una diversa y poderosa coalición de ciudadanos y grupos políticos de diferentes ideologías que se activa electoralmente con el objetivo principal de impedir su llegada al poder."
        },
        {
          "nombre": "Equipo Especial de la Fiscalía (Caso Lava Jato)",
          "descripcion": "El equipo de fiscales, liderado por José Domingo Pérez, que ha investigado el 'Caso Cócteles' y la acusa de liderar una organización criminal."
        },
        {
          "nombre": "Rafael López Aliaga",
          "descripcion": "Su principal rival por la hegemonía y el liderazgo del voto de la derecha en el Perú."
        }
      ]
    },
    headshot: "https://pbs.twimg.com/profile_images/1876955744525856768/1H9ukeEv_400x400.jpg",
    fullBody: "/fotos_candidatos/keiko/full_body_keiko.gif",
    education: "pro",
    security: "pro",
    health: "anti",
    "econ": 7,
    "social": 6
  },
  {
    id: "rafael",
    nombre: "Rafael L. Aliaga",
    ideologia: "Derecha",
    "proyectoPolitico": {
      "titulo": "'Restauración patriarcal' con 'mano dura' y gestión gerencial",
      "resumen": "Propone un modelo que amalgama un liberalismo económico con políticas sociales anti-liberales y una fuerte base en el catolicismo conservador, bajo la promesa de aplicar la eficiencia del sector privado a la gestión pública.",
      "detalles": [
        {
          "subtitulo": "'Lima Potencia Mundial': Infraestructura y Seguridad",
          "texto": "Prometió la adquisición de 10,000 motocicletas para seguridad y la construcción de grandes obras de infraestructura como nuevas vías expresas y túneles, financiadas con bonos municipales.",
          "fuente": "https://www.actualidadambiental.pe/wp-content/uploads/2022/09/Plan-de-Gobierno-Renovacion-Popular-Elecciones-2022.pdf"
        },
        {
          "subtitulo": "'Hambre Cero': Apoyo a ollas comunes",
          "texto": "Programa insignia de su campaña municipal diseñado para combatir la inseguridad alimentaria, aunque su implementación ha sido criticada por la mala calidad y cantidad de los alimentos entregados.",
          "fuente": "https://www.youtube.com/watch?v=q5ih6R1xnSE"
        },
        {
          "subtitulo": "Reducción radical del aparato estatal",
          "texto": "Durante su campaña presidencial de 2021, propuso una drástica reducción del Estado mediante la fusión de ministerios para proyectar una imagen de austeridad y eficiencia.",
          "fuente": "https://declara.jne.gob.pe/ASSETS/PLANGOBIERNO/FILEPLANGOBIERNO/16482.pdf"
        }
      ]
    },
    "creenciasClave": [
      {
        "id": "ultraconservadurismo-religioso",
        "nombre": "Cruzada moral y valores tradicionales",
        "resumen": "Miembro numerario del Opus Dei, practica el celibato y basa su plataforma en un discurso explícitamente religioso.",
        "detalle": "Su fe no es un detalle biográfico, sino un componente central de su marca política, que informa directamente su plataforma social ultraconservadora (anti-liberal) y su discurso de 'restauración patriarcal'.",
        "fuente": "https://es.wikipedia.org/wiki/Rafael_L%C3%B3pez_Aliaga"
      },
      {
        "id": "gestion-empresarial",
        "nombre": "El empresario exitoso en la política",
        "resumen": "Se presenta como un gestor competente capaz de replicar el éxito del sector privado en la administración pública.",
        "detalle": "Utiliza su historial como fundador de un conglomerado en finanzas y turismo (Grupo Acres, PeruRail) para construir una narrativa de eficiencia y prometer transformar Lima en una 'potencia mundial', aunque la solidez de su éxito empresarial ha sido cuestionada.",
        "fuente": "https://ojo-publico.com/2520/lopez-aliaga-los-negocios-un-candidato-ultraconservador"
      },
      {
        "id": "mano-dura",
        "nombre": "Mano dura contra la delincuencia",
        "resumen": "Abrazó el apodo de 'el Bolsonaro peruano', centrando su plataforma en un discurso de mano dura.",
        "detalle": "Una de las promesas centrales de su gestión como alcalde y de su campaña presidencial es una política de tolerancia cero contra el crimen, ejemplificada en su propuesta de adquirir 10,000 motocicletas para patrullaje.",
        "fuente": "https://www.actualidadambiental.pe/wp-content/uploads/2022/09/Plan-de-Gobierno-Renovacion-Popular-Elecciones-2022.pdf"
      }
    ],
    "trayectoria": [
      {
        "id": "formacion-empresarial",
        "rol": "Empresario y miembro del Opus Dei",
        "periodo": "1961 – 2006",
        "descripcion": "Ingeniero Industrial con MBA. Desde los 19 años es miembro numerario del Opus Dei. Fundó el Grupo Acres y se convirtió en un actor clave en el sector turismo (PeruRail).",
        "fuente": "https://es.wikipedia.org/wiki/Rafael_L%C3%B3pez_Aliaga"
      },
      {
        "id": "regidor-lima",
        "rol": "Regidor de la Municipalidad de Lima",
        "periodo": "2007 – 2010",
        "descripcion": "Ingresó a la política de la mano del alcalde Luis Castañeda Lossio. Apoyó la concesión de Línea Amarilla a la empresa brasileña OAS, luego implicada en el caso Lava Jato.",
        "fuente": "https://es.wikipedia.org/wiki/Rafael_L%C3%B3pez_Aliaga"
      },
      {
        "id": "panama-papers",
        "rol": "Implicado en los Panama Papers",
        "periodo": "Revelado en 2016",
        "descripcion": "Una investigación de IDL-Reporteros expuso su uso de estructuras offshore y presuntas maniobras fraudulentas en una guerra corporativa contra su socio, Lorenzo Sousa.",
        "fuente": "https://www.idl-reporteros.pe/lopez-aliaga-y-los-panama-papers/"
      },
      {
        "id": "deudas-sunat",
        "rol": "Controversia por deudas tributarias",
        "periodo": "Permanente",
        "descripcion": "Empresas vinculadas a él, como Peruval Corp SA, mantienen deudas coactivas con la SUNAT por decenas de millones de soles, usando tácticas como figurar como 'no habidas' para obstaculizar el cobro.",
        "fuente": "https://www.youtube.com/watch?v=EO2mr4WDAfY&pp=0gcJCfwAo7VqN5tD"
      },
      {
        "id": "refundacion-partido",
        "rol": "Fundador de Renovación Popular",
        "periodo": "2020",
        "descripcion": "Tras el fracaso electoral de Solidaridad Nacional, lo 'refunda' como Renovación Popular, un partido con una ideología explícitamente religiosa y ultraconservadora.",
        "fuente": "https://es.wikipedia.org/wiki/Rafael_L%C3%B3pez_Aliaga"
      },
      {
        "id": "campana-presidencial-2021",
        "rol": "Candidato Presidencial",
        "periodo": "2021",
        "descripcion": "Se posiciona como 'el Bolsonaro peruano' y obtiene el tercer lugar con 11.75% de los votos, consolidándose como una nueva fuerza hegemónica en la derecha.",
        "fuente": "https://en.wikipedia.org/wiki/Rafael_L%C3%B3pez_Aliaga"
      },
      {
        "id": "alcalde-lima",
        "rol": "Alcalde de Lima Metropolitana",
        "periodo": "2023 – Presente",
        "descripcion": "Asume el cargo el 1 de enero de 2023. Su gestión ha sido criticada por la baja ejecución presupuestaria y por priorizar una aparente campaña presidencial perpetua sobre la gestión municipal.",
        "fuente": "https://www.gob.pe/institucion/munilima/noticias/693302-rafael-lopez-aliaga-juro-como-alcalde-de-lima-en-ceremonia-realizada-en-el-teatro-municipal"
      }
    ],
    "presenciaDigital": {
      "plataformas": [
        {
          "nombre": "twitter",
          "handle": "@rlopezaliaga_",
          "url": "https://x.com/rlopezaliaga_",
          "estrategia": "Estilo confrontacional. Ha usado las cuentas oficiales de la municipalidad para atacar a los medios de comunicación ('pasquines mermeleros') y bloquear a críticos, como la Red de Ollas Comunes."
        },
        {
          "nombre": "facebook",
          "handle": "RafaelLopezAliaga",
          "url": "https://www.facebook.com/RafaelLopezAliaga/",
          "estrategia": "Comunica los avances de su gestión y mantiene una línea de mensajes de corte conservador y populista para movilizar a su base electoral."
        }
      ]
    },
    "mapaDePoder": {
      "alianzas": [
        {
          "nombre": "Renovación Popular",
          "descripcion": "Su vehículo político personal, refundado para promover una agenda ultraconservadora y servir como plataforma para sus ambiciones."
        },
        {
          "nombre": "Conglomerado corporativo",
          "descripcion": "Su imperio empresarial (Grupo Acres, PeruRail, etc.) le proporciona los recursos financieros y la imagen de 'gestor exitoso' que son la base de su poder político."
        },
        {
          "nombre": "Derecha radical internacional (Vox)",
          "descripcion": "Se ha alineado con otras figuras de la derecha radical en Iberoamérica, como José Antonio Kast y Javier Milei, a través de su adhesión a la Carta de Madrid, una iniciativa del partido español Vox."
        }
      ],
      "opositores": [
        {
          "nombre": "Keiko Fujimori / Fujimorismo",
          "descripcion": "Su principal rival en la contienda por la hegemonía de la derecha peruana. Representa un modelo de poder (ultraconservadurismo corporativo) que choca con el del fujimorismo (populismo de legado)."
        },
        {
          "nombre": "Prensa de investigación",
          "descripcion": "Medios como IDL-Reporteros y OjoPúblico han publicado investigaciones exhaustivas sobre sus estructuras offshore, deudas tributarias y la gestión de sus empresas, a las que él ataca constantemente."
        }
      ]
    },
    headshot: "https://pbs.twimg.com/profile_images/1372582295987757058/P2yzmjJP_400x400.jpg",
    fullBody: "/fotos_candidatos/rafael/full_body_rafael.gif",
    econ: 8,
    social: 7
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
      ]
    },
    headshot: "https://pbs.twimg.com/profile_images/991790180129476608/w-QUgKQT_400x400.jpg",
    fullBody: "/fotos_candidatos/lescano/full_body_lescano.gif",
    econ: 2,
    social: 1
  },
  {
    id: "antauro",
    nombre: "Antauro Humala",
    ideologia: "Izquierda Autoritaria",
    headshot: "https://pbs.twimg.com/profile_images/1561766942150737923/BJmWxtlq_400x400.jpg",
    fullBody: "/fotos_candidatos/antauro/full_body_antauro.gif",
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
      ]
    },
    econ: -8,
    social: 9
  },
  {
  id: "martin-vizcarra",
  nombre: "Martín Vizcarra",
  ideologia: "Centrista tecnocrático, descentralización",
  headshot: "https://commons.wikimedia.org/wiki/Special:FilePath/Mart%C3%ADn%20Vizcarra%20Cornejo%20(square%20portrait).png?width=150&height=150",
  fullBody: "/fotos_candidatos/vizcarra/full_body_vizcarra.gif",

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
    ]
  },
    econ: 4,
    social: 4
},
  {
    id: "guillermo-bermejo",
    nombre: "Guillermo Bermejo",
    ideologia: "Marxista-Leninista, Socialista, Izquierda",
    headshot: "https://pbs.twimg.com/profile_images/1711746019795382272/ROaxERZY_400x400.jpg",
    fullBody: "/fotos_candidatos/bermejo/full_body_bermejo.gif",
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
      ]
    },
    econ: -8,
    social: -3
  }
  ,
  {
  id: "carlos-alvarez",
  nombre: "Carlos Álvarez",
  ideologia: "Derecha punitiva",
  headshot: "https://portal.andina.pe/EDPfotografia3/Thumbnail/2018/05/03/000501027W.jpg",
  fullBody: "/fotos_candidatos/alvarez/full_body_alvarez.gif",
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
    ]
  },

  // Compass (estimación con la evidencia disponible)
  econ: 2,          // no hay plan económico; retórica de austeridad sin estatismo → ligera derecha
  social: 9,        // pena de muerte, megacárceles, estados de excepción → autoritarismo alto
  security: "pro",
  health: "neutral",
  education: "neutral"
},
{
    "id": "cesar-acuna",
    "nombre": "César Acuña",
    "ideologia": "Populismo pragmático y clientelar",
    "headshot": "https://upload.wikimedia.org/wikipedia/commons/b/bf/C%C3%A9sar_Acu%C3%B1a_Peralta.jpg",
    "fullBody": "/fotos_candidatos/acuña/full_body_acuña_move.gif",
    "proyectoPolitico": {
      "titulo": "Poder regional a través de obras de impacto y un modelo educativo-empresarial",
      "resumen": "Utiliza la vasta fortuna generada por su consorcio universitario (UCV, USS) para financiar un proyecto político regionalista, centrado en la ejecución de obras públicas de alto impacto visual y el establecimiento de una red clientelar para consolidar su poder en el norte del Perú.",
      "detalles": [
        {
          "subtitulo": "Proyectos de infraestructura a gran escala",
          "texto": "Su gestión como gobernador se ha centrado en megaproyectos como el destrabe del Proyecto Especial Chavimochic III y la planificación de un nuevo Hospital Regional para Trujillo.",
          "fuente": "https://regionlalibertad.gob.pe/noticiaS/regionales/15239-cesar-acuna-gestiones-mas-emblematicas-son-destrabe-de-chavimochic-y-nuevo-hospital-regional"
        },
        {
          "subtitulo": "Inversión masiva en educación y salud",
          "texto": "Ha anunciado una inversión de más de mil millones de soles para la reconstrucción de colegios y ha priorizado la compra de equipamiento médico, como 38 ambulancias y un resonador magnético.",
          "fuente": "https://www.gob.pe/institucion/regionlalibertad/noticias/1140130-mil-millones-invierte-la-gestion-de-cesar-acuna-en-educacion"
        },
        {
          "subtitulo": "Modelo de alianzas con gobiernos locales",
          "texto": "Implementó un sistema de ejecución de obras en alianza con los municipios, donde el Gobierno Regional financia directamente los proyectos locales, habiendo financiado más de 108 de ellos.",
          "fuente": "https://www.gob.pe/institucion/regionlalibertad/noticias/1158501-en-3-anos-de-gestion-108-obras-financiara-el-gore-a-municipios"
        }
      ]
    },
    "creenciasClave": [
      {
        "id": "plata-como-cancha",
        "nombre": "'Plata como cancha': El dinero como herramienta política",
        "resumen": "Su poder se sustenta en su vasta fortuna, usada explícitamente para financiar campañas y asegurar apoyo popular.",
        "detalle": "La frase, originada en un audio filtrado de 2010, encapsula su visión pragmática del poder, donde los recursos económicos son una herramienta fundamental para ganar elecciones y consolidar su influencia política.",
        "fuente": "https://es.wikipedia.org/wiki/Caso_Plata_como_cancha"
      },
      {
        "id": "educacion-poder",
        "nombre": "Sinergia Educación-Política",
        "resumen": "Su imperio educativo es la infraestructura de su poder político.",
        "detalle": "Las universidades (UCV, USS, Autónoma) no solo financian su partido, Alianza para el Progreso, sino que también actúan como centros de reclutamiento y bases políticas, utilizando la imagen de 'educador' para capitalizarla en las urnas.",
        "fuente": "https://www.infobae.com/peru/2024/02/16/cesar-acuna-a-cuanto-asciende-el-patrimonio-del-gobernador-de-la-libertad/"
      },
      {
        "id": "alcalde-constructor",
        "nombre": "Obras como fuente de legitimidad",
        "resumen": "Cimenta su popularidad en obras públicas de alto impacto visual y popular.",
        "detalle": "Durante su gestión como alcalde de Trujillo, invirtió más de 800 millones de soles en proyectos como el bypass de Mansiche y el complejo deportivo Chan Chan, consolidando su imagen de 'alcalde constructor' y gestor eficaz.",
        "fuente": "https://trujilloenlinea.pe/noticias/politica/16/02/2018/cesar-acuna-niega-corrupcion-durante-su-gestion-edil-en-trujillo"
      }
    ],
    "trayectoria": [
      {
        "id": "formacion-empresarial",
        "rol": "Fundador del consorcio UCV",
        "periodo": "1952 – 1991",
        "descripcion": "Nacido en Cajamarca, se gradúa de Ingeniero Químico y en 1991 funda la Universidad César Vallejo (UCV) en Trujillo, pilar de su imperio empresarial.",
        "fuente": "https://es.wikipedia.org/wiki/Universidad_C%C3%A9sar_Vallejo"
      },
      {
        "id": "congresista",
        "rol": "Congresista de la República",
        "periodo": "2000 – 2006",
        "descripcion": "Elegido por dos periodos. En 2001 funda su partido, Alianza para el Progreso (APP). Se le critica por legislar en materia de educación privada, existiendo un conflicto de interés.",
        "fuente": "https://es.wikipedia.org/wiki/C%C3%A9sar_Acu%C3%B1a"
      },
      {
        "id": "alcalde-trujillo",
        "rol": "Alcalde de Trujillo",
        "periodo": "2007 – 2014",
        "descripcion": "Pone fin a 44 años de hegemonía aprista en la ciudad. Es reelegido en 2010. Basa su gestión en obras de alto impacto.",
        "fuente": "https://en.wikipedia.org/wiki/C%C3%A9sar_Acu%C3%B1a"
      },
      {
        "id": "gobernador-libertad-1",
        "rol": "Gobernador Regional de La Libertad",
        "periodo": "2015",
        "descripcion": "Asume el cargo pero renuncia a los diez meses para postular a la presidencia en 2016, generando críticas por su falta de compromiso.",
        "fuente": "https://www.regionlalibertad.gob.pe/noticias/regionales/5916-cesar-acuna-renuncia-a-la-gobernacion-regional-de-la-libertad"
      },
      {
        "id": "investigacion-plagio",
        "rol": "Acusado de plagio académico",
        "periodo": "2016 – Presente",
        "descripcion": "Surgen graves y fundamentadas acusaciones de plagio en su tesis doctoral de la U. Complutense de Madrid y en su tesis de maestría de la U. de Lima.",
        "fuente": "https://www.ulima.edu.pe/la-universidad/noticias/comunicado-1"
      },
      {
        "id": "exclusion-presidencial-2016",
        "rol": "Excluido de la elección presidencial",
        "periodo": "Mar 2016",
        "descripcion": "El Jurado Nacional de Elecciones lo excluye por entregar dinero a comerciantes durante una actividad de campaña, en aplicación de la ley que prohíbe dádivas.",
        "fuente": "https://en.wikipedia.org/wiki/C%C3%A9sar_Acu%C3%B1a"
      },
      {
        "id": "campana-presidencial-2021",
        "rol": "Candidato Presidencial",
        "periodo": "2021",
        "descripcion": "Obtiene el séptimo lugar con el 6.02% de los votos válidos. Su partido consigue 15 congresistas.",
        "fuente": "https://es.wikipedia.org/wiki/Elecciones_generales_de_Per%C3%BA_de_2021"
      },
      {
        "id": "investigacion-trafico-influencias",
        "rol": "Investigado por tráfico de influencias",
        "periodo": "2022 – Presente",
        "descripcion": "La Fiscalía le abre investigación tras la difusión de audios donde presiona a la presidenta del Congreso, Lady Camones, para aprobar una ley que lo favorecería electoralmente.",
        "fuente": "https://diarioelgobierno.pe/politica-peruana-castillo-peru-2022-congreso/fiscalia-de-la-nacion-investiga-a-cesar-acuna-por-trafico-de-influencias/"
      },
      {
        "id": "gobernador-libertad-2",
        "rol": "Gobernador Regional de La Libertad",
        "periodo": "2023 – Presente",
        "descripcion": "Gana nuevamente la gobernación. Su mandato es criticado por sus constantes ausencias y licencias, que superan el límite legal.",
        "fuente": "https://es.wikipedia.org/wiki/C%C3%A9sar_Acu%C3%B1a"
      }
    ],
    "presenciaDigital": {
      "plataformas": [
        {
          "nombre": "tiktok",
          "handle": "@cesaracunap",
          "url": "https://www.tiktok.com/@cesaracunap",
          "estrategia": "Adopta un tono informal y participa en tendencias virales para conectar con audiencias más jóvenes que no consumen medios tradicionales."
        },
        {
          "nombre": "facebook",
          "handle": "CesarAcunaP",
          "url": "https://www.facebook.com/CesarAcunaP/",
          "estrategia": "Es uno de los políticos peruanos con mayor inversión en publicidad pagada en Facebook e Instagram, lo que le permite mantener una presencia constante y dirigir mensajes segmentados."
        }
      ]
    },
    "mapaDePoder": {
      "alianzas": [
        {
          "nombre": "Alianza para el Progreso (APP)",
          "descripcion": "Partido político que él mismo fundó en 2001, que funciona como el brazo político de su conglomerado empresarial y vehículo para sus ambiciones."
        },
        {
          "nombre": "Consorcio educativo (UCV, USS, UAP)",
          "descripcion": "El motor económico y la base social de su poder. La red de estudiantes, egresados y personal constituye una base política natural y un canal de difusión de su mensaje."
        }
      ],
      "opositores": [
        {
          "nombre": "Prensa nacional y limeña",
          "descripcion": "El intenso escrutinio de los medios de comunicación nacionales magnifica los escándalos que a nivel regional son minimizados, actuando como una barrera para sus aspiraciones presidenciales."
        },
        {
          "nombre": "Opositores políticos regionales (Ej. Partido Aprista)",
          "descripcion": "Su irrupción en Trujillo rompió una hegemonía de 44 años del APRA, consolidándolo como un rival directo del aprismo en el norte del país."
        }
      ]
    },
    "econ": 3,
    "social": 1
  }
];