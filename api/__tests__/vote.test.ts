import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import handler from '../game/vote.js';
import * as storage from '../storage.js';

// Mock storage module
vi.mock('../storage.js', () => ({
  saveVote: vi.fn(),
}));

describe('Vote API Endpoint - Critical Tests', () => {
  let mockReq: Partial<VercelRequest>;
  let mockRes: Partial<VercelResponse>;
  let statusCode: number;
  let responseData: any;
  let headers: Record<string, string>;

  beforeEach(() => {
    vi.clearAllMocks();
    statusCode = 200;
    responseData = null;
    headers = {};

    mockReq = {
      method: 'POST',
      body: {},
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
      }),
    };

    vi.mocked(storage.saveVote).mockResolvedValue(undefined);
  });

  describe('HTTP Methods', () => {
    it('should handle OPTIONS request (CORS preflight)', async () => {
      mockReq.method = 'OPTIONS';

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(200);
      expect(mockRes.end).toHaveBeenCalled();
      expect(headers['Access-Control-Allow-Origin']).toBe('*');
      expect(headers['Access-Control-Allow-Methods']).toBe('POST, OPTIONS');
      expect(headers['Access-Control-Allow-Headers']).toBe('Content-Type');
    });

    it('should reject GET requests', async () => {
      mockReq.method = 'GET';

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(405);
      expect(headers['Allow']).toBe('POST, OPTIONS');
      expect(mockRes.end).toHaveBeenCalledWith('Method GET Not Allowed');
    });

    it('should reject PUT requests', async () => {
      mockReq.method = 'PUT';

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(405);
      expect(headers['Allow']).toBe('POST, OPTIONS');
    });

    it('should reject DELETE requests', async () => {
      mockReq.method = 'DELETE';

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(405);
    });

    it('should only accept POST for vote submission', async () => {
      mockReq.method = 'POST';
      mockReq.body = {
        sessionId: 'test-session',
        aId: 'candidate-a',
        bId: 'candidate-b',
        outcome: 'A',
      };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(200);
      expect(responseData).toEqual({ ok: true });
    });
  });

  describe('CORS Headers', () => {
    it('should set CORS headers on successful request', async () => {
      mockReq.body = {
        sessionId: 'test',
        aId: 'a',
        bId: 'b',
        outcome: 'A',
      };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(headers['Access-Control-Allow-Origin']).toBe('*');
      expect(headers['Access-Control-Allow-Methods']).toBe('POST, OPTIONS');
      expect(headers['Access-Control-Allow-Headers']).toBe('Content-Type');
    });

    it('should set CORS headers on error responses', async () => {
      mockReq.body = {}; // Invalid body

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(headers['Access-Control-Allow-Origin']).toBe('*');
    });
  });

  describe('Request Validation', () => {
    it('should reject request without sessionId', async () => {
      mockReq.body = {
        aId: 'candidate-a',
        bId: 'candidate-b',
        outcome: 'A',
      };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(400);
      expect(responseData).toEqual({ error: 'Invalid vote data' });
      expect(storage.saveVote).not.toHaveBeenCalled();
    });

    it('should reject request without aId', async () => {
      mockReq.body = {
        sessionId: 'test-session',
        bId: 'candidate-b',
        outcome: 'A',
      };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(400);
      expect(responseData).toEqual({ error: 'Invalid vote data' });
    });

    it('should reject request without bId', async () => {
      mockReq.body = {
        sessionId: 'test-session',
        aId: 'candidate-a',
        outcome: 'A',
      };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(400);
      expect(responseData).toEqual({ error: 'Invalid vote data' });
    });

    it('should reject request without outcome', async () => {
      mockReq.body = {
        sessionId: 'test-session',
        aId: 'candidate-a',
        bId: 'candidate-b',
      };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(400);
      expect(responseData).toEqual({ error: 'Invalid vote data' });
    });

    it('should reject request with invalid outcome value', async () => {
      mockReq.body = {
        sessionId: 'test-session',
        aId: 'candidate-a',
        bId: 'candidate-b',
        outcome: 'C', // Invalid
      };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(400);
      expect(responseData).toEqual({ error: 'Invalid vote data' });
    });

    it('should reject request with outcome as number', async () => {
      mockReq.body = {
        sessionId: 'test-session',
        aId: 'candidate-a',
        bId: 'candidate-b',
        outcome: 1,
      };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(400);
    });

    it('should accept empty string sessionId (edge case)', async () => {
      mockReq.body = {
        sessionId: '',
        aId: 'a',
        bId: 'b',
        outcome: 'A',
      };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      // Empty string is falsy, should be rejected
      expect(statusCode).toBe(400);
    });

    it('should reject null values', async () => {
      mockReq.body = {
        sessionId: null,
        aId: 'a',
        bId: 'b',
        outcome: 'A',
      };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(400);
    });

    it('should reject undefined values in body', async () => {
      mockReq.body = {
        sessionId: undefined,
        aId: 'a',
        bId: 'b',
        outcome: 'A',
      };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(400);
    });
  });

  describe('Vote Processing - Outcome A', () => {
    it('should save vote correctly when A wins', async () => {
      mockReq.body = {
        sessionId: 'session-123',
        aId: 'candidate-a',
        bId: 'candidate-b',
        outcome: 'A',
      };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(200);
      expect(responseData).toEqual({ ok: true });
      expect(storage.saveVote).toHaveBeenCalledWith(
        'session-123',
        'candidate-a', // winner
        'candidate-b'  // loser
      );
    });

    it('should handle special characters in candidate IDs', async () => {
      mockReq.body = {
        sessionId: 'test-session',
        aId: 'candidate-with-dash',
        bId: 'candidate_with_underscore',
        outcome: 'A',
      };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(storage.saveVote).toHaveBeenCalledWith(
        'test-session',
        'candidate-with-dash',
        'candidate_with_underscore'
      );
    });

    it('should handle numeric-looking string IDs', async () => {
      mockReq.body = {
        sessionId: 'test',
        aId: '123',
        bId: '456',
        outcome: 'A',
      };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(storage.saveVote).toHaveBeenCalledWith('test', '123', '456');
    });
  });

  describe('Vote Processing - Outcome B', () => {
    it('should save vote correctly when B wins', async () => {
      mockReq.body = {
        sessionId: 'session-456',
        aId: 'candidate-a',
        bId: 'candidate-b',
        outcome: 'B',
      };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(200);
      expect(responseData).toEqual({ ok: true });
      expect(storage.saveVote).toHaveBeenCalledWith(
        'session-456',
        'candidate-b', // winner (B won)
        'candidate-a'  // loser
      );
    });

    it('should correctly swap winner and loser for B outcome', async () => {
      mockReq.body = {
        sessionId: 'swap-test',
        aId: 'first',
        bId: 'second',
        outcome: 'B',
      };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      const [sessionId, winnerId, loserId] = vi.mocked(storage.saveVote).mock.calls[0];

      expect(sessionId).toBe('swap-test');
      expect(winnerId).toBe('second'); // B won
      expect(loserId).toBe('first');
    });
  });

  describe('Fire-and-Forget Behavior', () => {
    it('should return immediately without waiting for saveVote', async () => {
      let saveVoteResolved = false;
      vi.mocked(storage.saveVote).mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        saveVoteResolved = true;
      });

      mockReq.body = {
        sessionId: 'test',
        aId: 'a',
        bId: 'b',
        outcome: 'A',
      };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      // Should return immediately
      expect(statusCode).toBe(200);
      expect(responseData).toEqual({ ok: true });

      // saveVote should not have completed yet
      expect(saveVoteResolved).toBe(false);
    });

    it('should call saveVote asynchronously', async () => {
      mockReq.body = {
        sessionId: 'async-test',
        aId: 'a',
        bId: 'b',
        outcome: 'A',
      };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      // Wait a bit for async operation
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(storage.saveVote).toHaveBeenCalled();
    });

    it('should not propagate saveVote errors to response', async () => {
      vi.mocked(storage.saveVote).mockRejectedValue(new Error('Storage error'));

      mockReq.body = {
        sessionId: 'error-test',
        aId: 'a',
        bId: 'b',
        outcome: 'A',
      };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      // Should still return success immediately
      expect(statusCode).toBe(200);
      expect(responseData).toEqual({ ok: true });
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON body', async () => {
      mockReq.body = 'not-an-object';

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(400);
    });

    it('should handle null body', async () => {
      mockReq.body = null;

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(400);
    });

    it('should handle undefined body', async () => {
      mockReq.body = undefined;

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(400);
    });

    it('should handle request with extra fields gracefully', async () => {
      mockReq.body = {
        sessionId: 'test',
        aId: 'a',
        bId: 'b',
        outcome: 'A',
        extraField: 'should-be-ignored',
        maliciousScript: '<script>alert("xss")</script>',
      };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(200);
      expect(storage.saveVote).toHaveBeenCalledWith('test', 'a', 'b');
    });

    it('should handle very long sessionId', async () => {
      const longSessionId = 'a'.repeat(10000);
      mockReq.body = {
        sessionId: longSessionId,
        aId: 'a',
        bId: 'b',
        outcome: 'A',
      };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(200);
      expect(storage.saveVote).toHaveBeenCalledWith(longSessionId, 'a', 'b');
    });

    it('should handle very long candidate IDs', async () => {
      const longId = 'x'.repeat(5000);
      mockReq.body = {
        sessionId: 'test',
        aId: longId,
        bId: 'b',
        outcome: 'A',
      };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(200);
    });

    it('should handle Unicode characters in IDs', async () => {
      mockReq.body = {
        sessionId: 'test-🎮',
        aId: '候選者-A',
        bId: 'candidate-Ñ',
        outcome: 'A',
      };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(200);
      expect(storage.saveVote).toHaveBeenCalledWith('test-🎮', '候選者-A', 'candidate-Ñ');
    });
  });

  describe('Edge Cases', () => {
    it('should handle same candidate for both aId and bId', async () => {
      mockReq.body = {
        sessionId: 'test',
        aId: 'candidate-x',
        bId: 'candidate-x',
        outcome: 'A',
      };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      // Should accept even though it's logically invalid
      expect(statusCode).toBe(200);
      expect(storage.saveVote).toHaveBeenCalledWith('test', 'candidate-x', 'candidate-x');
    });

    it('should handle whitespace-only strings', async () => {
      mockReq.body = {
        sessionId: '   ',
        aId: 'a',
        bId: 'b',
        outcome: 'A',
      };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      // Whitespace-only is truthy in JS, so it passes
      expect(statusCode).toBe(200);
    });

    it('should handle outcome case sensitivity', async () => {
      mockReq.body = {
        sessionId: 'test',
        aId: 'a',
        bId: 'b',
        outcome: 'a', // lowercase
      };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      // Should reject - must be uppercase 'A' or 'B'
      expect(statusCode).toBe(400);
    });

    it('should handle numeric sessionId', async () => {
      mockReq.body = {
        sessionId: 123456,
        aId: 'a',
        bId: 'b',
        outcome: 'A',
      };

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      // Numbers are truthy
      expect(statusCode).toBe(200);
    });

    it('should handle array as body', async () => {
      mockReq.body = ['invalid', 'array'];

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(400);
    });
  });

  describe('Concurrent Requests', () => {
    it('should handle multiple concurrent votes from same session', async () => {
      const votes = [
        { sessionId: 'concurrent-test', aId: 'a', bId: 'b', outcome: 'A' },
        { sessionId: 'concurrent-test', aId: 'c', bId: 'd', outcome: 'B' },
        { sessionId: 'concurrent-test', aId: 'e', bId: 'f', outcome: 'A' },
      ];

      const requests = votes.map(body => {
        const req = { ...mockReq, body };
        const res = {
          status: vi.fn(() => res),
          json: vi.fn(() => res),
          setHeader: vi.fn(),
          end: vi.fn(),
        };
        return handler(req as VercelRequest, res as any);
      });

      await Promise.all(requests);

      expect(storage.saveVote).toHaveBeenCalledTimes(3);
    });

    it('should handle votes from different sessions concurrently', async () => {
      const votes = [
        { sessionId: 'session-1', aId: 'a', bId: 'b', outcome: 'A' },
        { sessionId: 'session-2', aId: 'c', bId: 'd', outcome: 'B' },
        { sessionId: 'session-3', aId: 'e', bId: 'f', outcome: 'A' },
      ];

      const requests = votes.map(body => {
        const req = { ...mockReq, body };
        const res = {
          status: vi.fn(() => res),
          json: vi.fn(() => res),
          setHeader: vi.fn(),
          end: vi.fn(),
        };
        return handler(req as VercelRequest, res as any);
      });

      await Promise.all(requests);

      expect(storage.saveVote).toHaveBeenCalledTimes(3);
    });
  });

  describe('Integration Scenarios', () => {
    it('should process complete valid vote workflow', async () => {
      const voteData = {
        sessionId: 'user-12345-session',
        aId: 'keiko',
        bId: 'rafael',
        outcome: 'A' as const,
      };

      mockReq.body = voteData;

      await handler(mockReq as VercelRequest, mockRes as VercelResponse);

      expect(statusCode).toBe(200);
      expect(responseData).toEqual({ ok: true });
      expect(storage.saveVote).toHaveBeenCalledWith(
        voteData.sessionId,
        'keiko',  // A won
        'rafael'
      );
      expect(headers['Access-Control-Allow-Origin']).toBe('*');
    });

    it('should handle rapid sequential votes', async () => {
      const sessionId = 'rapid-fire-test';

      for (let i = 0; i < 10; i++) {
        mockReq.body = {
          sessionId,
          aId: `candidate-${i}`,
          bId: `candidate-${i + 1}`,
          outcome: i % 2 === 0 ? 'A' : 'B',
        };

        await handler(mockReq as VercelRequest, mockRes as VercelResponse);
      }

      expect(storage.saveVote).toHaveBeenCalledTimes(10);
    });
  });
});
