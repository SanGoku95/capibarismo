export interface MatchupDefinition {
  id: string;
  label: string;
  candidates: [string, string];
  rationale: string;
}

export const trendingMatchups: MatchupDefinition[] = [
  {
    id: "fujimori-vs-lopez",
    label: "Fujimori vs. López Aliaga",
    candidates: ["keiko", "rafael"],
    rationale: "El duelo clásico entre el fujimorismo y la nueva derecha populista limeña.",
  },
  {
    id: "vizcarra-vs-yonhy",
    label: "Vizcarra vs. Lescano",
    candidates: ["martin-vizcarra", "yonhy"],
    rationale: "Choque entre institucionalismo anticorrupción y el congresista más votado del sur.",
  },
  {
    id: "antauro-vs-bermejo",
    label: "Antauro vs. Bermejo",
    candidates: ["antauro", "guillermo-bermejo"],
    rationale: "La izquierda radical militarista frente a la izquierda asambleísta de Perú Libre.",
  },
  {
    id: "acuna-vs-alvarez",
    label: "Acuña vs. Carlos Álvarez",
    candidates: ["cesar-acuna", "carlos-alvarez"],
    rationale: "Empresario del norte y outsider mediático compiten por el voto popular.",
  },
];

export function pickRandomMatchup(exclusions: string[] = []) {
  const available = trendingMatchups.filter((matchup) =>
    matchup.candidates.every((candidateId) => !exclusions.includes(candidateId))
  );
  const source = available.length > 0 ? available : trendingMatchups;
  const randomIndex = Math.floor(Math.random() * source.length);
  return source[randomIndex];
}

