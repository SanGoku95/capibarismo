export interface Educacion {
  formacion: string;
  instituciones: string;
  credencial_hito: string;
  enfoque: string;
}

export interface SectorPrivado {
  actividad: string;
  escala_impacto: string;
  estrategia_ambito: string;
}

export interface SectorPublico {
  cargos_roles: string | null;
  periodo: string | null;
  logros_controversias: string | null;
  territorio_ambito: string | null;
}

export interface Politica {
  rol_accion: string;
  competicion: string;
  resultados_posicionamiento: string;
  linea: string;
}

export interface TrayectoriaEstructurada {
  id: string;
  nombre: string;
  educacion: Educacion;
  sector_privado: SectorPrivado;
  sector_publico: SectorPublico;
  politica: Politica;
  resumen_corto: string;
}

export const trayectorias: Record<string, TrayectoriaEstructurada> = {
  keiko: {
    id: "keiko",
    nombre: "Keiko Sofía Fujimori Higuchi",
    educacion: {
      formacion: "Administración de Empresas y MBA.",
      instituciones: "Stony Brook, Boston University (B.S.), Columbia Business School (MBA).",
      credencial_hito: "MBA en Columbia mientras ejercía como congresista",
      enfoque: "Gestión y liderazgo de organización política (Fuerza Popular)",
    },
    sector_privado: {
      actividad: "Accionista en Summit Products y titular de ONG Oportunidades.",
      escala_impacto: "Trayectoria privada acotada; capital político no proviene del mundo corporativo",
      estrategia_ambito: "Experiencia forjada en rol protocolar, cargos de elección y liderazgo partidario",
    },
    sector_publico: {
      cargos_roles: "Primera Dama.",
      periodo: "1994 – 2000",
      logros_controversias: "Primera Dama más joven; rol ligado a logros y controversias del gobierno de su padre",
      territorio_ambito: "Nacional e internacional",
    },
    politica: {
      rol_accion: "Presidenta de Fuerza Popular; ex congresista.",
      competicion: "Congresista (2006–2011); candidata presidencial 2011, 2016 y 2021",
      resultados_posicionamiento: "Máxima votación congresal 2006; tres segundas vueltas sin victoria",
      linea: "Fujimorismo: economía de mercado y mano dura",
    },
    resumen_corto: "Administradora con MBA; ex Primera Dama y congresista; tres veces candidata presidencial",
  },
  rafael: {
    id: "rafael",
    nombre: "Rafael López Aliaga",
    educacion: {
      formacion: "Ingeniería Industrial y MBA",
      instituciones: "UDEP (Ingeniería Industrial), Universidad del Pacífico (MBA)",
      credencial_hito: "Primero de su promoción en UDEP (1983)",
      enfoque: "Gestión corporativa de alto nivel y reestructuración de activos",
    },
    sector_privado: {
      actividad: "Fundador Grupo Acres; co‑accionista PeruRail, F. Trasandino y hoteles Belmond",
      escala_impacto: "> US$1,000 millones en activos gestionados; miles de empleos",
      estrategia_ambito: "Adquisición/gestión de activos en finanzas, infraestructura y turismo",
    },
    sector_publico: {
      cargos_roles: "Catedrático de finanzas (UNI)",
      periodo: "2017 – 2020",
      logros_controversias: "Mediación puntual en mesa MEF por 15 días",
      territorio_ambito: "Ámbito académico y mediación ministerial puntual",
    },
    politica: {
      rol_accion: "Alcalde de Lima y Líder de Renovación Popular (ex Solidaridad Nacional)",
      competicion: "Regidor Lima (2007–2010); candidato presidencial (2021); Alcalde de Lima (2023– )",
      resultados_posicionamiento: "Consolida fuerza de derecha conservadora con agenda de mano dura",
      linea: "Derecha conservadora, énfasis religioso y orden",
    },
    resumen_corto: "Ingeniero con MBA; empresario en finanzas y turismo; Alcalde de Lima",
  },
  yonhy: {
    id: "yonhy",
    nombre: "Yonhy Lescano Ancieta",
    educacion: {
      formacion: "Derecho (abogado) y posgrado/maestría",
      instituciones: "Universidad San Pablo de Puno; estudios de posgrado",
      credencial_hito: "Docencia universitaria y especialización jurídica",
      enfoque: "Formación jurídica aplicada a defensa del consumidor y labor legislativa",
    },
    sector_privado: {
      actividad: "Docente universitario y abogado",
      escala_impacto: "Influencia en educación superior pública y práctica legal",
      estrategia_ambito: "Docencia y abogacía; imagen de intelectual provinciano",
    },
    sector_publico: {
      cargos_roles: "Asesoría parlamentaria (inicios)",
      periodo: "2001 – 2019 (congresista); etapa previa de asesoría",
      logros_controversias: "Defensa del consumidor; liderazgo en comisiones",
      territorio_ambito: "En despacho parlamentario y representación nacional",
    },
    politica: {
      rol_accion: "Congresista referente de Acción Popular; candidato presidencial 2021",
      competicion: "Congresista por varios periodos; candidatura presidencial 2021",
      resultados_posicionamiento: "Perfil de centro con agenda anticorrupción y consumidor",
      linea: "Centro institucional, regulador y fiscalizador",
    },
    resumen_corto: "Abogado con maestría; 18 años congresista; candidato de centro en 2021",
  },
  antauro: {
    id: "antauro",
    nombre: "Antauro Igor Humala Tasso",
    educacion: {
      formacion: "Escuela Militar de Chorrillos",
      instituciones: "Escuelas del Ejército del Perú",
      credencial_hito: "Carrera castrense con actuación en conflictos internos",
      enfoque: "Ideología y método de acción basados en jerarquía y doctrina castrense",
    },
    sector_privado: {
      actividad: "Autor y difusor de ideología etnocacerista",
      escala_impacto: "Producción editorial e influencia doctrinaria",
      estrategia_ambito: "Publicaciones y organización del movimiento",
    },
    sector_publico: {
      cargos_roles: "Oficial del Ejército (mayor, en retiro)",
      periodo: "1980s – 2000s",
      logros_controversias: "Participación en Andahuaylazo; condena y excarcelación por redención",
      territorio_ambito: "Zonas de conflicto y despliegue operativo",
    },
    politica: {
      rol_accion: "Líder del movimiento etnocacerista; busca inscripción partidaria",
      competicion: "Intentos de articulación política; alianzas tácticas",
      resultados_posicionamiento: "Alta notoriedad por discursos radicales y agenda constituyente",
      linea: "Ultranacionalismo/etnocacerismo fuera del sistema tradicional",
    },
    resumen_corto: "Militar retirado; líder etnocacerista; condenado por Andahuaylazo",
  },
  "martin-vizcarra": {
    id: "martin-vizcarra",
    nombre: "Martín Alberto Vizcarra Cornejo",
    educacion: {
      formacion: "Ingeniería Civil con formación en gestión",
      instituciones: "UNI; cursos/estudios complementarios en gestión",
      credencial_hito: "Aplicación técnica a gestión pública regional y nacional",
      enfoque: "Gestión técnica con énfasis en reforma e infraestructura",
    },
    sector_privado: {
      actividad: "Constructor/consultor de obras públicas y mineras",
      escala_impacto: "Proyectos para sector público y minería",
      estrategia_ambito: "Contratación y supervisión de obras de infraestructura",
    },
    sector_publico: {
      cargos_roles: "Ministro MTC; embajador en Canadá",
      periodo: "2011–2014; 2016–2017; 2018–2020; otros",
      logros_controversias: "Reformas anticorrupción; cierre del Congreso; procesos e inhabilitaciones",
      territorio_ambito: "Nacional y bilateral (embajada)",
    },
    politica: {
      rol_accion: "Presidente; Gobernador de Moquegua; Fundador de Perú Primero; líder político en retorno",
      competicion: "Congreso 2021 (inhabilitado); proyección 2026 condicionada",
      resultados_posicionamiento: "Imagen tecnócrata anticorrupción con controversias posteriores",
      linea: "Centro regionalista y reformista",
    },
    resumen_corto: "Ingeniero civil; ex gobernador y ex presidente; agenda anticorrupción",
  },
  "guillermo-bermejo": {
    id: "guillermo-bermejo",
    nombre: "Guillermo Bermejo Rojas",
    educacion: {
      formacion: "Estudios de Derecho inconclusos",
      instituciones: "Universidad Inca Garcilaso de la Vega",
      credencial_hito: "Formación no concluida; deriva temprana al activismo",
      enfoque: "Militancia política de izquierda desde joven",
    },
    sector_privado: {
      actividad: "Escritor y analista político",
      escala_impacto: "Publicaciones y actividad en medios/redes",
      estrategia_ambito: "Opinión y articulación de bases",
    },
    sector_publico: {
      cargos_roles: "Asistente administrativo (Parlamento Andino); congresista (2021, breve periodo)",
      periodo: "Funciones administrativas y de representación 2010–2021",
      logros_controversias: "Procesos y controversias judiciales en paralelo",
      territorio_ambito: "Ámbito parlamentario y representación",
    },
    politica: {
      rol_accion: "Fundador de Perú Democrático; hoy en Juntos por el Perú",
      competicion: "Congresista 2021; liderazgo en bancadas afines",
      resultados_posicionamiento: "Perfil antisistema; promotor de Asamblea Constituyente",
      linea: "Izquierda radical, marxista‑leninista",
    },
    resumen_corto: "Activista y congresista 2021; investigado; promueve nueva Constitución",
  },
  "carlos-alvarez": {
    id: "carlos-alvarez",
    nombre: "Carlos Gonsalo Álvarez Loayza",
    educacion: {
      formacion: "Estudios iniciales en Derecho; formación artística en medios",
      instituciones: "—",
      credencial_hito: "Construcción de carrera mediática de alcance masivo",
      enfoque: "Sátira política y social con alto reconocimiento público",
    },
    sector_privado: {
      actividad: "Comediante, productor y presentador en TV/radios/redes",
      escala_impacto: "Masivo (medios tradicionales y plataformas digitales)",
      estrategia_ambito: "Imitación y sátira de coyuntura, producción de contenidos",
    },
    sector_publico: {
      cargos_roles: null,
      periodo: null,
      logros_controversias: null,
      territorio_ambito: null,
    },
    politica: {
      rol_accion: "Aspirante presidencial (País Para Todos)",
      competicion: "Afiliado 2024; precandidato 2025– ",
      resultados_posicionamiento: "Capitaliza descontento con clase política",
      linea: "Derecha punitiva/conservadora",
    },
    resumen_corto: "Comediante y productor; aspirante presidencial 2026",
  },
  "cesar-acuna": {
    id: "cesar-acuna",
    nombre: "César Acuña Peralta",
    educacion: {
      formacion: "Ingeniería Química; posgrados; credenciales con controversias de plagio",
      instituciones: "Universidad de Lima; Complutense de Madrid; UCV",
      credencial_hito: "Títulos base de su conglomerado educativo",
      enfoque: "Construcción de imperio educativo privado",
    },
    sector_privado: {
      actividad: "Fundador del consorcio educativo UCV (y otras universidades)",
      escala_impacto: "Educación privada masiva; inversiones en medios/deporte",
      estrategia_ambito: "Expansión universitaria y marketing de alto alcance",
    },
    sector_publico: {
      cargos_roles: null,
      periodo: null,
      logros_controversias: null,
      territorio_ambito: null,
    },
    politica: {
      rol_accion: "Congresista; alcalde de Trujillo; gobernador de La Libertad (dos periodos) Líder de Alianza para el Progreso (APP)",
      competicion: "Candidato presidencial 2016 (excluido) y 2021",
      resultados_posicionamiento: "Estructura territorial fuerte; uso de recursos propios",
      linea: "Centro‑derecha pragmática/clientelar",
    },
    resumen_corto: "Empresario educativo; ex alcalde y gobernador; líder de APP",
  },
  phillip: {
    id: "phillip",
    nombre: "Phillip Butters",
    educacion: {
      formacion: "Formación empírica en medios y periodismo de opinión",
      instituciones: "—",
      credencial_hito: "Fundación y dirección de PBO",
      enfoque: "Estilo confrontacional y conservador",
    },
    sector_privado: {
      actividad: "Periodista/empresario de medios; fundador de PBO",
      escala_impacto: "Alcance nacional por TV, radio y plataformas digitales",
      estrategia_ambito: "Programas diarios, opinión y activismo",
    },
    sector_publico: {
      cargos_roles: null,
      periodo: null,
      logros_controversias: null,
      territorio_ambito: null,
    },
    politica: {
      rol_accion: "Candidato presidencial (Avanza País)",
      competicion: "Giras y mitines desde 2024",
      resultados_posicionamiento: "Rostro mediático de derecha conservadora",
      linea: "Conservadurismo social y libre mercado",
    },
    resumen_corto: "Presentador y empresario de medios; candidato por Avanza País",
  },
};
