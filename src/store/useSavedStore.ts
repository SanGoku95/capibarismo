import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SavedMatchup {
  id: string;
  candidates: [string, string];
  savedAt: string;
  label?: string;
}

interface SavedState {
  savedCandidates: string[];
  recentMatchups: SavedMatchup[];
  resumeCompare?: { left: string | null; right: string | null };
  toggleCandidate: (candidateId: string) => void;
  isCandidateSaved: (candidateId: string) => boolean;
  saveMatchup: (pair: [string, string], label?: string) => void;
  removeMatchup: (id: string) => void;
  setResumeCompare: (pair: { left: string | null; right: string | null }) => void;
  clearAll: () => void;
}

const MAX_RECENT = 8;

export const useSavedStore = create<SavedState>()(
  persist(
    (set, get) => ({
      savedCandidates: [],
      recentMatchups: [],
      toggleCandidate: (candidateId) => {
        const { savedCandidates } = get();
        const exists = savedCandidates.includes(candidateId);
        if (exists) {
          set({ savedCandidates: savedCandidates.filter((id) => id !== candidateId) });
          return;
        }
        set({ savedCandidates: savedCandidates.concat(candidateId) });
      },
      isCandidateSaved: (candidateId) => get().savedCandidates.includes(candidateId),
      saveMatchup: (pair, label) => {
        const [left, right] = pair;
        if (!left || !right) return;
        const { recentMatchups } = get();
        const existing = recentMatchups.find(
          (matchup) =>
            (matchup.candidates[0] === left && matchup.candidates[1] === right) ||
            (matchup.candidates[0] === right && matchup.candidates[1] === left)
        );
        const savedAt = new Date().toISOString();
        if (existing) {
          const updated = recentMatchups
            .filter((matchup) => matchup.id !== existing.id)
            .concat({ ...existing, savedAt, label });
          set({ recentMatchups: updated.slice(-MAX_RECENT) });
          return;
        }
        const id = `${left}-${right}-${savedAt}`;
        const updated = recentMatchups
          .concat({ id, candidates: [left, right], savedAt, label })
          .slice(-MAX_RECENT);
        set({ recentMatchups: updated });
      },
      removeMatchup: (id) => {
        const { recentMatchups } = get();
        set({ recentMatchups: recentMatchups.filter((matchup) => matchup.id !== id) });
      },
      setResumeCompare: (pair) => {
        set({ resumeCompare: pair });
      },
      clearAll: () => set({ savedCandidates: [], recentMatchups: [], resumeCompare: undefined }),
    }),
    {
      name: "ppp-saved",
      version: 1,
    }
  )
);

export type { SavedMatchup };

