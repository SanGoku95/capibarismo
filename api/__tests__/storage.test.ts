import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { saveVote, getUserHistory, resetStorage } from '../storage.js';
import type { VoteRecord } from '../types.js';
import * as blobModule from '@vercel/blob';

// Mock @vercel/blob module
vi.mock('@vercel/blob', () => ({
  put: vi.fn(),
  list: vi.fn(),
}));

describe('Storage Module - Critical Tests', () => {
  const originalEnv = process.env.NODE_ENV;
  const originalToken = process.env.BLOB_READ_WRITE_TOKEN;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset storage singleton between tests
    resetStorage();
    // Reset environment to development by default
    process.env.NODE_ENV = 'development';
    delete process.env.BLOB_READ_WRITE_TOKEN;
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    process.env.BLOB_READ_WRITE_TOKEN = originalToken;
  });

  describe('saveVote', () => {
    describe('Development Environment', () => {
      it('should save vote to in-memory storage in development', async () => {
        const sessionId = 'test-session-1';
        const winnerId = 'candidate-a';
        const loserId = 'candidate-b';

        await saveVote(sessionId, winnerId, loserId);

        // Verify it was saved by retrieving it
        const history = await getUserHistory(sessionId);
        expect(history).toHaveLength(1);
        expect(history[0]).toMatchObject({
          winnerId,
          loserId,
        });
        expect(history[0].timestamp).toBeTypeOf('number');
      });

      it('should accumulate multiple votes in memory', async () => {
        const sessionId = 'test-session-multi';

        await saveVote(sessionId, 'a', 'b');
        await saveVote(sessionId, 'c', 'd');
        await saveVote(sessionId, 'e', 'f');

        const history = await getUserHistory(sessionId);
        expect(history).toHaveLength(3);
        expect(history[0].winnerId).toBe('a');
        expect(history[1].winnerId).toBe('c');
        expect(history[2].winnerId).toBe('e');
      });

      it('should isolate votes by sessionId', async () => {
        await saveVote('session-1', 'a', 'b');
        await saveVote('session-2', 'c', 'd');

        const history1 = await getUserHistory('session-1');
        const history2 = await getUserHistory('session-2');

        expect(history1).toHaveLength(1);
        expect(history2).toHaveLength(1);
        expect(history1[0].winnerId).toBe('a');
        expect(history2[0].winnerId).toBe('c');
      });

      it('should not call Vercel Blob API in development', async () => {
        await saveVote('session', 'a', 'b');

        expect(blobModule.put).not.toHaveBeenCalled();
      });
    });

    describe('Production Environment', () => {
      beforeEach(() => {
        process.env.NODE_ENV = 'production';
        process.env.BLOB_READ_WRITE_TOKEN = 'test-token-123';
      });

      it('should throw error when BLOB_READ_WRITE_TOKEN is missing', async () => {
        delete process.env.BLOB_READ_WRITE_TOKEN;

        await expect(
          saveVote('session', 'a', 'b')
        ).rejects.toThrow('Blob write token is missing');
      });

      it('should call Vercel Blob put with correct parameters', async () => {
        vi.mocked(blobModule.put).mockResolvedValue({} as any);

        const sessionId = 'prod-session';
        const winnerId = 'candidate-x';
        const loserId = 'candidate-y';

        await saveVote(sessionId, winnerId, loserId);

        expect(blobModule.put).toHaveBeenCalledTimes(1);

        const [key, content, options] = vi.mocked(blobModule.put).mock.calls[0];

        // Verify key format
        expect(key).toMatch(/^sessions\/prod-session\/votes\/\d+-[a-z0-9]+\.json$/);

        // Verify content
        const parsedContent = JSON.parse(content as string);
        expect(parsedContent).toMatchObject({
          winnerId,
          loserId,
        });
        expect(parsedContent.timestamp).toBeTypeOf('number');

        // Verify options
        expect(options).toMatchObject({
          access: 'public',
          addRandomSuffix: false,
          contentType: 'application/json',
          token: 'test-token-123',
          cacheControlMaxAge: 0,
        });
      });

      it('should generate unique keys for concurrent votes', async () => {
        vi.mocked(blobModule.put).mockResolvedValue({} as any);

        const sessionId = 'concurrent-session';

        // Save multiple votes concurrently
        await Promise.all([
          saveVote(sessionId, 'a', 'b'),
          saveVote(sessionId, 'c', 'd'),
          saveVote(sessionId, 'e', 'f'),
        ]);

        expect(blobModule.put).toHaveBeenCalledTimes(3);

        // Extract all keys
        const keys = vi.mocked(blobModule.put).mock.calls.map(call => call[0]);

        // Verify all keys are unique
        const uniqueKeys = new Set(keys);
        expect(uniqueKeys.size).toBe(3);

        // Verify all keys follow the pattern
        keys.forEach(key => {
          expect(key).toMatch(/^sessions\/concurrent-session\/votes\/\d+-[a-z0-9]+\.json$/);
        });
      });

      it('should propagate errors from Blob storage', async () => {
        const error = new Error('Network error');
        vi.mocked(blobModule.put).mockRejectedValue(error);

        await expect(
          saveVote('session', 'a', 'b')
        ).rejects.toThrow('Network error');
      });
    });

    describe('Vote Data Integrity', () => {
      it('should preserve timestamp precision', async () => {
        const sessionId = 'timestamp-test-' + Date.now();
        const beforeTimestamp = Date.now();
        await saveVote(sessionId, 'a', 'b');
        const afterTimestamp = Date.now();

        const history = await getUserHistory(sessionId);
        const savedTimestamp = history[0].timestamp;

        expect(savedTimestamp).toBeGreaterThanOrEqual(beforeTimestamp);
        expect(savedTimestamp).toBeLessThanOrEqual(afterTimestamp);
      });

      it('should handle special characters in candidate IDs', async () => {
        const sessionId = 'special-chars-test-' + Date.now();
        const specialIds = [
          'candidate-with-dash',
          'candidate_with_underscore',
          'candidate.with.dots',
          'candidate123',
        ];

        for (const id of specialIds) {
          await saveVote(sessionId, id, 'other');
        }

        const history = await getUserHistory(sessionId);
        expect(history.map(v => v.winnerId)).toEqual(specialIds);
      });
    });
  });

  describe('getUserHistory', () => {
    describe('Development Environment', () => {
      it('should return empty array for new session', async () => {
        const history = await getUserHistory('new-session');
        expect(history).toEqual([]);
      });

      it('should return votes in chronological order', async () => {
        const sessionId = 'ordered-session';

        // Add votes with slight delay to ensure different timestamps
        await saveVote(sessionId, 'first', 'x');
        await new Promise(resolve => setTimeout(resolve, 10));
        await saveVote(sessionId, 'second', 'x');
        await new Promise(resolve => setTimeout(resolve, 10));
        await saveVote(sessionId, 'third', 'x');

        const history = await getUserHistory(sessionId);

        expect(history).toHaveLength(3);
        expect(history[0].winnerId).toBe('first');
        expect(history[1].winnerId).toBe('second');
        expect(history[2].winnerId).toBe('third');

        // Verify timestamps are in order
        expect(history[0].timestamp).toBeLessThan(history[1].timestamp);
        expect(history[1].timestamp).toBeLessThan(history[2].timestamp);
      });

      it('should not call Vercel Blob API in development', async () => {
        await getUserHistory('session');

        expect(blobModule.list).not.toHaveBeenCalled();
      });
    });

    describe('Production Environment', () => {
      beforeEach(() => {
        process.env.NODE_ENV = 'production';
        process.env.BLOB_READ_WRITE_TOKEN = 'test-token-123';
      });

      it('should throw error when BLOB_READ_WRITE_TOKEN is missing', async () => {
        delete process.env.BLOB_READ_WRITE_TOKEN;

        await expect(
          getUserHistory('session')
        ).rejects.toThrow('Blob write token is missing');
      });

      it('should return empty array when no blobs found', async () => {
        vi.mocked(blobModule.list).mockResolvedValue({
          blobs: [],
          cursor: undefined,
          hasMore: false,
        } as any);

        const history = await getUserHistory('session');
        expect(history).toEqual([]);
      });

      it('should fetch and parse vote files correctly', async () => {
        const mockVotes: VoteRecord[] = [
          { winnerId: 'a', loserId: 'b', timestamp: 1000 },
          { winnerId: 'c', loserId: 'd', timestamp: 2000 },
          { winnerId: 'e', loserId: 'f', timestamp: 3000 },
        ];

        vi.mocked(blobModule.list).mockResolvedValue({
          blobs: [
            { url: 'http://example.com/vote1.json', pathname: '', size: 0, uploadedAt: new Date() },
            { url: 'http://example.com/vote2.json', pathname: '', size: 0, uploadedAt: new Date() },
            { url: 'http://example.com/vote3.json', pathname: '', size: 0, uploadedAt: new Date() },
          ],
          cursor: undefined,
          hasMore: false,
        } as any);

        // Mock fetch responses
        global.fetch = vi.fn()
          .mockResolvedValueOnce({
            ok: true,
            json: async () => mockVotes[0],
          } as any)
          .mockResolvedValueOnce({
            ok: true,
            json: async () => mockVotes[1],
          } as any)
          .mockResolvedValueOnce({
            ok: true,
            json: async () => mockVotes[2],
          } as any);

        const history = await getUserHistory('prod-session');

        expect(history).toHaveLength(3);
        expect(history).toEqual(mockVotes);

        // Verify list was called with correct parameters
        expect(blobModule.list).toHaveBeenCalledWith({
          prefix: 'sessions/prod-session/votes/',
          limit: 1000,
          token: 'test-token-123',
        });
      });

      it('should sort votes by timestamp ascending', async () => {
        const unsortedVotes: VoteRecord[] = [
          { winnerId: 'b', loserId: 'x', timestamp: 3000 },
          { winnerId: 'a', loserId: 'x', timestamp: 1000 },
          { winnerId: 'c', loserId: 'x', timestamp: 2000 },
        ];

        vi.mocked(blobModule.list).mockResolvedValue({
          blobs: unsortedVotes.map((_, i) => ({
            url: `http://example.com/vote${i}.json`,
            pathname: '',
            size: 0,
            uploadedAt: new Date(),
          })),
          cursor: undefined,
          hasMore: false,
        } as any);

        global.fetch = vi.fn()
          .mockResolvedValueOnce({ ok: true, json: async () => unsortedVotes[0] } as any)
          .mockResolvedValueOnce({ ok: true, json: async () => unsortedVotes[1] } as any)
          .mockResolvedValueOnce({ ok: true, json: async () => unsortedVotes[2] } as any);

        const history = await getUserHistory('session');

        expect(history).toHaveLength(3);
        expect(history[0].timestamp).toBe(1000);
        expect(history[1].timestamp).toBe(2000);
        expect(history[2].timestamp).toBe(3000);
      });

      it('should filter out failed fetches', async () => {
        vi.mocked(blobModule.list).mockResolvedValue({
          blobs: [
            { url: 'http://example.com/vote1.json', pathname: '', size: 0, uploadedAt: new Date() },
            { url: 'http://example.com/vote2.json', pathname: '', size: 0, uploadedAt: new Date() },
            { url: 'http://example.com/vote3.json', pathname: '', size: 0, uploadedAt: new Date() },
          ],
          cursor: undefined,
          hasMore: false,
        } as any);

        global.fetch = vi.fn()
          .mockResolvedValueOnce({
            ok: true,
            json: async () => ({ winnerId: 'a', loserId: 'b', timestamp: 1000 }),
          } as any)
          .mockResolvedValueOnce({
            ok: false, // Failed fetch
          } as any)
          .mockResolvedValueOnce({
            ok: true,
            json: async () => ({ winnerId: 'c', loserId: 'd', timestamp: 3000 }),
          } as any);

        const history = await getUserHistory('session');

        expect(history).toHaveLength(2);
        expect(history[0].winnerId).toBe('a');
        expect(history[1].winnerId).toBe('c');
      });

      it('should handle fetch exceptions gracefully', async () => {
        vi.mocked(blobModule.list).mockResolvedValue({
          blobs: [
            { url: 'http://example.com/vote1.json', pathname: '', size: 0, uploadedAt: new Date() },
            { url: 'http://example.com/vote2.json', pathname: '', size: 0, uploadedAt: new Date() },
          ],
          cursor: undefined,
          hasMore: false,
        } as any);

        global.fetch = vi.fn()
          .mockResolvedValueOnce({
            ok: true,
            json: async () => ({ winnerId: 'a', loserId: 'b', timestamp: 1000 }),
          } as any)
          .mockRejectedValueOnce(new Error('Network error')); // Exception

        const history = await getUserHistory('session');

        expect(history).toHaveLength(1);
        expect(history[0].winnerId).toBe('a');
      });

      it('should return empty array on list error', async () => {
        vi.mocked(blobModule.list).mockRejectedValue(new Error('Storage error'));

        const history = await getUserHistory('session');
        expect(history).toEqual([]);
      });

      it('should respect the 1000 vote limit', async () => {
        vi.mocked(blobModule.list).mockResolvedValue({
          blobs: [],
          cursor: undefined,
          hasMore: false,
        } as any);

        await getUserHistory('session');

        expect(blobModule.list).toHaveBeenCalledWith(
          expect.objectContaining({
            limit: 1000,
          })
        );
      });
    });

    describe('Edge Cases', () => {
      it('should handle malformed vote data', async () => {
        process.env.NODE_ENV = 'production';
        process.env.BLOB_READ_WRITE_TOKEN = 'test-token';

        vi.mocked(blobModule.list).mockResolvedValue({
          blobs: [
            { url: 'http://example.com/vote1.json', pathname: '', size: 0, uploadedAt: new Date() },
            { url: 'http://example.com/vote2.json', pathname: '', size: 0, uploadedAt: new Date() },
          ],
          cursor: undefined,
          hasMore: false,
        } as any);

        global.fetch = vi.fn()
          .mockResolvedValueOnce({
            ok: true,
            json: async () => ({ winnerId: 'a', loserId: 'b', timestamp: 1000 }),
          } as any)
          .mockResolvedValueOnce({
            ok: true,
            json: async () => { throw new Error('Invalid JSON'); },
          } as any);

        const history = await getUserHistory('session');

        expect(history).toHaveLength(1);
        expect(history[0].winnerId).toBe('a');
      });

      it('should handle empty sessionId gracefully', async () => {
        const history = await getUserHistory('');
        expect(Array.isArray(history)).toBe(true);
      });

      it('should handle very long sessionId', async () => {
        const longSessionId = 'a'.repeat(1000);
        await saveVote(longSessionId, 'x', 'y');
        const history = await getUserHistory(longSessionId);

        expect(history).toHaveLength(1);
      });
    });
  });

  describe('Integration Tests', () => {
    it('should maintain data consistency across save and retrieve', async () => {
      const sessionId = 'integration-test';
      const testVotes = [
        { winner: 'candidate-1', loser: 'candidate-2' },
        { winner: 'candidate-3', loser: 'candidate-1' },
        { winner: 'candidate-2', loser: 'candidate-3' },
      ];

      // Save all votes
      for (const vote of testVotes) {
        await saveVote(sessionId, vote.winner, vote.loser);
      }

      // Retrieve history
      const history = await getUserHistory(sessionId);

      expect(history).toHaveLength(3);

      // Verify all votes are present with correct data
      testVotes.forEach((testVote, index) => {
        expect(history[index].winnerId).toBe(testVote.winner);
        expect(history[index].loserId).toBe(testVote.loser);
      });
    });

    it('should handle rapid sequential saves', async () => {
      const sessionId = 'rapid-test';
      const count = 50;

      // Rapidly save votes
      const savePromises = Array.from({ length: count }, (_, i) =>
        saveVote(sessionId, `winner-${i}`, `loser-${i}`)
      );

      await Promise.all(savePromises);

      const history = await getUserHistory(sessionId);
      expect(history).toHaveLength(count);
    });
  });

  describe('Performance & Scale', () => {
    it('should handle maximum expected votes (1000)', async () => {
      const sessionId = 'max-votes';

      // Save 1000 votes
      const saves = Array.from({ length: 1000 }, (_, i) =>
        saveVote(sessionId, `w${i}`, `l${i}`)
      );

      await Promise.all(saves);

      const history = await getUserHistory(sessionId);
      expect(history.length).toBeLessThanOrEqual(1000);
    });

    it('should complete vote save within reasonable time', async () => {
      const start = Date.now();
      await saveVote('perf-test', 'a', 'b');
      const duration = Date.now() - start;

      // Should complete in less than 100ms in development
      expect(duration).toBeLessThan(100);
    });
  });
});
