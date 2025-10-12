import { create } from 'zustand';
import { Candidate } from '../data/candidates';

type Slot = 'left' | 'right';

const computeNextSlot = (
  leftCandidate: Candidate | null,
  rightCandidate: Candidate | null,
): Slot => {
  if (!leftCandidate && !rightCandidate) return 'left';
  if (!leftCandidate) return 'left';
  if (!rightCandidate) return 'right';
  return 'left';
};

interface CompareState {
  leftCandidate: Candidate | null;
  rightCandidate: Candidate | null;
  nextSlotToReplace: Slot;
  setLeftCandidate: (candidate: Candidate | null) => void;
  setRightCandidate: (candidate: Candidate | null) => void;
  selectCandidate: (candidate: Candidate) => void;
}

export const useCompareStore = create<CompareState>((set) => ({
  leftCandidate: null,
  rightCandidate: null,
  nextSlotToReplace: 'left',

  setLeftCandidate: (candidate) =>
    set((state) => ({
      leftCandidate: candidate,
      nextSlotToReplace: computeNextSlot(candidate, state.rightCandidate),
    })),
  setRightCandidate: (candidate) =>
    set((state) => ({
      rightCandidate: candidate,
      nextSlotToReplace: computeNextSlot(state.leftCandidate, candidate),
    })),

  selectCandidate: (candidate) =>
    set((state) => {
      const { leftCandidate, rightCandidate, nextSlotToReplace } = state;

      // If candidate is already selected, remove them
      if (leftCandidate?.id === candidate.id) {
        return { leftCandidate: null, nextSlotToReplace: 'left' };
      }
      if (rightCandidate?.id === candidate.id) {
        return { rightCandidate: null, nextSlotToReplace: 'right' };
      }

      if (!leftCandidate && !rightCandidate) {
        return { leftCandidate: candidate, nextSlotToReplace: 'right' };
      }

      if (!leftCandidate) {
        return { leftCandidate: candidate, nextSlotToReplace: 'right' };
      }

      if (!rightCandidate) {
        return { rightCandidate: candidate, nextSlotToReplace: 'left' };
      }

      if (nextSlotToReplace === 'left') {
        return { leftCandidate: candidate, nextSlotToReplace: 'right' };
      }

      return { rightCandidate: candidate, nextSlotToReplace: 'left' };
    }),
}));