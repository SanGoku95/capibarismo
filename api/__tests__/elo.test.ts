import { describe, it, expect } from 'vitest';
import { calculateExpected, updateElo, ELO_K, INITIAL_ELO } from '../elo';

describe('ELO Rating System', () => {
  describe('Constants', () => {
    it('should have correct ELO_K factor', () => {
      expect(ELO_K).toBe(32);
    });

    it('should have correct INITIAL_ELO rating', () => {
      expect(INITIAL_ELO).toBe(1200);
    });
  });

  describe('calculateExpected()', () => {
    it('should return 0.5 for equal ratings', () => {
      const result = calculateExpected(1200, 1200);
      expect(result).toBeCloseTo(0.5, 5);
    });

    it('should return higher probability for higher-rated player', () => {
      const result = calculateExpected(1400, 1200);
      expect(result).toBeGreaterThan(0.5);
      expect(result).toBeCloseTo(0.76, 2);
    });

    it('should return lower probability for lower-rated player', () => {
      const result = calculateExpected(1200, 1400);
      expect(result).toBeLessThan(0.5);
      expect(result).toBeCloseTo(0.24, 2);
    });

    it('should handle large rating differences', () => {
      const result = calculateExpected(2000, 1000);
      expect(result).toBeGreaterThan(0.99); // Almost certain to win
    });

    it('should be symmetric (probabilities sum to 1)', () => {
      const ratingA = 1350;
      const ratingB = 1250;
      const expectedA = calculateExpected(ratingA, ratingB);
      const expectedB = calculateExpected(ratingB, ratingA);

      expect(expectedA + expectedB).toBeCloseTo(1, 5);
    });

    it('should handle identical ratings with different values', () => {
      expect(calculateExpected(1500, 1500)).toBeCloseTo(0.5, 5);
      expect(calculateExpected(1000, 1000)).toBeCloseTo(0.5, 5);
      expect(calculateExpected(2000, 2000)).toBeCloseTo(0.5, 5);
    });
  });

  describe('updateElo()', () => {
    it('should increase winner rating and decrease loser rating', () => {
      const [newA, newB] = updateElo(1200, 1200, true);

      expect(newA).toBeGreaterThan(1200); // Winner gains points
      expect(newB).toBeLessThan(1200); // Loser loses points
    });

    it('should update ratings correctly for equal players (A wins)', () => {
      const [newA, newB] = updateElo(1200, 1200, true);

      expect(newA).toBeCloseTo(1216, 0); // Gains 16 points (32 * 0.5)
      expect(newB).toBeCloseTo(1184, 0); // Loses 16 points
    });

    it('should update ratings correctly for equal players (B wins)', () => {
      const [newA, newB] = updateElo(1200, 1200, false);

      expect(newA).toBeCloseTo(1184, 0); // Loses 16 points
      expect(newB).toBeCloseTo(1216, 0); // Gains 16 points
    });

    it('should give small gain to favorite who wins', () => {
      const [newA, newB] = updateElo(1400, 1200, true);

      // High-rated player wins as expected, small gain
      expect(newA - 1400).toBeLessThan(16); // Less than 16 points gain
      expect(newA - 1400).toBeGreaterThan(0);
    });

    it('should give large gain to underdog who wins', () => {
      const [newA, newB] = updateElo(1200, 1400, true);

      // Low-rated player wins unexpectedly, large gain
      expect(newA - 1200).toBeGreaterThan(16); // More than 16 points gain
      expect(newA).toBeCloseTo(1224, 0);
    });

    it('should give large loss to favorite who loses', () => {
      const [newA, newB] = updateElo(1400, 1200, false);

      // High-rated player loses unexpectedly, large loss
      expect(1400 - newA).toBeGreaterThan(16); // More than 16 points loss
      expect(newA).toBeCloseTo(1376, 0);
    });

    it('should conserve total rating points', () => {
      const ratingA = 1350;
      const ratingB = 1250;
      const totalBefore = ratingA + ratingB;

      const [newA, newB] = updateElo(ratingA, ratingB, true);
      const totalAfter = newA + newB;

      // Total rating should remain constant (zero-sum)
      expect(totalAfter).toBeCloseTo(totalBefore, 5);
    });

    it('should handle multiple updates in sequence', () => {
      let ratingA = INITIAL_ELO;
      let ratingB = INITIAL_ELO;

      // A wins 3 times
      [ratingA, ratingB] = updateElo(ratingA, ratingB, true);
      [ratingA, ratingB] = updateElo(ratingA, ratingB, true);
      [ratingA, ratingB] = updateElo(ratingA, ratingB, true);

      expect(ratingA).toBeGreaterThan(INITIAL_ELO);
      expect(ratingB).toBeLessThan(INITIAL_ELO);
    });

    it('should handle extreme rating differences', () => {
      const [newA, newB] = updateElo(2000, 1000, true);

      // High-rated player beating low-rated player gains minimal points
      expect(newA - 2000).toBeLessThan(2);
      expect(newA - 2000).toBeGreaterThan(0);
    });

    it('should handle extreme rating differences (upset)', () => {
      const [newA, newB] = updateElo(1000, 2000, true);

      // Low-rated player beating high-rated player gains many points
      expect(newA - 1000).toBeGreaterThan(30);
      expect(newA).toBeCloseTo(1031.9, 1); // More precise expectation
    });

    it('should produce deterministic results', () => {
      const [newA1, newB1] = updateElo(1200, 1300, true);
      const [newA2, newB2] = updateElo(1200, 1300, true);

      expect(newA1).toBe(newA2);
      expect(newB1).toBe(newB2);
    });

    it('should handle fractional ratings correctly', () => {
      const [newA, newB] = updateElo(1234.56, 1345.67, true);

      expect(newA).toBeGreaterThan(1234.56);
      expect(newB).toBeLessThan(1345.67);
      expect(typeof newA).toBe('number');
      expect(typeof newB).toBe('number');
    });
  });

  describe('ELO System Properties', () => {
    it('should be zero-sum (total rating points conserved)', () => {
      const scenarios = [
        { a: 1200, b: 1200, aWon: true },
        { a: 1500, b: 1000, aWon: false },
        { a: 800, b: 1600, aWon: true },
        { a: 2000, b: 2000, aWon: false },
      ];

      scenarios.forEach(({ a, b, aWon }) => {
        const totalBefore = a + b;
        const [newA, newB] = updateElo(a, b, aWon);
        const totalAfter = newA + newB;

        expect(totalAfter).toBeCloseTo(totalBefore, 10);
      });
    });

    it('should satisfy transitivity over time', () => {
      // If A > B and B > C, then A > C should emerge over multiple matches
      let [a, b, c] = [INITIAL_ELO, INITIAL_ELO, INITIAL_ELO];

      // A beats B multiple times
      for (let i = 0; i < 5; i++) {
        [a, b] = updateElo(a, b, true);
      }

      // B beats C multiple times
      for (let i = 0; i < 5; i++) {
        [b, c] = updateElo(b, c, true);
      }

      expect(a).toBeGreaterThan(b);
      expect(b).toBeGreaterThan(c);
      expect(a).toBeGreaterThan(c); // Transitivity
    });
  });
});
