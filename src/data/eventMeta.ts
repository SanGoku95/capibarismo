export interface EventMeta {
  slug: string;
  focusCandidates: string[];
  relatedIssues?: string[];
}

export const eventCandidateMap: EventMeta[] = [
  {
    slug: "crisis-politica-fuerza-popular-odebrecht",
    focusCandidates: ["keiko"],
    relatedIssues: ["corrupcion"],
  },
  {
    slug: "crisis-politica-jose-luna-galvez",
    focusCandidates: ["cesar-acuna", "keiko"],
    relatedIssues: ["corrupcion", "economia"],
  },
  {
    slug: "alianzas-politicas-elecciones-2026",
    focusCandidates: ["guillermo-bermejo", "antauro", "yonhy"],
    relatedIssues: ["descentralizacion", "economia"],
  },
  {
    slug: "infraestructuras-transporte-tren-lima",
    focusCandidates: ["rafael", "martin-vizcarra"],
    relatedIssues: ["descentralizacion", "economia"],
  },
];

export function getEventMeta(slug: string) {
  return eventCandidateMap.find((meta) => meta.slug === slug);
}

