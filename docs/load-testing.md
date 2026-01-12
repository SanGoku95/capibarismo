# Load Testing Plan - Presidential Punch Peru

## Overview

This document outlines the comprehensive load testing strategy for the Presidential Punch Peru game application. The application is a React-based SPA with Vercel Functions API backend, deployed on Vercel Pro.

**⚠️ Important**: This plan follows [Vercel's official load testing guidelines](https://vercel.com/kb/guide/how-to-effectively-load-test-your-vercel-application). See [VERCEL_BEST_PRACTICES.md](./VERCEL_BEST_PRACTICES.md) and [VERCEL_COST_ANALYSIS.md](./VERCEL_COST_ANALYSIS.md) for detailed Vercel-specific guidance.

## Quick Links

- **[Vercel Best Practices](./VERCEL_BEST_PRACTICES.md)** - Official Vercel recommendations
- **[Cost Analysis](./VERCEL_COST_ANALYSIS.md)** - Billing implications and cost calculator
- **[Quick Start Guide](./LOAD_TESTING_QUICKSTART.md)** - Get started in 5 minutes
- **[Test Scripts](../load-tests/README.md)** - All test scenarios

## Application Architecture

### Frontend
- **Framework**: React 18 + Vite + TypeScript
- **State Management**: Zustand + TanStack Query
- **Hosting**: Vercel (Static assets via CDN)
- **UI**: shadcn/ui + Tailwind CSS

### Backend
- **Runtime**: Vercel Serverless Functions (Node.js)
- **Storage**: Vercel Blob (for vote persistence)
- **API Endpoints**:
  - `POST /api/game/vote` - Submit vote for candidate matchup
  - `GET /api/ranking/personal` - Get personalized ranking based on user's vote history

### Key User Flow
1. User loads game page (`/jugar`)
2. Frontend generates unique session ID
3. User presented with candidate pairs (A vs B)
4. User votes for preferred candidate
5. Vote submitted to API (`POST /api/game/vote`)
6. Next pair is presented (client-side logic)
7. After completing votes, user views personalized ranking (`GET /api/ranking/personal`)

## Load Testing Objectives

### Primary Goals
1. **Determine system capacity**: Maximum concurrent users the system can handle
2. **Identify bottlenecks**: Database, API functions, CDN, or frontend performance
3. **Verify scalability**: How system behaves under increasing load
4. **Measure response times**: Ensure acceptable performance under load
5. **Test Vercel Pro limits**: Understand function execution limits and costs

### Key Metrics to Monitor
- **Response Time**: p50, p95, p99 latency for API calls
- **Throughput**: Requests per second (RPS)
- **Error Rate**: Percentage of failed requests
- **Concurrent Users**: Number of simultaneous active users
- **Function Duration**: Serverless function execution time
- **Storage Performance**: Vercel Blob read/write latency
- **Frontend Performance**: Page load time, FCP, LCP, TTI

## Load Testing Scenarios

### Scenario 1: Baseline Performance Test
**Objective**: Establish baseline performance metrics under normal load

- **Virtual Users**: 10-50 concurrent users
- **Duration**: 5 minutes
- **Ramp-up**: 1 minute
- **Actions**:
  - Load game page
  - Submit 10 votes per session
  - View personal ranking
  
**Expected Outcomes**:
- Response time < 200ms for vote submissions
- Response time < 500ms for ranking calculations
- 0% error rate
- Smooth user experience

### Scenario 2: Peak Load Test
**Objective**: Simulate peak traffic during election events

- **Virtual Users**: 500-1000 concurrent users
- **Duration**: 15 minutes
- **Ramp-up**: 3 minutes
- **Actions**: Same as Scenario 1
- **Vote rate**: ~5 votes/user/minute

**Expected Outcomes**:
- Response time < 500ms for vote submissions (p95)
- Response time < 1000ms for ranking calculations (p95)
- Error rate < 1%
- System remains responsive

### Scenario 3: Stress Test
**Objective**: Identify breaking point and failure modes

- **Virtual Users**: Start at 1000, increase by 500 every 5 minutes
- **Duration**: Until system degrades or reaches 5000 users
- **Ramp-up**: Gradual increase
- **Actions**: Same as Scenario 1

**Expected Outcomes**:
- Identify maximum capacity
- Understand failure modes (timeouts, rate limits, storage limits)
- Document degradation patterns

### Scenario 4: Spike Test
**Objective**: Test system resilience to sudden traffic spikes

- **Virtual Users**: 100 baseline, spike to 2000, return to 100
- **Duration**: 10 minutes (2 min baseline, 1 min spike, 2 min spike duration, 5 min recovery)
- **Actions**: Same as Scenario 1

**Expected Outcomes**:
- System handles spike gracefully
- Auto-scaling responds appropriately
- Recovery to baseline performance after spike

### Scenario 5: Endurance Test (Soak Test)
**Objective**: Verify system stability over extended period

- **Virtual Users**: 200 concurrent users
- **Duration**: 2 hours
- **Actions**: Same as Scenario 1

**Expected Outcomes**:
- No memory leaks in serverless functions
- Consistent performance over time
- No degradation in response times
- Storage system remains performant

### Scenario 6: Extreme Scale Test (100,000 users)
**Objective**: Test maximum expected capacity for election day

⚠️ **REQUIRES VERCEL COORDINATION** - See [Vercel Best Practices](./VERCEL_BEST_PRACTICES.md)

- **Virtual Users**: Ramp to 100,000 concurrent users
- **Duration**: ~55 minutes (phased ramp-up)
- **Actions**: Reduced votes per session (3-7 votes)
- **Estimated Cost**: ~$10-15 per test run

**Phases**:
1. Warm-up: 0 → 10,000 users (15 minutes)
2. Scale-up: 10,000 → 50,000 users (10 minutes)
3. Peak: 50,000 → 100,000 users (10 minutes)
4. Sustained: Hold at 100,000 (10 minutes)
5. Ramp-down: 100,000 → 10,000 (10 minutes)

**Prerequisites**:
- ✅ Contact Vercel support for approval
- ✅ Whitelist test IPs in WAF
- ✅ Run against Preview deployment only
- ✅ Team monitoring dashboards ready
- ✅ Schedule during off-peak hours

**Expected Outcomes**:
- Document maximum sustainable capacity
- Validate auto-scaling at extreme load
- Test DDoS protection interaction
- Identify breaking points
- Measure quality degradation patterns

## Quality of Experience (QoE) Metrics

### Beyond Performance: Measuring User Experience

Our load tests track not just performance metrics, but **Quality of Experience** - how users actually perceive the system.

### QoE Scoring System (0-100)

- **90-100 (Excellent)**: Users perceive as instant
  - Vote: <100ms
  - Ranking: <300ms
  - TTFB: <100ms

- **70-89 (Good)**: Acceptable user experience
  - Vote: 100-300ms
  - Ranking: 300-800ms
  - TTFB: 100-200ms

- **30-69 (Acceptable)**: Users notice delay
  - Vote: 300-500ms
  - Ranking: 800-1500ms
  - TTFB: 200-500ms

- **0-29 (Poor)**: Users may abandon
  - Vote: >500ms
  - Ranking: >1500ms
  - TTFB: >500ms

### Core Web Vitals Alignment

Our QoE metrics align with [Google's Core Web Vitals](https://web.dev/vitals/):

| Our Metric | Core Web Vital | Target |
|------------|----------------|--------|
| TTFB | Time to First Byte | <200ms |
| Vote Duration | LCP Proxy | <500ms |
| Connection Time | FID Proxy | <100ms |

### Tracking in Tests

All test scenarios automatically calculate and report QoE scores:

```
qoe_score................: avg=85.3 min=42.1 med=88.7 max=98.2
experience_excellent.....: 45.2% (users with instant experience)
experience_good..........: 42.8% (users with good experience)
experience_poor..........: 12.0% (users with poor experience)
```

## Testing Tools

### Recommended: k6 (Primary Tool)
**Why k6**:
- Open-source, modern load testing tool
- Written in Go (performant)
- JavaScript-based test scripts (familiar for team)
- Excellent metrics and reporting
- Cloud and local execution
- Great integration with CI/CD

**Installation**:
```bash
# macOS
brew install k6

# Ubuntu/Debian
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6

# npm (fallback)
npm install -g k6
```

### Alternative Tools (Secondary)
- **Artillery**: Node.js based, easy YAML config
- **Gatling**: JVM-based, powerful reporting
- **Locust**: Python-based, easy to write tests

## Implementation Plan

### Phase 1: Setup (Week 1)
- [ ] Install and configure k6
- [ ] Create test scripts for each scenario
- [ ] Set up monitoring dashboards (Vercel Analytics)
- [ ] Configure test data and session management
- [ ] Document baseline metrics

### Phase 2: Execution (Week 2)
- [ ] Run Scenario 1 (Baseline) - Document results
- [ ] Run Scenario 2 (Peak Load) - Document results
- [ ] Run Scenario 3 (Stress) - Identify limits
- [ ] Run Scenario 4 (Spike) - Test resilience
- [ ] Run Scenario 5 (Endurance) - Verify stability

### Phase 3: Analysis (Week 3)
- [ ] Analyze all test results
- [ ] Identify performance bottlenecks
- [ ] Create optimization recommendations
- [ ] Document capacity planning guidelines
- [ ] Update system architecture if needed

### Phase 4: Optimization (Week 4)
- [ ] Implement recommended optimizations
- [ ] Re-run critical tests to verify improvements
- [ ] Update documentation with findings
- [ ] Create monitoring alerts for production

## Test Environment

### Testing Targets
- **Staging Environment** (Recommended):
  - Deploy branch to Vercel preview deployment
  - Separate Blob storage namespace
  - Prevents production data contamination
  
- **Production Environment** (Carefully):
  - Only for final validation
  - Off-peak hours
  - Lower concurrent users
  - Monitor costs closely

### Environment Configuration
```bash
# .env.loadtest
LOAD_TEST_BASE_URL=https://your-staging-deployment.vercel.app
LOAD_TEST_DURATION=300s
LOAD_TEST_VUS=100
LOAD_TEST_RAMP_UP=60s
```

## Monitoring and Observability

### Vercel Analytics
- **Function Logs**: Monitor serverless function execution
- **Metrics Dashboard**: Track requests, errors, duration
- **Bandwidth Usage**: Monitor data transfer
- **Edge Network**: CDN cache hit rates

### Key Metrics to Track
1. **API Response Times**:
   - `/api/game/vote` - Target: p95 < 500ms
   - `/api/ranking/personal` - Target: p95 < 1000ms

2. **Error Rates**:
   - 4xx errors (client errors)
   - 5xx errors (server errors)
   - Timeout errors

3. **Throughput**:
   - Requests per second
   - Votes processed per minute

4. **Resource Usage**:
   - Function execution time
   - Memory consumption
   - Blob storage operations

### Monitoring Tools
- Vercel Dashboard (primary)
- k6 Cloud (optional, for advanced metrics)
- Grafana + InfluxDB (optional, for custom dashboards)

## Cost Considerations

### Vercel Pro Limits
- **Function Execution**: 1000 GB-hours/month
- **Bandwidth**: 1000 GB/month
- **Function Duration**: 60 seconds max
- **Concurrent Executions**: Scales automatically

### Load Test Cost Estimation
For 1000 concurrent users over 15 minutes:
- **Function invocations**: ~150,000 (10 votes/user + ranking)
- **Function duration**: ~200ms average = 0.2s
- **Total GB-seconds**: Depends on memory (estimate 1024MB)
- **Cost**: Minimal within Pro plan limits

**Recommendation**: Monitor costs during initial tests and adjust accordingly.

## Success Criteria

### Performance Benchmarks
- ✅ **Baseline Test**: < 200ms p95 response time, 0% errors
- ✅ **Peak Load Test**: Handles 500 concurrent users with < 1% errors
- ✅ **Stress Test**: Graceful degradation beyond capacity
- ✅ **Spike Test**: Recovery within 2 minutes after spike
- ✅ **Endurance Test**: Stable performance over 2 hours

### Capacity Planning
- Document maximum concurrent users
- Define scaling thresholds
- Create alerts for capacity warnings
- Plan for election day traffic (10x normal)

## Risk Mitigation

### Potential Issues
1. **Vercel Blob Rate Limits**: Parallel writes may hit limits
   - **Mitigation**: Implement write batching or caching
   
2. **Function Cold Starts**: First invocation slower
   - **Mitigation**: Keep functions warm, optimize bundle size
   
3. **Storage Costs**: High vote volume increases storage
   - **Mitigation**: Implement data retention policy
   
4. **API Rate Limiting**: Too many requests from single IP
   - **Mitigation**: Distribute load test across multiple IPs

### Safety Measures
- Start with small user counts
- Gradually increase load
- Monitor costs in real-time
- Have rollback plan ready
- Schedule tests during off-peak hours

## Post-Test Actions

### Documentation
1. Record all test results in `/docs/load-test-results/`
2. Update capacity planning guidelines
3. Document any issues discovered
4. Share findings with team

### Optimizations
1. Implement caching where appropriate
2. Optimize database queries
3. Add rate limiting if needed
4. Configure auto-scaling policies

### Continuous Testing
1. Integrate load tests into CI/CD
2. Run smoke tests on every deployment
3. Schedule weekly performance tests
4. Monitor production metrics continuously

## References

- [k6 Documentation](https://k6.io/docs/)
- [Vercel Functions Limits](https://vercel.com/docs/functions/limits)
- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Load Testing Best Practices](https://k6.io/docs/test-types/)

## Appendix: Quick Start Commands

```bash
# Run baseline test
npm run loadtest:baseline

# Run peak load test
npm run loadtest:peak

# Run stress test
npm run loadtest:stress

# Run all tests
npm run loadtest:all

# View results
npm run loadtest:report
```
