/**
 * Scenario 4: Spike Test
 * 
 * Objective: Test system resilience to sudden traffic spikes
 * 
 * Test Parameters:
 * - Virtual Users: 100 baseline → 2000 spike → 100 recovery
 * - Duration: 10 minutes
 * - Spike duration: 2 minutes
 * 
 * Expected Results:
 * - System handles spike gracefully
 * - Auto-scaling responds appropriately
 * - Recovery to baseline performance after spike
 * 
 * Usage:
 *   k6 run load-tests/spike.js
 *   k6 run --env BASE_URL=https://staging.capibarismo.com load-tests/spike.js
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
  isValidVoteResponse
} from './config.js';

// Custom metrics
const errorRate = new Rate('errors');
const spikeErrors = new Rate('spike_errors');
const recoveryErrors = new Rate('recovery_errors');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 100 },    // Baseline: 100 users
    { duration: '30s', target: 2000 },  // Spike: Rapid increase to 2000
    { duration: '2m', target: 2000 },   // Hold spike: 2000 users
    { duration: '30s', target: 100 },   // Drop: Rapid decrease to 100
    { duration: '5m', target: 100 },    // Recovery: Hold at 100
  ],
  thresholds: {
    // System should recover even if spike causes issues
    'http_req_failed': ['rate<0.05'],
    'errors': ['rate<0.05'],
    'recovery_errors': ['rate<0.01'], // Recovery phase should be stable
  },
  summaryTrendStats: baseConfig.summaryTrendStats,
};

/**
 * Setup function
 */
export function setup() {
  console.log('🚀 Starting Spike Test');
  console.log(`📍 Target: ${BASE_URL}`);
  console.log('👥 Virtual Users: 100 → 2000 (spike) → 100 (recovery)');
  console.log('⏱️  Duration: 10 minutes');
  console.log('⚡ Testing sudden traffic spike resilience');
  return { startTime: Date.now(), spikeStart: 0, recoveryStart: 0 };
}

/**
 * Main test function
 */
export default function (data) {
  const sessionId = generateSessionId();
  const currentVUs = __VU;
  
  // Detect if we're in spike phase
  const isSpike = currentVUs > 1000;
  const isRecovery = currentVUs <= 100 && data.spikeStart > 0;
  
  if (isSpike && data.spikeStart === 0) {
    data.spikeStart = Date.now();
    console.log('⚡ SPIKE STARTED');
  }
  
  if (isRecovery && data.recoveryStart === 0) {
    data.recoveryStart = Date.now();
    console.log('🔄 RECOVERY PHASE STARTED');
  }
  
  // Adjust behavior based on phase
  const numVotes = isSpike ? 3 : 8; // Fewer votes during spike
  
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
        tags: { 
          name: 'vote',
          phase: isSpike ? 'spike' : isRecovery ? 'recovery' : 'baseline'
        },
        timeout: '15s'
      }
    );
    
    const isError = voteResponse.status !== 200;
    errorRate.add(isError);
    
    // Track errors by phase
    if (isSpike) {
      spikeErrors.add(isError);
    } else if (isRecovery) {
      recoveryErrors.add(isError);
    }
    
    check(voteResponse, {
      'vote successful': (r) => r.status === 200,
      'response under 2s during spike': (r) => !isSpike || r.timings.duration < 2000,
      'response under 500ms during recovery': (r) => !isRecovery || r.timings.duration < 500,
    });
    
    // Think time varies by phase
    const thinkTime = isSpike ? randomSleep(0.2, 0.5) : randomSleep(1, 2);
    sleep(thinkTime);
  }
  
  sleep(randomSleep(1, 3));
}

/**
 * Teardown function
 */
export function teardown(data) {
  const duration = (Date.now() - data.startTime) / 1000;
  const spikeDuration = data.recoveryStart > 0 ? (data.recoveryStart - data.spikeStart) / 1000 : 0;
  
  console.log(`\n✅ Spike Test completed in ${duration.toFixed(2)}s`);
  if (spikeDuration > 0) {
    console.log(`⚡ Spike lasted ${spikeDuration.toFixed(2)}s`);
  }
  console.log('📊 Review metrics to assess spike resilience and recovery');
}
