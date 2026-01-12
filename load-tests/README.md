# Load Tests

This directory contains load testing scripts for the Presidential Punch Peru game application using [k6](https://k6.io/).

**🇵🇪 Peru-Specific Testing**: All tests include Peru network condition profiles accounting for realistic Peruvian internet (22ms avg latency, 35 Mbps mobile). See `peru-baseline.js` for dedicated Peru testing.

## Prerequisites

### Install k6

**macOS:**
```bash
brew install k6
```

**Ubuntu/Debian:**
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

**Windows:**
```bash
choco install k6
```

**Via npm (fallback):**
```bash
npm install -g k6
```

## UI/UX Performance Standards

As an interactive voting game ("Presidential Punch"), the application must adhere to strict UX contracts to maintain "Game Feel" and "Flow State". These standards define the pass/fail criteria for our load tests.

### 1. "The Punch" (Immediate Feedback)
The voting action must feel visceral and instantaneous.
- **Expectation**: < 100ms (Perceived)
- **Technical Target**: API latency < 300ms (Optimistic UI masks the network, but confirmation must arrive before the next interaction).
- **UX Theory**: 0.1s is the limit for having the user feel that the system is reacting instantaneously.

### 2. "The Flow" (Sustained Rhythm)
Users enter a rhythmic state of "Vote -> Next -> Vote". Interruptions break this trance.
- **Expectation**: < 1.0s (Transition)
- **Technical Target**: Ranking/Next Pair load < 1000ms.
- **UX Theory**: 1.0s is the limit for the user's flow of thought to stay uninterrupted. Delays > 1s require a loading indicator and cause a mental context switch.

### 3. "The Reach" (Digital Inclusion)
Democracy is for everyone. The experience must degrade gracefully, not fail.
- **Scope**: Rural Peru (10 Mbps / 60ms latency).
- **Expectation**: Functional interaction within 3s on 3G networks.
- **Constraint**: Strict timeouts (5s) prevent "zombie" states where the user doesn't know if the app crashed.

## Test Scenarios

### 1. Smoke Test (`smoke.js`)
Quick sanity check to verify basic functionality.

- **Users:** 5 concurrent
- **Duration:** 1 minute
- **Purpose:** Validate endpoints before larger tests

```bash
npm run loadtest:smoke
# or
k6 run load-tests/smoke.js
```

### 2. Baseline Test (`baseline.js`)
Establish baseline performance metrics under normal load.

- **Users:** 10-50 concurrent
- **Duration:** 5 minutes
- **Purpose:** Measure normal operating performance

```bash
npm run loadtest:baseline
# or
k6 run load-tests/baseline.js
```

### 3. Peak Load Test (`peak.js`)
Simulate peak traffic during election events.

- **Users:** 500-1000 concurrent
- **Duration:** 15 minutes
- **Purpose:** Test high-load scenarios

```bash
npm run loadtest:peak
# or
k6 run load-tests/peak.js
```

### 4. Stress Test (`stress.js`)
Identify breaking point and failure modes.

- **Users:** 1000-3000+ concurrent (gradual increase)
- **Duration:** ~30 minutes
- **Purpose:** Find system limits

```bash
npm run loadtest:stress
# or
k6 run load-tests/stress.js
```

### 5. Spike Test (`spike.js`)
Test system resilience to sudden traffic spikes.

- **Users:** 100 → 2000 (spike) → 100 (recovery)
- **Duration:** 10 minutes
- **Purpose:** Validate auto-scaling and recovery

```bash
npm run loadtest:spike
# or
k6 run load-tests/spike.js
```

### 6. Endurance Test (`endurance.js`)
Verify system stability over extended period.

- **Users:** 200 concurrent
- **Duration:** 2 hours
- **Purpose:** Detect memory leaks and degradation

```bash
npm run loadtest:endurance
# or
k6 run load-tests/endurance.js
```

### 7. Extreme Scale Test (`extreme-scale.js`)
Test maximum expected capacity for election day.

- **Users:** Up to 100,000 concurrent (phased ramp)
- **Duration:** ~55 minutes
- **Purpose:** Maximum capacity testing
- **⚠️ Requires Vercel coordination**

```bash
npm run loadtest:extreme
# or
k6 run load-tests/extreme-scale.js
```

### 8. Peru-Specific Test (`peru-baseline.js`) 🇵🇪
Test with realistic Peruvian network conditions.

- **Users:** 10-50 concurrent
- **Duration:** 5 minutes
- **Purpose:** Measure experience for Peruvian users
- **Network Profiles:** urban (default), suburban, rural, congested

```bash
# Default (urban Peru - 35 Mbps, 22ms latency)
npm run loadtest:peru

# Specific network profiles
npm run loadtest:peru:urban      # Lima, major cities (60% of users)
npm run loadtest:peru:suburban   # Mid-size cities (25% of users)
npm run loadtest:peru:rural      # Remote areas (10% of users)
npm run loadtest:peru:congested  # Peak hours (5% of users)

# Or manually
NETWORK_PROFILE=rural k6 run load-tests/peru-baseline.js
```

**Peru Network Profiles:**
- **Urban**: 35 Mbps, 22ms latency - Lima, Arequipa, Trujillo
- **Suburban**: 25 Mbps, 30ms latency - Mid-size cities
- **Rural**: 10 Mbps, 60ms latency - Remote areas, limited coverage
- **Congested**: 20 Mbps, 45ms latency - Peak hours (7-10 PM)

See [PERU_NETWORK_CONDITIONS.md](../docs/PERU_NETWORK_CONDITIONS.md) for detailed Peru-specific testing guide.

## Running Tests

### Basic Usage

```bash
# Run a specific test
k6 run load-tests/smoke.js

# Run against a specific environment
k6 run --env BASE_URL=https://staging.capibarismo.com load-tests/baseline.js

# Enable debug logging
k6 run --env DEBUG=true load-tests/smoke.js

# Output results to JSON
k6 run --out json=results.json load-tests/baseline.js
```

### Using npm Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "loadtest:smoke": "k6 run load-tests/smoke.js",
    "loadtest:baseline": "k6 run load-tests/baseline.js",
    "loadtest:peak": "k6 run load-tests/peak.js",
    "loadtest:stress": "k6 run load-tests/stress.js",
    "loadtest:spike": "k6 run load-tests/spike.js",
    "loadtest:endurance": "k6 run load-tests/endurance.js"
  }
}
```

### Environment Variables

- `BASE_URL`: Target URL (default: `https://capibarismo.com`)
- `DEBUG`: Enable debug logging (default: `false`)

Example:
```bash
BASE_URL=https://staging.capibarismo.com DEBUG=true k6 run load-tests/smoke.js
```

## Understanding Results

### Key Metrics

k6 provides comprehensive metrics after each test:

```
✓ checks.........................: 99.50%  ✓ 597  ✗ 3
  http_req_duration..............: avg=245ms min=123ms med=220ms max=890ms p(90)=380ms p(95)=450ms
✗ http_req_failed...............: 0.50%   ✓ 3    ✗ 597
  http_reqs......................: 600     20/s
  vus............................: 50      min=0  max=50
```

**Important metrics:**
- ✓/✗ **checks**: Pass/fail rate for test assertions
- **http_req_duration**: Response time statistics (p95, p99 are critical)
- **http_req_failed**: Percentage of failed requests
- **http_reqs**: Total requests and rate (requests per second)
- **vus**: Virtual users (concurrent users)

### Interpreting Results

**Good Performance:**
- ✅ http_req_failed < 1%
- ✅ p95 response time < 500ms for votes
- ✅ p95 response time < 1000ms for rankings
- ✅ All checks passing

**Warning Signs:**
- ⚠️ http_req_failed 1-5%
- ⚠️ p95 response time 500-1000ms for votes
- ⚠️ Increasing error rate over time

**Critical Issues:**
- ❌ http_req_failed > 5%
- ❌ p95 response time > 2000ms
- ❌ System unresponsive or timing out

## Best Practices

### Before Running Tests

1. **Start small**: Always run smoke test first
2. **Use staging**: Test on staging environment, not production
3. **Monitor costs**: Load tests consume serverless function executions
4. **Schedule appropriately**: Run during off-peak hours
5. **Notify team**: Inform team before running large tests

### During Tests

1. **Monitor in real-time**: Watch Vercel dashboard for metrics
2. **Check error logs**: Review function logs for issues
3. **Watch costs**: Monitor function execution costs
4. **Be ready to abort**: Stop test if issues occur (`Ctrl+C`)

### After Tests

1. **Document results**: Save metrics and findings
2. **Analyze patterns**: Look for trends and bottlenecks
3. **Create reports**: Share findings with team
4. **Plan optimizations**: Identify improvements needed

## Troubleshooting

### Common Issues

**Test fails to start:**
```bash
# Check k6 installation
k6 version

# Verify script syntax
k6 run --no-color load-tests/smoke.js
```

**High error rate:**
- Check BASE_URL is correct
- Verify API endpoints are accessible
- Review Vercel function logs
- Check rate limiting

**Timeouts:**
- Increase timeout in test scripts
- Check network connectivity
- Verify serverless functions aren't cold starting

**Inconsistent results:**
- Run multiple times to establish baseline
- Check for external factors (CDN, network)
- Verify consistent load pattern

## Output Formats

### Console Output (Default)
Real-time metrics printed to console.

### JSON Output
```bash
k6 run --out json=results.json load-tests/baseline.js
```

### CSV Output
```bash
k6 run --out csv=results.csv load-tests/baseline.js
```

### InfluxDB (Advanced)
```bash
k6 run --out influxdb=http://localhost:8086/k6 load-tests/baseline.js
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Load Test

on:
  schedule:
    - cron: '0 2 * * 1' # Weekly on Monday at 2 AM
  workflow_dispatch: # Manual trigger

jobs:
  load-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install k6
        run: |
          sudo gpg -k
          sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
          echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
          sudo apt-get update
          sudo apt-get install k6
      
      - name: Run Smoke Test
        run: k6 run load-tests/smoke.js
      
      - name: Run Baseline Test
        run: k6 run load-tests/baseline.js
      
      - name: Upload Results
        uses: actions/upload-artifact@v3
        with:
          name: load-test-results
          path: results.json
```

## Resources

- [k6 Documentation](https://k6.io/docs/)
- [Load Testing Best Practices](https://k6.io/docs/test-types/)
- [Vercel Functions Limits](https://vercel.com/docs/functions/limits)
- [Project Load Testing Plan](../docs/load-testing.md)

## Support

For questions or issues with load tests:
1. Check the [main documentation](../docs/load-testing.md)
2. Review k6 documentation
3. Open an issue on GitHub
4. Contact the development team
