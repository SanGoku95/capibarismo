import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import handler from '../ranking/personal.js';
import * as storage from '../storage.js';
import * as candidatesData from '../candidates-data.js';
import type { VoteRecord } from '../types.js';

// Mock modules
vi.mock('../storage.js');
vi.mock('../candidates-data.js');

describe('Personal Ranking API - Critical Tests', () => {
  let mockReq: Partial<VercelRequest>;
  let mockRes: Partial<VercelResponse>;
  let statusCode: number;
  let responseData: any;
  let headers: Record<string, string>;

  const mockCandidates = [
    { id: 'keiko', nombre: 'Keiko Fujimori', ideologia: 'Derecha Populista' },
    { id: 'rafael', nombre: 'Rafael L. Aliaga', ideologia: 'Derecha Conservadora' },
    { id: 'yonhy', nombre: 'Yonhy Lescano', ideologia: 'Centro Populista' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    statusCode = 200;
    responseData = null;
    headers = {};

    mockReq = {
      method: 'GET',
      query: {},
      headers: {},
    };

    mockRes = {
      status: vi.fn((code: number) => {
        statusCode = code;
        return mockRes as VercelResponse;
      }),
      json: vi.fn((data: any) => {
        responseData = data;
        return mockRes as VercelResponse;
      }),
      end: vi.fn((data?: any) => {
        responseData = data;
        return mockRes as VercelResponse;
      }),
      setHeader: vi.fn((key: string, value: string | string[]) => {
        headers[key] = Array.isArray(value) ? value.join(', ') : value;
        return mockRes as VercelResponse;
      }),
    };

    vi.mocked(candidatesData.listCandidates).mockReturnValue(mockCandidates);
    vi.mocked(storage.getUserHistory).mockResolvedValue([]);
  });

  describe('HTTP Methods', () => {
    it('should handle OPTIONS request (CORS preflight)', async () => {
      mockReq.method = 'OPTIONS';
      mockReq.query = { sessionId: 'test' };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(200);
      expect(mockRes.end).toHaveBeenCalled();
      expect(headers['Access-Control-Allow-Origin']).toBe('*');
    });

    it('should only accept GET requests', async () => {
      mockReq.method = 'GET';
      mockReq.query = { sessionId: 'test-session' };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(200);
    });

    it('should reject POST requests', async () => {
      mockReq.method = 'POST';
      mockReq.query = { sessionId: 'test' };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(405);
      expect(headers['Allow']).toBe('GET, OPTIONS');
    });

    it('should reject PUT requests', async () => {
      mockReq.method = 'PUT';

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(405);
    });

    it('should reject DELETE requests', async () => {
      mockReq.method = 'DELETE';

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(405);
    });
  });

  describe('Request Validation', () => {
    it('should require sessionId parameter', async () => {
      mockReq.query = {};

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(400);
      expect(responseData).toEqual({ error: 'Session ID required' });
    });

    it('should reject empty string sessionId', async () => {
      mockReq.query = { sessionId: '' };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(400);
      expect(responseData).toEqual({ error: 'Session ID required' });
    });

    it('should reject null sessionId', async () => {
      mockReq.query = { sessionId: null as any };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(400);
    });

    it('should reject undefined sessionId', async () => {
      mockReq.query = {};

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(400);
    });

    it('should accept valid sessionId', async () => {
      mockReq.query = { sessionId: 'valid-session-123' };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(200);
      expect(Array.isArray(responseData)).toBe(true);
    });

    it('should reject sessionId as array', async () => {
      mockReq.query = { sessionId: ['first', 'second'] as any };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      // Should reject arrays
      expect(statusCode).toBe(400);
      expect(responseData).toEqual({ error: 'Session ID required' });
    });
  });

  describe('Empty History - Initial Ranking', () => {
    it('should return all candidates with initial ELO rating', async () => {
      mockReq.query = { sessionId: 'empty-history' };
      vi.mocked(storage.getUserHistory).mockResolvedValue([]);

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(200);
      expect(responseData).toHaveLength(3);

      responseData.forEach((entry: any) => {
        expect(entry.rating).toBe(1200); // INITIAL_ELO
        expect(entry.wins).toBe(0);
        expect(entry.losses).toBe(0);
        expect(entry.games).toBe(0);
        expect(entry.winRate).toBe(0);
      });
    });

    it('should rank candidates in order', async () => {
      mockReq.query = { sessionId: 'test' };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(responseData[0].rank).toBe(1);
      expect(responseData[1].rank).toBe(2);
      expect(responseData[2].rank).toBe(3);
    });

    it('should include all candidate metadata', async () => {
      mockReq.query = { sessionId: 'test' };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      responseData.forEach((entry: any) => {
        expect(entry).toHaveProperty('rank');
        expect(entry).toHaveProperty('candidateId');
        expect(entry).toHaveProperty('name');
        expect(entry).toHaveProperty('ideologia');
        expect(entry).toHaveProperty('rating');
        expect(entry).toHaveProperty('score');
        expect(entry).toHaveProperty('wins');
        expect(entry).toHaveProperty('losses');
        expect(entry).toHaveProperty('games');
        expect(entry).toHaveProperty('winRate');
        expect(entry).toHaveProperty('rd');
      });
    });
  });

  describe('Vote History Processing', () => {
    it('should process single vote correctly', async () => {
      mockReq.query = { sessionId: 'single-vote' };

      const votes: VoteRecord[] = [
        { winnerId: 'keiko', loserId: 'rafael', timestamp: 1000 },
      ];
      vi.mocked(storage.getUserHistory).mockResolvedValue(votes);

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(200);

      const keikoRanking = responseData.find((r: any) => r.candidateId === 'keiko');
      const rafaelRanking = responseData.find((r: any) => r.candidateId === 'rafael');

      // Winner should have higher rating
      expect(keikoRanking.rating).toBeGreaterThan(1200);
      expect(rafaelRanking.rating).toBeLessThan(1200);

      // Stats should be updated
      expect(keikoRanking.wins).toBe(1);
      expect(keikoRanking.losses).toBe(0);
      expect(rafaelRanking.wins).toBe(0);
      expect(rafaelRanking.losses).toBe(1);
    });

    it('should process multiple votes in order', async () => {
      mockReq.query = { sessionId: 'multi-vote' };

      const votes: VoteRecord[] = [
        { winnerId: 'keiko', loserId: 'rafael', timestamp: 1000 },
        { winnerId: 'keiko', loserId: 'yonhy', timestamp: 2000 },
        { winnerId: 'rafael', loserId: 'yonhy', timestamp: 3000 },
      ];
      vi.mocked(storage.getUserHistory).mockResolvedValue(votes);

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      const keikoRanking = responseData.find((r: any) => r.candidateId === 'keiko');
      const rafaelRanking = responseData.find((r: any) => r.candidateId === 'rafael');
      const yonhyRanking = responseData.find((r: any) => r.candidateId === 'yonhy');

      // Keiko should be ranked first (2 wins)
      expect(keikoRanking.rank).toBe(1);
      expect(keikoRanking.wins).toBe(2);
      expect(keikoRanking.losses).toBe(0);

      // Rafael should have 1 win, 1 loss
      expect(rafaelRanking.wins).toBe(1);
      expect(rafaelRanking.losses).toBe(1);

      // Yonhy should be last (0 wins, 2 losses)
      expect(yonhyRanking.rank).toBe(3);
      expect(yonhyRanking.wins).toBe(0);
      expect(yonhyRanking.losses).toBe(2);
    });

    it('should calculate win rate correctly', async () => {
      mockReq.query = { sessionId: 'winrate-test' };

      const votes: VoteRecord[] = [
        { winnerId: 'keiko', loserId: 'rafael', timestamp: 1000 },
        { winnerId: 'rafael', loserId: 'keiko', timestamp: 2000 },
        { winnerId: 'keiko', loserId: 'rafael', timestamp: 3000 },
        { winnerId: 'keiko', loserId: 'rafael', timestamp: 4000 },
      ];
      vi.mocked(storage.getUserHistory).mockResolvedValue(votes);

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      const keikoRanking = responseData.find((r: any) => r.candidateId === 'keiko');
      const rafaelRanking = responseData.find((r: any) => r.candidateId === 'rafael');

      // Keiko: 3 wins, 1 loss = 75% win rate
      expect(keikoRanking.winRate).toBe(75);
      expect(keikoRanking.games).toBe(4);

      // Rafael: 1 win, 3 losses = 25% win rate
      expect(rafaelRanking.winRate).toBe(25);
      expect(rafaelRanking.games).toBe(4);
    });

    it('should handle 100% win rate', async () => {
      mockReq.query = { sessionId: 'perfect' };

      const votes: VoteRecord[] = [
        { winnerId: 'keiko', loserId: 'rafael', timestamp: 1000 },
        { winnerId: 'keiko', loserId: 'yonhy', timestamp: 2000 },
      ];
      vi.mocked(storage.getUserHistory).mockResolvedValue(votes);

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      const keikoRanking = responseData.find((r: any) => r.candidateId === 'keiko');
      expect(keikoRanking.winRate).toBe(100);
    });

    it('should handle 0% win rate', async () => {
      mockReq.query = { sessionId: 'zero-wins' };

      const votes: VoteRecord[] = [
        { winnerId: 'keiko', loserId: 'rafael', timestamp: 1000 },
        { winnerId: 'yonhy', loserId: 'rafael', timestamp: 2000 },
      ];
      vi.mocked(storage.getUserHistory).mockResolvedValue(votes);

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      const rafaelRanking = responseData.find((r: any) => r.candidateId === 'rafael');
      expect(rafaelRanking.winRate).toBe(0);
      expect(rafaelRanking.wins).toBe(0);
      expect(rafaelRanking.losses).toBe(2);
    });
  });

  describe('Ranking Calculation', () => {
    it('should sort by rating descending', async () => {
      mockReq.query = { sessionId: 'sort-test' };

      const votes: VoteRecord[] = [
        { winnerId: 'yonhy', loserId: 'keiko', timestamp: 1000 },
        { winnerId: 'yonhy', loserId: 'rafael', timestamp: 2000 },
        { winnerId: 'rafael', loserId: 'keiko', timestamp: 3000 },
      ];
      vi.mocked(storage.getUserHistory).mockResolvedValue(votes);

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      // Verify ratings are in descending order
      for (let i = 0; i < responseData.length - 1; i++) {
        expect(responseData[i].rating).toBeGreaterThanOrEqual(responseData[i + 1].rating);
      }

      // Verify ranks are sequential
      responseData.forEach((entry: any, index: number) => {
        expect(entry.rank).toBe(index + 1);
      });
    });

    it('should round ratings to integers', async () => {
      mockReq.query = { sessionId: 'rounding-test' };

      const votes: VoteRecord[] = [
        { winnerId: 'keiko', loserId: 'rafael', timestamp: 1000 },
      ];
      vi.mocked(storage.getUserHistory).mockResolvedValue(votes);

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      responseData.forEach((entry: any) => {
        expect(Number.isInteger(entry.rating)).toBe(true);
        expect(Number.isInteger(entry.score)).toBe(true);
      });
    });

    it('should set score equal to rating', async () => {
      mockReq.query = { sessionId: 'score-test' };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      responseData.forEach((entry: any) => {
        expect(entry.score).toBe(entry.rating);
      });
    });
  });

  describe('Edge Cases - Unknown Candidates', () => {
    it('should handle votes for unknown candidates gracefully', async () => {
      mockReq.query = { sessionId: 'unknown-candidate' };

      const votes: VoteRecord[] = [
        { winnerId: 'keiko', loserId: 'rafael', timestamp: 1000 },
        { winnerId: 'unknown-person', loserId: 'keiko', timestamp: 2000 },
        { winnerId: 'rafael', loserId: 'another-unknown', timestamp: 3000 },
      ];
      vi.mocked(storage.getUserHistory).mockResolvedValue(votes);

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      // Should not crash and return known candidates
      expect(statusCode).toBe(200);
      expect(responseData).toHaveLength(3);

      // Known candidates should still be ranked
      responseData.forEach((entry: any) => {
        expect(['keiko', 'rafael', 'yonhy']).toContain(entry.candidateId);
      });
    });

    it('should not include unknown candidates in ranking', async () => {
      mockReq.query = { sessionId: 'only-unknowns' };

      const votes: VoteRecord[] = [
        { winnerId: 'fake1', loserId: 'fake2', timestamp: 1000 },
      ];
      vi.mocked(storage.getUserHistory).mockResolvedValue(votes);

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      // Should return all known candidates with initial ratings
      expect(responseData).toHaveLength(3);
      responseData.forEach((entry: any) => {
        expect(entry.games).toBe(0);
        expect(entry.rating).toBe(1200);
      });
    });
  });

  describe('Edge Cases - Data Integrity', () => {
    it('should handle very large vote history', async () => {
      mockReq.query = { sessionId: 'large-history' };

      // Generate 1000 votes
      const votes: VoteRecord[] = Array.from({ length: 1000 }, (_, i) => ({
        winnerId: i % 2 === 0 ? 'keiko' : 'rafael',
        loserId: i % 2 === 0 ? 'rafael' : 'keiko',
        timestamp: 1000 + i,
      }));
      vi.mocked(storage.getUserHistory).mockResolvedValue(votes);

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(200);
      const keikoRanking = responseData.find((r: any) => r.candidateId === 'keiko');
      const rafaelRanking = responseData.find((r: any) => r.candidateId === 'rafael');

      // Both should have 500 games each (alternating wins)
      expect(keikoRanking.games).toBe(1000);
      expect(rafaelRanking.games).toBe(1000);
    });

    it('should handle malformed vote records', async () => {
      mockReq.query = { sessionId: 'malformed' };

      const votes: any[] = [
        { winnerId: 'keiko', loserId: 'rafael', timestamp: 1000 },
        { winnerId: null, loserId: 'rafael', timestamp: 2000 },
        { winnerId: 'yonhy', loserId: undefined, timestamp: 3000 },
      ];
      vi.mocked(storage.getUserHistory).mockResolvedValue(votes);

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      // Should handle gracefully
      expect(statusCode).toBe(200);
    });

    it('should handle empty candidate list', async () => {
      mockReq.query = { sessionId: 'no-candidates' };

      vi.mocked(candidatesData.listCandidates).mockReturnValue([]);

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(200);
      expect(responseData).toEqual([]);
    });

    it('should handle duplicate votes (same timestamp)', async () => {
      mockReq.query = { sessionId: 'duplicates' };

      const votes: VoteRecord[] = [
        { winnerId: 'keiko', loserId: 'rafael', timestamp: 1000 },
        { winnerId: 'keiko', loserId: 'rafael', timestamp: 1000 }, // duplicate
      ];
      vi.mocked(storage.getUserHistory).mockResolvedValue(votes);

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      // Should process both votes
      const keikoRanking = responseData.find((r: any) => r.candidateId === 'keiko');
      expect(keikoRanking.wins).toBe(2);
    });
  });

  describe('Error Handling', () => {
    it('should handle storage errors gracefully', async () => {
      mockReq.query = { sessionId: 'error-test' };

      vi.mocked(storage.getUserHistory).mockRejectedValue(new Error('Storage failure'));

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(500);
      expect(responseData).toEqual({ error: 'Internal server error' });
    });

    it('should handle candidate list errors', async () => {
      mockReq.query = { sessionId: 'test' };

      vi.mocked(candidatesData.listCandidates).mockImplementation(() => {
        throw new Error('Candidate data error');
      });

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(500);
    });

    it('should handle ELO calculation errors', async () => {
      mockReq.query = { sessionId: 'elo-error' };

      // Create votes with extreme values that might cause issues
      const votes: VoteRecord[] = [
        { winnerId: 'keiko', loserId: 'rafael', timestamp: Number.MAX_SAFE_INTEGER },
      ];
      vi.mocked(storage.getUserHistory).mockResolvedValue(votes);

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      // Should not crash
      expect(statusCode).toBe(200);
    });
  });

  describe('CORS Headers', () => {
    it('should set CORS headers on success', async () => {
      mockReq.query = { sessionId: 'test' };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(headers['Access-Control-Allow-Origin']).toBe('*');
      expect(headers['Access-Control-Allow-Methods']).toBe('GET, OPTIONS');
    });

    it('should set CORS headers on error', async () => {
      mockReq.query = {}; // Missing sessionId

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(headers['Access-Control-Allow-Origin']).toBe('*');
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete ranking flow', async () => {
      mockReq.query = { sessionId: 'complete-flow' };

      const votes: VoteRecord[] = [
        { winnerId: 'keiko', loserId: 'rafael', timestamp: 1000 },
        { winnerId: 'rafael', loserId: 'yonhy', timestamp: 2000 },
        { winnerId: 'keiko', loserId: 'yonhy', timestamp: 3000 },
        { winnerId: 'keiko', loserId: 'rafael', timestamp: 4000 },
        { winnerId: 'yonhy', loserId: 'rafael', timestamp: 5000 },
      ];
      vi.mocked(storage.getUserHistory).mockResolvedValue(votes);

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(200);
      expect(responseData).toHaveLength(3);

      // Verify keiko is ranked first (2 wins, 0 losses vs rafael; 2 wins, 0 losses vs yonhy)
      const keikoRanking = responseData.find((r: any) => r.candidateId === 'keiko');
      expect(keikoRanking.rank).toBe(1);
      expect(keikoRanking.wins).toBe(3);
      expect(keikoRanking.losses).toBe(0);

      // Verify total games across all candidates
      const totalGames = responseData.reduce((sum: number, entry: any) => sum + entry.games, 0);
      expect(totalGames).toBe(votes.length * 2); // Each vote counts for 2 games
    });
  });
});
