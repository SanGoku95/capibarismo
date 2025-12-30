import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCompareStore } from '../useCompareStore';
import type { CandidateBase } from '@/data/types';

// Mock candidates for testing
const mockCandidate1: CandidateBase = {
  id: 'test-1',
  nombre: 'Test Candidate 1',
  ideologia: 'Test Ideology',
  headshot: '/test1.jpg',
  fullBody: '/test1-full.jpg',
};

const mockCandidate2: CandidateBase = {
  id: 'test-2',
  nombre: 'Test Candidate 2',
  ideologia: 'Test Ideology 2',
  headshot: '/test2.jpg',
  fullBody: '/test2-full.jpg',
};

const mockCandidate3: CandidateBase = {
  id: 'test-3',
  nombre: 'Test Candidate 3',
  ideologia: 'Test Ideology 3',
  headshot: '/test3.jpg',
  fullBody: '/test3-full.jpg',
};

describe('useCompareStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useCompareStore());
    act(() => {
      result.current.setLeftCandidate(null);
      result.current.setRightCandidate(null);
    });
  });

  describe('Initial State', () => {
    it('should initialize with null candidates', () => {
      const { result } = renderHook(() => useCompareStore());

      expect(result.current.leftCandidate).toBeNull();
      expect(result.current.rightCandidate).toBeNull();
    });

    it('should initialize with left as next slot to replace', () => {
      const { result } = renderHook(() => useCompareStore());

      expect(result.current.nextSlotToReplace).toBe('left');
    });
  });

  describe('setLeftCandidate()', () => {
    it('should set left candidate', () => {
      const { result } = renderHook(() => useCompareStore());

      act(() => {
        result.current.setLeftCandidate(mockCandidate1);
      });

      expect(result.current.leftCandidate).toEqual(mockCandidate1);
    });

    it('should update nextSlotToReplace to right when setting left candidate', () => {
      const { result } = renderHook(() => useCompareStore());

      act(() => {
        result.current.setLeftCandidate(mockCandidate1);
      });

      expect(result.current.nextSlotToReplace).toBe('right');
    });

    it('should allow setting left candidate to null', () => {
      const { result } = renderHook(() => useCompareStore());

      act(() => {
        result.current.setLeftCandidate(mockCandidate1);
        result.current.setLeftCandidate(null);
      });

      expect(result.current.leftCandidate).toBeNull();
      expect(result.current.nextSlotToReplace).toBe('left');
    });
  });

  describe('setRightCandidate()', () => {
    it('should set right candidate', () => {
      const { result } = renderHook(() => useCompareStore());

      act(() => {
        result.current.setRightCandidate(mockCandidate2);
      });

      expect(result.current.rightCandidate).toEqual(mockCandidate2);
    });

    it('should update nextSlotToReplace to left when both candidates are set', () => {
      const { result } = renderHook(() => useCompareStore());

      act(() => {
        result.current.setLeftCandidate(mockCandidate1);
        result.current.setRightCandidate(mockCandidate2);
      });

      expect(result.current.nextSlotToReplace).toBe('left');
    });

    it('should allow setting right candidate to null', () => {
      const { result } = renderHook(() => useCompareStore());

      act(() => {
        result.current.setRightCandidate(mockCandidate2);
        result.current.setRightCandidate(null);
      });

      expect(result.current.rightCandidate).toBeNull();
    });
  });

  describe('selectCandidate()', () => {
    it('should select first candidate to left slot when both empty', () => {
      const { result } = renderHook(() => useCompareStore());

      act(() => {
        result.current.selectCandidate(mockCandidate1);
      });

      expect(result.current.leftCandidate).toEqual(mockCandidate1);
      expect(result.current.rightCandidate).toBeNull();
      expect(result.current.nextSlotToReplace).toBe('right');
    });

    it('should select second candidate to right slot', () => {
      const { result } = renderHook(() => useCompareStore());

      act(() => {
        result.current.selectCandidate(mockCandidate1);
        result.current.selectCandidate(mockCandidate2);
      });

      expect(result.current.leftCandidate).toEqual(mockCandidate1);
      expect(result.current.rightCandidate).toEqual(mockCandidate2);
    });

    it('should toggle off left candidate when selected again', () => {
      const { result } = renderHook(() => useCompareStore());

      act(() => {
        result.current.selectCandidate(mockCandidate1);
        result.current.selectCandidate(mockCandidate1);
      });

      expect(result.current.leftCandidate).toBeNull();
      expect(result.current.rightCandidate).toBeNull();
      expect(result.current.nextSlotToReplace).toBe('left');
    });

    it('should toggle off right candidate when selected again', () => {
      const { result } = renderHook(() => useCompareStore());

      act(() => {
        result.current.selectCandidate(mockCandidate1);
        result.current.selectCandidate(mockCandidate2);
        result.current.selectCandidate(mockCandidate2);
      });

      expect(result.current.leftCandidate).toEqual(mockCandidate1);
      expect(result.current.rightCandidate).toBeNull();
      expect(result.current.nextSlotToReplace).toBe('right');
    });

    it('should replace left candidate when both slots filled and nextSlot is left', () => {
      const { result } = renderHook(() => useCompareStore());

      act(() => {
        result.current.selectCandidate(mockCandidate1);
        result.current.selectCandidate(mockCandidate2);
        // Now nextSlotToReplace should be 'left'
        result.current.selectCandidate(mockCandidate3);
      });

      expect(result.current.leftCandidate).toEqual(mockCandidate3);
      expect(result.current.rightCandidate).toEqual(mockCandidate2);
    });

    it('should replace right candidate when both slots filled and nextSlot is right', () => {
      const { result } = renderHook(() => useCompareStore());

      act(() => {
        result.current.selectCandidate(mockCandidate1);
        // nextSlot is now 'right'
        result.current.selectCandidate(mockCandidate2);
        // nextSlot is now 'left'
        result.current.selectCandidate(mockCandidate3);
        // replaced left, nextSlot is now 'right'
        const mockCandidate4: CandidateBase = { ...mockCandidate1, id: 'test-4', nombre: 'Test 4' };
        result.current.selectCandidate(mockCandidate4);
      });

      expect(result.current.leftCandidate).toEqual(mockCandidate3);
      expect(result.current.rightCandidate?.id).toBe('test-4');
    });

    it('should fill left slot when only right is filled', () => {
      const { result } = renderHook(() => useCompareStore());

      act(() => {
        result.current.setRightCandidate(mockCandidate2);
        result.current.selectCandidate(mockCandidate1);
      });

      expect(result.current.leftCandidate).toEqual(mockCandidate1);
      expect(result.current.rightCandidate).toEqual(mockCandidate2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid selections correctly', () => {
      const { result } = renderHook(() => useCompareStore());

      act(() => {
        result.current.selectCandidate(mockCandidate1); // Left: C1, Right: null
        result.current.selectCandidate(mockCandidate2); // Left: C1, Right: C2
        result.current.selectCandidate(mockCandidate3); // Left: C3, Right: C2 (replaces left)
        result.current.selectCandidate(mockCandidate1); // Left: C3, Right: C1 (replaces right)
        result.current.selectCandidate(mockCandidate2); // Left: C2, Right: C1 (replaces left)
      });

      // After all selections, should have mockCandidate2 on left, mockCandidate1 on right
      expect(result.current.leftCandidate).toEqual(mockCandidate2);
      expect(result.current.rightCandidate).toEqual(mockCandidate1);
    });

    it('should maintain state consistency across multiple operations', () => {
      const { result } = renderHook(() => useCompareStore());

      act(() => {
        result.current.selectCandidate(mockCandidate1);
      });
      expect(result.current.nextSlotToReplace).toBe('right');

      act(() => {
        result.current.selectCandidate(mockCandidate2);
      });
      expect(result.current.nextSlotToReplace).toBe('left');

      act(() => {
        result.current.selectCandidate(mockCandidate1); // Toggle off
      });
      expect(result.current.nextSlotToReplace).toBe('left');
    });
  });
});
