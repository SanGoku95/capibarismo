import { create } from "zustand";
import { persist } from "zustand/middleware";
import { issueOrder } from "@/data/issues";

interface OnboardingState {
  selectedIssues: string[];
  lean: number | null;
  hasCompleted: boolean;
  lastCompletedAt?: string;
  lastMatchCandidates: string[];
  shareCount: number;
  setSelectedIssues: (issues: string[]) => void;
  toggleIssue: (issueId: string) => void;
  setLean: (value: number | null) => void;
  completeOnboarding: () => void;
  setLastMatches: (candidateIds: string[]) => void;
  incrementShare: () => void;
  resetOnboarding: () => void;
}

const MAX_ISSUES = 3;

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      selectedIssues: [],
      lean: 0,
      hasCompleted: false,
      lastMatchCandidates: [],
      shareCount: 0,
      setSelectedIssues: (issues) => {
        const unique = Array.from(new Set(issues));
        const ordered = unique
          .filter((issue) => issueOrder.includes(issue))
          .sort((a, b) => issueOrder.indexOf(a) - issueOrder.indexOf(b))
          .slice(0, MAX_ISSUES);
        set({ selectedIssues: ordered });
      },
      toggleIssue: (issueId) => {
        const { selectedIssues } = get();
        const exists = selectedIssues.includes(issueId);
        if (exists) {
          set({ selectedIssues: selectedIssues.filter((id) => id !== issueId) });
          return;
        }
        if (selectedIssues.length >= MAX_ISSUES) {
          const [, ...rest] = selectedIssues.concat(issueId);
          const ordered = rest
            .filter((issue) => issueOrder.includes(issue))
            .sort((a, b) => issueOrder.indexOf(a) - issueOrder.indexOf(b))
            .slice(0, MAX_ISSUES);
          set({ selectedIssues: ordered });
          return;
        }
        const next = selectedIssues
          .concat(issueId)
          .filter((issue) => issueOrder.includes(issue))
          .sort((a, b) => issueOrder.indexOf(a) - issueOrder.indexOf(b));
        set({ selectedIssues: next.slice(0, MAX_ISSUES) });
      },
      setLean: (value) => set({ lean: value }),
      completeOnboarding: () => {
        const timestamp = new Date().toISOString();
        set({ hasCompleted: true, lastCompletedAt: timestamp });
      },
      setLastMatches: (candidateIds) => {
        set({ lastMatchCandidates: candidateIds.slice(0, 3) });
      },
      incrementShare: () => {
        const { shareCount } = get();
        set({ shareCount: shareCount + 1 });
      },
      resetOnboarding: () =>
        set({ selectedIssues: [], lean: 0, hasCompleted: false, lastMatchCandidates: [] }),
    }),
    {
      name: "ppp-onboarding",
      version: 1,
    }
  )
);

