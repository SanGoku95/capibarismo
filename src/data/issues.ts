export type IssueScore = -1 | 0 | 1;

export interface CompassIssueOption {
  value: IssueScore;
  label: string;
  helper: string;
}

export interface CompassIssue {
  id: string;
  title: string;
  prompt: string;
  description: string;
  topicLabel: string;
  estimatedTime?: number;
  options: CompassIssueOption[];
  source?: string;
}

export const compassIssues: CompassIssue[] = [
  {
    id: "economia-popular",
    title: "Economía popular",
    prompt: "¿Qué debería priorizar el próximo gobierno para reactivar la economía familiar?",
    description:
      "Desde subsidios directos hasta incentivos a la inversión privada, las estrategias revelan visiones económicas distintas.",
    topicLabel: "Economía",
    estimatedTime: 3,
    options: [
      { value: 1, label: "Reducir impuestos y abrir inversión", helper: "Mercado libre, más empresa" },
      { value: 0, label: "Equilibrio con apoyo focalizado", helper: "Mix público-privado" },
      { value: -1, label: "Subsidios y gasto social fuerte", helper: "Estado protagonista" },
    ],
    source: "Informe macroeconómico MEF 2024",
  },
  {
    id: "seguridad-ciudadana",
    title: "Seguridad ciudadana",
    prompt: "Frente a la crisis de inseguridad, ¿qué enfoque te representa mejor?",
    description:
      "Las propuestas oscilan entre intervención militar, reforma policial y estrategias comunitarias de prevención.",
    topicLabel: "Seguridad",
    estimatedTime: 3,
    options: [
      { value: 1, label: "Mano dura con apoyo militar", helper: "Tolerancia cero" },
      { value: 0, label: "Reforma policial con control ciudadano", helper: "Orden con derechos" },
      { value: -1, label: "Prevención social primero", helper: "Causas profundas" },
    ],
    source: "Encuesta INEI sobre inseguridad 2024",
  },
  {
    id: "corrupcion",
    title: "Corrupción sistémica",
    prompt: "¿Cómo debería enfrentarse la corrupción en el Estado?",
    description:
      "Desde nuevas fiscalías hasta mecanismos de democracia directa, cada candidato plantea un cambio distinto.",
    topicLabel: "Institucionalidad",
    estimatedTime: 2,
    options: [
      { value: 1, label: "Tribunales expeditivos y sanción ejemplar", helper: "Castigo inmediato" },
      { value: 0, label: "Reformas administrativas y transparencia", helper: "Cortar incentivos" },
      { value: -1, label: "Control ciudadano y revocatoria", helper: "Poder a la calle" },
    ],
    source: "Transparencia Internacional 2024",
  },
  {
    id: "territorial",
    title: "Estado y regiones",
    prompt: "¿Dónde debería concentrarse el poder de decisión?",
    description:
      "Las posiciones van desde recentralizar en Lima hasta transferir recursos y autonomía plena a regiones.",
    topicLabel: "Descentralización",
    estimatedTime: 2,
    options: [
      { value: 1, label: "Decisiones desde Lima", helper: "Coordinación central" },
      { value: 0, label: "Estado coordinador con regiones", helper: "Equilibrio" },
      { value: -1, label: "Autonomía regional con presupuesto", helper: "Poder local" },
    ],
    source: "Consejo Nacional de Descentralización",
  },
  {
    id: "derechos-sociales",
    title: "Derechos y libertades",
    prompt: "¿Qué ritmo debería tener la agenda de derechos sociales?",
    description:
      "Divorcio igualitario, educación sexual, aborto terapéutico: temas que diferencian a los contendores.",
    topicLabel: "Derechos",
    estimatedTime: 2,
    options: [
      { value: 1, label: "Conservar valores tradicionales", helper: "Cambios mínimos" },
      { value: 0, label: "Avances graduales", helper: "Consenso paso a paso" },
      { value: -1, label: "Reformas progresistas ya", helper: "Plenos derechos" },
    ],
    source: "Defensoría del Pueblo 2024",
  },
  {
    id: "recursos-naturales",
    title: "Recursos naturales",
    prompt: "¿Cómo equilibrar inversión minera y protección ambiental?",
    description:
      "El conflicto entre crecimiento y sostenibilidad es clave para la próxima presidencia.",
    topicLabel: "Ambiente",
    estimatedTime: 3,
    options: [
      { value: 1, label: "Facilitar inversión con reglas flexibles", helper: "Crecimiento ante todo" },
      { value: 0, label: "Licencia social obligatoria", helper: "Negociar antes de explotar" },
      { value: -1, label: "Pausa ecológica", helper: "Protección ambiental" },
    ],
    source: "Observatorio de Conflictos Mineros",
  },
];

export const candidateIssuePositions: Record<string, Record<string, IssueScore>> = {
  keiko: {
    "economia-popular": 1,
    "seguridad-ciudadana": 1,
    corrupcion: 0,
    territorial: 1,
    "derechos-sociales": 1,
    "recursos-naturales": 1,
  },
  rafael: {
    "economia-popular": 1,
    "seguridad-ciudadana": 1,
    corrupcion: 0,
    territorial: 1,
    "derechos-sociales": 1,
    "recursos-naturales": 0,
  },
  yonhy: {
    "economia-popular": 0,
    "seguridad-ciudadana": 0,
    corrupcion: 1,
    territorial: -1,
    "derechos-sociales": 0,
    "recursos-naturales": 0,
  },
  antauro: {
    "economia-popular": -1,
    "seguridad-ciudadana": 0,
    corrupcion: -1,
    territorial: -1,
    "derechos-sociales": -1,
    "recursos-naturales": -1,
  },
  "martin-vizcarra": {
    "economia-popular": 0,
    "seguridad-ciudadana": 0,
    corrupcion: 0,
    territorial: -1,
    "derechos-sociales": 0,
    "recursos-naturales": 0,
  },
  "guillermo-bermejo": {
    "economia-popular": -1,
    "seguridad-ciudadana": -1,
    corrupcion: -1,
    territorial: -1,
    "derechos-sociales": -1,
    "recursos-naturales": -1,
  },
  "carlos-alvarez": {
    "economia-popular": 0,
    "seguridad-ciudadana": 1,
    corrupcion: 1,
    territorial: 1,
    "derechos-sociales": 1,
    "recursos-naturales": 1,
  },
  "cesar-acuna": {
    "economia-popular": 0,
    "seguridad-ciudadana": 1,
    corrupcion: 0,
    territorial: 0,
    "derechos-sociales": 0,
    "recursos-naturales": 0,
  },
};

export const trendingMatchups: { a: string; b: string; headline: string }[] = [
  { a: "keiko", b: "antauro", headline: "Keiko vs Antauro: orden vs. refundación" },
  { a: "rafael", b: "yonhy", headline: "López Aliaga vs. Lescano" },
  { a: "martin-vizcarra", b: "keiko", headline: "Vizcarra vs Keiko: revancha 2021" },
];
