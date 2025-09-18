import { Axis } from "@/components/political-compass/PoliticalCompass";

export interface IssueTopic {
  id: string;
  label: string;
  description: string;
  axis: Axis;
  source: string;
  highlight?: string;
}

export const onboardingIssues: IssueTopic[] = [
  {
    id: "corrupcion",
    label: "Lucha anticorrupción",
    description:
      "¿Qué tan dispuesto estás a respaldar reformas fuertes para investigar y sancionar redes de corrupción en el Estado?",
    axis: "power",
    source: "https://ojo-publico.com/justicia",
    highlight: "Reformas del sistema de justicia",
  },
  {
    id: "economia",
    label: "Modelo económico",
    description:
      "Define cuánto debería intervenir el Estado en la economía frente al libre mercado y la inversión privada.",
    axis: "econ",
    source: "https://iep.org.pe/economia",
    highlight: "Política fiscal y empleo",
  },
  {
    id: "seguridad",
    label: "Seguridad ciudadana",
    description:
      "¿Priorizarías estrategias de mano dura o prevención comunitaria frente al crimen organizado y la violencia?",
    axis: "power",
    source: "https://idl-reporteros.pe/seguridad",
    highlight: "Plan nacional de seguridad",
  },
  {
    id: "derechos",
    label: "Derechos y libertades",
    description:
      "Balance entre libertades civiles, agenda de derechos y regulaciones sobre temas como enfoque de género y unión civil.",
    axis: "social",
    source: "https://idehpucp.pucp.edu.pe/derechos",
    highlight: "Agenda social",
  },
  {
    id: "descentralizacion",
    label: "Descentralización",
    description:
      "Redistribución del poder y del presupuesto hacia regiones fuera de Lima y fortalecimiento de gobiernos locales.",
    axis: "territorial",
    source: "https://ciup.up.edu.pe/descentralizacion",
    highlight: "Transferencia de recursos",
  },
  {
    id: "migracion",
    label: "Política migratoria",
    description:
      "¿Prefieres un enfoque de apertura y regularización o controles estrictos sobre la migración internacional?",
    axis: "social",
    source: "https://rpp.pe/migracion",
    highlight: "Control fronterizo",
  },
];

export const candidateIssuePositions: Record<string, Partial<Record<string, number>>> = {
  keiko: {
    corrupcion: -0.3,
    economia: 0.7,
    seguridad: 0.6,
    derechos: 0.6,
    descentralizacion: 0.1,
    migracion: 0.5,
  },
  rafael: {
    corrupcion: 0.1,
    economia: 0.6,
    seguridad: 0.9,
    derechos: 0.9,
    descentralizacion: -0.2,
    migracion: 1,
  },
  yonhy: {
    corrupcion: 0.4,
    economia: -0.1,
    seguridad: 0.2,
    derechos: -0.2,
    descentralizacion: 0.5,
    migracion: -0.4,
  },
  antauro: {
    corrupcion: -0.2,
    economia: -0.4,
    seguridad: 0.7,
    derechos: -0.6,
    descentralizacion: 0.6,
    migracion: 0.2,
  },
  "martin-vizcarra": {
    corrupcion: 0.6,
    economia: 0,
    seguridad: 0.1,
    derechos: 0,
    descentralizacion: 0.8,
    migracion: -0.2,
  },
  "guillermo-bermejo": {
    corrupcion: -0.1,
    economia: -0.7,
    seguridad: -0.4,
    derechos: -0.3,
    descentralizacion: 0.7,
    migracion: -0.6,
  },
  "carlos-alvarez": {
    corrupcion: 0.2,
    economia: 0.4,
    seguridad: 0.8,
    derechos: 0.7,
    descentralizacion: -0.3,
    migracion: 0.8,
  },
  "cesar-acuna": {
    corrupcion: -0.1,
    economia: 0.3,
    seguridad: 0.2,
    derechos: 0.3,
    descentralizacion: 0.1,
    migracion: 0.2,
  },
};

export const issueOrder = onboardingIssues.map((issue) => issue.id);

export function normaliseLean(value: number | null | undefined) {
  if (value === null || value === undefined) return 0;
  if (value > 100) return 1;
  if (value < -100) return -1;
  return Number((value / 100).toFixed(2));
}

