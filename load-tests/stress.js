/**
 * Scenario 3: Stress Test
 * 
 * Objective: Identify breaking point and failure modes
 * 
 * Test Parameters:
 * - Virtual Users: Start at 1000, increase by 500 every 5 minutes
 * - Duration: Until system degrades or reaches 5000 users
 * - Gradual increase to find limits
 * 
 * Expected Results:
 * - Identify maximum capacity
 * - Understand failure modes (timeouts, rate limits, storage limits)
 * - Document degradation patterns
 * 
 * Usage:
 *   k6 run load-tests/stress.js
 *   k6 run --env BASE_URL=https://staging.capibarismo.com load-tests/stress.js
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
  debug,
  isValidVoteResponse
} from './config.js';

// Custom metrics
const errorRate = new Rate('errors');
const timeoutRate = new Rate('timeouts');
const votesSubmitted = new Counter('votes_submitted');
const responseTime = new Trend('response_time_trend');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 1000 },   // Ramp to 1000 users
    { duration: '3m', target: 1000 },   // Hold at 1000
    { duration: '2m', target: 1500 },   // Increase to 1500
    { duration: '3m', target: 1500 },   // Hold at 1500
    { duration: '2m', target: 2000 },   // Increase to 2000
    { duration: '3m', target: 2000 },   // Hold at 2000
    { duration: '2m', target: 2500 },   // Increase to 2500
    { duration: '3m', target: 2500 },   // Hold at 2500
    { duration: '2m', target: 3000 },   // Increase to 3000 (if system survives)
    { duration: '3m', target: 3000 },   // Hold at 3000
    { duration: '3m', target: 0 },      // Ramp down
  ],
  thresholds: {
    // More lenient thresholds - we expect failures
    'http_req_failed': ['rate<0.05'], // Less than 5% errors
    'errors': ['rate<0.05'],
    'timeouts': ['rate<0.10'], // Up to 10% timeouts acceptable
  },
  summaryTrendStats: baseConfig.summaryTrendStats,
};

/**
 * Setup function
 */
export function setup() {
  console.log('🚀 Starting Stress Test');
  console.log(`📍 Target: ${BASE_URL}`);
  console.log('👥 Virtual Users: 1000 → 1500 → 2000 → 2500 → 3000');
  console.log('⏱️  Duration: ~30 minutes');
  console.log('⚠️  WARNING: This test is designed to stress the system to failure!');
  console.log('💰 COST WARNING: This test may incur significant charges!');
  return { startTime: Date.now() };
}

/**
 * Main test function
 */
export default function () {
  const sessionId = generateSessionId();
  
  // Reduced votes per session to focus on concurrency
  const numVotes = 5 + Math.floor(Math.random() * 3); // 5-7 votes
  
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
        tags: { name: 'vote' },
        timeout: '30s' // Longer timeout for stress test
      }
    );
    
    const duration = Date.now() - startTime;
    responseTime.add(duration);
    votesSubmitted.add(1);
    
    // Track different types of failures
    const isTimeout = voteResponse.error && voteResponse.error.includes('timeout');
    const isError = voteResponse.status !== 200;
    
    if (isTimeout) {
      timeoutRate.add(1);
      debug(`Timeout after ${duration}ms`);
    } else {
      timeoutRate.add(0);
    }
    
    errorRate.add(isError);
    
    // Log performance degradation
    if (duration > 5000) {
      console.log(`⚠️  Slow response: ${duration}ms at ${__VU} VUs`);
    }
    
    check(voteResponse, {
      'vote completed': (r) => r.status === 200,
      'vote under 1s': (r) => r.timings.duration < 1000,
      'vote under 5s': (r) => r.timings.duration < 5000,
    });
    
    // Minimal think time under stress
    sleep(randomSleep(0.2, 1));
  }
  
  // Very short pause between sessions
  sleep(randomSleep(1, 3));
}

/**
 * Teardown function
 */
export function teardown(data) {
  const duration = (Date.now() - data.startTime) / 1000;
  console.log(`\n✅ Stress Test completed in ${duration.toFixed(2)}s`);
  console.log('📊 Review metrics to identify breaking point and failure modes');
}
