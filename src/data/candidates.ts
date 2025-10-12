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
  controversias: {
    id: string;
    titulo: string;
    descripcion: string;
    fuente: string;
    rank?: number; // 1..n por candidato (usa Rank_candidato)
    legal?: 'denuncia_en_medios' | 'en_curso' | 'sancion' | 'cerrado_sin_sancion' | 'condena'; // badge legal
    severidad?: 'media' | 'alta' | 'muy-alta'; // personas + impacto + dinero (3 niveles)
  }[];
  econ?: number;
  social?: number;
  territorial?: number;
  power?: number;
  education?: string;
  security?: string;
  health?: string;
}

export const candidates: Candidate[] = [
  {
    id: "keiko",
    nombre: "Keiko Fujimori",
    ideologia: "Derecha Populista",
    proyectoPolitico: {
      titulo: "Orden y mercado",
      resumen: "Reivindica fujimorismo con mano dura y economía de mercado; enfrenta antifujimorismo.",
      detalles: [
        {
          subtitulo: "Legislación de 'mano dura'",
          texto: "Durante su tiempo como congresista, su labor se centró en la promoción de proyectos de ley punitivos, como la restricción de beneficios penitenciarios para delitos graves, en línea con la plataforma ideológica de su padre.",
          fuente: "https://es.wikipedia.org/wiki/Keiko_Fujimori"
        },
        {
          subtitulo: "Obstrucción parlamentaria como estrategia",
          texto: "Tras ganar una mayoría absoluta en el Congreso en 2016, lideró una estrategia de obstrucción sistemática contra los gobiernos de PPK y Vizcarra, lo que agudizó la inestabilidad política del país.",
          fuente: "https://www.cidob.org/lider-politico/keiko-fujimori-higuchi"
        },
        {
          subtitulo: "Desconocimiento de resultados electorales",
          texto: "Después de su derrota en 2021, se embarcó en una agresiva campaña para desconocer los resultados, alegando un 'fraude electoral' sistemático que no fue respaldado por pruebas y fue desestimado por observadores.",
          fuente: "https://www.wola.org/es/analysis/peru-tiene-nuevo-presidente-fujimori-empeligra-democracia/"
        }
      ]
    },
    creenciasClave: [
      {
        id: "legado-paterno",
        nombre: "Legado Fujimori",
        resumen: "Su capital político emana del legado de su padre, lo que es a la vez su mayor activo y su principal lastre.",
        detalle: "Toda su carrera se define por su lealtad al proyecto político de su padre. Tomó el lugar de su madre como Primera Dama, asumió el liderazgo del movimiento y ha hecho de la defensa de su padre una bandera política.",
        fuente: "https://es.wikipedia.org/wiki/Keiko_Fujimori"
      },
      {
        id: "antifujimorismo",
        nombre: "Combatir Antifujimorismo",
        resumen: "Es la encarnación de la polarización; su figura activa una poderosa coalición opositora en su contra.",
        detalle: "El patrón de sus tres derrotas presidenciales es claro: su base leal la lleva a la segunda vuelta, pero el sentimiento 'antifujimorista' aglutina a una diversa mayoría de votantes con el único fin de impedir su victoria.",
        fuente: "https://en.wikipedia.org/wiki/Keiko_Fujimori"
      },
      {
        id: "lawfare",
        nombre: "Tribunales como escenario",
        resumen: "Su estrategia de defensa se ha centrado en atacar la validez del proceso judicial en su contra.",
        detalle: "El juicio en su contra fue anulado y retrocedido a una etapa anterior gracias a fallos del Tribunal Constitucional basados en tecnicismos procesales, lo que sugiere una estrategia deliberada para dilatar el proceso hasta su eventual prescripción.",
        fuente: "https://es.wikipedia.org/wiki/Juicio_a_Keiko_Fujimori"
      }
    ],
    trayectoria: [
      {
        id: "primera-dama",
        rol: "Primera Dama del Perú",
        periodo: "1994 – 2000",
        descripcion: "Con solo 19 años, es nombrada Primera Dama por su padre, tras la destitución de su madre, Susana Higuchi. Se alinea indeleblemente con el proyecto político paterno.",
        fuente: "https://es.wikipedia.org/wiki/Keiko_Fujimori"
      },
      {
        id: "congresista-record",
        rol: "Una de las congresistas más votadas de la historia",
        periodo: "2006 – 2011",
        descripcion: "Obtiene 602,869 votos, la tercera cifra más alta para un legislador en la historia del Perú, considerando los resultados de las elecciones del 2000",
        fuente: "https://en.wikipedia.org/wiki/Keiko_Fujimori"
      },
      {
        id: "fundacion-fuerza-popular",
        rol: "Fundadora y Presidenta de Fuerza Popular",
        periodo: "2010 – Presente",
        descripcion: "Funda su propio partido, Fuerza 2011 (luego Fuerza Popular), creando un vehículo político a su medida para sus tres intentos presidenciales.",
        fuente: "https://www.cidob.org/lider-politico/keiko-fujimori-higuchi"
      },
      {
        id: "campanas-presidenciales",
        rol: "Candidata presidencial derrotada (3 veces)",
        periodo: "2011, 2016, 2021",
        descripcion: "Llega a la segunda vuelta en tres elecciones consecutivas, pero es derrotada por Ollanta Humala (2011), PPK (2016) y Pedro Castillo (2021).",
        fuente: "https://es.wikipedia.org/wiki/Keiko_Fujimori"
      },
      {
        id: "prision-preventiva",
        rol: "Encarcelada por el 'Caso Cócteles'",
        periodo: "2018 – 2020",
        descripcion: "Cumple más de 16 meses de prisión preventiva en varios periodos, acusada de liderar una organización criminal para lavar dinero de aportes de campaña ilícitos (Odebrecht, etc.).",
        fuente: "https://en.wikipedia.org/wiki/Keiko_Fujimori"
      },
      {
        id: "juicio-oral",
        rol: "Enjuiciada por organización criminal",
        periodo: "2024 – Presente",
        descripcion: "Se inicia el juicio oral donde la fiscalía pide 30 años de prisión. El proceso es posteriormente anulado por el TC y retrocedido a una etapa anterior, quedando en un limbo legal.",
        fuente: "https://es.wikipedia.org/wiki/Juicio_a_Keiko_Fujimori"
      }
    ],
    presenciaDigital: {
      plataformas: [
        {
          nombre: "tiktok",
          handle: "@keikofujimorih",
          url: "https://www.tiktok.com/@keikofujimorih",
          estrategia: "Su plataforma más dinámica. Mezcla contenido político con videos personales (cocinando, bailando) para humanizar su figura y conectar con un público más joven."
        },
        {
          nombre: "youtube",
          handle: "@keikofujimorih",
          url: "https://www.youtube.com/@keikofujimorih",
          estrategia: "Utiliza formatos largos como la serie 'Konfesiones' para contar su propia versión de su vida y batallas legales, en un intento de controlar la narrativa y apelar a la empatía."
        }
      ]
    },
    mapaDePoder: {
      alianzas: [
        {
          nombre: "Fuerza Popular",
          descripcion: "Su partido político, que se convirtió en la principal fuerza de oposición con mayoría absoluta en el Congreso entre 2016 y 2019."
        },
        {
          nombre: "Núcleo duro fujimorista",
          descripcion: "Una base electoral leal y sólida, heredada de su padre, que le ha garantizado consistentemente el paso a la segunda vuelta presidencial."
        },
        {
          nombre: "Grupos empresariales",
          descripcion: "La fiscalía la acusa de recibir aportes clandestinos de importantes corporaciones como Odebrecht y Credicorp para financiar sus campañas."
        }
      ],
      opositores: [
        {
          nombre: "Movimiento Antifujimorista",
          descripcion: "Una diversa y poderosa coalición de ciudadanos y grupos políticos de diferentes ideologías que se activa electoralmente con el objetivo principal de impedir su llegada al poder."
        },
        {
          nombre: "Equipo de Fiscalía",
          descripcion: "El equipo de fiscales, liderado por José Domingo Pérez, que ha investigado el 'Caso Cócteles' y la acusa de liderar una organización criminal."
        },
        {
          nombre: "Rafael López Aliaga",
          descripcion: "Su principal rival por la hegemonía y el liderazgo del voto de la derecha en el Perú."
        }
      ]
    },
    controversias: [
      {
        id: "cocteles",
        titulo: "Caso ‘Cócteles’: presunto lavado de aportes",
        descripcion: "Acusada de liderar una organización criminal y lavar dinero (Odebrecht)",
        fuente: "https://es.wikipedia.org/wiki/Juicio_a_Keiko_Fujimori",
        rank: 1,
        legal: "en_curso",
        severidad: "muy-alta"
      },
      {
        id: "compra-propiedades-ramirez",
        titulo: "Caso Joaquín Ramírez: compras inmobiliarias",
        descripcion: "Lavado de dinero vía inmuebles vinculados al exsecretario general.",
        fuente: "https://rpp.pe/politica/judiciales/poder-judicial-ordeno-al-ministerio-publico-concluir-investigacion-contra-el-alcalde-de-cajamarca-joaquin-ramirez-noticia-1616395",
        rank: 2,
        legal: "en_curso",
        severidad: "media"
      },
      {
        id: "captura-instituciones",
        titulo: "Captura de la justicia",
        descripcion: "Influencia para decidir magistrados y juicios.",
        fuente: "https://www.ohchr.org/en/press-releases/2023/11/peru-un-expert-concerned-about-proceedings-peruvian-congress-seeking-removal",
        rank: 3,
        legal: "denuncia_en_medios",
        severidad: "alta"
      },
      {
        id: "obstruccion-2016-2018",
        titulo: "Confrontación con el Ejecutivo (2016–2018)",
        descripcion: "Choque con ejecutivo usando mayoría en el Congreso.",
        fuente: "https://www.cidob.org/lider-politico/keiko-fujimori-higuchi",
        rank: 4,
        legal: "denuncia_en_medios",
        severidad: "alta"
      },
      {
        id: "mamanivideos-indulto",
        titulo: "Mamanivideos e indulto a Alberto Fujimori",
        descripcion: "Videos de negociación de votos y polémica por el indulto a Alberto Fujimori.",
        fuente: "https://es.wikipedia.org/wiki/Mamanivideos",
        rank: 5,
        legal: "denuncia_en_medios",
        severidad: "media"
      },
      {
        id: "susana-higuchi",
        titulo: "Caso Susana Higuchi: Negó denuncias de tortura",
        descripcion: "Negó las torturas denunciadas por su madre; polémica familiar y política.",
        fuente: "https://ojo-publico.com/221/hermanos-keiko-culparon-su-madre-para-salvar-fujimori-la-extradicion",
        rank: 6,
        legal: "denuncia_en_medios",
        severidad: "alta"
      }
    ],
    headshot: "https://pbs.twimg.com/profile_images/1876955744525856768/1H9ukeEv_400x400.jpg",
    fullBody: "/fotos_candidatos/keiko/full_body_keiko.gif",
    education: "pro",
    security: "pro",
    health: "anti",
    econ: 7,
    social: 6,
    territorial: 3,
    power: 8,
  },
  {
    id: "rafael",
    nombre: "Rafael L. Aliaga",
    ideologia: "Derecha Conservadora",
    proyectoPolitico: {
      titulo: "Mano dura gerencial",
      resumen: "Liberalismo económico, conservadurismo social y gestión privada aplicada al Estado.",
      detalles: [
        {
          subtitulo: "'Lima Potencia Mundial': Infraestructura y Seguridad",
          texto: "Prometió la adquisición de 10,000 motocicletas para seguridad y la construcción de grandes obras de infraestructura como nuevas vías expresas y túneles, financiadas con bonos municipales.",
          fuente: "https://www.actualidadambiental.pe/wp-content/uploads/2022/09/Plan-de-Gobierno-Renovacion-Popular-Elecciones-2022.pdf"
        },
        {
          subtitulo: "'Hambre Cero': Apoyo a ollas comunes",
          texto: "Programa insignia de su campaña municipal diseñado para combatir la inseguridad alimentaria, aunque su implementación ha sido criticada por la mala calidad y cantidad de los alimentos entregados.",
          fuente: "https://www.youtube.com/watch?v=q5ih6R1xnSE"
        },
        {
          subtitulo: "Reducción radical del aparato estatal",
          texto: "Durante su campaña presidencial de 2021, propuso una drástica reducción del Estado mediante la fusión de ministerios para proyectar una imagen de austeridad y eficiencia.",
          fuente: "https://declara.jne.gob.pe/ASSETS/PLANGOBIERNO/FILEPLANGOBIERNO/16482.pdf"
        }
      ]
    },
    creenciasClave: [
      {
        id: "ultraconservadurismo-religioso",
        nombre: "Valores tradicionales",
        resumen: "Miembro numerario del Opus Dei, practica el celibato y basa su plataforma en un discurso explícitamente religioso.",
        detalle: "Su fe no es un detalle biográfico, sino un componente central de su marca política, que informa directamente su plataforma social ultraconservadora (anti-liberal) y su discurso de 'restauración patriarcal'.",
        fuente: "https://es.wikipedia.org/wiki/Rafael_L%C3%B3pez_Aliaga"
      },
      {
        id: "gestion-empresarial",
        nombre: "Empresario exitoso en política",
        resumen: "Se presenta como un gestor competente capaz de replicar el éxito del sector privado en la administración pública.",
        detalle: "Utiliza su historial como fundador de un conglomerado en finanzas y turismo (Grupo Acres, PeruRail) para construir una narrativa de eficiencia y prometer transformar Lima en una 'potencia mundial', aunque la solidez de su éxito empresarial ha sido cuestionada.",
        fuente: "https://ojo-publico.com/2520/lopez-aliaga-los-negocios-un-candidato-ultraconservador"
      },
      {
        id: "mano-dura",
        nombre: "Mano dura",
        resumen: "Abrazó el apodo de 'el Bolsonaro peruano', centrando su plataforma en un discurso de mano dura.",
        detalle: "Una de las promesas centrales de su gestión como alcalde y de su campaña presidencial es una política de tolerancia cero contra el crimen, ejemplificada en su propuesta de adquirir 10,000 motocicletas para patrullaje.",
        fuente: "https://www.actualidadambiental.pe/wp-content/uploads/2022/09/Plan-de-Gobierno-Renovacion-Popular-Elecciones-2022.pdf"
      }
    ],
    trayectoria: [
      {
        id: "formacion-empresarial",
        rol: "Empresario y miembro del Opus Dei",
        periodo: "1961 – 2006",
        descripcion: "Ingeniero Industrial con MBA. Desde los 19 años es miembro numerario del Opus Dei. Fundó el Grupo Acres y se convirtió en un actor clave en el sector turismo (PeruRail).",
        fuente: "https://es.wikipedia.org/wiki/Rafael_L%C3%B3pez_Aliaga"
      },
      {
        id: "regidor-lima",
        rol: "Regidor de la Municipalidad de Lima",
        periodo: "2007 – 2010",
        descripcion: "Ingresó a la política de la mano del alcalde Luis Castañeda Lossio. Apoyó la concesión de Línea Amarilla a la empresa brasileña OAS, luego implicada en el caso Lava Jato.",
        fuente: "https://es.wikipedia.org/wiki/Rafael_L%C3%B3pez_Aliaga"
      },
      {
        id: "panama-papers",
        rol: "Implicado en los Panama Papers",
        periodo: "Revelado en 2016",
        descripcion: "Una investigación de IDL-Reporteros expuso su uso de estructuras offshore y presuntas maniobras fraudulentas en una guerra corporativa contra su socio, Lorenzo Sousa.",
        fuente: "https://www.idl-reporteros.pe/lopez-aliaga-y-los-panama-papers/"
      },
      {
        id: "deudas-sunat",
        rol: "Controversia por deudas tributarias",
        periodo: "Permanente",
        descripcion: "Empresas vinculadas a él, como Peruval Corp SA, mantienen deudas coactivas con la SUNAT por decenas de millones de soles, usando tácticas como figurar como 'no habidas' para obstaculizar el cobro.",
        fuente: "https://www.youtube.com/watch?v=EO2mr4WDAfY&pp=0gcJCfwAo7VqN5tD"
      },
      {
        id: "refundacion-partido",
        rol: "Fundador de Renovación Popular",
        periodo: "2020",
        descripcion: "Tras el fracaso electoral de Solidaridad Nacional, lo 'refunda' como Renovación Popular, un partido con una ideología explícitamente religiosa y ultraconservadora.",
        fuente: "https://es.wikipedia.org/wiki/Rafael_L%C3%B3pez_Aliaga"
      },
      {
        id: "campana-presidencial-2021",
        rol: "Candidato Presidencial",
        periodo: "2021",
        descripcion: "Se posiciona como 'el Bolsonaro peruano' y obtiene el tercer lugar with 11.75% de los votos, consolidándose como una nueva fuerza hegemónica en la derecha.",
        fuente: "https://en.wikipedia.org/wiki/Rafael_L%C3%B3pez_Aliaga"
      },
      {
        id: "alcalde-lima",
        rol: "Alcalde de Lima Metropolitana",
        periodo: "2023 – Presente",
        descripcion: "Asume el cargo el 1 de enero de 2023. Su gestión ha sido criticada por la baja ejecución presupuestaria y por priorizar una aparente campaña presidencial perpetua sobre la gestión municipal.",
        fuente: "https://www.gob.pe/institucion/munilima/noticias/693302-rafael-lopez-aliaga-juro-como-alcalde-de-lima-en-ceremonia-realizada-en-el-teatro-municipal"
      }
    ],
    presenciaDigital: {
      plataformas: [
        {
          nombre: "twitter",
          handle: "@rlopezaliaga_",
          url: "https://x.com/rlopezaliaga_",
          estrategia: "Estilo confrontacional. Ha usado las cuentas oficiales de la municipalidad para atacar a los medios de comunicación ('pasquines mermeleros') y bloquear a críticos, como la Red de Ollas Comunes."
        },
        {
          nombre: "facebook",
          handle: "RafaelLopezAliaga",
          url: "https://www.facebook.com/RafaelLopezAliaga/",
          estrategia: "Comunica los avances de su gestión y mantiene una línea de mensajes de corte conservador y populista para movilizar a su base electoral."
        }
      ]
    },
    mapaDePoder: {
      alianzas: [
        {
          nombre: "Renovación Popular",
          descripcion: "Su vehículo político personal, refundado para promover una agenda ultraconservadora y servir como plataforma para sus ambiciones."
        },
        {
          nombre: "Conglomerado corporativo",
          descripcion: "Su imperio empresarial (Grupo Acres, PeruRail, etc.) le proporciona los recursos financieros y la imagen de 'gestor exitoso' que son la base de su poder político."
        },
        {
          nombre: "Derecha radical internacional (Vox)",
          descripcion: "Se ha alineado con otras figuras de la derecha radical en Iberoamérica, como José Antonio Kast y Javier Milei, a través de su adhesión a la Carta de Madrid, una iniciativa del partido español Vox."
        }
      ],
      opositores: [
        {
          nombre: "Keiko Fujimori / Fujimorismo",
          descripcion: "Su principal rival en la contienda por la hegemonía de la derecha peruana. Representa un modelo de poder (ultraconservadurismo corporativo) que choca con el del fujimorismo (populismo de legado)."
        },
        {
          nombre: "Prensa de investigación",
          descripcion: "Medios como IDL-Reporteros y OjoPúblico han publicado investigaciones exhaustivas sobre sus estructuras offshore, deudas tributarias y la gestión de sus empresas, a las que él ataca constantemente."
        }
      ]
    },
    controversias: [
      {
        id: "rutas-de-lima-brookfield",
        titulo: "Rutas de Lima: disputa por peajes $2.700 millones",
        descripcion: "Busca anular concesiones de peajes; posibles cobros contra el Estado",
        fuente: "https://www.infobae.com/peru/2025/10/05/rafael-lopez-aliaga-anuncia-que-reclamara-a-brookfield-una-indemnizacion-de-mas-de-s-3-mil-millones",
        rank: 1,
        legal: "en_curso",
        severidad: "muy-alta"
      },
      {
        id: "deuda-bonos-mml",
        titulo: "Deuda de la MML: S/1.300 millones",
        descripcion: "Moody’s bajó la calificación; se proyecta deuda de hasta S/ 1,300 millones.",
        fuente: "https://www.infobae.com/peru/2025/06/14/moodys-degrada-calificacion-de-la-municipalidad-de-lima-se-endeudara-hasta-por-s1300-millones/",
        rank: 2,
        severidad: "alta"
      },
      {
        id: "monopolio-perurail",
        titulo: "PeruRail: dominio de ruta y disputas legales",
        descripcion: "Socio de PerúRail desde 1999; dominio de la ruta a Machu Picchu y disputas con competidores y el Estado.",
        fuente: "https://wayka.pe/rafael-lopez-aliaga-los-artificios-en-defensa-de-su-monopolio-ferroviario/",
        rank: 3,
        legal: "sancion",
        severidad: "media"
      },
      {
        id: "panama-papers-lavado",
        titulo: "Panama Papers: Lavado de activos y deudas tributarias",
        descripcion: "Registros de sociedades offshore y deudas coactivas; pesquisas por presunto lavado.",
        fuente: "https://www.idl-reporteros.pe/lopez-aliaga-y-los-panama-papers/",
        rank: 4,
        legal: "en_curso",
        severidad: "media"
      },
      {
        id: "capacitacion-chibolin",
        titulo: "Caso Chibolín: Capacitaciones de Renovación Popular",
        descripcion: "Fiscalía investiga pagos de más de S/650 mil a una empresa vinculada a TV por charlas/capacitaciones.",
        fuente: "https://www.infobae.com/peru/2024/10/06/fiscalia-investiga-vinculo-entre-renovacion-popular-y-andres-hurtado-partido-pago-mas-de-medio-millon-de-soles-a-productor-de-chibolin/",
        rank: 5,
        legal: "en_curso",
        severidad: "media"
      },
      {
        id: "conflicto-phillip-butters",
        titulo: "Cruce con Phillip Butters por préstamo y campaña",
        descripcion: "Préstamo de US$250 mil y acusaciones cruzadas sobre trolls, favores y 'mermelada'.",
        fuente: "https://willax.pe/politica/butters-sobre-supuesto-prestamo-de-rafael-lopez-aliaga-por-60-mil-dolares-no-le-debo-un-mango",
        rank: 6,
        legal: "denuncia_en_medios",
        severidad: "media"
      },
      {
        id: "caso-jose-miguel-castro",
        titulo: "Muerte de José Miguel Castro: versiones enfrentadas",
        descripcion: "Declaraciones cruzadas sobre la causa del deceso; sin conclusión firme.",
        fuente: "https://www.infobae.com/peru/2025/09/28/crimen-o-suicidio-la-muerte-de-jose-miguel-castro-enfrenta-versiones-entre-el-informe-forense-y-la-pericia-policial/",
        rank: 7,
        legal: "denuncia_en_medios",
        severidad: "media"
      }
    ],
    headshot: "https://pbs.twimg.com/profile_images/1372582295987757058/P2yzmjJP_400x400.jpg",
    fullBody: "/fotos_candidatos/rafael/full_body_rafael.gif",
    econ: 8,
    social: 7,
    territorial: 5,
    power: -4,
  },
  {
    id: "yonhy",
    nombre: "Yonhy Lescano",
    ideologia: "Centro Institucional",
    headshot: "https://pbs.twimg.com/profile_images/991790180129476608/w-QUgKQT_400x400.jpg",
    fullBody: "/fotos_candidatos/lescano/full_body_lescano.gif",
    proyectoPolitico: {
      titulo: "Centro Institucional",
      resumen:
        "Institucionalidad, anticorrupción y defensa del consumidor con enfoque equilibrado.",
      detalles: [
        {
          subtitulo: "Defensa del consumidor y control de abusos",
          texto:
            "Trabajo legislativo sostenido en comisiones vinculadas al consumidor y a organismos reguladores, con iniciativas frente a abusos de grandes empresas de telecomunicaciones y del sistema financiero.",
          fuente: "https://es.wikipedia.org/wiki/Yonhy_Lescano"
        },
        {
          subtitulo: "Reforma institucional y anticorrupción",
          texto:
            "Agenda de fortalecimiento de la transparencia estatal, rendición de cuentas y meritocracia en el sistema de justicia y reguladores.",
          fuente: "https://es.wikipedia.org/wiki/Yonhy_Lescano"
        }
      ]
    },
    creenciasClave: [
      {
        id: "institucionalidad",
        nombre: "Institucionalidad",
        resumen: "Fortalecimiento del Estado de derecho y de organismos autónomos.",
        detalle:
          "Promueve independencia judicial y regulatoria, con mecanismos de control y evaluación permanente.",
        fuente: "https://es.wikipedia.org/wiki/Yonhy_Lescano"
      },
      {
        id: "transparencia",
        nombre: "Transparencia",
        resumen: "Apertura de datos y políticas de gobierno abierto.",
        detalle:
          "Rendición de cuentas activa y trazabilidad del gasto público como ejes para reducir corrupción.",
        fuente: "https://es.wikipedia.org/wiki/Yonhy_Lescano"
      },
      {
        id: "dialogo-nacional",
        nombre: "Diálogo nacional",
        resumen:
          "Concertación entre Estado, empresa y sociedad civil para reformas graduales.",
        detalle:
          "Mesas de trabajo para construir consensos y resolver conflictos sectoriales.",
        fuente: "https://es.wikipedia.org/wiki/Yonhy_Lescano"
      },
      {
        id: "defensa-consumidor",
        nombre: "Defensa del consumidor",
        resumen:
          "Prioriza al usuario frente a posiciones dominantes y prácticas abusivas.",
        detalle:
          "Impulso a marcos regulatorios y sancionadores efectivos para telecomunicaciones, servicios financieros y utilities.",
        fuente: "https://es.wikipedia.org/wiki/Yonhy_Lescano"
      }
    ],
    trayectoria: [
      {
        id: "abogado-1985",
        rol: "Abogado",
        periodo: "1985 – 2000",
        descripcion: "Ejercicio profesional y docencia antes de su ingreso al Congreso.",
        fuente: "https://es.wikipedia.org/wiki/Yonhy_Lescano"
      },
      {
        id: "congresista-2001-2019",
        rol: "Congresista de la República (Acción Popular)",
        periodo: "2001 – 2019",
        descripcion:
          "Legislador por varios periodos hasta la disolución del Congreso en 2019; labor destacada en defensa del consumidor.",
        fuente: "https://es.wikipedia.org/wiki/Yonhy_Lescano"
      },
      {
        id: "candidato-2021",
        rol: "Candidato presidencial por Acción Popular",
        periodo: "2021",
        descripcion:
          "Postuló a la presidencia en 2021; no accedió a la segunda vuelta.",
        fuente: "https://es.wikipedia.org/wiki/Elecciones_generales_de_Per%C3%BA_de_2021"
      }
    ],
    presenciaDigital: {
      plataformas: [
        {
          nombre: "twitter",
          handle: "@yonhy_lescano",
          url: "https://x.com/yonhy_lescano",
          estrategia:
            "Canal principal para posicionamiento político y comentarios de coyuntura."
        },
        {
          nombre: "facebook",
          handle: "YonhyLescanoOficial",
          url: "https://www.facebook.com/YonhyLescanoOficial",
          estrategia:
            "Publicación de actividades, posiciones y transmisiones en vivo para base regional."
        }
      ]
    },
    mapaDePoder: {
      alianzas: [
        {
          nombre: "Bases de Acción Popular",
          descripcion:
            "Estructura partidaria y capital político construido en Puno y el sur andino."
        },
        {
          nombre: "Asociaciones de consumidores",
          descripcion:
            "Redes vinculadas a agendas de regulación y protección al usuario."
        }
      ],
      opositores: [
        {
          nombre: "Bancadas y liderazgos de derecha",
          descripcion:
            "Choques discursivos por regulación económica y control a posiciones dominantes."
        },
        {
          nombre: "Grupos empresariales regulados (telcos, finanzas)",
          descripcion:
            "Resistencia a medidas pro‑consumidor y mayor fiscalización."
        }
      ]
    },
controversias: [
      {
        id: "acoso-2019",
        titulo: "Denuncia de acoso sexual (2019) y suspensión",
        descripcion: "Denunciado por periodista; el congreso lo suspendió 120 días sin goce de haber.",
        fuente: "https://es.wikipedia.org/wiki/Yonhy_Lescano",
        rank: 1,
        legal: "sancion",
        severidad: "alta"
      },
      {
        id: "canazo-con-sal",
        titulo: "'Cañazo con sal' en pandemia",
        descripcion: "Recomendación sin sustento durante la pandemia.",
        fuente: "https://www.swissinfo.ch/spa/candidato-a-presidente-de-per%C3%BA-insiste-en-tratar-la-covid-19-con-aguardiente/46489840",
        rank: 2,
        legal: "denuncia_en_medios",
        severidad: "alta"
      },
      {
        id: "agradecimiento-guzman",
        titulo: "Polémica por mención de Abimael Guzmán",
        descripcion: "Mención en publicación del cabecilla terrorista generó polémica.",
        fuente: "https://es.wikipedia.org/wiki/Yonhy_Lescano",
        rank: 3,
        legal: "denuncia_en_medios",
        severidad: "media"
      },
      {
        id: "lopez-meneses",
        titulo: "Señalamientos de vínculo con López Meneses",
        descripcion: "Hubo señalamientos y diligencias preliminares; negó vínculos.",
        fuente: "https://www.americatv.com.pe/noticias/actualidad/yonhy-lescano-niega-vinculos-caso-lopez-meneses-n162084",
        rank: 4,
        legal: "cerrado_sin_sancion",
        severidad: "media"
      }
    ],
    econ: 2,
    social: 1,
    territorial: -5,
    power: -7,
  },
  {
    id: "antauro",
    nombre: "Antauro Humala",
    ideologia: "Izquierda Autoritaria",
    headshot: "https://pbs.twimg.com/profile_images/1561766942150737923/BJmWxtlq_400x400.jpg",
    fullBody: "/fotos_candidatos/antauro/full_body_antauro.gif",
    proyectoPolitico: {
      titulo: "Nueva Constitución Etnocacerista",
      resumen: "Estatismo, identidad andina y disciplina militar con nacionalismo radical.",
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
        nombre: "Etnocacerismo",
        resumen: "Identidad andina (‘raza cobriza’) como base de la nación.",
        detalle: "Nacionalismo étnico‑militar inspirado en Andrés Avelino Cáceres.",
        fuente: "https://antaurohumala.pe/libros/"
      },
      {
        id: "democracia-directa",
        nombre: "Falsa Democracia",
        resumen: "Sistema capturado por élites criollas y extranjeras.",
        detalle: "Aboga por control popular permanente y revocatoria de autoridades.",
        fuente: "https://antaurohumala.pe/libros/"
      },
      {
        id: "orden-militarista",
        nombre: "Disciplina Militar",
        resumen: "Autoridad firme como remedio a la corrupción.",
        detalle: "Valores castrenses para imponer disciplina social y administrativa.",
        fuente: "https://antaurohumala.pe/libros/"
      },
      {
        id: "antiimperialismo",
        nombre: "Anti Imperialista",
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
          nombre: "Ina Andrade de Humala, Máximo Grillo",
          descripcion: "Columna vertebral del movimiento; redes de excombatientes."
        },
        {
          nombre: "Veteranos FFAA",
          descripcion: "Columna vertebral del movimiento; redes de excombatientes."
        },
        {
          nombre: "Juntos por el Perú",
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
    controversias: [
      {
      id: "expropiacion-medios-empresas",
      titulo: "Expropiación de medios y grandes empresas",
      descripcion: "Propone expropiar medios de comunicación y grandes empresas como parte de su plataforma.",
      fuente: "https://convoca.pe/agenda-propia/el-mensaje-extremista-que-antauro-humala-esta-llevando-las-regiones-del-peru",
      rank: 1,
      severidad: "muy-alta"
    },
    {
      id: "andahuaylazo-condena",
      titulo: "Condena por el 'Andahuaylazo' (2005)",
      descripcion: "Asonada con saldo de 4 policías fallecidos; cumplió alrededor de 17 años de condena.",
      fuente: "https://es.wikipedia.org/wiki/Andahuaylazo",
      rank: 2,
      legal: "condena",
      severidad: "alta"
    },
    {
      id: "xenofobia-campamento-venezolanos",
      titulo: "Xenofobia: Campamento para venezolanos",
      descripcion: "Propone instalar campamentos para migrantes venezolanos; críticas por discriminación.",
      fuente: "https://panampost.com/oriana-rivas/2023/10/06/antauro-humala-el-criminal-peruano-que-pide-campos-de-refugiados-para-migrantes/#google_vignette",
      rank: 3,
      severidad: "alta"
    },
    {
      id: "fusilamiento-corruptos",
      titulo: "Propuesta de fusilamiento de corruptos",
      descripcion: "Defiende pena de muerte por fusilamiento para casos de corrupción.",
      fuente: "https://edition.cnn.com/videos/spanish/2022/09/03/ideas-extremistas-antauro-humala-etnocacerista-pena-muerte-corruptos-peru-fernando-del-rincon-conclusiones-cnne.cnn",
      rank: 4,
      severidad: "media"
    },
    {
      id: "reparacion-civil-incumplida",
      titulo: "No paga reparación civil por el Andahuaylazo",
      descripcion: "No habría pagado más de S/1 millón correspondiente a la reparación civil.",
      fuente: "https://www.infobae.com/peru/2024/01/02/antauro-humala-no-ha-pagado-la-reparacion-civil-de-mas-de-un-millon-de-soles-a-los-deudos-del-andahuaylazo/",
      rank: 5,
      legal: "condena",
      severidad: "alta"
    },
    {
      id: "privilegios-en-prision",
      titulo: "Privilegios y presunto cohecho en prisión",
      descripcion: "Investigado por presunto cohecho y privilegios carcelarios mientras cumplía condena.",
      fuente: "https://www.infobae.com/peru/2024/12/08/archivan-investigacion-contra-antauro-humala-por-cohecho-pese-a-que-admitio-y-motivo-sobornos-en-el-inpe/",
      rank: 6,
      legal: "cerrado_sin_sancion",
      severidad: "media"
    },
    {
      id: "homofobia-lgbt",
      titulo: "Declaraciónes sobre población LGBT",
      descripcion: "Declaraciones homofóbicas reiteradas que generaron críticas y rechazo público.",
      fuente: "https://elcomercio.pe/opinion/columnistas/antauro-humala-anibal-torres-y-todos-los-demas-por-hector-villalobos-noticia/",
      rank: 7,
      legal: "denuncia_en_medios",
      severidad: "media"
    },
    {
      id: "apologia-sl",
      titulo: "Polémica por comentarios sobre Sendero Luminoso",
      descripcion: "Afirmó que SL fue lo mejor de la izquierda; generó polémica y condena pública.",
      fuente: "https://www.youtube.com/watch?v=She-lmSObpk",
      rank: 8,
      severidad: "media"
    },
    {
      id: "conflicto-ollanta",
      titulo: "Ruptura con Ollanta Humala",
      descripcion: "Ruptura política con acusaciones cruzadas y confrontación pública.",
      fuente: "https://es.wikipedia.org/wiki/Antauro_Humala",
      rank: 9,
      legal: "denuncia_en_medios",
      severidad: "media"
    }
    ],
    education: "pro",
    security: "pro",
    health: "anti",
    econ: -8,
    social: 9,
    territorial: -9,
    power: 10,
  },
  {
    id: "martin-vizcarra",
    nombre: "Martín Vizcarra",
    ideologia: "Centro Regionalista",
    headshot: "https://commons.wikimedia.org/wiki/Special:FilePath/Mart%C3%ADn%20Vizcarra%20Cornejo%20(square%20portrait).png?width=150&height=150",
    fullBody: "/fotos_candidatos/vizcarra/full_body_vizcarra.gif",

    proyectoPolitico: {
      titulo: "Reforma y descentralización",
      resumen:
        "Reformas anticorrupción y apuesta sostenida por la descentralización del Estado.",
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
          subtitulo: "Seguridad ciudadana: Expulsión de delincuentes extranjeros e intervención de FFAA",
          texto: "Propone no permitir que delincuentes venezolanos se queden en el país y expulsarlos en aviones, como afirma que se hacía durante su gobierno.En caso de asumir la presidencia, declararía el 'estado de sitio' para una intervención inmediata de las Fuerzas Armadas en problemas internos.",
          fuente: "https://www.youtube.com/watch?v=qBnBVfMoPbs"
        }
      ]
    },

    creenciasClave: [
      {
        id: "anticorrupcion-institucional",
        nombre: "Reformas Anticorrupción",
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
        nombre: "Crecimiento social",
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
          nombre: "Gestores Moqueguanos",
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
    controversias: [
  {
    id: "corrupcion-moquegua-lomas-ilo-hospital",
    titulo: "Moquegua: presuntos sobornos (Lomas de Ilo / Hospital de Moquegua)",
    descripcion: "Acusado por presuntos sobornos y direccionamiento de obras en Moquegua.",
    fuente: "https://www.pj.gob.pe/wps/wcm/connect/3b7c3280450a72f6a6a9eee5406a4592/TEMP_202000033500223704620250725165505%2B%281%29.pdf?CACHEID=3b7c3280450a72f6a6a9eee5406a4592&MOD=AJPERES",
    rank: 1,
    legal: "en_curso",
    severidad: "muy-alta"
  },
  {
    id: "intocables-provias",
    titulo: "Caso 'Intocables de la Corrupción' (Provías)",
    descripcion: "Se le imputa red para coimas en obras públicas vinculadas a Provías.",
    fuente: "https://www.gob.pe/institucion/mpfn/noticias/899517-eficcop-logra-detencion-de-exfuncionarios-de-provias-descentralizado-investigados-en-presunta-red-criminal-los-intocables-de-la-corrupcion",
    rank: 2,
    legal: "en_curso",
    severidad: "muy-alta"
  },
  {
    id: "disolucion-congreso-inhabilitaciones",
    titulo: "Cierre del Congreso(2019)",
    descripcion: "Disolvió el Congreso (aval del TC); registró inhabilitaciones posteriores por juicio político.",
    fuente: "https://es.wikipedia.org/wiki/Disoluci%C3%B3n_del_Congreso_de_la_Rep%C3%BAblica_del_Per%C3%BA_en_2019",
    rank: 3,
    legal: "sancion",
    severidad: "muy-alta"
  },
  {
    id: "vacunagate-inhabilitacion",
    titulo: "Vacunagate e inhabilitación por 10 años",
    descripcion: "Vacunación irregular con Sinopharm; inhabilitado 10 años para ejercer función pública.",
    fuente: "https://rpp.pe/politica/congreso/martin-vizcarra-congreso-oficializo-inhabilitacion-politica-por-10-anos-por-el-caso-vacunagate-noticia-1332053",
    rank: 4,
    legal: "sancion",
    severidad: "muy-alta"
  },
  {
    id: "arbitraje-chinchero",
    titulo: "Renuncia como ministro por el caso Chinchero",
    descripcion: "Deuda millonaria tras el arbitraje de Chinchero.",
    fuente: "https://elcomercio.pe/politica/procuraduria-del-mtc-prepara-denuncia-contra-martin-vizcarra-por-deuda-del-caso-kuntur-wasi-ultimas-noticia",
    rank: 5,
    legal: "en_curso",
    severidad: "alta"
  },
  {
    id: "richard-swing",
    titulo: "Caso Richard Swing: Obstrucción a la justicia",
    descripcion: "Contratos irregulares y audios comprometedores; diligencias fiscales y administrativas.",
    fuente: "https://elcomercio.pe/politica/justicia/caso-richard-swing-que-se-sabe-sobre-la-investigacion-que-involucra-a-martin-vizcarra-noticia/",
    rank: 6,
    legal: "en_curso",
    severidad: "alta"
  },
  {
    id: "inhabilitacion-conflicto-intereses",
    titulo: "Inhabilitación por conflicto de intereses empresarial",
    descripcion: "Sanción por no renunciar a su empresa mientras fue ministro.",
    fuente: "https://comunicaciones.congreso.gob.pe/noticias/representacion-nacional-aprueba-inhabilitar-por-cinco-anos-al-expresidente-martin-vizcarra/",
    rank: 7,
    legal: "sancion",
    severidad: "alta"
  },
  {
    id: "designacion-ilegal-daniel-soria",
    titulo: "Acusación por designación ilegal de Daniel Soria",
    descripcion: "Acusación constitucional por presunta designación irregular del procurador general.",
    fuente: "https://comunicaciones.congreso.gob.pe/noticias/comision-permanente-aprobo-informe-final-que-recomienda-acusar-a-martin-vizcarra-por-delitos-contra-la-administracion-publica/",
    rank: 8,
    legal: "en_curso",
    severidad: "alta"
  },
  {
    id: "reuniones-keiko-opacidad",
    titulo: "Reuniones reservadas con Keiko Fujimori",
    descripcion: "Negó reuniones secretas; posterior reconocimiento generó crisis de credibilidad.",
    fuente: "https://rpp.pe/politica/gobierno/vizcarra-reconoce-error-de-haber-mantenido-reuniones-con-keiko-fujimori-en-reserva-noticia-1145883",
    rank: 9,
    legal: "denuncia_en_medios",
    severidad: "media"
  },
  {
    id: "responsabilidad-bancada-somos-peru",
    titulo: "Bancada Somos Perú (2021)",
    descripcion: "Fue el más votado; calificó a su bancada como nefasta.",
    fuente: "https://elcomercio.pe/elecciones-2021/elecciones-2021-martin-vizcarra-y-los-candidatos-que-se-proyectan-como-los-mas-votados-onpe-jne-elecciones-generales-peru-2021-martin-vizcarra-jose-luna-jorge-montoya-peru-libre-noticia/",
    rank: 10,
    legal: "denuncia_en_medios",
    severidad: "media"
  }
],
    econ: 4,
    social: 4,
    territorial: -7, // Su carrera se forjó como Gobernador de Moquegua; su marca es la gestión regional.
    power: 8,
    education: "pro",
    security: "pro",
    health: "anti"
  },

  {
    id: "guillermo-bermejo",
    nombre: "Guillermo Bermejo",
    ideologia: "Izquierda Marxista",
    headshot: "https://pbs.twimg.com/profile_images/1711746019795382272/ROaxERZY_400x400.jpg",
    fullBody: "/fotos_candidatos/bermejo/full_body_bermejo.gif",
    proyectoPolitico: {
      titulo: "Nueva Constitución Socialista",
      resumen: "Nueva Constitución, Estado activo e industrialización; crítica al modelo neoliberal.",
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
        nombre: "Crítica a la Oligarquía",
        resumen: "Rechaza el modelo económico neoliberal y critica a las élites económicas y políticas tradicionales.",
        detalle: "Su postura antisistema lo posiciona como opositor a las estructuras de poder establecidas, buscando un mayor control estatal sobre los recursos y sectores estratégicos.",
        fuente: "https://www.youtube.com/watch?v=PMm960A6ZHA"
      },
      {
        id: "estabilidad-politica",
        nombre: "Rechazo a la Vacancia Presidencial",
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
          nombre: "CCB-CP",
          descripcion: "Organización de la que 'Todas las Voces' fue parte, con la que Bermejo realizó viajes internacionales a Bolivia y Venezuela para eventos con círculos afines. ",
        },
        {
          nombre: "Perú Libre",
          descripcion: "Partido por el que fue elegido congresista en 2021, siendo el más votado en Lima. 'Todas las Voces' se integró a Perú Libre antes de la campaña.",
        },
        {
          nombre: "Perú Democrático",
          descripcion: "Grupo formado por Bermejo junto a Héctor Valer tras su salida de Perú Libre en 2021, con el objetivo de promover una nueva constitución.",
        },
        {
          nombre: "Juntos por el Perú",
          descripcion: "Bancada a la que actualmente pertenece en el Congreso.",
        },
        {
          nombre: "Pedro Castillo",
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
    controversias: [
    {
      id: "arcc-operadores-reconstruccion",
      titulo: "ARCC: presunto tráfico de influencias",
      descripcion: "Investigado por presuntos sobornos para direccionar obras en Piura mediante operadores vinculados a la ARCC.",
      fuente: "https://gestion.pe/peru/politica/los-operadores-de-la-reconstruccion-fiscalia-abre-investigacion-a-guillermo-bermejo-noticia/",
      rank: 1,
      legal: "en_curso",
      severidad: "alta"
    },
    {
      id: "procesos-terrorismo",
      titulo: "Vínculos con Sendero Luminoso y procesos por terrorismo",
      descripcion: "Procesos por presunta afiliación al terrorismo; fue absuelto en un caso, otros antecedentes fueron archivados.",
      fuente: "https://es.wikipedia.org/wiki/Guillermo_Bermejo",
      rank: 2,
      legal: "cerrado_sin_sancion",
      severidad: "media"
    },
    {
      id: "obstruccion-justicia-sacha",
      titulo: "Obstrucción de la justicia (intimidación de testigo 'Sacha')",
      descripcion: "A juicio oral por presunta obstrucción a la justicia en investigación vinculada a terrorismo.",
      fuente: "https://elcomercio.pe/politica/justicia/guillermo-bermejo-y-guido-bellido-iran-a-juicio-por-presuntamente-obstruir-una-investigacion-por-terrorismo-para-cuando-se-espera-una-sentencia-noticia/",
      rank: 3,
      legal: "en_curso",
      severidad: "media"
    },
    {
      id: "uso-indebido-recursos-campana",
      titulo: "Uso indebido de recursos públicos para campaña",
      descripcion: "Colaborador afirma que usó viáticos y viajes del Congreso para actividades proselitistas.",
      fuente: "https://gestion.pe/peru/politica/bermejo-financia-su-campana-presidencial-con-recursos-publicos-afirma-colaborador-noticia/",
      rank: 4,
      legal: "denuncia_en_medios",
      severidad: "media"
    },
    {
      id: "sindicacion-embajada-eeuu-2010",
      titulo: "Embajada de EE. UU. (2010): sindicaciones y detención",
      descripcion: "Detención por sindicaciones; sin condena firme reportada.",
      fuente: "https://peru21.pe/politica/las-pelotudeces-del-che-guillermo-bermejo-noticia/",
      rank: 5,
      legal: "cerrado_sin_sancion",
      severidad: "alta"
    },
    {
      id: "presunto-pacto-ilegal-absolucion",
      titulo: "Señalamientos de pacto para evitar justicia",
      descripcion: "Acusación de reunión con un juez para asegurar absolución; en indagación preliminar.",
      fuente: "https://diariocorreo.pe/politica/guillermo-bermejo-congresista-habria-pactado-con-juez-para-ser-absuelto-en-caso-de-terrorismo-noticia",
      rank: 6,
      legal: "denuncia_en_medios",
      severidad: "media"
    }
  ],
    education: "pro",
    security: "pro",
    health: "anti",
    econ: -8,
    social: -3,
    territorial: 0,
    power: 7,
  }
  ,
  {
    id: "carlos-alvarez",
    nombre: "Carlos Álvarez",
    ideologia: "Derecha Punitiva",
    headshot: "https://portal.andina.pe/EDPfotografia3/Thumbnail/2018/05/03/000501027W.jpg",
    fullBody: "/fotos_candidatos/alvarez/full_body_alvarez.gif",
    proyectoPolitico: {
      titulo: "Mano dura punitiva.",
      resumen:
        "Seguridad prioritaria con pena de muerte, megacárceles y expulsión de extranjeros.",
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
        nombre: "Orden público por encima del garantismo",
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
        nombre: "Antiprivilegios del Estado",
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
          nombre: "País Para Todos",
          descripcion:
            "Vehículo político (agrupación nº34 habilitada para EG-2026)."
        },
        {
          nombre: "Vladimir Meza",
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
    controversias:  [
    {
      id: "mano-dura-pena-muerte",
      titulo: "Propuestas de mano dura (pena de muerte y salida del Pacto)",
      descripcion: "Implica denunciar el Pacto de San José para habilitar la pena de muerte.",
      fuente: "https://www.youtube.com/watch?v=_Qxl-JD_7w8",
      rank: 1,
      severidad: "alta"
    },
    {
      id: "vinculos-fujimorato-montesinos",
      titulo: "Acusaciones históricas de vínculos con el fujimorato/Montesinos",
      descripcion: "Investigado mediáticamente por presuntos pagos del SIN en los 90s.",
      fuente: "https://www.hildebrandtensustrece.com/opinion/articulo/2116",
      rank: 2,
      legal: "denuncia_en_medios",
      severidad: "media"
    },
  ],
    econ: 3,
    social: 1
  },

  {
    id: "cesar-acuna",
    nombre: "César Acuña",
    ideologia: "Populismo Clientelar",
    headshot: "https://upload.wikimedia.org/wikipedia/commons/b/bf/C%C3%A9sar_Acu%C3%B1a_Peralta.jpg",
    fullBody: "/fotos_candidatos/acuña/full_body_acuña_move.gif",
    proyectoPolitico: {
      titulo: "Poder clientelar",
      resumen: "Obras públicas visibles y red territorial norteña.",
      detalles: [
        {
          subtitulo: "Proyectos de infraestructura a gran escala",
          texto: "Su gestión como gobernador se ha centrado en megaproyectos como el destrabe del Proyecto Especial Chavimochic III y la planificación de un nuevo Hospital Regional para Trujillo.",
          fuente: "https://regionlalibertad.gob.pe/noticiaS/regionales/15239-cesar-acuna-gestiones-mas-emblematicas-son-destrabe-de-chavimochic-y-nuevo-hospital-regional"
        },
        {
          subtitulo: "Inversión masiva en educación y salud",
          texto: "Ha anunciado una inversión de más de mil millones de soles para la reconstrucción de colegios y ha priorizado la compra de equipamiento médico, como 38 ambulancias y un resonador magnético.",
          fuente: "https://www.gob.pe/institucion/regionlalibertad/noticias/1140130-mil-millones-invierte-la-gestion-de-cesar-acuna-en-educacion"
        },
        {
          subtitulo: "Modelo de alianzas con gobiernos locales",
          texto: "Implementó un sistema de ejecución de obras en alianza con los municipios, donde el Gobierno Regional financia directamente los proyectos locales, habiendo financiado más de 108 de ellos.",
          fuente: "https://www.gob.pe/institucion/regionlalibertad/noticias/1158501-en-3-anos-de-gestion-108-obras-financiara-el-gore-a-municipios"
        }
      ]
    },
    creenciasClave: [
      {
        id: "plata-como-cancha",
        nombre: "Plata como cancha",
        resumen: "Su poder se sustenta en su vasta fortuna, usada explícitamente para financiar campañas y asegurar apoyo popular.",
        detalle: "La frase, originada en un audio filtrado de 2010, encapsula su visión pragmática del poder, donde los recursos económicos son una herramienta fundamental para ganar elecciones y consolidar su influencia política.",
        fuente: "https://es.wikipedia.org/wiki/Caso_Plata_como_cancha"
      },
      {
        id: "educacion-poder",
        nombre: "Imperio Educativo",
        resumen: "Su imperio educativo es la infraestructura de su poder político.",
        detalle: "Las universidades (UCV, USS, Autónoma) no solo financian su partido, Alianza para el Progreso, sino que también actúan como centros de reclutamiento y bases políticas, utilizando la imagen de 'educador' para capitalizarla en las urnas.",
        fuente: "https://www.infobae.com/peru/2024/02/16/cesar-acuna-a-cuanto-asciende-el-patrimonio-del-gobernador-de-la-libertad/"
      },
      {
        id: "alcalde-constructor",
        nombre: "Obras Visibles",
        resumen: "Cimenta su popularidad en obras públicas de alto impacto visual y popular.",
        detalle: "Durante su gestión como alcalde de Trujillo, invirtió más de 800 millones de soles en proyectos como el bypass de Mansiche y el complejo deportivo Chan Chan, consolidando su imagen de 'alcalde constructor' y gestor eficaz.",
        fuente: "https://trujilloenlinea.pe/noticias/politica/16/02/2018/cesar-acuna-niega-corrupcion-durante-su-gestion-edil-en-trujillo"
      }
    ],
    trayectoria: [
      {
        id: "formacion-empresarial",
        rol: "Fundador del consorcio UCV",
        periodo: "1952 – 1991",
        descripcion: "Nacido en Cajamarca, se gradúa de Ingeniero Químico y en 1991 funda la Universidad César Vallejo (UCV) en Trujillo, pilar de su imperio empresarial.",
        fuente: "https://es.wikipedia.org/wiki/Universidad_C%C3%A9sar_Vallejo"
      },
      {
        id: "congresista",
        rol: "Congresista de la República",
        periodo: "2000 – 2006",
        descripcion: "Elegido por dos periodos. En 2001 funda su partido, Alianza para el Progreso (APP). Se le critica por legislar en materia de educación privada, existiendo un conflicto de interés.",
        fuente: "https://es.wikipedia.org/wiki/C%C3%A9sar_Acu%C3%B1a"
      },
      {
        id: "alcalde-trujillo",
        rol: "Alcalde de Trujillo",
        periodo: "2007 – 2014",
        descripcion: "Pone fin a 44 años de hegemonía aprista en la ciudad. Es reelegido en 2010. Basa su gestión en obras de alto impacto.",
        fuente: "https://en.wikipedia.org/wiki/C%C3%A9sar_Acu%C3%B1a"
      },
      {
        id: "gobernador-libertad-1",
        rol: "Gobernador Regional de La Libertad",
        periodo: "2015",
        descripcion: "Asume el cargo pero renuncia a los diez meses para postular a la presidencia en 2016, generando críticas por su falta de compromiso.",
        fuente: "https://www.regionlalibertad.gob.pe/noticias/regionales/5916-cesar-acuna-renuncia-a-la-gobernacion-regional-de-la-libertad"
      },
      {
        id: "investigacion-plagio",
        rol: "Acusado de plagio académico",
        periodo: "2016 – Presente",
        descripcion: "Surgen graves y fundamentadas acusaciones de plagio en su tesis doctoral de la U. Complutense de Madrid y en su tesis de maestría de la U. de Lima.",
        fuente: "https://www.ulima.edu.pe/la-universidad/noticias/comunicado-1"
      },
      {
        id: "exclusion-presidencial-2016",
        rol: "Excluido de la elección presidencial",
        periodo: "Mar 2016",
        descripcion: "El Jurado Nacional de Elecciones lo excluye por entregar dinero a comerciantes durante una actividad de campaña, en aplicación de la ley que prohíbe dádivas.",
        fuente: "https://en.wikipedia.org/wiki/C%C3%A9sar_Acu%C3%B1a"
      },
      {
        id: "campana-presidencial-2021",
        rol: "Candidato Presidencial",
        periodo: "2021",
        descripcion: "Obtiene el séptimo lugar con el 6.02% de los votos válidos. Su partido consigue 15 congresistas.",
        fuente: "https://es.wikipedia.org/wiki/Elecciones_generales_de_Per%C3%BA_de_2021"
      },
      {
        id: "investigacion-trafico-influencias",
        rol: "Investigado por tráfico de influencias",
        periodo: "2022 – Presente",
        descripcion: "La Fiscalía le abre investigación tras la difusión de audios donde presiona a la presidenta del Congreso, Lady Camones, para aprobar una ley que lo favorecería electoralmente.",
        fuente: "https://diarioelgobierno.pe/politica-peruana-castillo-peru-2022-congreso/fiscalia-de-la-nacion-investiga-a-cesar-acuna-por-trafico-de-influencias/"
      },
      {
        id: "gobernador-libertad-2",
        rol: "Gobernador Regional de La Libertad",
        periodo: "2023 – Presente",
        descripcion: "Gana nuevamente la gobernación. Su mandato es criticado por sus constantes ausencias y licencias, que superan el límite legal.",
        fuente: "https://es.wikipedia.org/wiki/C%C3%A9sar_Acu%C3%B1a"
      }
    ],
    presenciaDigital: {
      plataformas: [
        {
          nombre: "tiktok",
          handle: "@cesaracunap",
          url: "https://www.tiktok.com/@cesaracunap",
          estrategia: "Adopta un tono informal y participa en tendencias virales para conectar con audiencias más jóvenes que no consumen medios tradicionales."
        },
        {
          nombre: "facebook",
          handle: "CesarAcunaP",
          url: "https://www.facebook.com/CesarAcunaP/",
          estrategia: "Es uno de los políticos peruanos con mayor inversión en publicidad pagada en Facebook e Instagram, lo que le permite mantener una presencia constante y dirigir mensajes segmentados."
        }
      ]
    },
    mapaDePoder: {
      alianzas: [
        {
          nombre: "Alianza para el Progreso",
          descripcion: "Partido político que él mismo fundó en 2001, que funciona como el brazo político de su conglomerado empresarial y vehículo para sus ambiciones."
        },
        {
          nombre: "Consorcio educativo",
          descripcion: "El motor económico y la base social de su poder. La red de estudiantes, egresados y personal constituye una base política natural y un canal de difusión de su mensaje."
        }
      ],
      opositores: [
        {
          nombre: "Prensa nacional y limeña",
          descripcion: "El intenso escrutinio de los medios de comunicación nacionales magnifica los escándalos que a nivel regional son minimizados, actuando como una barrera para sus aspiraciones presidenciales."
        },
        {
          nombre: "Opositores políticos regionales (Ej. Partido Aprista)",
          descripcion: "Su irrupción en Trujillo rompió una hegemonía de 44 años del APRA, consolidándolo como un rival directo del aprismo en el norte del país."
        }
      ]
    },
    controversias: [
  {
    id: "dadivas-exclusion-jne-2016",
    titulo: "Exclusión electoral por dádivas (JNE, 2016)",
    descripcion: "El JNE lo excluyó de la elección presidencial por infringir la ley al entregar dinero durante campaña (resolución electoral firme; no es sentencia penal).",
    fuente: "https://rpp.pe/politica/elecciones/elecciones-2016-jee-excluye-candidatura-de-cesar-acuna-de-alianza-para-el-progreso-noticia-943203",
    rank: 1,
    legal: "sancion",
    severidad: "muy-alta"
  },
  {
    id: "contratos-315m-gobernador",
    titulo: "Contraloría pide anular contratos por S/ 315 millones",
    descripcion: "Informe de control recomienda anular dos contratos (vía Trujillo–Huanchaco y hospital de Virú) por presuntas irregularidades. No es acusación fiscal ni sentencia.",
    fuente: "https://caretas.pe/politica/contraloria-pide-anular-contratos-millonarios-de-cesar-acuna-en-la-libertad/",
    rank: 2,
    legal: "en_curso",
    severidad: "alta"
  },
  {
    id: "multas-onpe-financiamiento",
    titulo: "Multa de ONPE por exceso de aportes (APP–UCV)",
    descripcion: "ONPE ratificó multa millonaria a APP por exceder el tope de aportes de la UCV en 2010; el cobro siguió la vía judicial. Sanción administrativa a la organización política.",
    fuente: "https://peru21.pe/politica/onpe-ratifica-multa-s-9-millones-alianza-progreso-122662-noticia/",
    rank: 3,
    legal: "sancion",
    severidad: "alta"
  },
  {
    id: "difamacion-christopher-acosta",
    titulo: "Querella por difamación contra Christopher Acosta (concluida)",
    descripcion: "Hubo condena en 1ª instancia (ene-2022), pero el querellante desistió en jun-2022 antes de la vista de apelación. No quedó condena firme.",
    fuente: "https://www.swissinfo.ch/spa/empresario-y-excandidato-peruano-retir%C3%B3-sonada-demanda-contra-periodista/47680628",
    rank: 4,
    legal: "cerrado_sin_sancion",
    severidad: "media"
  },
  {
    id: "acuniagate-alto-trujillo",
    titulo: "Audios y presión por Alto Trujillo; pesquisa preliminar",
    descripcion: "Se difundieron audios donde pide priorizar un proyecto ligado a Alto Trujillo. El Congreso censuró a Lady Camones y la Fiscalía abrió investigación preliminar por tráfico de influencias.",
    fuente: "https://www.gob.pe/institucion/mpfn/noticias/647443-fiscalia-inicia-diligencias-por-investigacion-contra-cesar-acuna",
    rank: 5,
    legal: "en_curso",
    severidad: "media"
  },
  {
    id: "subvenciones-trujillo",
    titulo: "Denuncia por subvenciones municipales (archivada en 2012)",
    descripcion: "El Ministerio Público archivó la denuncia por presunto desvío de subvenciones en la Municipalidad de Trujillo. No prosperó.",
    fuente: "https://rpp.pe/peru/actualidad/archivan-denuncia-por-desvio-de-subvenciones-en-municipio-de-trujillo-noticia-511859",
    rank: 6,
    legal: "cerrado_sin_sancion",
    severidad: "media"
  },
  {
    id: "lavado-activos",
    titulo: "Investigación preliminar por lavado de activos (2018)",
    descripcion: "Fue citado por la Fiscalía de Lavado de Activos en 2018 por movimientos financieros; no hay acusación ni sentencia públicas. Declaraciones posteriores vincularon el tema con su visa a EE.UU.",
    fuente: "https://rpp.pe/politica/judiciales/cesar-acuna-sera-interrogado-en-la-fiscalia-por-investigacion-por-lavado-de-activos-noticia-1161512",
    rank: 7,
    legal: "en_curso",
    severidad: "media"
  },
  {
    id: "plagio-academico",
    titulo: "Sanción de Indecopi por plagio (tesis y libro)",
    descripcion: "Indecopi sancionó en 2016 por infracción al derecho de autor (tesis doctoral y libro atribuido). Sanción administrativa; no es condena penal.",
    fuente: "https://rpp.pe/economia/economia/indecopi-multo-a-cesar-acuna-por-plagio-de-libro-y-tesis-doctoral-noticia-993039",
    rank: 8,
    legal: "sancion",
    severidad: "media"
  },
  {
    id: "violencia-familiar",
    titulo: "Denuncias de violencia familiar (sin fallo)",
    descripcion: "Exesposa y expareja lo denunciaron por maltrato. No hay sentencia conocida.",
    fuente: "https://www.infobae.com/america/peru/2022/09/03/los-escandalos-politicos-y-legales-que-rodean-a-cesar-acuna-el-millonario-lider-de-app/",
    rank: 9,
    legal: "denuncia_en_medios",
    severidad: "media"
  },
  {
    id: "vinculos-sin",
    titulo: "Señalamientos sobre visitas al SIN en los 90",
    descripcion: "Apariciones en medios y testimonios lo mencionan; no hay decisión judicial. Trátese como señalamiento no corroborado.",
    fuente: "https://www.youtube.com/watch?v=CKiYQbGNMxA",
    rank: 10,
    legal: "denuncia_en_medios",
    severidad: "media"
  }
],
    econ: 3,
    social: 1,
    territorial: -8,
    power: -5,

  },
  {
  id: "phillip",
  nombre: "Phillip Butters",
  ideologia: "Derecha Conservadora",
  headshot: "/fotos_candidatos/phillip/phillip_headshot.png",
  fullBody: "/fotos_candidatos/phillip/phillip_full_body.png",

  proyectoPolitico: {
    titulo: "Orden, mano dura y shock mediático",
    resumen:
      "Conservadurismo social, libre mercado y mano dura.",
    detalles: [
      {
        subtitulo: "Seguridad ciudadana con tecnología",
        texto:
          "Promueve uso de drones y operativos focalizados para combatir delincuencia; narrativa de “mano dura” repetida en lives/entrevistas.",
        fuente: "https://www.youtube.com/watch?v=4xfF9Dymrg0"
      },
      {
        subtitulo: "Educación: ‘4,000 colegios en un año’ (módulos)",
        texto:
          "Promesa reiterada en entrevistas y piezas de campaña∫.",
        fuente: "https://www.facebook.com/jhonomarrr/videos/phillip-butters-4000-colegios-al-año/4182106268776524/"
      },
      {
        subtitulo: "Minería e inversión privada",
        texto:
          "Se presenta favorable a la inversión minera como eje de crecimiento y formalización.",
        fuente: "https://www.youtube.com/watch?v=vAgG9mSdQnA"
      },
      {
        subtitulo: "Sistema de pensiones",
        texto:
          "Ha señalado que derogaría la ‘última ley de AFP’ si Avanza País es gobierno.",
        fuente:
          "https://www.facebook.com/photo.php?fbid=1372115741585853&set=a.510355094428593&type=3"
      },
      {
        subtitulo: "Estilo de gobierno (presencialismo interno)",
        texto:
          "Ha indicado que, de llegar a la presidencia, ‘saldría del país lo menos posible’ para enfocarse en la gestión interna.",
        fuente:
          "https://www.facebook.com/larepublicape/videos/%EF%B8%8F-en-entrevista-con-curwen-phillip-butters-asegur%C3%B3-que-de-llegar-a-la-presidenci/1180307983937972/"
      },
      {
        subtitulo: "Pena de muerte (debate público)",
        texto:
          "Se ha pronunciado sobre la pena de muerte en piezas de campaña; posicionamiento enmarcado en su discurso de orden y castigo.",
        fuente: "https://www.instagram.com/reel/DLDRDM-NcZX/"
      }
    ]
  },

  creenciasClave: [
    {
      id: "conservadurismo-social",
      nombre: "Rechazo al enfoque de género",
      resumen: "Participó y apoyó activamente ‘Con mis hijos no te metas’.",
      detalle:
        "Se posiciona contra la ideología de género y la educación sexual integral del Minedu.",
      fuente:
        "https://diariocorreo.pe/peru/con-mis-hijos-no-te-metas-phillip-butters-y-su-encendido-discurso-contra-la-ministra-martens-735131/"
    },
    {
      id: "mano-dura-seguridad",
      nombre: "Ley y orden",
      resumen:
        "Discurso de mano dura contra la delincuencia, énfasis en operativos y vigilancia.",
      detalle:
        "Insiste en decir la verdad sobre inseguridad y ejecutar planes operativos con apoyo tecnológico (drones, patrullaje intensivo).",
      fuente: "https://www.youtube.com/watch?v=4xfF9Dymrg0"
    },
    {
      id: "outsider-mediatico",
      nombre: "Outsider mediático-empresarial",
      resumen:
        "Fundador de PBO y conductor de Combutters; usa su plataforma como base política.",
      detalle:
        "Construye capital político desde PBO y su audiencia, más que desde estructuras partidarias tradicionales.",
      fuente: "https://es.wikipedia.org/wiki/PBO_Radio"
    }
  ],

  trayectoria: [
    {
      id: "biografia-medios",
      rol: "Presentador/locutor y empresario de medios",
      periodo: "2001 – presente",
      descripcion:
        "Carrera en TV y radio (Canal N, Panamericana, Latina, Exitosa); luego conductor de ‘Combutters’.",
      detalles: [
        {
          subtitulo: "Combutters",
          texto: "Programa nocturno (Willax 2017–2024; luego por PBO).",
          fuente: "https://es.wikipedia.org/wiki/Combutters"
        },
        {
          subtitulo: "Fundación de PBO",
          texto:
            "Crea y dirige PBO como plataforma multiplataforma; episodios regulatorios por el uso de la 91.9 FM.",
          fuente: "https://es.wikipedia.org/wiki/PBO_Radio"
        }
      ],
      fuente: "https://es.wikipedia.org/wiki/Phillip_Butters"
    },
    {
      id: "avanza-pais",
      rol: "Afiliado/precandidato presidencial (Avanza País)",
      periodo: "2024 – presente",
      descripcion:
        "Se incorpora a Avanza País y se posiciona como precandidato para 2026; realiza mitines y giras (Tacna, etc.).",
      detalles: [
        {
          subtitulo: "Mitines y giras",
          texto:
            "Presenta propuestas en eventos partidarios con cobertura orgánica en redes de Avanza País.",
          fuente:
            "https://www.avanzapais.org/blog/articulo/phillip-butters-realiza-mitin-multitudinario-y-presenta-propuestas-para-potenciar-el-desarrollo-regional/"
        }
      ],
      fuente: "https://es.wikipedia.org/wiki/Phillip_Butters"
    }
  ],

  presenciaDigital: {
    plataformas: [
      {
        nombre: "web",
        url: "https://pbo.pe/",
        estrategia: "Centro de operaciones: streaming en vivo, agenda y posicionamiento."
      },
      {
        nombre: "youtube",
        url: "https://www.youtube.com/channel/UCgR0st4ZLABi-LQcWNu3wnQ",
        estrategia:
          "Programas diarios y lives como vehículo de campaña (‘Combutters’/PBO)."
      },
      {
        nombre: "instagram",
        handle: "@phillipbuttersperu",
        url: "https://www.instagram.com/phillipbuttersperu/",
        estrategia: "Narrativa de precandidatura y microclips de propuestas."
      },
      {
        nombre: "facebook",
        url: "https://www.facebook.com/PBOPeru/",
        estrategia:
          "Amplificación de contenidos de PBO y posicionamiento político."
      },
      {
        nombre: "twitter",
        url: "https://x.com/pboperu",
        estrategia: "Mensajería rápida y enlaces a transmisiones."
      }
    ]
  },

  mapaDePoder: {
    alianzas: [
      {
        nombre: "Avanza País",
        descripcion:
          "Partido vehículo de su precandidatura y giras; estructura organizativa y logística."
      },
      {
        nombre: "PBO (propio medio)",
        descripcion:
          "Activos mediáticos propios como fuente central de influencia y movilización."
      },
      {
        nombre: "Ecosistema derecha dura (Willax y afines)",
        descripcion:
          "Historial de colaboración/afinidad con medios y figuras conservadoras."
      }
    ],
    opositores: [
      {
        nombre: "Colectivos pro derechos / Minedu (2017)",
        descripcion:
          "Antagonismo por su postura anti ‘enfoque de género’ y declaraciones de 2017."
      }
    ]
  },

  controversias: [
  {
    id: "incendiaria-declaracion-manifestantes",
    titulo: "Incendiaria declaración contra manifestantes",
    descripcion: "Sugirió el uso de fuerza letal contra manifestantes.",
    fuente: "https://lpderecho.pe/video-por-que-a-estos-senores-no-les-han-metido-un-balazo-defensoria-rechaza-expresiones-de-conductor-phillip-butters/",
    rank: 1,
    legal: "denuncia_en_medios",
    severidad: "alta"
  },
  {
    id: "irregularidades-fondos-avanza-pais",
    titulo: "Irregularidades en gasto de fondos públicos de Avanza País",
    descripcion: "Pagos observados (p. ej., S/465 mil) por 'capacitaciones'.",
    fuente: "https://rpp.pe/peru/actualidad/avanza-pais-pago-por-capacitaciones-s-465-000-con-fondos-publicos-a-empresa-que-funciona-en-un-puesto-de-fotocopias-noticia-1469171",
    rank: 2,
    legal: "denuncia_en_medios",
    severidad: "media"
  },
  {
    id: "riesgo-designar-funcionarios-cuestionados",
    titulo: "Riesgo de designar funcionarios cuestionados",
    descripcion: "Equipo con figuras con cuestionamientos.",
    fuente: "https://limagris.com/phillip-butters-el-terror-de-los-progres/",
    rank: 3,
    legal: "denuncia_en_medios",
    severidad: "media"
  },
  {
    id: "tenencia-armas-sin-licencia",
    titulo: "Tenencia de armas sin licencia",
    descripcion: "Admitió portar armas sin permiso.",
    fuente: "https://lpderecho.pe/phillip-butters-reconoce-porto-armas-sin-licencia-gobierno-castillo/",
    rank: 4,
    legal: "denuncia_en_medios",
    severidad: "media"
  },
  {
    id: "declaraciones-discriminatorias-homofobicas",
    titulo: "Declaraciones discriminatorias y homofóbicas",
    descripcion: "Expresiones contra personas LGBT y un futbolista.",
    fuente: "https://www.concortv.gob.pe/sancionan-a-radio-capital-por-frases-homofobicas-de-phillip-butters/",
    rank: 5,
    legal: "sancion",
    severidad: "media"
  },
  {
    id: "afiliacion-bancada-cuestionada",
    titulo: "Afiliación a bancada cuestionada (Avanza País)",
    descripcion: "Rostro de partido con votaciones controversiales.",
    fuente: "https://elcomercio.pe/politica/congreso/avanza-pais-votara-en-contra-de-reconsideracion-para-adelanto-de-elecciones-al-2023-noticia/",
    rank: 6,
    legal: "denuncia_en_medios",
    severidad: "media"
  },
  {
    id: "relacion-conflictiva-rla",
    titulo: "Relación conflictiva y acusaciones con RLA",
    descripcion: "Préstamo de US$250 mil y acusaciones cruzadas.",
    fuente: "https://www.atv.pe/noticia/desmienten-a-phillip-butters-y-muestran-pruebas-de-prestamo-que-le-hizo-rafael-lopez-aliaga/",
    rank: 7,
    legal: "denuncia_en_medios",
    severidad: "media"
  },
  {
    id: "filtracion-chantaje-silencio-estampa",
    titulo: "Supuesta filtración/chantaje (Silencio Estampa)",
    descripcion: "Afirmó tener información para 'tumbar' la campaña de RLA.",
    fuente: "https://www.infobae.com/peru/2025/09/05/phillip-butters-denuncia-que-rafael-lopez-aliaga-paga-trolls-para-atacar-y-lo-amenaza-si-hablo-se-acaba-su-candidatura/",
    rank: 8,
    legal: "denuncia_en_medios",
    severidad: "media"
  },
  {
    id: "vinculo-cuellos-blancos",
    titulo: "Vínculo en caso 'Cuellos Blancos'",
    descripcion: "Vinculado a empresario clave; presunta documentación falsa.",
    fuente: "https://www.atv.pe/noticia/cual-es-la-historia-del-vinculo-entre-phillip-butters-y-antonio-camayo/",
    rank: 9,
    legal: "denuncia_en_medios",
    severidad: "media"
  },
  {
    id: "falta-experiencia-gestion-publica",
    titulo: "Falta de experiencia en gestión pública",
    descripcion: "Outsider sin historial en cargos públicos.",
    fuente: "https://es.wikipedia.org/wiki/Phillip_Butters",
    rank: 10,
    legal: "denuncia_en_medios",
    severidad: "media"
  }
],

  econ: 8, 
  social: 8,
  territorial: 4,
  power: -2,

}
];