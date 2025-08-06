export interface Candidate {
  id: string;
  nombre: string;
  ideologia: string;
  headshot: string;
  fullBody: string;

  // Nuevas secciones
  proyectoPolitico: {
    titulo: string;
    resumen: string;
  };
  creenciasClave: string[];
  trayectoria: {
    id: string;
    rol: string;
    periodo: string;
    descripcion: string;
  }[];
  presenciaDigital: {
    tiktok?: string;
    youtube?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  mapaDePoder: {
    alianzas: string[];
    opositores: string[];
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
      resumen: "Propuesta de gobierno basada en la experiencia y estabilidad económica para recuperar el orden y la seguridad en el país."
    },
    creenciasClave: ["Estabilidad económica", "Seguridad ciudadana", "Mano dura", "Inversión privada"],
    trayectoria: [
      { id: "lider-fuerza-popular", rol: "Líder de Fuerza Popular", periodo: "2011 - Presente", descripcion: "Candidata presidencial en 2011, 2016 y 2021, consolidando un bloque político importante." },
      { id: "congresista-2006", rol: "Congresista", periodo: "2006 - 2011", descripcion: "La congresista más votada en las elecciones de 2006." },
      { id: "primera-dama-1994", rol: "Primera Dama", periodo: "1994 - 2000", descripcion: "Asumió el rol tras la separación de sus padres." }
    ],
    presenciaDigital: {
      tiktok: "Ha lanzado una campaña para mostrar un lado más personal y humano, en respuesta a los juicios en curso.",
      youtube: "Mantiene un canal con entrevistas y resúmenes de sus actividades políticas.",
      twitter: "Activa con comunicados oficiales y respuestas a la coyuntura política."
    },
    mapaDePoder: {
      alianzas: ["Sector empresarial conservador", "Grupos religiosos"],
      opositores: ["Antifujimorismo", "Sectores de izquierda"],
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
    creenciasClave: ["Justicia social", "Medio ambiente", "Derechos humanos", "Nueva Constitución"],
    trayectoria: [
      { id: "candidata-presidencial-2016", rol: "Candidata Presidencial", periodo: "2016 - Presente", descripcion: "Figura principal de la izquierda peruana en las últimas elecciones." },
      { id: "congresista-2011", rol: "Congresista", periodo: "2011 - 2016", descripcion: "Electa por Cusco, con una agenda de fiscalización y derechos sociales." },
      { id: "activista-2008", rol: "Activista", periodo: "2008 - 2011", descripcion: "Defensora de derechos humanos y medio ambiente en la sociedad civil." }
    ],
    presenciaDigital: {
      facebook: "Es su principal canal para comunicar propuestas y organizar a sus bases.",
      instagram: "Recientemente ha comenzado a usar Reels para explicar conceptos económicos complejos de forma sencilla.",
      twitter: "Utiliza la plataforma para debates y fijar su posición sobre temas de actualidad."
    },
    mapaDePoder: {
      alianzas: ["Sindicatos", "Organizaciones ecologistas", "Movimientos feministas"],
      opositores: ["Gremios empresariales", "Sectores conservadores"],
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
    creenciasClave: ["Libre mercado", "Valores familiares", "Crecimiento económico", "Seguridad"],
    trayectoria: [
      { id: "alcalde-lima-2023", rol: "Alcalde de Lima", periodo: "2023 - Presente", descripcion: "Enfocado en la recuperación económica y la seguridad ciudadana." },
      { id: "empresario-1990", rol: "Empresario", periodo: "1990 - 2023", descripcion: "Desarrollo de proyectos empresariales exitosos en diversos sectores." },
      { id: "candidato-2021", rol: "Candidato", periodo: "2021 - 2021", descripcion: "Participación en las elecciones presidenciales de 2021." }
    ],
    presenciaDigital: {
      facebook: "Activo en redes sociales como Facebook y Twitter, donde comparte sus opiniones sobre economía y política.",
      youtube: "También tiene un canal de YouTube donde publica entrevistas y análisis de la actualidad nacional."
    },
    mapaDePoder: {
      alianzas: ["Empresarios", "Iglesia Católica", "Organizaciones de seguridad"],
      opositores: ["Sectores progresistas", "Sindicalistas"],
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
    creenciasClave: ["Institucionalidad", "Transparencia", "Diálogo nacional", "Desarrollo sostenible"],
    trayectoria: [
      { id: "congresista-2020", rol: "Congresista", periodo: "2020 - Presente", descripcion: "Trabajo en comisiones de justicia y defensa del consumidor." },
      { id: "periodista-2000", rol: "Periodista", periodo: "2000 - 2020", descripcion: "Labor en medios de comunicación y análisis político." },
      { id: "abogado-1985", rol: "Abogado", periodo: "1985 - 2000", descripcion: "Ejercicio de la abogacía y defensa de derechos humanos." }
    ],
    presenciaDigital: {
      twitter: "Presente en Twitter y Facebook, donde comparte análisis políticos y propuestas legislativas.",
      facebook: "Presente en Twitter y Facebook, donde comparte análisis políticos y propuestas legislativas.",
      youtube: "En YouTube, publica videos explicando temas legales y políticos de interés público."
    },
    mapaDePoder: {
      alianzas: ["Organizaciones de derechos humanos", "Medios de comunicación"],
      opositores: ["Corrupción", "Abusos de poder"],
      seguidores: "Aprox. 900K en redes"
    },
    headshot: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "antauro",
    nombre: "Antauro Humala",
    ideologia: "Nacionalista",
    proyectoPolitico: {
      titulo: "Patria y Justicia",
      resumen: "Un proyecto nacionalista que busca la soberanía y la justicia social para todos los peruanos."
    },
    creenciasClave: ["Nacionalismo", "Soberanía", "Justicia popular", "Antiimperialismo"],
    trayectoria: [
      { id: "lider-etnocacerista-2005", rol: "Líder Etnocacerista", periodo: "2005 - Presente", descripcion: "Promotor de un nacionalismo radical y de izquierda." },
      { id: "mayor-ep-1982", rol: "Mayor EP", periodo: "1982 - 2000", descripcion: "Carrera militar con énfasis en la defensa y el orden interno." },
      { id: "activista-2000", rol: "Activista", periodo: "2000 - 2005", descripcion: "Participación activa en movimientos sociales y políticos." }
    ],
    presenciaDigital: {
      facebook: "Utiliza Facebook y Twitter para difundir su mensaje nacionalista y movilizar a sus seguidores.",
      twitter: "Utiliza Facebook y Twitter para difundir su mensaje nacionalista y movilizar a sus seguidores.",
      youtube: "En YouTube, tiene un canal donde publica discursos y entrevistas."
    },
    mapaDePoder: {
      alianzas: ["Movimientos nacionalistas", "Sindicatos de trabajadores"],
      opositores: ["Empresarios", "Medios de comunicación"],
      seguidores: "Aprox. 700K en redes"
    },
    headshot: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "patricia",
    nombre: "Patricia Chirinos",
    ideologia: "Liberal",
    proyectoPolitico: {
      titulo: "Libertad y Desarrollo",
      resumen: "Promoción de un liberalismo económico y social que garantice los derechos individuales y el emprendimiento."
    },
    creenciasClave: ["Libertad económica", "Derechos civiles", "Emprendimiento", "Igualdad de oportunidades"],
    trayectoria: [
      { id: "congresista-2021", rol: "Congresista", periodo: "2021 - Presente", descripcion: "Voz activa en temas de derechos humanos y libertades individuales." },
      { id: "empresaria-2010", rol: "Empresaria", periodo: "2010 - 2021", descripcion: "Desarrollo de negocios con enfoque en la innovación y la sostenibilidad." },
      { id: "abogada-1995", rol: "Abogada", periodo: "1995 - 2010", descripcion: "Ejercicio de la abogacía con énfasis en derechos humanos y derecho empresarial." }
    ],
    presenciaDigital: {
      twitter: "Activa en Twitter, Facebook e Instagram, donde comparte contenido sobre derechos humanos, emprendimiento y política.",
      facebook: "Activa en Twitter, Facebook e Instagram, donde comparte contenido sobre derechos humanos, emprendimiento y política.",
      instagram: "Activa en Twitter, Facebook e Instagram, donde comparte contenido sobre derechos humanos, emprendimiento y política.",
      youtube: "En YouTube, tiene un canal donde publica entrevistas y análisis de actualidad."
    },
    mapaDePoder: {
      alianzas: ["Empresarios", "Organizaciones de derechos humanos", "Movimientos estudiantiles"],
      opositores: ["Sectores conservadores", "Gremios sindicales"],
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
    creenciasClave: ["Gestión eficiente", "Modernización", "Deportes", "Transparencia"],
    trayectoria: [
      { id: "alcalde-la-victoria-2019", rol: "Alcalde La Victoria", periodo: "2019 - 2022", descripcion: "Gestión enfocada en la seguridad ciudadana y el desarrollo urbano." },
      { id: "futbolista-profesional-1997", rol: "Futbolista Profesional", periodo: "1997 - 2015", descripcion: "Carrera destacada en el fútbol profesional, con reconocimiento internacional." },
      { id: "politico-2019", rol: "Político", periodo: "2019 - 2026", descripcion: "Participación activa en la política peruana, con énfasis en la gestión pública." }
    ],
    presenciaDigital: {
      instagram: "Activo en redes sociales como Instagram, Twitter y Facebook, donde comparte su visión sobre la gestión pública y el desarrollo del país.",
      twitter: "Activo en redes sociales como Instagram, Twitter y Facebook, donde comparte su visión sobre la gestión pública y el desarrollo del país.",
      facebook: "Activo en redes sociales como Instagram, Twitter y Facebook, donde comparte su visión sobre la gestión pública y el desarrollo del país.",
      youtube: "En YouTube, publica videos sobre su gestión como alcalde y proyectos futuros."
    },
    mapaDePoder: {
      alianzas: ["Empresarios", "Organizaciones deportivas", "Grupos de jóvenes"],
      opositores: ["Sectores de izquierda", "Críticos de su gestión"],
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
    creenciasClave: ["Cultura nacional", "Desarrollo regional", "Tradiciones", "Familia"],
    trayectoria: [
      { id: "escritor-1980", rol: "Escritor", periodo: "1980 - Presente", descripcion: "Obra literaria centrada en la identidad y cultura peruana." },
      { id: "gobernador-regional-2015", rol: "Gobernador Regional", periodo: "2015 - 2018", descripcion: "Gestión regional con énfasis en el desarrollo cultural y turístico." },
      { id: "politico-regional-2010", rol: "Político Regional", periodo: "2010 - 2026", descripcion: "Participación activa en la política regional, promoviendo el desarrollo sostenible." }
    ],
    presenciaDigital: {
      facebook: "Utiliza Facebook y Twitter para compartir sus escritos, opiniones sobre política y cultura, y para promover sus actividades como político y escritor.",
      twitter: "Utiliza Facebook y Twitter para compartir sus escritos, opiniones sobre política y cultura, y para promover sus actividades como político y escritor.",
      youtube: "En YouTube, tiene un canal donde publica conferencias y charlas sobre temas culturales y políticos."
    },
    mapaDePoder: {
      alianzas: ["Organizaciones culturales", "Grupos de escritores", "Movimientos conservadores"],
      opositores: ["Sectores progresistas", "Críticos de su gestión"],
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
    creenciasClave: ["Seguridad ciudadana", "Orden público", "Justicia social", "Desarrollo humano"],
    trayectoria: [
      { id: "congresista-2020", rol: "Congresista", periodo: "2020 - Presente", descripcion: "Trabajo en comisiones de defensa y seguridad ciudadana." },
      { id: "ministro-interior-2014", rol: "Ministro del Interior", periodo: "2014 - 2015", descripcion: "Implementación de políticas de seguridad y lucha contra la corrupción." },
      { id: "general-ep-1978", rol: "General EP", periodo: "1978 - 2014", descripcion: "Carrera militar con énfasis en la seguridad y el orden interno." }
    ],
    presenciaDigital: {
      twitter: "Activo en Twitter y Facebook, donde comparte su visión sobre seguridad y desarrollo.",
      facebook: "Activo en Twitter y Facebook, donde comparte su visión sobre seguridad y desarrollo.",
      youtube: "En YouTube, publica videos sobre su gestión como ministro y congresista."
    },
    mapaDePoder: {
      alianzas: ["Fuerzas Armadas", "Policía Nacional", "Organizaciones de seguridad"],
      opositores: ["Sectores de izquierda", "Críticos de su gestión"],
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
    creenciasClave: ["Innovación tecnológica", "Competitividad", "Educación digital", "Emprendimiento"],
    trayectoria: [
      { id: "candidato-presidencial-2016", rol: "Candidato Presidencial", periodo: "2016 - Presente", descripcion: "Promotor de una agenda de modernización y desarrollo tecnológico." },
      { id: "consultor-internacional-2005", rol: "Consultor Internacional", periodo: "2005 - 2016", descripcion: "Asesoría en proyectos de desarrollo y modernización en diversos países." },
      { id: "economista-1995", rol: "Economista", periodo: "1995 - 2005", descripcion: "Ejercicio de la profesión con énfasis en el desarrollo económico y social." }
    ],
    presenciaDigital: {
      twitter: "Muy activo en LinkedIn, donde comparte artículos y análisis sobre economía, tecnología y política.",
      facebook: "En Twitter y Facebook, publica sobre sus actividades políticas y proyectos.",
      youtube: "También tiene un canal de YouTube donde explica conceptos económicos y tecnológicos."
    },
    mapaDePoder: {
      alianzas: ["Empresas de tecnología", "Organizaciones de desarrollo económico", "Universidades"],
      opositores: ["Sectores conservadores", "Críticos de la modernización"],
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
    creenciasClave: ["Desarrollo sostenible", "Equidad social", "Medio ambiente", "Derechos laborales"],
    trayectoria: [
      { id: "politico-veterano-1985", rol: "Político Veterano", periodo: "1985 - Presente", descripcion: "Amplia trayectoria en la política peruana, promoviendo el desarrollo sostenible." },
      { id: "ingeniero-1970", rol: "Ingeniero", periodo: "1970 - 1985", descripcion: "Ejercicio de la ingeniería con énfasis en proyectos sostenibles y de impacto social." },
      { id: "candidato-2006", rol: "Candidato", periodo: "2006 - 2026", descripcion: "Participación en múltiples elecciones con una agenda socialdemócrata." }
    ],
    presenciaDigital: {
      facebook: "Activo en Facebook y Twitter, donde comparte su visión sobre desarrollo sostenible y equidad social.",
      twitter: "Activo en Facebook y Twitter, donde comparte su visión sobre desarrollo sostenible y equidad social.",
      youtube: "En YouTube, publica videos sobre sus propuestas y análisis de la actualidad política."
    },
    mapaDePoder: {
      alianzas: ["Organizaciones ambientalistas", "Sindicatos", "Movimientos sociales"],
      opositores: ["Sectores empresariales", "Críticos del estado"],
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
    creenciasClave: ["Ecología integral", "Derechos humanos", "Espiritualidad", "Justicia social"],
    trayectoria: [
      { id: "ambientalista-2000", rol: "Ambientalista", periodo: "2000 - Presente", descripcion: "Defensor de la ecología integral y los derechos humanos." },
      { id: "sacerdote-1986", rol: "Sacerdote", periodo: "1986 - 2000", descripcion: "Labor pastoral con énfasis en la justicia social y la defensa de los pobres." },
      { id: "activista-2005", rol: "Activista", periodo: "2005 - 2026", descripcion: "Participación activa en movimientos sociales y políticos por la justicia ambiental y social." }
    ],
    presenciaDigital: {
      facebook: "Utiliza Facebook y Twitter para difundir su mensaje ecologista y movilizar a sus seguidores.",
      twitter: "Utiliza Facebook y Twitter para difundir su mensaje ecologista y movilizar a sus seguidores.",
      youtube: "En YouTube, tiene un canal donde publica documentales y entrevistas sobre temas ambientales y sociales."
    },
    mapaDePoder: {
      alianzas: ["Organizaciones ecologistas", "Movimientos sociales", "Iglesia progresista"],
      opositores: ["Empresarios", "Medios de comunicación"],
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
    creenciasClave: ["Igualdad de género", "Empoderamiento femenino", "Justicia reproductiva", "Derechos laborales"],
    trayectoria: [
      { id: "activista-2010", rol: "Activista", periodo: "2010 - Presente", descripcion: "Defensora de los derechos de las mujeres y la igualdad de género." },
      { id: "sociologa-2005", rol: "Socióloga", periodo: "2005 - 2010", descripcion: "Investigación y análisis sobre la situación de las mujeres en Perú." },
      { id: "candidata-2024", rol: "Candidata", periodo: "2024 - 2026", descripcion: "Participación en las elecciones con una agenda feminista." }
    ],
    presenciaDigital: {
      instagram: "Muy activa en redes sociales como Instagram, Twitter y Facebook, donde comparte contenido sobre derechos de las mujeres, igualdad de género y justicia social.",
      twitter: "Muy activa en redes sociales como Instagram, Twitter y Facebook, donde comparte contenido sobre derechos de las mujeres, igualdad de género y justicia social.",
      facebook: "Muy activa en redes sociales como Instagram, Twitter y Facebook, donde comparte contenido sobre derechos de las mujeres, igualdad de género y justicia social.",
      youtube: "En YouTube, tiene un canal donde publica entrevistas y análisis sobre temas de género."
    },
    mapaDePoder: {
      alianzas: ["Organizaciones feministas", "Sindicatos de mujeres", "Movimientos sociales"],
      opositores: ["Sectores conservadores", "Críticos del feminismo"],
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
    creenciasClave: ["Educación rural", "Derechos campesinos", "Descentralización", "Desarrollo sostenible"],
    trayectoria: [
      { id: "profesor-1995", rol: "Profesor", periodo: "1995 - Presente", descripcion: "Enseñanza y defensa de los derechos educativos en zonas rurales." },
      { id: "sindicalista-2010", rol: "Sindicalista", periodo: "2010 - 2026", descripcion: "Liderazgo en la defensa de los derechos laborales y sociales de los campesinos." },
      { id: "politico-2021", rol: "Político", periodo: "2021 - 2026", descripcion: "Representación política de las comunidades rurales y campesinas." }
    ],
    presenciaDigital: {
      facebook: "Activo en Facebook y Twitter, donde comparte su visión sobre educación rural, derechos campesinos y desarrollo sostenible.",
      twitter: "Activo en Facebook y Twitter, donde comparte su visión sobre educación rural, derechos campesinos y desarrollo sostenible.",
      youtube: "En YouTube, publica videos sobre sus actividades como profesor y sindicalista."
    },
    mapaDePoder: {
      alianzas: ["Sindicatos campesinos", "Organizaciones de derechos humanos", "Movimientos sociales"],
      opositores: ["Empresarios", "Medios de comunicación"],
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
    creenciasClave: ["Políticas basadas en evidencia", "Eficiencia gubernamental", "Meritocracia", "Transparencia"],
    trayectoria: [
      { id: "consultor-2010", rol: "Consultor", periodo: "2010 - Presente", descripcion: "Asesoría en la formulación e implementación de políticas públicas." },
      { id: "economista-2000", rol: "Economista", periodo: "2000 - 2010", descripcion: "Ejercicio de la profesión con énfasis en el análisis y evaluación de políticas públicas." },
      { id: "academico-1995", rol: "Académico", periodo: "1995 - 2000", descripcion: "Docencia e investigación en economía y políticas públicas." }
    ],
    presenciaDigital: {
      twitter: "Activo en LinkedIn, Twitter y Facebook, donde comparte artículos y análisis sobre políticas públicas, economía y gestión gubernamental.",
      facebook: "Activo en LinkedIn, Twitter y Facebook, donde comparte artículos y análisis sobre políticas públicas, economía y gestión gubernamental.",
      youtube: "En YouTube, publica videos explicando conceptos económicos y de políticas públicas."
    },
    mapaDePoder: {
      alianzas: ["Academia", "Organizaciones internacionales", "Grupos de expertos en políticas públicas"],
      opositores: ["Sectores políticos tradicionales", "Críticos de la tecnocracia"],
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
    creenciasClave: ["Participación ciudadana", "Gobierno popular", "Economía familiar", "Solidaridad"],
    trayectoria: [
      { id: "lider-social-2015", rol: "Líder Social", periodo: "2015 - Presente", descripcion: "Trabajo comunitario y liderazgo en la defensa de los derechos sociales." },
      { id: "comerciante-2000", rol: "Comerciante", periodo: "2000 - 2015", descripcion: "Desarrollo de un negocio familiar y participación en la economía local." },
      { id: "activista-2010", rol: "Activista", periodo: "2010 - 2026", descripcion: "Participación activa en movimientos sociales y políticos." }
    ],
    presenciaDigital: {
      instagram: "Activa en Facebook e Instagram, donde comparte contenido sobre participación ciudadana, economía familiar y solidaridad.",
      facebook: "Activa en Facebook e Instagram, donde comparte contenido sobre participación ciudadana, economía familiar y solidaridad.",
      youtube: "En YouTube, tiene un canal donde publica entrevistas y análisis sobre política y sociedad."
    },
    mapaDePoder: {
      alianzas: ["Organizaciones sociales", "Sindicatos", "Movimientos populares"],
      opositores: ["Sectores empresariales", "Críticos del populismo"],
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
    creenciasClave: ["Descentralización", "Desarrollo regional", "Autonomía local", "Identidad regional"],
    trayectoria: [
      { id: "alcalde-provincial-2019", rol: "Alcalde Provincial", periodo: "2019 - 2026", descripcion: "Gestión provincial con énfasis en el desarrollo local y la descentralización." },
      { id: "regidor-2015", rol: "Regidor", periodo: "2015 - 2019", descripcion: "Trabajo en la municipalidad provincial, promoviendo el desarrollo regional." },
      { id: "gestor-publico-2010", rol: "Gestor Público", periodo: "2010 - 2015", descripcion: "Gestión de proyectos públicos en diversas áreas." }
    ],
    presenciaDigital: {
      facebook: "Activo en Facebook y Twitter, donde comparte su visión sobre desarrollo regional, descentralización y autonomía local.",
      twitter: "Activo en Facebook y Twitter, donde comparte su visión sobre desarrollo regional, descentralización y autonomía local.",
      youtube: "En YouTube, publica videos sobre sus actividades como alcalde y proyectos de desarrollo regional."
    },
    mapaDePoder: {
      alianzas: ["Gobiernos regionales", "Organizaciones de desarrollo local", "Movimientos regionalistas"],
      opositores: ["Sectores centralistas", "Críticos de su gestión"],
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
    creenciasClave: ["Tradición aprista", "Justicia social", "Latinoamericanismo", "Solidaridad"],
    trayectoria: [
      { id: "ex-ministra-2014", rol: "Ex-Ministra", periodo: "2014 - 2016", descripcion: "Gestión en el Ministerio de la Mujer y Poblaciones Vulnerables." },
      { id: "abogada-1990", rol: "Abogada", periodo: "1990 - 2014", descripcion: "Ejercicio de la abogacía con énfasis en derechos humanos y derecho de familia." },
      { id: "dirigente-aprista-2000", rol: "Dirigente Aprista", periodo: "2000 - 2026", descripcion: "Participación activa en la política peruana, promoviendo los valores apristas." }
    ],
    presenciaDigital: {
      facebook: "Activa en Facebook y Twitter, donde comparte su visión sobre justicia social, derechos humanos y política.",
      twitter: "Activa en Facebook y Twitter, donde comparte su visión sobre justicia social, derechos humanos y política.",
      youtube: "En YouTube, publica videos sobre sus actividades políticas y análisis de la actualidad."
    },
    mapaDePoder: {
      alianzas: ["Partido Aprista", "Organizaciones de derechos humanos", "Movimientos sociales"],
      opositores: ["Sectores conservadores", "Críticos del aprismo"],
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
    creenciasClave: ["Independencia política", "Comunicación directa", "Gestión moderna", "Transparencia"],
    trayectoria: [
      { id: "comunicador-2000", rol: "Comunicador", periodo: "2000 - Presente", descripcion: "Labor en medios de comunicación, promoviendo la independencia y la transparencia." },
      { id: "empresario-1995", rol: "Empresario", periodo: "1995 - 2000", descripcion: "Desarrollo de proyectos empresariales en el sector privado." },
      { id: "independiente-2020", rol: "Independiente", periodo: "2020 - 2026", descripcion: "Participación en la política como candidato independiente." }
    ],
    presenciaDigital: {
      twitter: "Activo en Twitter y Facebook, donde comparte su visión sobre independencia política, gestión moderna y transparencia.",
      facebook: "Activo en Twitter y Facebook, donde comparte su visión sobre independencia política, gestión moderna y transparencia.",
      youtube: "En YouTube, publica videos sobre sus actividades como comunicador y político."
    },
    mapaDePoder: {
      alianzas: ["Organizaciones de la sociedad civil", "Grupos de independientes"],
      opositores: ["Partidos tradicionales", "Críticos de su gestión"],
      seguidores: "Aprox. 400K en redes"
    },
    headshot: "https://images.unsplash.com/photo-1537511446984-935f663eb1f4?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=400&h=600&fit=crop&auto=format"
  }
];