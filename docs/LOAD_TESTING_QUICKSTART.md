# Quick Start Guide - Load Testing

This guide will help you get started with load testing the Presidential Punch Peru application.

## Step 1: Install k6

Choose your platform:

### macOS
```bash
brew install k6
```

### Ubuntu/Debian
```bash
curl -s https://dl.k6.io/key.gpg | sudo apt-key add -
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

### Windows (using Chocolatey)
```bash
choco install k6
```

### Verify Installation
```bash
k6 version
# Should output: k6 vX.XX.X
```

## Step 2: Run Your First Test

### Smoke Test (Recommended for first run)

The smoke test is a quick validation that runs for just 1 minute with 5 concurrent users. This is perfect for verifying everything works before running larger tests.

```bash
# From the project root
npm run loadtest:smoke

# Or directly with k6
k6 run load-tests/smoke.js
```

**What to expect:**
- Test runs for ~60 seconds
- 5 concurrent users
- Tests vote submission and ranking endpoints
- Should complete successfully with minimal errors

**Example output:**
```
✓ checks.........................: 98.50%  ✓ 197   ✗ 3
  http_req_duration..............: avg=245ms min=123ms med=220ms max=890ms
✓ http_req_failed...............: 0.50%   ✓ 1     ✗ 199
  http_reqs......................: 200     3.33/s
```

## Step 3: Run a Baseline Test

Once the smoke test passes, run a baseline test to establish performance benchmarks:

```bash
npm run loadtest:baseline
```

**What to expect:**
- Test runs for ~5 minutes
- Ramps from 10 to 50 concurrent users
- More comprehensive than smoke test
- Establishes performance baseline metrics

## Step 4: Understanding Results

### Reading the Output

k6 provides detailed metrics at the end of each test:

```
scenarios.........................: (100.00%) 1 scenario, 50 max VUs, 5m30s max duration
✓ checks.........................: 99.20%  ✓ 2976  ✗ 24
  data_received..................: 1.2 MB  4.0 kB/s
  data_sent......................: 450 kB  1.5 kB/s
  http_req_blocked...............: avg=1.2ms   min=1µs     med=5µs     max=120ms
✓ http_req_duration..............: avg=245ms   min=123ms   med=220ms   max=890ms
    { expected_response:true }...: avg=240ms   min=123ms   med=218ms   max=850ms
✗ http_req_failed...............: 0.80%   ✓ 24    ✗ 2976
  http_reqs......................: 3000    10/s
  iteration_duration.............: avg=4.5s    min=1.2s    med=4.2s    max=8.5s
  iterations.....................: 300     1/s
  vus............................: 50      min=10  max=50
  vus_max........................: 50      min=10  max=50
```

### Key Metrics Explained

| Metric | Description | What's Good? |
|--------|-------------|--------------|
| **checks** | % of successful assertions | >95% |
| **http_req_failed** | % of failed HTTP requests | <1% |
| **http_req_duration** (p95) | 95th percentile response time | <500ms for votes, <1000ms for rankings |
| **http_reqs** | Total requests and rate | Higher is better (if no errors) |
| **vus** | Virtual users (concurrent) | Depends on test scenario |

### Interpreting Symbols

- ✓ (green checkmark) = Threshold passed
- ✗ (red X) = Threshold failed
- Yellow = Warning

## Step 5: Test Against Different Environments

### Testing Staging Environment

```bash
# Set BASE_URL environment variable
BASE_URL=https://your-staging-deployment.vercel.app npm run loadtest:smoke
```

### Testing Preview Deployments

```bash
BASE_URL=https://presidential-punch-peru-git-feat-xyz.vercel.app npm run loadtest:smoke
```

## Common Issues and Solutions

### Issue: "k6: command not found"
**Solution**: k6 is not installed. Follow Step 1 to install it.

### Issue: High error rate (>5%)
**Possible causes:**
- Target URL is incorrect
- API endpoints are down
- Rate limiting is active
- Network issues

**Solutions:**
1. Verify BASE_URL is correct
2. Check API endpoints manually: `curl https://your-url.com/api/game/vote`
3. Reduce concurrent users
4. Check Vercel dashboard for errors

### Issue: Slow response times
**Possible causes:**
- Cold starts (serverless functions)
- Database/storage latency
- Network latency
- System under load

**Solutions:**
1. Run a warm-up test first
2. Wait a few minutes and retry
3. Check Vercel metrics dashboard
4. Verify you're not hitting rate limits

### Issue: Test times out
**Possible causes:**
- Test duration too long
- System unresponsive
- Network timeout

**Solutions:**
1. Use Ctrl+C to stop the test
2. Reduce VUs (virtual users)
3. Check system health
4. Increase timeout in test script

## Next Steps

### After Successful Baseline Test

1. **Document Results**: Save the output and create a results document
   ```bash
   npm run loadtest:baseline > results/baseline-$(date +%Y-%m-%d).txt
   ```

2. **Run Peak Load Test**: Test with higher load (500-1000 users)
   ```bash
   npm run loadtest:peak
   ```

3. **Set Up Monitoring**: Configure alerts in Vercel dashboard

4. **Schedule Regular Tests**: Use GitHub Actions or cron jobs

### Viewing Detailed Results

For more detailed analysis, output results to JSON:

```bash
k6 run --out json=results.json load-tests/baseline.js
```

Then analyze with tools like:
- [k6 Cloud](https://k6.io/cloud/) (free tier available)
- [Grafana](https://grafana.com/) + [InfluxDB](https://www.influxdata.com/)
- Custom analysis scripts

## Test Scenarios Overview

| Test | Duration | Users | Purpose | When to Run |
|------|----------|-------|---------|-------------|
| **Smoke** | 1 min | 5 | Quick validation | Before every test session |
| **Baseline** | 5 min | 10-50 | Normal performance | Weekly |
| **Peak** | 15 min | 500-1000 | High load | Before major events |
| **Stress** | 30 min | 1000-3000+ | Find limits | Quarterly |
| **Spike** | 10 min | 100→2000→100 | Resilience | Monthly |
| **Endurance** | 2 hours | 200 | Stability | Before elections |

## Best Practices

### DO ✅
- Always start with smoke test
- Test against staging first
- Monitor costs during tests
- Document all results
- Run tests during off-peak hours
- Notify team before large tests

### DON'T ❌
- Don't test production without planning
- Don't run stress tests against production
- Don't ignore error messages
- Don't run multiple tests simultaneously
- Don't forget to stop tests if issues occur

## Getting Help

- **Documentation**: [Load Testing Plan](../docs/load-testing.md)
- **k6 Docs**: https://k6.io/docs/
- **Issues**: [GitHub Issues](https://github.com/Italosayan/presidential-punch-peru/issues)
- **Team**: Contact via project channels

## Example Commands Cheat Sheet

```bash
# Quick smoke test
npm run loadtest:smoke

# Baseline against staging
BASE_URL=https://staging.example.com npm run loadtest:baseline

# Save results to file
npm run loadtest:baseline > results.txt

# Run with debug output
DEBUG=true npm run loadtest:smoke

# Output JSON for analysis
k6 run --out json=results.json load-tests/baseline.js

# Run specific test directly
k6 run load-tests/peak.js

# Set custom BASE_URL
k6 run --env BASE_URL=https://custom-url.com load-tests/smoke.js
```

---

**Ready to start?** Run your first test now:
```bash
npm run loadtest:smoke
```
