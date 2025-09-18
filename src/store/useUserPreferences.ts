import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Matchup = {
  a: string;
  b: string;
  savedAt: string;
  label?: string;
};

export type QuizAnswer = {
  issueId: string;
  value: number | null;
};

export type QuizResult = {
  completedAt: string;
  topMatches: { candidateId: string; score: number }[];
  answers: QuizAnswer[];
  shareUrl?: string;
};

interface UserPreferencesState {
  onboardingCompleted: boolean;
  selectedIssues: string[];
  lean: number | null;
  savedCandidateIds: string[];
  savedMatchups: Matchup[];
  lastMatchup?: Matchup;
  lastQuizResult?: QuizResult;
  highIntentCount: number;
  markOnboardingComplete: (issues: string[], lean: number | null) => void;
  toggleSavedCandidate: (candidateId: string) => void;
  saveMatchup: (a: string, b: string, label?: string) => void;
  removeMatchup: (a: string, b: string) => void;
  recordMatchupView: (a: string, b: string) => void;
  recordQuizResult: (result: QuizResult) => void;
  incrementHighIntent: () => void;
  resetOnboarding: () => void;
}

const normalisePair = (a: string, b: string) => {
  return [a, b].sort().join(":");
};

export const useUserPreferences = create<UserPreferencesState>()(
  persist(
    (set, get) => ({
      onboardingCompleted: false,
      selectedIssues: [],
      lean: null,
      savedCandidateIds: [],
      savedMatchups: [],
      lastMatchup: undefined,
      lastQuizResult: undefined,
      highIntentCount: 0,
      markOnboardingComplete: (issues, lean) =>
        set({
          onboardingCompleted: true,
          selectedIssues: issues,
          lean,
        }),
      toggleSavedCandidate: (candidateId) =>
        set((state) => {
          const exists = state.savedCandidateIds.includes(candidateId);
          return {
            savedCandidateIds: exists
              ? state.savedCandidateIds.filter((id) => id !== candidateId)
              : [...state.savedCandidateIds, candidateId],
          };
        }),
      saveMatchup: (a, b, label) =>
        set((state) => {
          const key = normalisePair(a, b);
          const exists = state.savedMatchups.some(
            (matchup) => normalisePair(matchup.a, matchup.b) === key,
          );
          if (exists) {
            return state;
          }
          const now = new Date().toISOString();
          const nextMatchup: Matchup = { a, b, savedAt: now, label };
          return {
            savedMatchups: [nextMatchup, ...state.savedMatchups].slice(0, 12),
            lastMatchup: nextMatchup,
          };
        }),
      removeMatchup: (a, b) =>
        set((state) => {
          const key = normalisePair(a, b);
          return {
            savedMatchups: state.savedMatchups.filter(
              (matchup) => normalisePair(matchup.a, matchup.b) !== key,
            ),
          };
        }),
      recordMatchupView: (a, b) => {
        const now = new Date().toISOString();
        set({ lastMatchup: { a, b, savedAt: now } });
      },
      recordQuizResult: (result) => set({ lastQuizResult: result }),
      incrementHighIntent: () =>
        set((state) => ({ highIntentCount: state.highIntentCount + 1 })),
      resetOnboarding: () =>
        set({ onboardingCompleted: false, selectedIssues: [], lean: null }),
    }),
    {
      name: "ppp-user-preferences",
      version: 1,
    },
  ),
);
