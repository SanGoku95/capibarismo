/**
 * Scenario 6: Extreme Scale Test (100,000 users)
 * 
 * Objective: Test system behavior at maximum expected scale
 * 
 * Test Parameters:
 * - Virtual Users: Ramp to 100,000 concurrent users
 * - Duration: ~55 minutes total
 * - Phased ramp-up to avoid DDoS triggers
 * 
 * ⚠️ CRITICAL REQUIREMENTS:
 * 1. MUST coordinate with Vercel support before running
 * 2. MUST run against Preview deployment (not production)
 * 3. MUST have monitoring dashboards ready
 * 4. MUST have team standing by
 * 5. MUST whitelist test IPs in Vercel WAF
 * 
 * Expected Costs:
 * - Function execution: ~173 GB-Hours (~$10 overage)
 * - Bandwidth: ~20GB (within quota)
 * - Total: ~$10-15 per run
 * 
 * Expected Results:
 * - Identify maximum capacity
 * - Validate auto-scaling behavior
 * - Test DDoS protection interaction
 * - Measure degradation patterns
 * - Verify function cold start behavior at scale
 * 
 * Usage:
 *   ⚠️  DO NOT RUN WITHOUT VERCEL APPROVAL ⚠️
 *   
 *   # Step 1: Contact Vercel support
 *   # Step 2: Get approval and whitelist IPs
 *   # Step 3: Deploy to preview
 *   # Step 4: Run test
 *   BASE_URL=https://your-preview.vercel.app k6 run load-tests/extreme-scale.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend, Gauge } from 'k6/metrics';
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

// Custom metrics for extreme scale
const errorRate = new Rate('errors');
const timeoutRate = new Rate('timeouts');
const votesSubmitted = new Counter('votes_submitted');
const activeUsers = new Gauge('active_users');
const queueDepth = new Trend('queue_depth');

// Test configuration
export const options = {
  // Phased ramp to 100,000 users
  stages: [
    // Phase 1: Gradual ramp to 10k
    { duration: '5m', target: 1000 },    // 0-5min: Warm up
    { duration: '5m', target: 5000 },    // 5-10min: Moderate load
    { duration: '5m', target: 10000 },   // 10-15min: Heavy load
    
    // Phase 2: Aggressive ramp to 50k
    { duration: '5m', target: 25000 },   // 15-20min: Scale up
    { duration: '5m', target: 50000 },   // 20-25min: Approach peak
    
    // Phase 3: Final push to 100k
    { duration: '5m', target: 75000 },   // 25-30min: High scale
    { duration: '5m', target: 100000 },  // 30-35min: Maximum load
    
    // Phase 4: Sustained peak
    { duration: '10m', target: 100000 }, // 35-45min: Hold at peak
    
    // Phase 5: Graceful ramp down
    { duration: '5m', target: 50000 },   // 45-50min: Reduce load
    { duration: '5m', target: 10000 },   // 50-55min: Cool down
  ],
  
  // More lenient thresholds for extreme scale
  thresholds: {
    'http_req_failed': ['rate<0.10'],    // Up to 10% errors acceptable at peak
    'errors': ['rate<0.10'],
    'timeouts': ['rate<0.20'],           // Up to 20% timeouts during peak
    'http_req_duration': ['p(95)<5000'], // 5s at p95 acceptable under extreme load
  },
  
  summaryTrendStats: baseConfig.summaryTrendStats,
  
  // Disable detailed metrics to reduce overhead
  noConnectionReuse: false,
  batchPerHost: 20,  // Batch requests for efficiency
};

/**
 * Setup function
 */
export function setup() {
  console.log('🚀 Starting EXTREME SCALE Test');
  console.log(`📍 Target: ${BASE_URL}`);
  console.log('👥 Virtual Users: Ramping to 100,000');
  console.log('⏱️  Duration: ~55 minutes');
  console.log('');
  console.log('⚠️  ===============================================');
  console.log('⚠️  CRITICAL: Ensure Vercel approval received!');
  console.log('⚠️  CRITICAL: Run against PREVIEW deployment only!');
  console.log('⚠️  CRITICAL: Team monitoring dashboards!');
  console.log('⚠️  ===============================================');
  console.log('');
  console.log('💰 Estimated Cost: $10-15 for this test run');
  console.log('📊 Expected: ~10M requests, 173 GB-Hours');
  
  // Verify this is not production
  if (BASE_URL.includes('capibarismo.com') && !BASE_URL.includes('preview')) {
    console.error('❌ ABORT: This test should NOT run against production!');
    console.error('❌ Please use a preview deployment URL');
    throw new Error('Production deployment detected - aborting for safety');
  }
  
  return { 
    startTime: Date.now(),
    checkpoints: new Set(),
    phaseStart: Date.now()
  };
}

/**
 * Main test function
 */
export default function (data) {
  const sessionId = generateSessionId();
  const currentVUs = __VU;
  const elapsedMinutes = Math.floor((Date.now() - data.startTime) / 60000);
  
  // Track active users
  activeUsers.add(currentVUs);
  
  // Log major checkpoints
  if ([5, 10, 15, 20, 25, 30, 35, 45, 50].includes(elapsedMinutes)) {
    if (!data.checkpoints.has(elapsedMinutes)) {
      data.checkpoints.add(elapsedMinutes);
      console.log(`⏰ Checkpoint ${elapsedMinutes}min: ${currentVUs} active users`);
    }
  }
  
  // Determine current phase
  let phase = 'warmup';
  if (currentVUs >= 75000) phase = 'extreme';
  else if (currentVUs >= 50000) phase = 'peak';
  else if (currentVUs >= 25000) phase = 'high';
  else if (currentVUs >= 10000) phase = 'heavy';
  
  // Adjust behavior based on scale
  const numVotes = phase === 'extreme' ? 3 : phase === 'peak' ? 5 : 7;
  
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
          phase: phase,
          scale: currentVUs
        },
        timeout: '15s' // Longer timeout for extreme scale
      }
    );
    
    const duration = Date.now() - startTime;
    queueDepth.add(duration);
    votesSubmitted.add(1);
    
    // Track failures
    const isTimeout = voteResponse.error && voteResponse.error.includes('timeout');
    const isError = voteResponse.status !== 200;
    
    if (isTimeout) {
      timeoutRate.add(1);
    } else {
      timeoutRate.add(0);
    }
    
    errorRate.add(isError);
    
    // Log concerning patterns
    if (duration > 10000 && phase === 'extreme') {
      console.log(`⚠️  Extreme delay: ${duration}ms at ${currentVUs} VUs in ${phase} phase`);
    }
    
    // Basic success check (don't overload with detailed checks at scale)
    check(voteResponse, {
      'vote completed': (r) => r.status === 200 || r.status === 429, // Accept rate limiting
      'not server error': (r) => r.status < 500 || r.status >= 600,
    });
    
    // Minimal think time at extreme scale
    const thinkTime = phase === 'extreme' ? randomSleep(0.1, 0.3) : 
                      phase === 'peak' ? randomSleep(0.2, 0.5) :
                      randomSleep(0.5, 1.5);
    sleep(thinkTime);
  }
  
  // Short pause between sessions (adjusted by scale)
  const pauseTime = phase === 'extreme' ? randomSleep(0.5, 1) :
                    phase === 'peak' ? randomSleep(1, 2) :
                    randomSleep(1, 3);
  sleep(pauseTime);
}

/**
 * Teardown function
 */
export function teardown(data) {
  const duration = (Date.now() - data.startTime) / 1000;
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  
  console.log(`\n✅ Extreme Scale Test completed in ${hours}h ${minutes}m`);
  console.log('');
  console.log('📊 Post-Test Checklist:');
  console.log('  [ ] Review Vercel Analytics for function errors');
  console.log('  [ ] Check Vercel billing dashboard for actual costs');
  console.log('  [ ] Analyze error patterns and bottlenecks');
  console.log('  [ ] Document maximum sustained capacity');
  console.log('  [ ] Clean up preview deployment');
  console.log('  [ ] Share results with team');
  console.log('  [ ] Update capacity planning docs');
}
