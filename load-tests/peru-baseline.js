/**
 * Peru-Specific Baseline Test
 * 
 * Objective: Test performance with realistic Peruvian network conditions
 * 
 * This test uses Peru-adjusted thresholds that account for:
 * - Average 22ms mobile latency in Peru
 * - 35 Mbps average download speed
 * - Typical urban/suburban/rural distribution
 * 
 * Network Profile: Use NETWORK_PROFILE env var
 * - urban (default): Lima, major cities - 35 Mbps, 22ms latency
 * - suburban: Mid-size cities - 25 Mbps, 30ms latency
 * - rural: Remote areas - 10 Mbps, 60ms latency
 * - congested: Peak hours - 20 Mbps, 45ms latency
 * 
 * Usage:
 *   npm run loadtest:peru
 *   NETWORK_PROFILE=rural npm run loadtest:peru
 *   NETWORK_PROFILE=congested BASE_URL=https://preview.vercel.app npm run loadtest:peru
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Trend, Rate } from 'k6/metrics';
import {
  BASE_URL,
  NETWORK_PROFILE,
  PERU_NETWORK_PROFILES,
  PERU_QOE_THRESHOLDS,
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

// Peru-specific QoE metrics
const peruQoeScore = new Trend('peru_qoe_score');
const peruExcellent = new Rate('peru_experience_excellent');
const peruGood = new Rate('peru_experience_good');
const peruPoor = new Rate('peru_experience_poor');

// Network awareness metrics
const networkLatencyImpact = new Trend('network_latency_impact');

// Get current network profile
const currentProfile = PERU_NETWORK_PROFILES[NETWORK_PROFILE];

// Test configuration - adjusted for Peru
export const options = {
  stages: [
    { duration: '1m', target: 10 },  // Ramp up to 10 users
    { duration: '2m', target: 30 },  // Increase to 30 users
    { duration: '1m', target: 50 },  // Peak at 50 users
    { duration: '1m', target: 0 },   // Ramp down
  ],
  thresholds: {
    // Peru-adjusted thresholds (accounting for network latency)
    http_req_failed: ['rate<0.01'],
    
    // Overall response times (Peru-adjusted)
    http_req_duration: ['p(95)<550', 'p(99)<1100'],
    
    // Vote endpoint (Peru-adjusted: add ~22-60ms for network)
    'http_req_duration{name:vote}': ['p(95)<350', 'p(99)<550'],
    
    // Ranking endpoint (Peru-adjusted)
    'http_req_duration{name:ranking}': ['p(95)<900', 'p(99)<1600'],
    
    // Peru QoE targets
    'peru_qoe_score': ['avg>70'],  // Average Good or better
    'peru_experience_poor': ['rate<0.15'],  // Less than 15% poor experience
    
    // TTFB accounting for Peru latency
    http_req_waiting: ['p(95)<250', 'p(99)<450'],
  },
  summaryTrendStats: ['min', 'avg', 'med', 'p(90)', 'p(95)', 'p(99)', 'max'],
};

/**
 * Setup function
 */
export function setup() {
  console.log('🇵🇪 Starting Peru-Specific Baseline Test');
  console.log(`📍 Target: ${BASE_URL}`);
  console.log(`🌐 Network Profile: ${currentProfile.name}`);
  console.log(`   Download: ${currentProfile.downloadMbps} Mbps`);
  console.log(`   Upload: ${currentProfile.uploadMbps} Mbps`);
  console.log(`   Latency: ${currentProfile.latencyMs} ms`);
  console.log(`   Packet Loss: ${currentProfile.packetLoss}%`);
  console.log(`   Coverage: ${currentProfile.coverage} of Peruvian users`);
  console.log(`   ${currentProfile.description}`);
  console.log('');
  console.log('👥 Virtual Users: 10 → 30 → 50 → 0');
  console.log('⏱️  Duration: 5 minutes');
  console.log('');
  console.log('📊 Peru-Adjusted Performance Targets:');
  console.log(`   Vote p95: <${PERU_QOE_THRESHOLDS.GOOD.vote}ms (accounting for ${currentProfile.latencyMs}ms network latency)`);
  console.log(`   Ranking p95: <${PERU_QOE_THRESHOLDS.GOOD.ranking}ms`);
  console.log(`   QoE Score: >70 (Good or better)`);
  
  return { 
    startTime: Date.now(),
    checkpoints: new Set(),
    profile: currentProfile
  };
}

/**
 * Main test function - simulates Peruvian user behavior
 */
export default function (data) {
  const sessionId = generateSessionId();
  
  // Simulate realistic Peruvian user playing the game
  const numVotes = 10 + Math.floor(Math.random() * 5); // 10-15 votes per session
  
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
          network_profile: NETWORK_PROFILE
        }
      }
    );
    
    votesSubmitted.add(1);
    
    // Calculate Peru-specific QoE (uses Peru thresholds by default)
    const qoe = calculateQoE(voteResponse.timings.duration, 'vote', true);
    peruQoeScore.add(qoe.score);
    
    // Track Peru-specific experience distribution
    peruExcellent.add(qoe.rating === 'Excellent');
    peruGood.add(qoe.rating === 'Good');
    peruPoor.add(qoe.rating === 'Poor');
    
    // Track network latency impact
    // (Actual time - expected server time = network overhead)
    const expectedServerTime = 100; // Typical server processing time
    const networkOverhead = Math.max(0, voteResponse.timings.duration - expectedServerTime);
    networkLatencyImpact.add(networkOverhead);
    
    // Check vote response with Peru-adjusted thresholds
    const voteSuccess = check(voteResponse, {
      'vote status is 200': (r) => r.status === 200,
      'vote response is valid': (r) => isValidVoteResponse(r),
      'vote response time acceptable for Peru': (r) => r.timings.duration < PERU_QOE_THRESHOLDS.GOOD.vote,
      'vote QoE meets Peru standards': (r) => qoe.score >= 70,
      'vote TTFB accounts for Peru latency': (r) => r.timings.waiting < PERU_QOE_THRESHOLDS.GOOD.ttfb,
    });
    
    if (voteSuccess) {
      voteSuccessRate.add(1);
      debug(`Vote ${i + 1}/${numVotes} - ${outcome === 'A' ? candidateA : candidateB} won | QoE: ${qoe.score} (${qoe.rating}) | Profile: ${qoe.profile}`);
    } else {
      debug(`Vote ${i + 1}/${numVotes} failed:`, voteResponse.status, voteResponse.body);
    }
    
    // Think time between votes - simulate realistic Peruvian user
    // Users on slower connections may take slightly longer to interact
    const thinkTimeMultiplier = NETWORK_PROFILE === 'rural' ? 1.2 : 1.0;
    sleep(randomSleep(1, 3) * thinkTimeMultiplier);
  }
  
  // After voting, fetch personal ranking
  const rankingResponse = http.get(
    `${BASE_URL}/api/ranking/personal?sessionId=${sessionId}`,
    {
      ...getRequestOptions(sessionId),
      tags: { 
        name: 'ranking',
        network_profile: NETWORK_PROFILE
      }
    }
  );
  
  rankingFetches.add(1);
  
  // Calculate ranking QoE
  const rankingQoe = calculateQoE(rankingResponse.timings.duration, 'ranking', true);
  
  check(rankingResponse, {
    'ranking status is 200': (r) => r.status === 200,
    'ranking response is valid': (r) => isValidRankingResponse(r),
    'ranking has all candidates': (r) => {
      try {
        const ranking = JSON.parse(r.body);
        return ranking.length >= 9;
      } catch {
        return false;
      }
    },
    'ranking time acceptable for Peru': (r) => r.timings.duration < PERU_QOE_THRESHOLDS.GOOD.ranking,
    'ranking QoE acceptable': () => rankingQoe.score >= 70,
  });
  
  debug(`Session ${sessionId} completed | ${numVotes} votes | Network: ${currentProfile.name}`);
  
  // Pause between sessions
  sleep(randomSleep(5, 10));
}

/**
 * Teardown function
 */
export function teardown(data) {
  const duration = (Date.now() - data.startTime) / 1000;
  console.log(`\n✅ Peru-Specific Test completed in ${duration.toFixed(2)}s`);
  console.log(`\n📊 Network Profile: ${data.profile.name}`);
  console.log(`   This represents ${data.profile.coverage} of Peruvian users`);
  console.log(`   ${data.profile.description}`);
  console.log('');
  console.log('💡 Tips:');
  console.log('   - Compare results across profiles: urban, suburban, rural, congested');
  console.log('   - Urban profile represents majority (60%) of Peruvian users');
  console.log('   - Rural profile helps ensure inclusive experience');
  console.log('   - Congested profile tests election day peak hours');
}
