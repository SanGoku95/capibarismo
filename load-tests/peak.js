/**
 * Scenario 2: Peak Load Test
 * 
 * Objective: Simulate peak traffic during election events
 * 
 * Test Parameters:
 * - Virtual Users: 500-1000 concurrent users
 * - Duration: 15 minutes
 * - Ramp-up: 3 minutes
 * - Vote rate: ~5 votes/user/minute
 * 
 * Expected Results:
 * - Response time < 500ms for vote submissions (p95)
 * - Response time < 1000ms for ranking calculations (p95)
 * - Error rate < 1%
 * - System remains responsive
 * 
 * Usage:
 *   k6 run load-tests/peak.js
 *   k6 run --env BASE_URL=https://staging.capibarismo.com load-tests/peak.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate } from 'k6/metrics';
import {
  BASE_URL,
  config as baseConfig,
  generateSessionId,
  getRandomPair,
  getRandomOutcome,
  getRequestOptions,
  randomSleep,
  debug,
  isValidVoteResponse,
  isValidRankingResponse
} from './config.js';

// Custom metrics
const voteSuccessRate = new Rate('votes_successful');
const errorRate = new Rate('errors');
const votesSubmitted = new Counter('votes_submitted');

// Test configuration
export const options = {
  stages: [
    { duration: '3m', target: 500 },   // Ramp up to 500 users
    { duration: '5m', target: 800 },   // Increase to 800 users
    { duration: '4m', target: 1000 },  // Peak at 1000 users
    { duration: '3m', target: 0 },     // Ramp down
  ],
  thresholds: {
    ...baseConfig.thresholds,
    // Adjusted thresholds for peak load
    'http_req_failed': ['rate<0.01'], // Less than 1% errors
    'http_req_duration{name:vote}': ['p(95)<500', 'p(99)<800'],
    'http_req_duration{name:ranking}': ['p(95)<1000', 'p(99)<2000'],
    'errors': ['rate<0.01'],
    'votes_successful': ['rate>0.99'],
  },
  summaryTrendStats: baseConfig.summaryTrendStats,
};

/**
 * Setup function
 */
export function setup() {
  console.log('🚀 Starting Peak Load Test');
  console.log(`📍 Target: ${BASE_URL}`);
  console.log('👥 Virtual Users: 500 → 800 → 1000 → 0');
  console.log('⏱️  Duration: 15 minutes');
  console.log('⚠️  WARNING: This test generates significant load!');
  return { startTime: Date.now() };
}

/**
 * Main test function
 */
export default function () {
  const sessionId = generateSessionId();
  
  // Simulate shorter game sessions during peak load
  const numVotes = 8 + Math.floor(Math.random() * 5); // 8-12 votes per session
  
  for (let i = 0; i < numVotes; i++) {
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
        tags: { name: 'vote' },
        timeout: '10s' // Add timeout to prevent hanging
      }
    );
    
    votesSubmitted.add(1);
    
    // Check vote response
    const voteSuccess = check(voteResponse, {
      'vote status is 200': (r) => r.status === 200,
      'vote response is valid': (r) => isValidVoteResponse(r),
    });
    
    voteSuccessRate.add(voteSuccess);
    errorRate.add(!voteSuccess);
    
    if (!voteSuccess) {
      debug(`Vote failed:`, voteResponse.status, voteResponse.error);
    }
    
    // Shorter think time during peak (0.5-2 seconds)
    sleep(randomSleep(0.5, 2));
  }
  
  // Fetch ranking (50% of users)
  if (Math.random() < 0.5) {
    const rankingResponse = http.get(
      `${BASE_URL}/api/ranking/personal?sessionId=${sessionId}`,
      {
        ...getRequestOptions(sessionId),
        tags: { name: 'ranking' },
        timeout: '15s'
      }
    );
    
    const rankingSuccess = check(rankingResponse, {
      'ranking status is 200': (r) => r.status === 200,
      'ranking response is valid': (r) => isValidRankingResponse(r),
    });
    
    errorRate.add(!rankingSuccess);
  }
  
  // Short pause between sessions
  sleep(randomSleep(2, 5));
}

/**
 * Teardown function
 */
export function teardown(data) {
  const duration = (Date.now() - data.startTime) / 1000;
  console.log(`\n✅ Peak Load Test completed in ${duration.toFixed(2)}s`);
}
