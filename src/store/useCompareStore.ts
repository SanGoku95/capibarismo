import { create } from 'zustand';
import { Candidate, candidates } from '../data/candidates';

interface CompareState {
  leftCandidate: Candidate | null;
  rightCandidate: Candidate | null;
  pinnedSide: 'left' | 'right' | null;
  setLeftCandidate: (candidate: Candidate | null) => void;
  setRightCandidate: (candidate: Candidate | null) => void;
  selectCandidate: (candidate: Candidate) => void;
  setPinnedSide: (side: 'left' | 'right' | null) => void;
  setCandidatesByIds: (leftId: string | null, rightId: string | null) => void;
  swapCandidates: () => void;
  clearSelection: () => void;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  leftCandidate: null,
  rightCandidate: null,
  pinnedSide: null,

  setLeftCandidate: (candidate) => set({ leftCandidate: candidate }),
  setRightCandidate: (candidate) => set({ rightCandidate: candidate }),

  selectCandidate: (candidate) => {
    const { leftCandidate, rightCandidate, pinnedSide } = get();

    // If candidate is already selected, remove them
    if (leftCandidate?.id === candidate.id) {
      set((state) => ({
        leftCandidate: pinnedSide === 'left' ? state.leftCandidate : null,
        pinnedSide: pinnedSide === 'left' ? null : pinnedSide,
      }));
      return;
    }
    if (rightCandidate?.id === candidate.id) {
      set((state) => ({
        rightCandidate: pinnedSide === 'right' ? state.rightCandidate : null,
        pinnedSide: pinnedSide === 'right' ? null : pinnedSide,
      }));
      return;
    }

    // Respect pinned side when adding new candidates
    if (pinnedSide === 'left') {
      set({ rightCandidate: candidate });
      return;
    }

    if (pinnedSide === 'right') {
      set({ leftCandidate: candidate });
      return;
    }

    // If both slots are empty, assign to left
    if (!leftCandidate && !rightCandidate) {
      set({ leftCandidate: candidate });
      return;
    }
    
    // If left is empty, assign to left
    if (!leftCandidate) {
      set({ leftCandidate: candidate });
      return;
    }
    
    // If right is empty, assign to right
    if (!rightCandidate) {
      set({ rightCandidate: candidate });
      return;
    }

    // If both slots are full, replace the right one
    set({ rightCandidate: candidate });
  },
  setPinnedSide: (side) => {
    const { leftCandidate, rightCandidate } = get();
    if (side === 'left' && !leftCandidate) {
      set({ pinnedSide: null });
      return;
    }
    if (side === 'right' && !rightCandidate) {
      set({ pinnedSide: null });
      return;
    }
    set({ pinnedSide: side });
  },
  setCandidatesByIds: (leftId, rightId) => {
    const left = leftId ? candidates.find((candidate) => candidate.id === leftId) ?? null : null;
    const right = rightId ? candidates.find((candidate) => candidate.id === rightId) ?? null : null;
    set({ leftCandidate: left, rightCandidate: right, pinnedSide: null });
  },
  swapCandidates: () => {
    const { leftCandidate, rightCandidate } = get();
    set({ leftCandidate: rightCandidate, rightCandidate: leftCandidate });
  },
  clearSelection: () => set({ leftCandidate: null, rightCandidate: null, pinnedSide: null }),
}));