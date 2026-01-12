# Vercel Load Testing Best Practices Guide

## Overview

This guide implements recommendations from Vercel's official knowledge base article "How to Effectively Load Test Your Vercel Application" and best practices for serverless architectures.

## Key Principles from Vercel

### 1. Coordinate with Vercel for Large Tests

⚠️ **CRITICAL**: Do NOT run tests exceeding **50,000 requests per second** without coordinating with Vercel engineering team.

**Why?**
- Triggers DDoS mitigation systems
- May result in blocked IPs or throttled requests
- Vercel needs to whitelist your test IPs
- Could impact billing unexpectedly

**When to Contact Vercel:**
- Tests > 50,000 RPS
- Tests > 100,000 concurrent users
- Multi-hour high-load tests
- Testing from multiple geographic regions

**Contact Method:**
- Email: support@vercel.com
- Include: Test plan, expected RPS, duration, source IPs

### 2. Test Against Preview Deployments

✅ **ALWAYS** use Preview or Staging deployments for initial load tests.

**Benefits:**
- Same infrastructure as production
- Isolated environment (no user impact)
- Easy cleanup after testing
- Same billing structure
- Real edge network and serverless functions

**How to Test Preview:**
```bash
# Deploy feature branch
git push origin feature/load-test-prep

# Vercel auto-creates preview
# URL: https://presidential-punch-peru-git-feature-abc123.vercel.app

# Run load test against preview
BASE_URL=https://presidential-punch-peru-git-feature-abc123.vercel.app \
  npm run loadtest:baseline
```

### 3. Focus on Application Code

**Test YOUR code, not Vercel's infrastructure:**

✅ **DO Test:**
- API endpoint logic
- Database queries
- Cache effectiveness
- Middleware performance
- Edge function behavior
- Integration points (external APIs)
- Rate limiting logic
- Authentication flows

❌ **DON'T Test:**
- Vercel's CDN capacity
- Edge network infrastructure
- DDoS protection systems
- Global anycast performance

### 4. Monitoring and Observability

⚠️ **Expensive Observability Features:**

Vercel offers advanced monitoring that can significantly increase costs under load:
- Speed Insights
- Web Analytics
- Observability Plus
- Log Drains

**Cost-Saving Strategy:**

```typescript
// Conditional monitoring in API functions
export default async function handler(req, res) {
  // Disable expensive monitoring during load tests
  const isLoadTest = req.headers['user-agent']?.includes('k6-load-test');
  
  if (!isLoadTest) {
    // Enable Speed Insights sampling
    // Enable detailed logging
    // Track analytics events
  }
  
  // Your business logic
  // ...
}
```

**Dashboard Settings:**
- Reduce sampling rate before tests
- Disable non-critical monitoring
- Re-enable after tests complete

### 5. WAF and Security Configuration

**Web Application Firewall (WAF):**

If using Vercel WAF, configure bypass rules for load testing:

1. Go to Vercel Dashboard → Security → WAF
2. Add custom rule for load test IPs:
   ```
   Rule: Bypass rate limiting
   Condition: IP Address in [your-test-ips]
   Action: Allow
   ```

3. Or use custom headers:
   ```
   Rule: Bypass for load tests
   Condition: User-Agent contains "k6-load-test"
   Action: Allow (with caution!)
   ```

**Important**: Remove bypass rules after testing!

## Framework-Specific Best Practices

### React 18 + Vite + TypeScript

Our application stack requires specific considerations:

#### 1. Static Assets (Vite Build)
- Assets served via Vercel CDN (Edge Network)
- Not counted against function execution
- Minimal cost impact
- Test focus: API endpoints, not static files

#### 2. Client-Side State (Zustand + TanStack Query)
- State management happens client-side
- Load testing targets server APIs only
- Consider browser-based testing for full UX

#### 3. API Functions (Vercel Functions)
- Node.js runtime
- 10-second timeout (configured in vercel.json)
- 256MB memory (recommended starting point)
- Auto-scales horizontally

#### 4. shadcn/ui + Tailwind CSS
- No server impact (client-side only)
- CSS served as static assets
- No load testing needed for UI

## Rate Limiting Implementation

### Why Rate Limiting Matters

1. **Cost Control**: Prevent runaway function executions
2. **Fair Usage**: Prevent abuse
3. **System Protection**: Avoid overload
4. **Quality of Service**: Ensure responsiveness

### Recommended Implementation

#### Option 1: Vercel Edge Config + KV

```typescript
import { kv } from '@vercel/kv';
import { Ratelimit } from '@upstash/ratelimit';

// Create rate limiter (100 requests per minute per session)
const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(100, '1m'),
  analytics: true,
});

export default async function handler(req, res) {
  const sessionId = req.body.sessionId || req.ip;
  
  const { success, limit, reset, remaining } = await ratelimit.limit(sessionId);
  
  if (!success) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      limit,
      remaining,
      reset
    });
  }
  
  // Your business logic
}
```

#### Option 2: Vercel WAF (Dashboard Configuration)

1. Go to Vercel Dashboard → Security → WAF
2. Enable rate limiting rules:
   - 100 requests/minute per IP
   - 1000 requests/hour per IP
   - Custom rules for specific endpoints

#### Option 3: Function-Level (Simple)

```typescript
// In-memory rate limiting (NOT for production with multiple instances)
const rateLimitMap = new Map();

function checkRateLimit(sessionId: string, limit = 100): boolean {
  const now = Date.now();
  const windowStart = now - 60000; // 1 minute window
  
  if (!rateLimitMap.has(sessionId)) {
    rateLimitMap.set(sessionId, []);
  }
  
  const requests = rateLimitMap.get(sessionId)
    .filter(timestamp => timestamp > windowStart);
  
  if (requests.length >= limit) {
    return false; // Rate limited
  }
  
  requests.push(now);
  rateLimitMap.set(sessionId, requests);
  return true;
}
```

**Note**: Option 3 only works for single-instance deployments. Use KV for production.

## Load Testing Checklist

### Pre-Test Preparation

- [ ] Review Vercel Pro quotas (1TB bandwidth, 1000 GB-Hours functions)
- [ ] Estimate test cost using cost calculator
- [ ] Create preview deployment for testing
- [ ] Configure WAF bypass rules (if applicable)
- [ ] Reduce monitoring sampling rates
- [ ] Notify team about upcoming test
- [ ] Set up monitoring dashboards
- [ ] Document baseline metrics

### For Tests > 50k RPS

- [ ] Contact Vercel support (support@vercel.com)
- [ ] Provide test plan and timeline
- [ ] Get approval and guidance
- [ ] Whitelist test IPs in WAF
- [ ] Schedule test during agreed window
- [ ] Have Vercel engineer on standby (if recommended)

### During Test

- [ ] Monitor Vercel Analytics dashboard
- [ ] Watch function execution metrics
- [ ] Track error rates in real-time
- [ ] Monitor bandwidth usage
- [ ] Check for rate limiting triggers
- [ ] Log any unusual behavior

### Post-Test

- [ ] Review Vercel billing dashboard
- [ ] Analyze function execution logs
- [ ] Document performance findings
- [ ] Remove WAF bypass rules
- [ ] Re-enable monitoring features
- [ ] Clean up preview deployment
- [ ] Share results with team
- [ ] Update capacity planning docs

## Quality of Experience (QoE) Metrics

### Core Web Vitals Mapping

Our load tests track metrics that correlate with Core Web Vitals:

| k6 Metric | Core Web Vital | Target |
|-----------|----------------|--------|
| `http_req_waiting` | Time to First Byte (TTFB) | <200ms |
| `http_req_duration` | Largest Contentful Paint (LCP) proxy | <500ms |
| `http_req_connecting` | First Input Delay (FID) proxy | <100ms |

### QoE Scoring System

Our tests calculate a Quality of Experience score (0-100):

- **90-100**: Excellent (users perceive as instant)
- **70-89**: Good (acceptable user experience)
- **30-69**: Acceptable (users notice delay but tolerate)
- **0-29**: Poor (users may abandon)

### Measuring QoE in Tests

```javascript
// Automatic QoE calculation in baseline test
const qoe = calculateQoE(response.timings.duration, 'vote');
console.log(`QoE Score: ${qoe.score} (${qoe.rating})`);
```

## Cost Optimization Strategies

### 1. Function Configuration

```json
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 10,      // Balance UX vs cost
      "memory": 256           // Start small, increase if needed
    }
  }
}
```

### 2. Caching Strategy

```typescript
// Cache ranking calculations
const CACHE_TTL = 60; // seconds
const cache = new Map();

function getCachedRanking(sessionId) {
  const cached = cache.get(sessionId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL * 1000) {
    return cached.data;
  }
  return null;
}
```

### 3. Edge Caching

```typescript
// Set cache headers for cacheable responses
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  // Your logic
}
```

### 4. Batch Operations

```typescript
// Batch multiple votes in single request (if UX allows)
export default async function handler(req, res) {
  const votes = req.body.votes; // Array of votes
  await Promise.all(votes.map(vote => saveVote(vote)));
  return res.json({ success: true, count: votes.length });
}
```

## Troubleshooting Common Issues

### Issue: 429 Too Many Requests

**Cause**: Rate limiting triggered
**Solution**: 
- Check if test exceeded safe limits
- Verify WAF bypass rules
- Contact Vercel if legitimate traffic

### Issue: 503 Service Unavailable

**Cause**: Function cold starts or scaling
**Solution**:
- Warm up functions before test
- Ramp up load gradually
- Increase function timeout if needed

### Issue: High Error Rate (>5%)

**Cause**: System under stress or bugs
**Solution**:
- Review function logs
- Check database connection limits
- Verify external API availability
- Reduce concurrent users

### Issue: Slow Response Times

**Cause**: Database queries, external APIs, or cold starts
**Solution**:
- Profile function execution
- Optimize queries
- Add caching
- Increase function memory

## Additional Resources

- [Vercel Functions Documentation](https://vercel.com/docs/functions)
- [Vercel Pro Pricing](https://vercel.com/pricing)
- [Vercel Edge Network](https://vercel.com/docs/edge-network/overview)
- [k6 Documentation](https://k6.io/docs/)
- [Core Web Vitals](https://web.dev/vitals/)

## Support

For questions or issues:
1. Vercel Support: support@vercel.com
2. Vercel Community: vercel.com/community
3. Project Team: Open GitHub issue
