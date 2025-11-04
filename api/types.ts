// Types for the ranking game API

export interface PairwiseOutcome {
  id: string;
  sessionId: string;
  aId: string;
  bId: string;
  winner: "A" | "B";
  createdAt: string;
  clientMeta?: {
    uaHash?: string;
    ipHash?: string;
    screen?: string;
    tz?: string;
  };
}

export interface Rating {
  candidateId: string;
  rating: number; // Elo rating
  rd: number; // Rating deviation / uncertainty
  games: number;
  wins: number;
  losses: number;
  lastUpdated: string;
}

export interface GameState {
  sessionId: string;
  comparisons: number;
  progressPercent: number;
  topN?: Array<{ candidateId: string; name: string; rating: number }>;
}

export interface Pair {
  pairId: string;
  a: {
    id: string;
    nombre: string;
    ideologia?: string;
    fullBody?: string;
    headshot?: string;
  };
  b: {
    id: string;
    nombre: string;
    ideologia?: string;
    fullBody?: string;
    headshot?: string;
  };
  hint?: {
    rationale: "uncertainty" | "close_rating" | "random";
  };
}

export interface VoteRequest {
  sessionId: string;
  pairId: string;
  aId: string;
  bId: string;
  outcome: "A" | "B";
}

export interface GlobalRankingEntry {
  rank: number;
  candidateId: string;
  name: string;
  ideologia?: string;
  imageFullBodyUrl?: string;
  score: number; // normalized 0-100
  rating: number; // actual Elo
  games: number;
  wins: number;
  losses: number;
  winRate: number;
  rd: number; // uncertainty
}
