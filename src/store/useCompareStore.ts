import { create } from 'zustand';
import { Candidate } from '../data/candidates';

interface CompareState {
  leftCandidate: Candidate | null;
  rightCandidate: Candidate | null;
  pinnedLeft: boolean;
  pinnedRight: boolean;
  setLeftCandidate: (candidate: Candidate | null) => void;
  setRightCandidate: (candidate: Candidate | null) => void;
  selectCandidate: (candidate: Candidate) => void;
  togglePin: (side: "left" | "right") => void;
  setPair: (left: Candidate | null, right: Candidate | null) => void;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  leftCandidate: null,
  rightCandidate: null,
  pinnedLeft: false,
  pinnedRight: false,

  setLeftCandidate: (candidate) => set({ leftCandidate: candidate }),
  setRightCandidate: (candidate) => set({ rightCandidate: candidate }),
  setPair: (leftCandidate, rightCandidate) => set({ leftCandidate, rightCandidate }),
  togglePin: (side) =>
    set((state) =>
      side === "left"
        ? { pinnedLeft: !state.pinnedLeft }
        : { pinnedRight: !state.pinnedRight },
    ),

  selectCandidate: (candidate) => {
    const { leftCandidate, rightCandidate } = get();

    // If candidate is already selected, remove them
    if (leftCandidate?.id === candidate.id) {
      set({ leftCandidate: null });
      return;
    }
    if (rightCandidate?.id === candidate.id) {
      set({ rightCandidate: null });
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
}));