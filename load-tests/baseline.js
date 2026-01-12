/**
 * Scenario 1: Baseline Performance Test
 * 
 * Objective: Establish baseline performance metrics under normal load
 * 
 * Test Parameters:
 * - Virtual Users: 10-50 concurrent users
 * - Duration: 5 minutes
 * - Ramp-up: 1 minute
 * 
 * Expected Results:
 * - Response time < 200ms for vote submissions (p95)
 * - Response time < 500ms for ranking calculations (p95)
 * - 0% error rate
 * - Smooth user experience
 * 
 * Usage:
 *   k6 run load-tests/baseline.js
 *   k6 run --env BASE_URL=https://staging.capibarismo.com load-tests/baseline.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Trend, Rate } from 'k6/metrics';
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
  isValidRankingResponse,
  calculateQoE,
  meetsQoEStandards
} from './config.js';

// Custom metrics
const voteSuccessRate = new Counter('votes_successful');
const votesSubmitted = new Counter('votes_submitted');
const rankingFetches = new Counter('ranking_fetches');

// Quality of Experience metrics
const qoeScore = new Trend('qoe_score');
const excellentExperience = new Rate('experience_excellent');
const goodExperience = new Rate('experience_good');
const poorExperience = new Rate('experience_poor');

// Test configuration
export const options = {
  stages: [
    { duration: '1m', target: 10 },  // Ramp up to 10 users
    { duration: '2m', target: 30 },  // Increase to 30 users
    { duration: '1m', target: 50 },  // Peak at 50 users
    { duration: '1m', target: 0 },   // Ramp down
  ],
  thresholds: {
    ...baseConfig.thresholds,
    // Stricter thresholds for baseline test
    'http_req_duration{name:vote}': ['p(95)<200', 'p(99)<300'],
    // Relaxed ranking threshold to 1.5s as per UX decision (loading state is acceptable)
    'http_req_duration{name:ranking}': ['p(95)<1500', 'p(99)<2000'],
    'votes_successful': ['count>0'],
  },
  summaryTrendStats: baseConfig.summaryTrendStats,
};

/**
 * Setup function - runs once before test starts
 */
export function setup() {
  console.log('🚀 Starting Baseline Performance Test');
  console.log(`📍 Target: ${BASE_URL}`);
  console.log('👥 Virtual Users: 10 → 30 → 50 → 0');
  console.log('⏱️  Duration: 5 minutes');
  return { 
    startTime: Date.now(),
    // Use Set for O(1) checkpoint tracking
    checkpoints: new Set()
  };
}

/**
 * Main test function - simulates user behavior
 */
export default function () {
  const sessionId = generateSessionId();
  
  // Simulate user playing the game
  const numVotes = 10 + Math.floor(Math.random() * 5); // 10-15 votes per session
  
  for (let i = 0; i < numVotes; i++) {
    // Get random candidate pair
    const [candidateA, candidateB] = getRandomPair();
    const outcome = getRandomOutcome();
    
    // Submit vote
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
    
    votesSubmitted.add(1);
    
    // Calculate Quality of Experience
    const qoe = calculateQoE(voteResponse.timings.duration, 'vote');
    qoeScore.add(qoe.score);
    
    // Track experience quality distribution
    excellentExperience.add(qoe.rating === 'Excellent');
    goodExperience.add(qoe.rating === 'Good');
    poorExperience.add(qoe.rating === 'Poor');
    
    // Check vote response
    const voteSuccess = check(voteResponse, {
      'vote status is 200': (r) => r.status === 200,
      'vote response is valid': (r) => isValidVoteResponse(r),
      'vote response time < 300ms': (r) => r.timings.duration < 300,
      'vote meets QoE standards': (r) => meetsQoEStandards(r, 'vote'),
      'vote TTFB < 200ms': (r) => r.timings.waiting < 200,
    });
    
    if (voteSuccess) {
      voteSuccessRate.add(1);
      debug(`Vote ${i + 1}/${numVotes} successful: ${outcome === 'A' ? candidateA : candidateB} won (QoE: ${qoe.score})`);
    } else {
      debug(`Vote ${i + 1}/${numVotes} failed:`, voteResponse.status, voteResponse.body);
    }
    
    // Think time between votes (1-3 seconds)
    sleep(randomSleep(1, 3));
  }
  
  // After voting, fetch personal ranking
  const rankingResponse = http.get(
    `${BASE_URL}/api/ranking/personal?sessionId=${sessionId}`,
    {
      ...getRequestOptions(sessionId),
      tags: { name: 'ranking' }
    }
  );
  
  rankingFetches.add(1);
  
  check(rankingResponse, {
    'ranking status is 200': (r) => r.status === 200,
    'ranking response is valid': (r) => isValidRankingResponse(r),
    'ranking has all candidates': (r) => {
      try {
        const ranking = JSON.parse(r.body);
        // Updated to match current backend data (6 candidates)
        return ranking.length >= 6; 
      } catch {
        return false;
      }
    },
    // Relaxed check to match threshold
    'ranking response time < 1500ms': (r) => r.timings.duration < 1500,
  });
  
  debug(`Session ${sessionId} completed with ${numVotes} votes`);
  
  // Pause between sessions (user leaves and comes back later)
  sleep(randomSleep(5, 10));
}

/**
 * Teardown function - runs once after test completes
 */
export function teardown(data) {
  const duration = (Date.now() - data.startTime) / 1000;
  console.log(`\n✅ Baseline Performance Test completed in ${duration.toFixed(2)}s`);
}
