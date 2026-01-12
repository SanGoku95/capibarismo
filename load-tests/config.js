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
    
    // Overall response time targets
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    
    // Vote endpoint should be fast (critical path - user interaction)
    'http_req_duration{name:vote}': ['p(95)<300', 'p(99)<500'],
    
    // Ranking endpoint can be slightly slower (computation heavy)
    'http_req_duration{name:ranking}': ['p(95)<800', 'p(99)<1500'],
    
    // Quality of Experience (QoE) metrics
    // Based on Core Web Vitals and user experience research
    
    // Time to First Byte - Critical for perceived responsiveness
    http_req_waiting: ['p(95)<200', 'p(99)<400'],
    
    // Connection time - Network quality indicator
    http_req_connecting: ['p(95)<100'],
    
    // TLS handshake - Security overhead check
    http_req_tls_handshaking: ['p(95)<200'],
  },
  
  // Summary output configuration
  summaryTrendStats: ['min', 'avg', 'med', 'p(90)', 'p(95)', 'p(99)', 'max'],
};

// Quality of Experience (QoE) thresholds
// Based on Google's Core Web Vitals and UX research
export const QOE_THRESHOLDS = {
  // Excellent: Users perceive as instant
  EXCELLENT: {
    vote: 100,      // <100ms feels instant
    ranking: 300,   // <300ms feels responsive
    ttfb: 100,      // <100ms TTFB is excellent
  },
  
  // Good: Acceptable user experience
  GOOD: {
    vote: 300,      // <300ms still feels fast
    ranking: 800,   // <800ms is acceptable
    ttfb: 200,      // <200ms TTFB is good
  },
  
  // Poor: Users start to notice delay
  POOR: {
    vote: 500,      // >500ms users get impatient
    ranking: 1500,  // >1500ms users may abandon
    ttfb: 500,      // >500ms TTFB feels slow
  }
};

// Vercel-specific configuration
export const VERCEL_CONFIG = {
  // Function execution limits
  MAX_FUNCTION_DURATION: 10, // seconds (as configured in vercel.json)
  MAX_FUNCTION_MEMORY: 3008, // MB (Vercel Pro limit)
  
  // Rate limiting recommendations
  RATE_LIMIT_PER_MINUTE: 100, // Suggested per-session limit
  RATE_LIMIT_PER_IP: 1000,    // Suggested per-IP limit
  
  // DDoS protection thresholds
  DDOS_TRIGGER_RPS: 50000,    // Coordinate with Vercel above this
  SAFE_RPS: 10000,            // Safe without coordination
  
  // Cost optimization
  RECOMMEND_MEMORY: 256,      // MB - Start here, increase if needed
  RECOMMEND_TIMEOUT: 10,      // seconds - Balance cost vs UX
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

/**
 * Calculate Quality of Experience (QoE) score
 * Returns a score from 0-100 based on response time
 * 
 * @param {number} duration - Response time in milliseconds
 * @param {string} endpoint - 'vote' or 'ranking'
 * @returns {object} - { score, rating, color }
 */
export function calculateQoE(duration, endpoint = 'vote') {
  const thresholds = QOE_THRESHOLDS;
  
  let score, rating, color;
  
  if (duration <= thresholds.EXCELLENT[endpoint]) {
    score = 100;
    rating = 'Excellent';
    color = 'green';
  } else if (duration <= thresholds.GOOD[endpoint]) {
    // Linear interpolation between EXCELLENT and GOOD
    const range = thresholds.GOOD[endpoint] - thresholds.EXCELLENT[endpoint];
    const position = duration - thresholds.EXCELLENT[endpoint];
    score = 90 - (position / range) * 20; // 90 to 70
    rating = 'Good';
    color = 'green';
  } else if (duration <= thresholds.POOR[endpoint]) {
    // Linear interpolation between GOOD and POOR
    const range = thresholds.POOR[endpoint] - thresholds.GOOD[endpoint];
    const position = duration - thresholds.GOOD[endpoint];
    score = 70 - (position / range) * 40; // 70 to 30
    rating = 'Acceptable';
    color = 'yellow';
  } else {
    // Exponential decay below 30
    const excess = duration - thresholds.POOR[endpoint];
    score = Math.max(0, 30 - (excess / 100));
    rating = 'Poor';
    color = 'red';
  }
  
  return {
    score: Math.round(score),
    rating,
    color,
    duration
  };
}

/**
 * Get experience quality category
 * @param {object} response - k6 response object
 * @returns {string} - 'excellent', 'good', 'acceptable', or 'poor'
 */
export function getExperienceQuality(response) {
  const duration = response.timings.duration;
  const qoe = calculateQoE(duration, 'vote');
  
  if (qoe.score >= 90) return 'excellent';
  if (qoe.score >= 70) return 'good';
  if (qoe.score >= 30) return 'acceptable';
  return 'poor';
}

/**
 * Check if response meets Quality of Experience standards
 * @param {object} response - k6 response object
 * @param {string} endpoint - 'vote' or 'ranking'
 * @returns {boolean}
 */
export function meetsQoEStandards(response, endpoint = 'vote') {
  const qoe = calculateQoE(response.timings.duration, endpoint);
  return qoe.score >= 70; // Good or better
}
