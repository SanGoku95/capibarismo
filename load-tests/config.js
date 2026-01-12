/**
 * Shared configuration for load tests
 * 
 * This file contains common configuration, helper functions, and constants
 * used across all load test scenarios.
 */

// Load environment variables
export const BASE_URL = __ENV.BASE_URL || 'https://capibarismo.com';
export const DEBUG = __ENV.DEBUG === 'true';

// Test configuration
export const config = {
  // Thresholds define what constitutes acceptable performance
  thresholds: {
    // HTTP errors should be less than 1%
    http_req_failed: ['rate<0.01'],
    
    // 95% of requests should complete within 500ms
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    
    // Vote endpoint should be fast (critical path)
    'http_req_duration{name:vote}': ['p(95)<300', 'p(99)<500'],
    
    // Ranking endpoint can be slightly slower (computation heavy)
    'http_req_duration{name:ranking}': ['p(95)<800', 'p(99)<1500'],
  },
  
  // Summary output configuration
  summaryTrendStats: ['min', 'avg', 'med', 'p(90)', 'p(95)', 'p(99)', 'max'],
};

// Candidate data - actual candidate IDs from the application
export const CANDIDATE_IDS = [
  'antauro-humala',
  'carlos-zeballos',
  'cesar-acuna',
  'enrique-wong',
  'fernando-rospigliosi',
  'hernando-guerra-garcia',
  'jaime-salinas',
  'juan-carlos-tafur',
  'nicanor-alvarado'
];

/**
 * Generate a unique session ID
 * Mimics the frontend's session ID generation
 */
export function generateSessionId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `loadtest-${timestamp}-${random}`;
}

/**
 * Get a random candidate ID
 */
export function getRandomCandidate() {
  return CANDIDATE_IDS[Math.floor(Math.random() * CANDIDATE_IDS.length)];
}

/**
 * Get a random pair of different candidates
 * Uses Fisher-Yates shuffle for proper randomization
 */
export function getRandomPair() {
  const arr = [...CANDIDATE_IDS];
  // Fisher-Yates shuffle for first two positions
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return [arr[0], arr[1]];
}

/**
 * Get random outcome (A or B)
 */
export function getRandomOutcome() {
  return Math.random() < 0.5 ? 'A' : 'B';
}

/**
 * Log debug information if DEBUG is enabled
 */
export function debug(...args) {
  if (DEBUG) {
    console.log('[DEBUG]', ...args);
  }
}

/**
 * Sleep with random jitter to simulate realistic user behavior
 * @param {number} min - Minimum sleep time in seconds
 * @param {number} max - Maximum sleep time in seconds
 */
export function randomSleep(min, max) {
  const duration = min + Math.random() * (max - min);
  return duration;
}

/**
 * Create HTTP request options with common headers
 */
export function getRequestOptions(sessionId) {
  return {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'k6-load-test/1.0',
      'Origin': BASE_URL,
    },
    tags: {
      sessionId: sessionId
    }
  };
}

/**
 * Validate vote response
 */
export function isValidVoteResponse(response) {
  if (response.status !== 200) {
    debug(`Vote failed with status ${response.status}:`, response.body);
    return false;
  }
  
  try {
    const body = JSON.parse(response.body);
    return body.ok === true;
  } catch (e) {
    debug('Failed to parse vote response:', response.body);
    return false;
  }
}

/**
 * Validate ranking response
 */
export function isValidRankingResponse(response) {
  if (response.status !== 200) {
    debug(`Ranking failed with status ${response.status}:`, response.body);
    return false;
  }
  
  try {
    const body = JSON.parse(response.body);
    return Array.isArray(body) && body.length > 0;
  } catch (e) {
    debug('Failed to parse ranking response:', response.body);
    return false;
  }
}
