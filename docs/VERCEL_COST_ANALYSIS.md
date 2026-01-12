# Vercel Pro Plan Analysis & Load Testing Cost Calculator

## Vercel Pro Plan Overview (2026)

### Base Cost
- **$20 per user/month**
- Example: Team of 4 (3 developers + 1 manager) = **$80/month**

### Included Resources (Per Month)
- **1TB Bandwidth** (HTML, JS, images, static assets)
- **1,000 GB-Hours Function Execution** (serverless compute time)
- **Unlimited Edge Requests** (CDN/Edge Network)
- **Unlimited Build Minutes** (CI/CD pipeline)
- **Unlimited Preview Deployments**
- **100GB Fast Origin Transfer**

### Overage Charges
- **Additional Bandwidth**: $0.15/GB ($150/TB)
- **Additional Function Execution**: $0.06/GB-Hour
- **Fast Origin Transfer**: $0.15/GB beyond 100GB

### Important Limits
- **Function Timeout**: 60 seconds max (10s default in our config)
- **Function Memory**: Up to 3008MB
- **Concurrent Executions**: Auto-scales, no hard limit
- **Request Rate**: Subject to DDoS protection (coordinate for >50k RPS tests)

---

## Load Testing Cost Analysis

### Critical Vercel Recommendations
⚠️ **IMPORTANT**: Vercel explicitly recommends:
1. **DO NOT** run tests exceeding 50,000 RPS without coordinating with Vercel
2. **ALWAYS** test against Preview or Staging deployments first
3. **DISABLE** expensive monitoring (Observability Plus) during large tests
4. **CONFIGURE** WAF bypass rules for load testing IPs
5. **TEST** your application code, not Vercel's infrastructure

### Cost Breakdown by Test Scenario

#### Scenario 1: Smoke Test (5 users, 1 minute)
**Resources:**
- Requests: ~50 (10 votes/user + ranking)
- Function Executions: ~50 × 200ms avg = 10 seconds
- Memory: 256MB avg
- GB-Hours: (256MB / 1024) × (10s / 3600) = 0.0007 GB-Hours

**Cost**: **~$0.00004** (essentially free)

---

#### Scenario 2: Baseline Test (10-50 users, 5 minutes)
**Resources:**
- Requests: ~2,500 (avg 30 users × 10 votes × 8 rounds)
- Function Executions: ~2,500 × 200ms avg = 500 seconds
- Memory: 256MB avg
- GB-Hours: (256MB / 1024) × (500s / 3600) = 0.035 GB-Hours
- Bandwidth: ~5MB (small JSON responses)

**Cost**: **~$0.002** (negligible)

---

#### Scenario 3: Peak Load Test (500-1000 users, 15 minutes)
**Resources:**
- Requests: ~150,000 (avg 750 users × 10 votes × 20 rounds)
- Function Executions: ~150,000 × 200ms avg = 30,000 seconds
- Memory: 256MB avg
- GB-Hours: (256MB / 1024) × (30,000s / 3600) = 2.08 GB-Hours
- Bandwidth: ~300MB (JSON responses + headers)

**Cost**: **~$0.12** (within free tier)

---

#### Scenario 4: Stress Test (1000-3000 users, 30 minutes)
**Resources:**
- Requests: ~450,000 (avg 2000 users × 8 votes × 28 rounds)
- Function Executions: ~450,000 × 220ms avg = 99,000 seconds
- Memory: 256MB avg
- GB-Hours: (256MB / 1024) × (99,000s / 3600) = 6.88 GB-Hours
- Bandwidth: ~900MB (JSON responses)

**Cost**: **~$0.41** (within free tier)

---

#### Scenario 5: Extreme Scale Test (10,000-100,000 users, 1 hour)
⚠️ **REQUIRES VERCEL COORDINATION**

**Resources:**
- Requests: ~5,000,000 (avg 50,000 users × 10 votes × 10 rounds)
- Function Executions: ~5,000,000 × 250ms avg = 1,250,000 seconds
- Memory: 256MB avg (may increase under load)
- GB-Hours: (256MB / 1024) × (1,250,000s / 3600) = 86.8 GB-Hours
- Bandwidth: ~10GB (JSON responses + overhead)

**Overage Cost Calculation:**
- Function GB-Hours: 86.8 - 1000 (included) = **0 GB-Hours overage** ✅
- Bandwidth: 10GB - 1TB (included) = **0 GB overage** ✅

**Cost**: **Within free tier for one-time test**

**However:**
- Need to coordinate with Vercel (>50k RPS)
- DDoS protection may trigger
- May need to whitelist testing IPs
- Consider using multiple source IPs
- Ramp up slowly to avoid blocks

---

## Preview Deployments vs Production

### Cost Implications

**Preview Deployments:**
- ✅ **Same pricing structure** as production
- ✅ **Counted in same limits** (bandwidth, function execution)
- ✅ **No additional cost** per preview
- ⚠️ **Each test consumes from monthly quota**

**Advantages of Preview Testing:**
1. **Isolated environment** - No impact on production data
2. **Safe testing** - Can break things without user impact
3. **Real infrastructure** - Same Vercel edge network and functions
4. **Easy cleanup** - Delete preview after testing
5. **Branch-specific** - Test features before merge

**Disadvantages:**
1. **Cold starts** - Preview functions may be colder than production
2. **Cache miss** - CDN cache not warmed up
3. **Same billing** - Uses same quota as production

### Recommendation
✅ **Always test on Preview first**, then validate on Production with minimal traffic

---

## Monthly Budget Estimation

### Conservative Testing Schedule
- **Weekly Smoke Tests**: 4 × $0.00004 = **$0.0002/month**
- **Weekly Baseline Tests**: 4 × $0.002 = **$0.008/month**
- **Bi-weekly Peak Tests**: 2 × $0.12 = **$0.24/month**
- **Monthly Stress Test**: 1 × $0.41 = **$0.41/month**

**Total Testing Cost**: **~$0.66/month** (essentially free)

### Aggressive Testing Schedule (Pre-Election)
- **Daily Smoke Tests**: 30 × $0.00004 = **$0.001/month**
- **Daily Baseline Tests**: 30 × $0.002 = **$0.06/month**
- **Weekly Peak Tests**: 4 × $0.12 = **$0.48/month**
- **Weekly Stress Test**: 4 × $0.41 = **$1.64/month**
- **One Extreme Scale Test**: 1 × $0 = **$0/month** (within tier)

**Total Testing Cost**: **~$2.18/month** (still negligible)

---

## Cost Optimization Strategies

### 1. Minimize Observability During Tests
```javascript
// Disable expensive monitoring for load tests
if (process.env.LOAD_TEST === 'true') {
  // Skip Speed Insights
  // Skip Web Analytics
  // Reduce sampling rate
}
```

### 2. Use Efficient Function Configuration
```json
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 10,     // Keep timeout reasonable
      "memory": 256          // Start small, increase if needed
    }
  }
}
```

### 3. Implement Smart Caching
- Cache ranking calculations for 30-60s
- Use CDN for static assets
- Implement edge caching where possible

### 4. Rate Limiting
- Protect against runaway costs
- Use Vercel WAF or KV-based rate limiting
- Example: 100 requests/minute per session

### 5. Preview Cleanup
- Delete old preview deployments
- Each preview counts toward storage
- Automate cleanup in CI/CD

---

## 100,000 User Test Planning

### Phased Approach (Recommended)

**Phase 1: Ramp Test (15 minutes)**
- 0-5min: 0 → 10,000 users
- 5-10min: 10,000 → 50,000 users
- 10-15min: 50,000 → 100,000 users

**Phase 2: Sustained Load (30 minutes)**
- Hold at 100,000 users
- Monitor error rates
- Track function cold starts

**Phase 3: Ramp Down (10 minutes)**
- 100,000 → 10,000 users
- Verify graceful degradation

**Total Duration**: 55 minutes

### Resource Requirements
- **Requests**: ~10,000,000 (100k users × 10 votes × 10 rounds)
- **Function Execution**: ~173 GB-Hours
- **Bandwidth**: ~20GB
- **Cost**: **~$10.38** for function overages + **$0** for bandwidth

### Prerequisites for 100K Test
1. ✅ Contact Vercel support team
2. ✅ Get approval for high-volume test
3. ✅ Whitelist test IPs in WAF
4. ✅ Schedule during off-peak hours
5. ✅ Use preview deployment
6. ✅ Have monitoring dashboards ready
7. ✅ Coordinate with team
8. ✅ Plan rollback strategy

---

## Billing Alerts & Monitoring

### Recommended Alerts
1. **Function Execution > 800 GB-Hours** (80% of quota)
2. **Bandwidth > 800GB** (80% of quota)
3. **Error Rate > 5%** during tests
4. **p95 Latency > 1000ms**

### Monitoring Tools
- Vercel Analytics Dashboard
- Vercel Logs (real-time)
- k6 Cloud (for test results)
- Custom Grafana/InfluxDB setup

---

## Summary: Key Takeaways

✅ **Load testing is very affordable** on Vercel Pro
✅ **Preview deployments recommended** for initial tests
✅ **Coordinate with Vercel** for >50k RPS tests
✅ **100K user test is feasible** (~$10-15 for one run)
✅ **Regular testing fits easily** in monthly budget
✅ **Main cost driver** is production traffic, not tests

### Final Recommendation
Run your load tests on **Preview Deployments** for:
- Same infrastructure
- Isolated environment
- No production impact
- Same billing (but worth it for safety)

The cost difference between preview and production testing is **zero**, but the risk reduction is **immense**.
