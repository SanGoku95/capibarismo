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
    // Relaxed to 1500ms as per UX decision (loading state is acceptable)
    'http_req_duration{name:ranking}': ['p(95)<1500', 'p(99)<2500'],
    
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
// Based on Nielsen's Response Time Limits & Google Core Web Vitals
// 1. Instant (0.1s): User feels they caused the action.
// 2. Flow (1.0s): User's thought process is uninterrupted.
// 3. Attention (10s): Limit for keeping user's attention.
export const QOE_THRESHOLDS = {
  // Excellent: "The Punch" - Feels immediate and visceral
  EXCELLENT: {
    vote: 100,      // <100ms: Instant (Optimistic UI goal)
    ranking: 500,   // <500ms: Snappy transition
    ttfb: 100,      // <100ms: Server is ready immediately
  },
  
  // Good: "The Flow" - Rhythm is maintained, no context switch
  GOOD: {
    vote: 300,      // <300ms: Noticeable but doesn't break flow
    ranking: 1000,  // <1.0s: The limit of "Uninterrupted thought"
    ttfb: 200,      // <200ms: Standard good performance
  },
  
  // Poor: "The Drag" - User notices delay, loses rhythm
  POOR: {
    vote: 500,      // >500ms: Feels "sticky" or broken
    ranking: 3000,  // >3.0s: User considers abandoning
    ttfb: 500,      // >500ms: perceptible lag before paint
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

// Peru network profiles - Realistic conditions for Peruvian users
// Based on Speedtest Global Index and Ookla research (2026)
export const PERU_NETWORK_PROFILES = {
  urban: {
    name: 'Urban Peru (Good 4G)',
    downloadMbps: 35,           // Average mobile download
    uploadMbps: 15.6,           // Average mobile upload
    latencyMs: 22,              // Average mobile latency
    packetLoss: 0.5,            // Good conditions
    coverage: '60%',            // Estimated user distribution
    description: 'Lima, Arequipa, Trujillo - Major cities with good 4G coverage',
  },
  suburban: {
    name: 'Suburban Peru (Moderate 4G)',
    downloadMbps: 25,
    uploadMbps: 12,
    latencyMs: 30,
    packetLoss: 1.5,
    coverage: '25%',
    description: 'Mid-size cities, suburban areas with moderate coverage',
  },
  rural: {
    name: 'Rural Peru (Limited 3G/4G)',
    downloadMbps: 10,
    uploadMbps: 5,
    latencyMs: 60,
    packetLoss: 3,
    coverage: '10%',
    description: 'Remote areas with limited coverage',
  },
  congested: {
    name: 'Congested Network (Peak Hours)',
    downloadMbps: 20,
    uploadMbps: 8,
    latencyMs: 45,
    packetLoss: 2,
    coverage: '5%',
    description: 'Urban during 7-10 PM peak hours',
  },
};

// Get current network profile (default: urban - most common)
export const NETWORK_PROFILE = __ENV.NETWORK_PROFILE || 'urban';

// Peru-adjusted QoE thresholds
// Accounts for average 22ms Peru mobile latency
export const PERU_QOE_THRESHOLDS = {
  // Excellent: Users perceive as instant (accounting for Peru latency)
  EXCELLENT: {
    vote: 150,      // <150ms feels instant (includes 22ms network latency)
    ranking: 600,   // <600ms feels responsive (relaxed from 350)
    ttfb: 120,      // <120ms TTFB is excellent (includes latency)
  },
  
  // Good: Acceptable user experience for Peru (Rural/3G Baseline)
  GOOD: {
    vote: 320,      // <320ms still feels fast for Peruvian users
    ranking: 1200,  // <1.2s: Striving for Flow state even on mobile
    ttfb: 220,      // <220ms TTFB is good
  },
  
  // Poor: Users start to notice delay (Peru-adjusted)
  POOR: {
    vote: 550,      // >550ms users get impatient (even accounting for network)
    ranking: 3500,  // >3.5s users may abandon (relaxed from 1600)
    ttfb: 550,      // >550ms TTFB feels slow
  }
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
  const bypass = __ENV.VERCEL_PROTECTION_BYPASS;

  return {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'k6-load-test/1.0',
      ...(bypass ? { 'x-vercel-protection-bypass': bypass } : {}),
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
 * @param {boolean} usePeruThresholds - Use Peru-adjusted thresholds (default: true)
 * @returns {object} - { score, rating, color, profile }
 */
export function calculateQoE(duration, endpoint = 'vote', usePeruThresholds = true) {
  // Use Peru thresholds by default (realistic for target audience)
  const thresholds = usePeruThresholds ? PERU_QOE_THRESHOLDS : QOE_THRESHOLDS;
  const profile = usePeruThresholds ? PERU_NETWORK_PROFILES[NETWORK_PROFILE] : null;
  
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
    duration,
    profile: profile ? profile.name : 'Global',
    networkLatency: profile ? profile.latencyMs : 0
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
