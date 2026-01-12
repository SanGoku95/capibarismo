/**
 * Scenario 5: Endurance Test (Soak Test)
 * 
 * Objective: Verify system stability over extended period
 * 
 * Test Parameters:
 * - Virtual Users: 200 concurrent users
 * - Duration: 2 hours
 * - Consistent load throughout
 * 
 * Expected Results:
 * - No memory leaks in serverless functions
 * - Consistent performance over time
 * - No degradation in response times
 * - Storage system remains performant
 * 
 * Usage:
 *   k6 run load-tests/endurance.js
 *   k6 run --env BASE_URL=https://staging.capibarismo.com load-tests/endurance.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';
import {
  BASE_URL,
  config as baseConfig,
  generateSessionId,
  getRandomPair,
  getRandomOutcome,
  getRequestOptions,
  randomSleep,
  isValidVoteResponse,
  isValidRankingResponse
} from './config.js';

// Custom metrics
const errorRate = new Rate('errors');
const votesSubmitted = new Counter('votes_submitted');
const responseTime = new Trend('response_time_trend');
const memoryLeakIndicator = new Trend('response_time_over_time');

// Test configuration
export const options = {
  stages: [
    { duration: '5m', target: 200 },    // Ramp up
    { duration: '110m', target: 200 },  // Hold for 110 minutes (almost 2 hours)
    { duration: '5m', target: 0 },      // Ramp down
  ],
  thresholds: {
    ...baseConfig.thresholds,
    // Strict thresholds - performance should not degrade
    'http_req_failed': ['rate<0.01'],
    'errors': ['rate<0.01'],
    'http_req_duration{name:vote}': ['p(95)<400', 'p(99)<600'],
    'http_req_duration{name:ranking}': ['p(95)<900', 'p(99)<1500'],
  },
  summaryTrendStats: baseConfig.summaryTrendStats,
};

/**
 * Setup function
 */
export function setup() {
  console.log('🚀 Starting Endurance Test (Soak Test)');
  console.log(`📍 Target: ${BASE_URL}`);
  console.log('👥 Virtual Users: 200 (constant)');
  console.log('⏱️  Duration: 2 hours');
  console.log('🔍 Monitoring for memory leaks and performance degradation');
  console.log('💰 COST WARNING: Long-running test will incur charges!');
  return { 
    startTime: Date.now(),
    // Use Set for O(1) checkpoint tracking
    checkpoints: new Set()
  };
}

/**
 * Main test function
 */
export default function (data) {
  const sessionId = generateSessionId();
  const currentTime = Date.now();
  const elapsedMinutes = Math.floor((currentTime - data.startTime) / 60000);
  
  // Log checkpoint every 15 minutes using Set for O(1) lookup
  if (elapsedMinutes > 0 && elapsedMinutes % 15 === 0) {
    if (!data.checkpoints.has(elapsedMinutes)) {
      data.checkpoints.add(elapsedMinutes);
      console.log(`⏰ Checkpoint: ${elapsedMinutes} minutes elapsed`);
    }
  }
  
  // Simulate realistic user session
  const numVotes = 10 + Math.floor(Math.random() * 5); // 10-15 votes
  
  for (let i = 0; i < numVotes; i++) {
    const [candidateA, candidateB] = getRandomPair();
    const outcome = getRandomOutcome();
    
    const votePayload = JSON.stringify({
      sessionId: sessionId,
      aId: candidateA,
      bId: candidateB,
      outcome: outcome
    });
    
    const startTime = Date.now();
    
    const voteResponse = http.post(
      `${BASE_URL}/api/game/vote`,
      votePayload,
      {
        ...getRequestOptions(sessionId),
        tags: { 
          name: 'vote',
          elapsed_minutes: elapsedMinutes
        },
        timeout: '10s'
      }
    );
    
    const duration = Date.now() - startTime;
    responseTime.add(duration);
    memoryLeakIndicator.add(duration, { elapsed_minutes: elapsedMinutes });
    votesSubmitted.add(1);
    
    const isError = voteResponse.status !== 200;
    errorRate.add(isError);
    
    // Warn if response times are increasing (potential memory leak)
    if (duration > 1000 && elapsedMinutes > 30) {
      console.log(`⚠️  Slow response at ${elapsedMinutes}m: ${duration}ms (potential degradation)`);
    }
    
    check(voteResponse, {
      'vote successful': (r) => r.status === 200,
      'vote response valid': (r) => isValidVoteResponse(r),
      'no performance degradation': (r) => r.timings.duration < 800,
    });
    
    sleep(randomSleep(1, 3));
  }
  
  // Fetch ranking periodically (every other session)
  if (Math.random() < 0.5) {
    const rankingResponse = http.get(
      `${BASE_URL}/api/ranking/personal?sessionId=${sessionId}`,
      {
        ...getRequestOptions(sessionId),
        tags: { 
          name: 'ranking',
          elapsed_minutes: elapsedMinutes
        },
        timeout: '15s'
      }
    );
    
    check(rankingResponse, {
      'ranking successful': (r) => r.status === 200,
      'ranking response valid': (r) => isValidRankingResponse(r),
    });
  }
  
  // Longer pause between sessions for endurance test
  sleep(randomSleep(5, 15));
}

/**
 * Teardown function
 */
export function teardown(data) {
  const duration = (Date.now() - data.startTime) / 1000;
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  
  console.log(`\n✅ Endurance Test completed in ${hours}h ${minutes}m`);
  console.log('📊 Review metrics for performance degradation over time');
  console.log('🔍 Check for memory leaks indicated by increasing response times');
}
