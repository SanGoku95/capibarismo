/**
 * Smoke Test
 * 
 * Objective: Quick sanity check to verify basic functionality
 * 
 * Test Parameters:
 * - Virtual Users: 1-5 concurrent users
 * - Duration: 1 minute
 * - Quick validation before larger tests
 * 
 * Expected Results:
 * - All endpoints respond successfully
 * - No critical errors
 * - Basic functionality works
 * 
 * Usage:
 *   k6 run load-tests/smoke.js
 *   k6 run --env BASE_URL=https://staging.capibarismo.com load-tests/smoke.js
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import {
  BASE_URL,
  generateSessionId,
  getRandomPair,
  getRandomOutcome,
  getRequestOptions,
  isValidVoteResponse,
  isValidRankingResponse
} from './config.js';

// Test configuration
export const options = {
  vus: 5,
  duration: '1m',
  thresholds: {
    checks: ['rate>0.95'], // 95% of checks should pass
    http_req_failed: ['rate<0.01'], // Less than 1% errors
    http_req_duration: ['p(95)<1000'], // 95% under 1s
  },
};

/**
 * Setup function
 */
export function setup() {
  console.log('🔥 Starting Smoke Test');
  console.log(`📍 Target: ${BASE_URL}`);
  console.log('👥 Virtual Users: 5');
  console.log('⏱️  Duration: 1 minute');
  console.log('🎯 Quick functionality check');
  return { startTime: Date.now() };
}

/**
 * Main test function
 */
export default function () {
  const sessionId = generateSessionId();
  
  group('Vote Submission', () => {
    const [candidateA, candidateB] = getRandomPair();
    const outcome = getRandomOutcome();
    
    const votePayload = JSON.stringify({
      sessionId: sessionId,
      aId: candidateA,
      bId: candidateB,
      outcome: outcome
    });
    
    const voteResponse = http.post(
      `${BASE_URL}/api/game/vote`,
      votePayload,
      {
        ...getRequestOptions(sessionId),
        tags: { name: 'vote' }
      }
    );
    
    check(voteResponse, {
      'vote endpoint reachable': (r) => r.status !== 0,
      'vote status is 200': (r) => r.status === 200,
      'vote response is valid JSON': (r) => {
        try {
          JSON.parse(r.body);
          return true;
        } catch {
          return false;
        }
      },
      'vote response contains ok field': (r) => isValidVoteResponse(r),
      'vote completes in reasonable time': (r) => r.timings.duration < 2000,
    });
    
    sleep(1);
  });
  
  group('Personal Ranking', () => {
    const rankingResponse = http.get(
      `${BASE_URL}/api/ranking/personal?sessionId=${sessionId}`,
      {
        ...getRequestOptions(sessionId),
        tags: { name: 'ranking' }
      }
    );
    
    check(rankingResponse, {
      'ranking endpoint reachable': (r) => r.status !== 0,
      'ranking status is 200': (r) => r.status === 200,
      'ranking response is valid JSON array': (r) => {
        try {
          const body = JSON.parse(r.body);
          return Array.isArray(body);
        } catch {
          return false;
        }
      },
      'ranking contains data': (r) => isValidRankingResponse(r),
      'ranking completes in reasonable time': (r) => r.timings.duration < 3000,
    });
  });
  
  sleep(2);
}

/**
 * Teardown function
 */
export function teardown(data) {
  const duration = (Date.now() - data.startTime) / 1000;
  console.log(`\n✅ Smoke Test completed in ${duration.toFixed(2)}s`);
  console.log('✨ If all checks passed, system is ready for larger tests');
}
