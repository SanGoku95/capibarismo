# Load Test Results - Example Baseline Test

**Date**: 2026-01-15  
**Test Duration**: 5 minutes  
**Target**: https://staging.capibarismo.com  
**Tester**: Example User  

## Test Configuration

- **Test Type**: Baseline Performance Test
- **Virtual Users**: 10 → 30 → 50 → 0 (staged ramp)
- **Total Duration**: 5 minutes
- **Ramp-up**: 1 minute to 10 users, then gradual increase
- **Test Script**: `load-tests/baseline.js`
- **k6 Version**: v0.48.0

## Results Summary

### Key Metrics

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Total Requests | 2,847 | - | - |
| Requests/sec | 9.49/s | - | ✅ |
| Error Rate | 0.35% | <1% | ✅ |
| p95 Vote Response | 285ms | <200ms | ⚠️ |
| p95 Ranking Response | 645ms | <500ms | ⚠️ |
| p99 Vote Response | 412ms | <300ms | ⚠️ |
| p99 Ranking Response | 892ms | <800ms | ⚠️ |

### Response Times

```
http_req_duration:
  avg=198ms min=87ms med=165ms max=1.2s
  p(90)=245ms p(95)=321ms p(99)=567ms

http_req_duration{name:vote}:
  avg=145ms min=87ms med=142ms max=780ms
  p(90)=210ms p(95)=285ms p(99)=412ms

http_req_duration{name:ranking}:
  avg=523ms min=215ms med=485ms max=1.2s
  p(90)=587ms p(95)=645ms p(99)=892ms
```

### Checks

```
✓ checks.........................: 99.65%  ✓ 2837  ✗ 10
  ✓ vote status is 200............: 99.80%  ✓ 2555  ✗ 5
  ✓ vote response is valid........: 99.80%  ✓ 2555  ✗ 5
  ✓ ranking status is 200.........: 98.26%  ✓ 282   ✗ 5
  ✓ ranking response is valid.....: 98.26%  ✓ 282   ✗ 5
```

### Traffic Pattern

```
http_reqs......................: 2847    9.49/s
  http_reqs{name:vote}..........: 2560    8.53/s
  http_reqs{name:ranking}.......: 287     0.96/s

data_received..................: 1.8 MB  6.0 kB/s
data_sent......................: 842 kB  2.8 kB/s

iteration_duration.............: avg=15.2s min=8.1s med=14.8s max=28.5s
iterations.....................: 287     0.96/s
```

### Virtual Users

```
vus............................: 50      min=0   max=50
vus_max........................: 50      min=50  max=50
```

## Observations

### What Went Well
- Error rate well below 1% threshold (0.35%)
- System handled 50 concurrent users without major issues
- Consistent throughput of ~9.5 requests/second
- Vote submissions completed quickly (avg 145ms)
- No system crashes or timeouts
- All endpoints remained responsive

### Issues Encountered
- **p95/p99 slightly above targets**: Response times exceeded targets by ~40-80ms
  - Vote p95: 285ms (target: <200ms) - 43% over target
  - Ranking p95: 645ms (target: <500ms) - 29% over target
- **5 failed requests for votes** (0.2% of vote requests)
  - Likely due to cold starts during ramp-up phase
- **5 failed requests for rankings** (1.7% of ranking requests)
  - May indicate computation bottleneck under load
- **Occasional spikes to 1.2s**: Max response time higher than expected

### Performance Notes
- Cold start impact visible in first 30 seconds
- Response times stabilized after initial ramp-up
- Ranking computation more expensive than vote submission (as expected)
- No performance degradation observed over test duration
- Memory usage remained stable throughout test

## System Behavior

### Resource Usage
- **Function executions**: ~2,847 invocations
- **Average memory**: 256 MB (estimated)
- **Peak memory**: 512 MB (estimated)
- **Bandwidth**: 2.64 MB total (1.8 MB received, 842 KB sent)
- **Function duration**: avg 150-500ms depending on endpoint

### Vercel Metrics (from dashboard)
- **Function Invocations**: 2,850
- **Errors**: 10 (0.35%)
- **95th Percentile Duration**: 320ms
- **Cold Starts**: ~5-8 during ramp-up
- **Bandwidth Used**: 2.7 MB

### Error Analysis
- **Timeout errors**: 0
- **5xx errors**: 8 (likely cold starts)
- **4xx errors**: 2 (invalid session ID format in 2 cases)
- **Connection errors**: 0

#### Error Breakdown by Type
1. **500 Internal Server Error**: 6 occurrences
   - All during first minute (cold starts)
   - Timestamp: 10:32:15 - 10:32:45
   
2. **503 Service Unavailable**: 2 occurrences
   - During peak load (50 VUs)
   - Timestamp: 10:35:20, 10:35:22
   
3. **400 Bad Request**: 2 occurrences
   - Test data generation issue
   - Timestamp: 10:33:42, 10:34:18

## Recommendations

### Immediate Actions
1. **Optimize ranking computation**: Consider caching or pre-computation
   - Current p95: 645ms, Target: <500ms
   - Impact: High - this is a critical user-facing operation
   
2. **Implement function warming**: Reduce cold start impact
   - Use Vercel's keep-warm feature or scheduled pings
   - Should eliminate the 5-8 cold starts observed
   
3. **Add caching for ranking calculation**: 
   - Cache results for 30-60 seconds per session
   - Reduce computation load by ~30-40%

### Medium-term Improvements
4. **Optimize vote submission response time**:
   - Current avg: 145ms, Target: <100ms
   - Consider async processing or write-behind caching
   
5. **Add rate limiting**: Prevent abuse while maintaining performance
   - Current: No rate limiting observed
   - Recommended: 100 requests/minute per session
   
6. **Implement better error handling**: Graceful degradation for cold starts
   - Return cached data or default responses
   - Retry logic for transient errors

### Long-term Enhancements
7. **Database optimization**: If using database, add indexes and query optimization
8. **CDN configuration**: Ensure proper caching headers for static assets
9. **Auto-scaling tuning**: Optimize Vercel function scaling parameters
10. **Monitoring alerts**: Set up alerts for p95 > 500ms or error rate > 1%

## Action Items

- [x] Complete baseline test execution
- [x] Document results and findings
- [ ] Review with team (deadline: 2026-01-17)
- [ ] Implement function warming (deadline: 2026-01-20)
- [ ] Add caching for ranking calculation (deadline: 2026-01-22)
- [ ] Optimize ranking computation algorithm (deadline: 2026-01-25)
- [ ] Re-run baseline test to verify improvements (deadline: 2026-01-27)
- [ ] Schedule peak load test (target: 2026-01-30)

## Attachments

- `baseline-results-2026-01-15.json` - Raw k6 output (2.4 MB)
- `vercel-dashboard-screenshot.png` - Performance metrics during test
- `vercel-function-logs.txt` - Relevant log excerpts showing errors
- `graph-response-times.png` - Response time distribution chart

## Next Steps

1. **Address immediate recommendations**: Focus on caching and cold starts
2. **Schedule follow-up test**: Re-run baseline after optimizations
3. **Plan peak load test**: Schedule for staging environment
4. **Update capacity planning**: Document findings in main load testing plan

## Notes

- Test conducted on staging environment (Vercel preview deployment)
- No real user traffic during test
- Blob storage performance was good (no storage-related errors)
- Network conditions were stable throughout test
- Test completed successfully without manual intervention

---

**Test Conclusion**: ✅ **PASSED with WARNINGS**

System performs acceptably under baseline load but has room for optimization. Response times slightly exceed targets, suggesting need for caching and cold start mitigation. Error rate is well below threshold. System is production-ready but optimizations recommended before high-traffic events.

**Overall Score**: 7.5/10
- Stability: 9/10
- Performance: 7/10  
- Reliability: 8/10
- Scalability: 7/10 (needs validation with peak load test)
