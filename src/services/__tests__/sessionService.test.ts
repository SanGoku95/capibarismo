import { describe, it, expect, beforeEach } from 'vitest';
import { createSessionService } from '../sessionService';
import { createMockStorage } from '../browserStorage';

describe('SessionService', () => {
  let localStorage: ReturnType<typeof createMockStorage>;
  let sessionStorage: ReturnType<typeof createMockStorage>;
  let service: ReturnType<typeof createSessionService>;

  beforeEach(() => {
    localStorage = createMockStorage();
    sessionStorage = createMockStorage();
    service = createSessionService(localStorage, sessionStorage);
  });

  describe('Session ID Management', () => {
    it('should generate a session ID on first access', () => {
      const sessionId = service.getSessionId();

      expect(sessionId).toBeTruthy();
      expect(typeof sessionId).toBe('string');
      expect(sessionId.length).toBeGreaterThan(0);
    });

    it('should return the same session ID on multiple calls', () => {
      const sessionId1 = service.getSessionId();
      const sessionId2 = service.getSessionId();
      const sessionId3 = service.getSessionId();

      expect(sessionId1).toBe(sessionId2);
      expect(sessionId2).toBe(sessionId3);
    });

    it('should persist session ID in localStorage', () => {
      const sessionId = service.getSessionId();
      const storedId = localStorage.getItem('ranking-game-session-id');

      expect(storedId).toBe(sessionId);
    });

    it('should load existing session ID from localStorage', () => {
      // Manually set a session ID
      localStorage.setItem('ranking-game-session-id', 'existing-session-123');

      // Create new service instance
      const newService = createSessionService(localStorage, sessionStorage);
      const sessionId = newService.getSessionId();

      expect(sessionId).toBe('existing-session-123');
    });

    it('should generate a new session ID on reset', () => {
      const oldSessionId = service.getSessionId();
      const newSessionId = service.resetSession();

      expect(newSessionId).toBeTruthy();
      expect(newSessionId).not.toBe(oldSessionId);
      expect(service.getSessionId()).toBe(newSessionId);
    });

    it('should clean up old session data on reset', () => {
      // Set up some data for the old session
      service.incrementVoteCount();
      service.addSeenPair('candidate1-candidate2');
      service.markCompletionAsShown();

      const oldSessionId = service.getSessionId();

      // Reset session
      service.resetSession();

      // Old data should be cleared
      expect(localStorage.getItem(`local-vote-count-${oldSessionId}`)).toBeNull();
      expect(localStorage.getItem(`ranking-game-seen-pairs:${oldSessionId}`)).toBeNull();
      expect(sessionStorage.getItem(`completion-shown-${oldSessionId}`)).toBeNull();
    });
  });

  describe('Vote Count Management', () => {
    it('should return 0 for initial vote count', () => {
      const count = service.getVoteCount();
      expect(count).toBe(0);
    });

    it('should increment vote count', () => {
      const count1 = service.incrementVoteCount();
      expect(count1).toBe(1);

      const count2 = service.incrementVoteCount();
      expect(count2).toBe(2);

      const count3 = service.incrementVoteCount();
      expect(count3).toBe(3);
    });

    it('should persist vote count in localStorage', () => {
      service.incrementVoteCount();
      service.incrementVoteCount();

      const sessionId = service.getSessionId();
      const stored = localStorage.getItem(`local-vote-count-${sessionId}`);

      expect(stored).toBe('2');
    });

    it('should decrement vote count', () => {
      service.incrementVoteCount();
      service.incrementVoteCount();
      service.incrementVoteCount(); // count = 3

      const count1 = service.decrementVoteCount();
      expect(count1).toBe(2);

      const count2 = service.decrementVoteCount();
      expect(count2).toBe(1);
    });

    it('should not decrement below 0', () => {
      const count = service.decrementVoteCount();
      expect(count).toBe(0);

      const count2 = service.decrementVoteCount();
      expect(count2).toBe(0);
    });

    it('should reset vote count to 0', () => {
      service.incrementVoteCount();
      service.incrementVoteCount();
      service.incrementVoteCount();

      service.resetVoteCount();

      expect(service.getVoteCount()).toBe(0);
    });

    it('should handle invalid stored vote count', () => {
      const sessionId = service.getSessionId();
      localStorage.setItem(`local-vote-count-${sessionId}`, 'invalid');

      const count = service.getVoteCount();
      expect(count).toBe(0);
    });

    it('should handle non-numeric stored vote count', () => {
      const sessionId = service.getSessionId();
      localStorage.setItem(`local-vote-count-${sessionId}`, 'NaN');

      const count = service.getVoteCount();
      expect(count).toBe(0);
    });
  });

  describe('Seen Pairs Management', () => {
    it('should return empty set for initial seen pairs', () => {
      const seenPairs = service.getSeenPairs();

      expect(seenPairs).toBeInstanceOf(Set);
      expect(seenPairs.size).toBe(0);
    });

    it('should add seen pair', () => {
      service.addSeenPair('candidate1-candidate2');

      const seenPairs = service.getSeenPairs();
      expect(seenPairs.has('candidate1-candidate2')).toBe(true);
    });

    it('should add multiple seen pairs', () => {
      service.addSeenPair('candidate1-candidate2');
      service.addSeenPair('candidate2-candidate3');
      service.addSeenPair('candidate1-candidate3');

      const seenPairs = service.getSeenPairs();
      expect(seenPairs.size).toBe(3);
      expect(seenPairs.has('candidate1-candidate2')).toBe(true);
      expect(seenPairs.has('candidate2-candidate3')).toBe(true);
      expect(seenPairs.has('candidate1-candidate3')).toBe(true);
    });

    it('should not add duplicate pairs', () => {
      service.addSeenPair('candidate1-candidate2');
      service.addSeenPair('candidate1-candidate2');
      service.addSeenPair('candidate1-candidate2');

      const seenPairs = service.getSeenPairs();
      expect(seenPairs.size).toBe(1);
    });

    it('should persist seen pairs in localStorage', () => {
      service.addSeenPair('candidate1-candidate2');
      service.addSeenPair('candidate2-candidate3');

      const sessionId = service.getSessionId();
      const stored = localStorage.getItem(`ranking-game-seen-pairs:${sessionId}`);

      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed).toEqual(expect.arrayContaining(['candidate1-candidate2', 'candidate2-candidate3']));
    });

    it('should clear seen pairs', () => {
      service.addSeenPair('candidate1-candidate2');
      service.addSeenPair('candidate2-candidate3');

      service.clearSeenPairs();

      const seenPairs = service.getSeenPairs();
      expect(seenPairs.size).toBe(0);
    });

    it('should handle corrupted seen pairs data', () => {
      const sessionId = service.getSessionId();
      localStorage.setItem(`ranking-game-seen-pairs:${sessionId}`, 'invalid json');

      const seenPairs = service.getSeenPairs();
      expect(seenPairs).toBeInstanceOf(Set);
      expect(seenPairs.size).toBe(0);
    });

    it('should handle non-array seen pairs data', () => {
      const sessionId = service.getSessionId();
      localStorage.setItem(`ranking-game-seen-pairs:${sessionId}`, JSON.stringify({ foo: 'bar' }));

      const seenPairs = service.getSeenPairs();
      expect(seenPairs).toBeInstanceOf(Set);
      expect(seenPairs.size).toBe(0);
    });

    it('should filter out non-string values from seen pairs', () => {
      const sessionId = service.getSessionId();
      localStorage.setItem(
        `ranking-game-seen-pairs:${sessionId}`,
        JSON.stringify(['valid-pair', 123, null, 'another-valid', undefined, { foo: 'bar' }])
      );

      const seenPairs = service.getSeenPairs();
      expect(seenPairs.size).toBe(2);
      expect(seenPairs.has('valid-pair')).toBe(true);
      expect(seenPairs.has('another-valid')).toBe(true);
    });
  });

  describe('Completion Status', () => {
    it('should return false for initial completion status', () => {
      const isShown = service.isCompletionShown();
      expect(isShown).toBe(false);
    });

    it('should mark completion as shown', () => {
      service.markCompletionAsShown();

      const isShown = service.isCompletionShown();
      expect(isShown).toBe(true);
    });

    it('should persist completion status in sessionStorage', () => {
      service.markCompletionAsShown();

      const sessionId = service.getSessionId();
      const stored = sessionStorage.getItem(`completion-shown-${sessionId}`);

      // markCompletionAsShown now stores 'preliminary' instead of 'true'
      expect(stored).toBe('preliminary');
    });

    it('should clear completion status', () => {
      service.markCompletionAsShown();
      expect(service.isCompletionShown()).toBe(true);

      service.clearCompletionStatus();
      expect(service.isCompletionShown()).toBe(false);
    });
  });

  describe('Integration Tests', () => {
    it('should maintain separate data for different sessions', () => {
      // Session 1
      const session1Id = service.getSessionId();
      service.incrementVoteCount();
      service.incrementVoteCount();
      service.addSeenPair('pair1-pair2');
      service.markCompletionAsShown();

      // Reset to session 2
      const session2Id = service.resetSession();

      expect(session2Id).not.toBe(session1Id);
      expect(service.getVoteCount()).toBe(0);
      expect(service.getSeenPairs().size).toBe(0);
      expect(service.isCompletionShown()).toBe(false);
    });

    it('should handle rapid increments correctly', () => {
      for (let i = 0; i < 100; i++) {
        service.incrementVoteCount();
      }

      expect(service.getVoteCount()).toBe(100);
    });

    it('should handle rapid pair additions correctly', () => {
      const pairs = Array.from({ length: 50 }, (_, i) => `pair-${i}-${i + 1}`);

      pairs.forEach(pair => service.addSeenPair(pair));

      const seenPairs = service.getSeenPairs();
      expect(seenPairs.size).toBe(50);
    });

    it('should survive service recreation with same storage', () => {
      // Add data with first service
      service.incrementVoteCount();
      service.incrementVoteCount();
      service.addSeenPair('pair1-pair2');
      const originalSessionId = service.getSessionId();

      // Create new service with same storage
      const newService = createSessionService(localStorage, sessionStorage);

      // Data should be preserved
      expect(newService.getSessionId()).toBe(originalSessionId);
      expect(newService.getVoteCount()).toBe(2);
      expect(newService.getSeenPairs().has('pair1-pair2')).toBe(true);
    });
  });
});
