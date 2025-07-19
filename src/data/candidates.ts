export interface Candidate {
  id: string;
  nombre: string;
  ideologia: string;
  summary: string;
  profession: string;
  keyBeliefs: string[];
  clips: { title: string; url: string; t: number }[];
  powerMap: { role: string; from: string; to: string }[];
  timeline: { week: string; clips: number }[];
  headshot: string;
  fullBody: string;
}

export const candidates: Candidate[] = [
  {
    id: "keiko",
    nombre: "Keiko Fujimori",
    ideologia: "Centro-derecha",
    summary: "Propuesta de gobierno basada en la experiencia y estabilidad económica",
    profession: "Política / Ex-Congresista",
    keyBeliefs: ["Estabilidad económica", "Seguridad ciudadana", "Educación técnica"],
    clips: [
      { title: "Debate Nacional 2026", url: "#", t: 1642089600 },
      { title: "Propuesta Económica", url: "#", t: 1642003200 },
      { title: "Plan de Seguridad", url: "#", t: 1641916800 },
      { title: "Educación y Trabajo", url: "#", t: 1641830400 },
      { title: "Entrevista RPP", url: "#", t: 1641744000 }
    ],
    powerMap: [
      { role: "Líder", from: "2011", to: "2026", },
      { role: "Congresista", from: "2006", to: "2011" },
      { role: "Primera Dama", from: "1994", to: "2000" }
    ],
    timeline: [
      { week: "2024-W01", clips: 12 },
      { week: "2024-W02", clips: 18 },
      { week: "2024-W03", clips: 25 },
      { week: "2024-W04", clips: 22 },
      { week: "2024-W05", clips: 30 },
      { week: "2024-W06", clips: 28 }
    ],
    headshot: "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "veronika",
    nombre: "Verónika Mendoza",
    ideologia: "Izquierda",
    summary: "Transformación social y justicia económica para todos los peruanos",
    profession: "Psicóloga / Política",
    keyBeliefs: ["Justicia social", "Medio ambiente", "Derechos humanos"],
    clips: [
      { title: "Propuesta Ambiental", url: "#", t: 1642089600 },
      { title: "Justicia Social", url: "#", t: 1642003200 },
      { title: "Plan Económico Inclusivo", url: "#", t: 1641916800 },
      { title: "Derechos de la Mujer", url: "#", t: 1641830400 },
      { title: "Debate Presidencial", url: "#", t: 1641744000 }
    ],
    powerMap: [
      { role: "Candidata Presidencial", from: "2021", to: "2026" },
      { role: "Congresista", from: "2011", to: "2016" },
      { role: "Activista", from: "2008", to: "2011" }
    ],
    timeline: [
      { week: "2024-W01", clips: 15 },
      { week: "2024-W02", clips: 20 },
      { week: "2024-W03", clips: 23 },
      { week: "2024-W04", clips: 27 },
      { week: "2024-W05", clips: 32 },
      { week: "2024-W06", clips: 29 }
    ],
    headshot: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "rafael",
    nombre: "Rafael López Aliaga",
    ideologia: "Derecha",
    summary: "Gobierno empresarial con enfoque en desarrollo económico y valores tradicionales",
    profession: "Empresario / Alcalde",
    keyBeliefs: ["Libre mercado", "Valores familiares", "Crecimiento económico"],
    clips: [
      { title: "Plan Empresarial", url: "#", t: 1642089600 },
      { title: "Valores y Familia", url: "#", t: 1642003200 },
      { title: "Inversión Privada", url: "#", t: 1641916800 },
      { title: "Infraestructura", url: "#", t: 1641830400 },
      { title: "Entrevista Canal N", url: "#", t: 1641744000 }
    ],
    powerMap: [
      { role: "Alcalde de Lima", from: "2023", to: "2026" },
      { role: "Empresario", from: "1990", to: "2023" },
      { role: "Candidato", from: "2021", to: "2021" }
    ],
    timeline: [
      { week: "2024-W01", clips: 10 },
      { week: "2024-W02", clips: 14 },
      { week: "2024-W03", clips: 18 },
      { week: "2024-W04", clips: 21 },
      { week: "2024-W05", clips: 25 },
      { week: "2024-W06", clips: 23 }
    ],
    headshot: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "yonhy",
    nombre: "Yonhy Lescano",
    ideologia: "Centro",
    summary: "Propuesta centrista con enfoque en institucionalidad y diálogo nacional",
    profession: "Abogado / Periodista",
    keyBeliefs: ["Institucionalidad", "Transparencia", "Diálogo nacional"],
    clips: [
      { title: "Institucionalidad Democrática", url: "#", t: 1642089600 },
      { title: "Transparencia Gubernamental", url: "#", t: 1642003200 },
      { title: "Reforma Judicial", url: "#", t: 1641916800 },
      { title: "Desarrollo Regional", url: "#", t: 1641830400 },
      { title: "Propuesta Política", url: "#", t: 1641744000 }
    ],
    powerMap: [
      { role: "Congresista", from: "2020", to: "2026" },
      { role: "Periodista", from: "2000", to: "2020" },
      { role: "Abogado", from: "1985", to: "2000" }
    ],
    timeline: [
      { week: "2024-W01", clips: 8 },
      { week: "2024-W02", clips: 12 },
      { week: "2024-W03", clips: 16 },
      { week: "2024-W04", clips: 19 },
      { week: "2024-W05", clips: 22 },
      { week: "2024-W06", clips: 20 }
    ],
    headshot: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "antauro",
    nombre: "Antauro Humala",
    ideologia: "Nacionalista",
    summary: "Nacionalismo peruano y transformación desde las bases populares",
    profession: "Militar retirado / Político",
    keyBeliefs: ["Nacionalismo", "Soberanía", "Justicia popular"],
    clips: [
      { title: "Nacionalismo Peruano", url: "#", t: 1642089600 },
      { title: "Soberanía Nacional", url: "#", t: 1642003200 },
      { title: "Poder Popular", url: "#", t: 1641916800 },
      { title: "Reforma del Estado", url: "#", t: 1641830400 },
      { title: "Entrevista Histórica", url: "#", t: 1641744000 }
    ],
    powerMap: [
      { role: "Líder Etnocacerista", from: "2005", to: "2026" },
      { role: "Mayor EP", from: "1982", to: "2000" },
      { role: "Activista", from: "2000", to: "2005" }
    ],
    timeline: [
      { week: "2024-W01", clips: 5 },
      { week: "2024-W02", clips: 8 },
      { week: "2024-W03", clips: 12 },
      { week: "2024-W04", clips: 15 },
      { week: "2024-W05", clips: 18 },
      { week: "2024-W06", clips: 16 }
    ],
    headshot: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "patricia",
    nombre: "Patricia Chirinos",
    ideologia: "Liberal",
    summary: "Liberalismo económico y social con enfoque en derechos individuales",
    profession: "Abogada / Empresaria",
    keyBeliefs: ["Libertad económica", "Derechos civiles", "Emprendimiento"],
    clips: [
      { title: "Libertades Individuales", url: "#", t: 1642089600 },
      { title: "Emprendimiento Femenino", url: "#", t: 1642003200 },
      { title: "Liberalismo Económico", url: "#", t: 1641916800 },
      { title: "Derechos Civiles", url: "#", t: 1641830400 },
      { title: "Debate Liberal", url: "#", t: 1641744000 }
    ],
    powerMap: [
      { role: "Congresista", from: "2021", to: "2026" },
      { role: "Empresaria", from: "2010", to: "2021" },
      { role: "Abogada", from: "1995", to: "2010" }
    ],
    timeline: [
      { week: "2024-W01", clips: 7 },
      { week: "2024-W02", clips: 11 },
      { week: "2024-W03", clips: 14 },
      { week: "2024-W04", clips: 17 },
      { week: "2024-W05", clips: 20 },
      { week: "2024-W06", clips: 18 }
    ],
    headshot: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1594736797933-d0200d27252c?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "george",
    nombre: "George Forsyth",
    ideologia: "Centro-derecha",
    summary: "Gestión moderna y eficiente con experiencia municipal",
    profession: "Ex-futbolista / Alcalde",
    keyBeliefs: ["Gestión eficiente", "Modernización", "Deportes"],
    clips: [
      { title: "Gestión Municipal", url: "#", t: 1642089600 },
      { title: "Modernización del Estado", url: "#", t: 1642003200 },
      { title: "Juventud y Deportes", url: "#", t: 1641916800 },
      { title: "Eficiencia Pública", url: "#", t: 1641830400 },
      { title: "Propuesta de Gobierno", url: "#", t: 1641744000 }
    ],
    powerMap: [
      { role: "Alcalde La Victoria", from: "2019", to: "2022" },
      { role: "Futbolista Profesional", from: "1997", to: "2015" },
      { role: "Político", from: "2019", to: "2026" }
    ],
    timeline: [
      { week: "2024-W01", clips: 9 },
      { week: "2024-W02", clips: 13 },
      { week: "2024-W03", clips: 17 },
      { week: "2024-W04", clips: 20 },
      { week: "2024-W05", clips: 24 },
      { week: "2024-W06", clips: 22 }
    ],
    headshot: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "ciro",
    nombre: "Ciro Gálvez",
    ideologia: "Conservador",
    summary: "Valores tradicionales y desarrollo regional con enfoque cultural",
    profession: "Escritor / Político",
    keyBeliefs: ["Cultura nacional", "Desarrollo regional", "Tradiciones"],
    clips: [
      { title: "Identidad Cultural", url: "#", t: 1642089600 },
      { title: "Desarrollo del Norte", url: "#", t: 1642003200 },
      { title: "Tradiciones Peruanas", url: "#", t: 1641916800 },
      { title: "Literatura y Política", url: "#", t: 1641830400 },
      { title: "Regionalismo", url: "#", t: 1641744000 }
    ],
    powerMap: [
      { role: "Escritor", from: "1980", to: "2026" },
      { role: "Gobernador Regional", from: "2015", to: "2018" },
      { role: "Político Regional", from: "2010", to: "2026" }
    ],
    timeline: [
      { week: "2024-W01", clips: 4 },
      { week: "2024-W02", clips: 7 },
      { week: "2024-W03", clips: 10 },
      { week: "2024-W04", clips: 13 },
      { week: "2024-W05", clips: 16 },
      { week: "2024-W06", clips: 14 }
    ],
    headshot: "https://images.unsplash.com/photo-1558492426-ad8470a9e54c?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "daniel",
    nombre: "Daniel Urresti",
    ideologia: "Centro-izquierda",
    summary: "Seguridad y orden con enfoque en justicia social",
    profession: "General EP (r) / Político",
    keyBeliefs: ["Seguridad ciudadana", "Orden público", "Justicia social"],
    clips: [
      { title: "Plan de Seguridad", url: "#", t: 1642089600 },
      { title: "Orden y Justicia", url: "#", t: 1642003200 },
      { title: "Experiencia Militar", url: "#", t: 1641916800 },
      { title: "Política de Estado", url: "#", t: 1641830400 },
      { title: "Lucha Antidrogas", url: "#", t: 1641744000 }
    ],
    powerMap: [
      { role: "Congresista", from: "2020", to: "2026" },
      { role: "Ministro del Interior", from: "2014", to: "2015" },
      { role: "General EP", from: "1978", to: "2014" }
    ],
    timeline: [
      { week: "2024-W01", clips: 6 },
      { week: "2024-W02", clips: 10 },
      { week: "2024-W03", clips: 13 },
      { week: "2024-W04", clips: 16 },
      { week: "2024-W05", clips: 19 },
      { week: "2024-W06", clips: 17 }
    ],
    headshot: "https://images.unsplash.com/photo-1556474835-a7ed57b0b9c7?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "julio",
    nombre: "Julio Guzmán",
    ideologia: "Centro",
    summary: "Tecnología y modernización para un Perú digital y competitivo",
    profession: "Economista / Consultor",
    keyBeliefs: ["Innovación tecnológica", "Competitividad", "Educación digital"],
    clips: [
      { title: "Perú Digital 2030", url: "#", t: 1642089600 },
      { title: "Innovación y Tecnología", url: "#", t: 1642003200 },
      { title: "Competitividad Global", url: "#", t: 1641916800 },
      { title: "Educación 4.0", url: "#", t: 1641830400 },
      { title: "Economía Digital", url: "#", t: 1641744000 }
    ],
    powerMap: [
      { role: "Candidato Presidencial", from: "2016", to: "2026" },
      { role: "Consultor Internacional", from: "2005", to: "2016" },
      { role: "Economista", from: "1995", to: "2005" }
    ],
    timeline: [
      { week: "2024-W01", clips: 11 },
      { week: "2024-W02", clips: 15 },
      { week: "2024-W03", clips: 19 },
      { week: "2024-W04", clips: 22 },
      { week: "2024-W05", clips: 26 },
      { week: "2024-W06", clips: 24 }
    ],
    headshot: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "alberto",
    nombre: "Alberto Beingolea",
    ideologia: "Socialdemócrata",
    summary: "Desarrollo sostenible y equidad social para el progreso nacional",
    profession: "Ingeniero / Político",
    keyBeliefs: ["Desarrollo sostenible", "Equidad social", "Medio ambiente"],
    clips: [
      { title: "Desarrollo Sostenible", url: "#", t: 1642089600 },
      { title: "Equidad y Progreso", url: "#", t: 1642003200 },
      { title: "Política Ambiental", url: "#", t: 1641916800 },
      { title: "Ingeniería Social", url: "#", t: 1641830400 },
      { title: "Futuro Verde", url: "#", t: 1641744000 }
    ],
    powerMap: [
      { role: "Político Veterano", from: "1985", to: "2026" },
      { role: "Ingeniero", from: "1970", to: "1985" },
      { role: "Candidato", from: "2006", to: "2026" }
    ],
    timeline: [
      { week: "2024-W01", clips: 3 },
      { week: "2024-W02", clips: 6 },
      { week: "2024-W03", clips: 9 },
      { week: "2024-W04", clips: 12 },
      { week: "2024-W05", clips: 15 },
      { week: "2024-W06", clips: 13 }
    ],
    headshot: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "marco",
    nombre: "Marco Arana",
    ideologia: "Ecologista",
    summary: "Protección ambiental y desarrollo humano sostenible",
    profession: "Sacerdote / Ambientalista",
    keyBeliefs: ["Ecología integral", "Derechos humanos", "Espiritualidad"],
    clips: [
      { title: "Ecología Integral", url: "#", t: 1642089600 },
      { title: "Derechos Ambientales", url: "#", t: 1642003200 },
      { title: "Espiritualidad y Política", url: "#", t: 1641916800 },
      { title: "Desarrollo Humano", url: "#", t: 1641830400 },
      { title: "Protección de la Vida", url: "#", t: 1641744000 }
    ],
    powerMap: [
      { role: "Ambientalista", from: "2000", to: "2026" },
      { role: "Sacerdote", from: "1986", to: "2000" },
      { role: "Activista", from: "2005", to: "2026" }
    ],
    timeline: [
      { week: "2024-W01", clips: 2 },
      { week: "2024-W02", clips: 5 },
      { week: "2024-W03", clips: 8 },
      { week: "2024-W04", clips: 11 },
      { week: "2024-W05", clips: 14 },
      { week: "2024-W06", clips: 12 }
    ],
    headshot: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "maria",
    nombre: "María Rivera",
    ideologia: "Feminista",
    summary: "Igualdad de género y empoderamiento de la mujer peruana",
    profession: "Socióloga / Activista",
    keyBeliefs: ["Igualdad de género", "Empoderamiento femenino", "Justicia reproductiva"],
    clips: [
      { title: "Igualdad de Género", url: "#", t: 1642089600 },
      { title: "Empoderamiento Femenino", url: "#", t: 1642003200 },
      { title: "Justicia Reproductiva", url: "#", t: 1641916800 },
      { title: "Violencia de Género", url: "#", t: 1641830400 },
      { title: "Participación Política", url: "#", t: 1641744000 }
    ],
    powerMap: [
      { role: "Activista", from: "2010", to: "2026" },
      { role: "Socióloga", from: "2005", to: "2010" },
      { role: "Candidata", from: "2024", to: "2026" }
    ],
    timeline: [
      { week: "2024-W01", clips: 8 },
      { week: "2024-W02", clips: 12 },
      { week: "2024-W03", clips: 15 },
      { week: "2024-W04", clips: 18 },
      { week: "2024-W05", clips: 21 },
      { week: "2024-W06", clips: 19 }
    ],
    headshot: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "pedro",
    nombre: "Pedro Castillo Jr",
    ideologia: "Izquierda rural",
    summary: "Representación campesina y desarrollo del Perú profundo",
    profession: "Profesor / Sindicalista",
    keyBeliefs: ["Educación rural", "Derechos campesinos", "Descentralización"],
    clips: [
      { title: "Educación Rural", url: "#", t: 1642089600 },
      { title: "Derechos del Campo", url: "#", t: 1642003200 },
      { title: "Descentralización Real", url: "#", t: 1641916800 },
      { title: "Perú Profundo", url: "#", t: 1641830400 },
      { title: "Sindicalismo Magisterial", url: "#", t: 1641744000 }
    ],
    powerMap: [
      { role: "Profesor", from: "1995", to: "2026" },
      { role: "Sindicalista", from: "2010", to: "2026" },
      { role: "Político", from: "2021", to: "2026" }
    ],
    timeline: [
      { week: "2024-W01", clips: 13 },
      { week: "2024-W02", clips: 17 },
      { week: "2024-W03", clips: 21 },
      { week: "2024-W04", clips: 24 },
      { week: "2024-W05", clips: 28 },
      { week: "2024-W06", clips: 26 }
    ],
    headshot: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "luis",
    nombre: "Luis Valdez",
    ideologia: "Tecnocrático",
    summary: "Gestión basada en evidencia y políticas públicas eficaces",
    profession: "Economista / Consultor",
    keyBeliefs: ["Políticas basadas en evidencia", "Eficiencia gubernamental", "Meritocracia"],
    clips: [
      { title: "Políticas Públicas", url: "#", t: 1642089600 },
      { title: "Evidencia Científica", url: "#", t: 1642003200 },
      { title: "Meritocracia", url: "#", t: 1641916800 },
      { title: "Eficiencia Estatal", url: "#", t: 1641830400 },
      { title: "Tecnocracia Moderna", url: "#", t: 1641744000 }
    ],
    powerMap: [
      { role: "Consultor", from: "2010", to: "2026" },
      { role: "Economista", from: "2000", to: "2010" },
      { role: "Académico", from: "1995", to: "2000" }
    ],
    timeline: [
      { week: "2024-W01", clips: 6 },
      { week: "2024-W02", clips: 9 },
      { week: "2024-W03", clips: 12 },
      { week: "2024-W04", clips: 15 },
      { week: "2024-W05", clips: 18 },
      { week: "2024-W06", clips: 16 }
    ],
    headshot: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1556474835-a7ed57b0b9c7?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "carmen",
    nombre: "Carmen Salinas",
    ideologia: "Populista",
    summary: "Gobierno del pueblo para el pueblo con participación ciudadana",
    profession: "Comerciante / Líder social",
    keyBeliefs: ["Participación ciudadana", "Gobierno popular", "Economía familiar"],
    clips: [
      { title: "Poder Popular", url: "#", t: 1642089600 },
      { title: "Participación Ciudadana", url: "#", t: 1642003200 },
      { title: "Economía Familiar", url: "#", t: 1641916800 },
      { title: "Liderazgo Social", url: "#", t: 1641830400 },
      { title: "Gobierno del Pueblo", url: "#", t: 1641744000 }
    ],
    powerMap: [
      { role: "Líder Social", from: "2015", to: "2026" },
      { role: "Comerciante", from: "2000", to: "2015" },
      { role: "Activista", from: "2010", to: "2026" }
    ],
    timeline: [
      { week: "2024-W01", clips: 14 },
      { week: "2024-W02", clips: 18 },
      { week: "2024-W03", clips: 22 },
      { week: "2024-W04", clips: 25 },
      { week: "2024-W05", clips: 29 },
      { week: "2024-W06", clips: 27 }
    ],
    headshot: "https://images.unsplash.com/photo-1609205790067-0aad7a7e3d0e?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "miguel",
    nombre: "Miguel Torres",
    ideologia: "Regionalista",
    summary: "Desarrollo descentralizado y fortalecimiento de las regiones",
    profession: "Alcalde / Gestor público",
    keyBeliefs: ["Descentralización", "Desarrollo regional", "Autonomía local"],
    clips: [
      { title: "Descentralización Real", url: "#", t: 1642089600 },
      { title: "Poder Regional", url: "#", t: 1642003200 },
      { title: "Autonomía Municipal", url: "#", t: 1641916800 },
      { title: "Desarrollo Local", url: "#", t: 1641830400 },
      { title: "Gestión Provincial", url: "#", t: 1641744000 }
    ],
    powerMap: [
      { role: "Alcalde Provincial", from: "2019", to: "2026" },
      { role: "Regidor", from: "2015", to: "2019" },
      { role: "Gestor Público", from: "2010", to: "2015" }
    ],
    timeline: [
      { week: "2024-W01", clips: 5 },
      { week: "2024-W02", clips: 8 },
      { week: "2024-W03", clips: 11 },
      { week: "2024-W04", clips: 14 },
      { week: "2024-W05", clips: 17 },
      { week: "2024-W06", clips: 15 }
    ],
    headshot: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "ana",
    nombre: "Ana Jara",
    ideologia: "Aprista",
    summary: "Tradición aprista renovada para los nuevos tiempos",
    profession: "Abogada / Ex-ministra",
    keyBeliefs: ["Tradición aprista", "Justicia social", "Latinoamericanismo"],
    clips: [
      { title: "Tradición Aprista", url: "#", t: 1642089600 },
      { title: "Renovación Política", url: "#", t: 1642003200 },
      { title: "Justicia Social", url: "#", t: 1641916800 },
      { title: "Integración Latinoamericana", url: "#", t: 1641830400 },
      { title: "Experiencia Ministerial", url: "#", t: 1641744000 }
    ],
    powerMap: [
      { role: "Ex-Ministra", from: "2014", to: "2016" },
      { role: "Abogada", from: "1990", to: "2014" },
      { role: "Dirigente Aprista", from: "2000", to: "2026" }
    ],
    timeline: [
      { week: "2024-W01", clips: 7 },
      { week: "2024-W02", clips: 10 },
      { week: "2024-W03", clips: 13 },
      { week: "2024-W04", clips: 16 },
      { week: "2024-W05", clips: 19 },
      { week: "2024-W06", clips: 17 }
    ],
    headshot: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=600&fit=crop&auto=format"
  },
  {
    id: "ricardo",
    nombre: "Ricardo Belmont Jr",
    ideologia: "Independiente",
    summary: "Independencia política y gestión moderna sin partidos tradicionales",
    profession: "Comunicador / Empresario",
    keyBeliefs: ["Independencia política", "Comunicación directa", "Gestión moderna"],
    clips: [
      { title: "Independencia Total", url: "#", t: 1642089600 },
      { title: "Comunicación Directa", url: "#", t: 1642003200 },
      { title: "Sin Partidos", url: "#", t: 1641916800 },
      { title: "Gestión Empresarial", url: "#", t: 1641830400 },
      { title: "Nueva Política", url: "#", t: 1641744000 }
    ],
    powerMap: [
      { role: "Comunicador", from: "2000", to: "2026" },
      { role: "Empresario", from: "1995", to: "2000" },
      { role: "Independiente", from: "2020", to: "2026" }
    ],
    timeline: [
      { week: "2024-W01", clips: 10 },
      { week: "2024-W02", clips: 14 },
      { week: "2024-W03", clips: 18 },
      { week: "2024-W04", clips: 21 },
      { week: "2024-W05", clips: 25 },
      { week: "2024-W06", clips: 23 }
    ],
    headshot: "https://images.unsplash.com/photo-1537511446984-935f663eb1f4?w=150&h=150&fit=crop&crop=face&auto=format",
    fullBody: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=400&h=600&fit=crop&auto=format"
  }
];