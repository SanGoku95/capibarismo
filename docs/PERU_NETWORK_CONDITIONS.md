# Peru Network Conditions - Load Testing Configuration

## Overview

This document provides realistic network conditions for simulating Peruvian users accessing the Presidential Punch Peru application.

## Current Peruvian Internet Statistics (2026)

### Mobile Internet (Primary Access Method)
Based on Speedtest Global Index and Ookla research:

- **Average Mobile Download Speed**: 35 Mbps
- **Average Mobile Upload Speed**: 15.6 Mbps
- **Average Mobile Latency**: 22 milliseconds
- **4G Coverage**: 88.5% of connection time
- **5G Coverage**: ~15.5% (early rollout)
- **Global Ranking**: 94th for mobile broadband speeds

### Fixed Broadband
- **Average Download Speed**: 45-60 Mbps (urban areas)
- **Average Upload Speed**: 20-30 Mbps
- **Average Latency**: 15-20 ms

### Geographic Variations

#### Urban Areas (Lima, Arequipa, Trujillo)
- **Download**: 40-50 Mbps (mobile), 60-100 Mbps (fixed)
- **Latency**: 18-22 ms
- **Quality**: Good 4G/LTE coverage, emerging 5G

#### Rural/Remote Areas
- **Download**: 10-20 Mbps (mobile), 5-15 Mbps (fixed)
- **Latency**: 40-80 ms
- **Quality**: Limited 3G/4G, packet loss common

#### Suburban Areas
- **Download**: 25-35 Mbps
- **Latency**: 25-35 ms
- **Quality**: Moderate 4G coverage

## Network Throttling Profiles for k6

### Profile 1: Urban Peruvian User (Good Connection)
**Scenario**: User in Lima with 4G connection

```javascript
export const PERU_URBAN = {
  downloadBandwidth: 35 * 125,      // 35 Mbps = 4375 KB/s
  uploadBandwidth: 15.6 * 125,      // 15.6 Mbps = 1950 KB/s
  latency: 22,                       // 22ms average
  packetLoss: 0.5,                   // 0.5% packet loss (good conditions)
};
```

**Expected Impact**:
- Vote submission: ~150-200ms total (22ms latency + API time)
- Ranking fetch: ~350-450ms total
- Generally acceptable UX

### Profile 2: Suburban Peruvian User (Average Connection)
**Scenario**: User in suburban area with moderate 4G

```javascript
export const PERU_SUBURBAN = {
  downloadBandwidth: 25 * 125,      // 25 Mbps = 3125 KB/s
  uploadBandwidth: 12 * 125,        // 12 Mbps = 1500 KB/s
  latency: 30,                       // 30ms average
  packetLoss: 1.5,                   // 1.5% packet loss
};
```

**Expected Impact**:
- Vote submission: ~180-250ms total
- Ranking fetch: ~400-550ms total
- Noticeable but acceptable delays

### Profile 3: Rural Peruvian User (Limited Connection)
**Scenario**: User in rural area with 3G/limited 4G

```javascript
export const PERU_RURAL = {
  downloadBandwidth: 10 * 125,      // 10 Mbps = 1250 KB/s
  uploadBandwidth: 5 * 125,         // 5 Mbps = 625 KB/s
  latency: 60,                       // 60ms average
  packetLoss: 3,                     // 3% packet loss (poor conditions)
};
```

**Expected Impact**:
- Vote submission: ~280-400ms total
- Ranking fetch: ~600-900ms total
- Users will notice delays, borderline acceptable

### Profile 4: Congested Network (Peak Hours)
**Scenario**: Urban user during peak hours (7-10 PM)

```javascript
export const PERU_CONGESTED = {
  downloadBandwidth: 20 * 125,      // 20 Mbps (degraded)
  uploadBandwidth: 8 * 125,         // 8 Mbps (degraded)
  latency: 45,                       // 45ms (increased)
  packetLoss: 2,                     // 2% packet loss
};
```

**Expected Impact**:
- Vote submission: ~220-320ms total
- Ranking fetch: ~500-700ms total
- Frustrating but usable during election events

## Implementation in k6

### Basic Network Simulation

k6 doesn't natively support bandwidth throttling, but we can simulate network conditions through:

1. **Latency Simulation**: Add artificial delays
2. **Response Time Adjustments**: Adjust thresholds based on network profile
3. **Documentation**: Clear expectations for each profile

### Example Configuration

```javascript
// In load-tests/config.js

// Peru network profiles
export const PERU_NETWORK_PROFILES = {
  urban: {
    name: 'Urban Peru (Good 4G)',
    downloadMbps: 35,
    uploadMbps: 15.6,
    latencyMs: 22,
    packetLoss: 0.5,
    description: 'Lima, Arequipa, major cities',
  },
  suburban: {
    name: 'Suburban Peru (Moderate 4G)',
    downloadMbps: 25,
    uploadMbps: 12,
    latencyMs: 30,
    packetLoss: 1.5,
    description: 'Mid-size cities, suburban areas',
  },
  rural: {
    name: 'Rural Peru (Limited 3G/4G)',
    downloadMbps: 10,
    uploadMbps: 5,
    latencyMs: 60,
    packetLoss: 3,
    description: 'Remote areas, limited coverage',
  },
  congested: {
    name: 'Congested Network (Peak Hours)',
    downloadMbps: 20,
    uploadMbps: 8,
    latencyMs: 45,
    packetLoss: 2,
    description: 'Urban during 7-10 PM peak',
  },
};

// Adjusted QoE thresholds for Peru
export const PERU_QOE_THRESHOLDS = {
  EXCELLENT: {
    vote: 150,      // Account for 22ms baseline latency
    ranking: 350,
    ttfb: 120,
  },
  GOOD: {
    vote: 320,      // Account for typical Peru conditions
    ranking: 850,
    ttfb: 220,
  },
  POOR: {
    vote: 550,      // Still usable threshold
    ranking: 1600,
    ttfb: 550,
  }
};
```

## Testing Strategy for Peruvian Users

### Recommended Test Mix

For realistic election day simulation, use this distribution:

- **60%** Urban profile (majority of users)
- **25%** Suburban profile
- **10%** Rural profile
- **5%** Congested profile

### Implementation Approach

Since k6 doesn't support per-VU network throttling, we recommend:

1. **Adjust Performance Thresholds**: Account for Peru's 22ms baseline latency
2. **Document Expected Times**: Clear expectations for each network profile
3. **Monitor Real User Data**: Use Vercel Analytics to track actual Peru performance
4. **Browser-Based Testing**: Use tools like WebPageTest with Peru location

### Performance Targets for Peru

Adjusted targets accounting for Peruvian network conditions:

| Metric | Global Target | Peru Urban | Peru Rural |
|--------|---------------|------------|------------|
| Vote (p95) | <300ms | <320ms | <550ms |
| Ranking (p95) | <800ms | <850ms | <1600ms |
| TTFB (p95) | <200ms | <220ms | <550ms |
| Error Rate | <1% | <1% | <2% |

## Browser-Based Testing with Peru Network

For more realistic testing, use WebPageTest or Chrome DevTools:

### Chrome DevTools Network Throttling

```javascript
// Custom profile for Chrome DevTools
{
  "title": "Peru 4G (Urban)",
  "description": "Typical Peruvian urban 4G connection",
  "download": 4375,    // KB/s (35 Mbps)
  "upload": 1950,      // KB/s (15.6 Mbps)
  "latency": 22        // ms
}
```

### WebPageTest Configuration

```
Location: South America (São Paulo or Buenos Aires as proxy)
Connection: Custom
- Download: 35 Mbps
- Upload: 15.6 Mbps
- Latency: 22 ms
- Packet Loss: 0.5%
```

## Real User Monitoring (RUM)

### Vercel Analytics Configuration

Enable geographic tracking to monitor actual Peru performance:

1. Filter by country: Peru (PE)
2. Track Core Web Vitals by region
3. Compare urban vs rural performance
4. Monitor during peak election hours

### Key Metrics to Track

- **P75 Response Time** from Peru IPs
- **Error Rate** by Peruvian regions
- **Abandonment Rate** (users leaving before completion)
- **Time to Interactive** for Peru users

## Recommendations

### For Development

1. **Test with Peru profile**: Use adjusted thresholds
2. **Optimize for latency**: Minimize round trips
3. **Cache aggressively**: Reduce bandwidth requirements
4. **Compress responses**: Gzip/Brotli for all API responses
5. **Use CDN effectively**: Vercel Edge Network helps

### For Load Testing

1. **Adjust thresholds**: Add 22ms baseline to all targets
2. **Test during Peru peak hours**: 7-10 PM Peru time (EST+0)
3. **Monitor from Lima region**: If possible, run tests from AWS South America
4. **Document assumptions**: Clear about network profile used
5. **Validate with RUM**: Compare load test vs real user metrics

### For Production

1. **Set realistic SLOs**: Based on Peru network conditions
2. **Monitor by region**: Separate Peru metrics
3. **Optimize critical path**: Vote submission most important
4. **Implement retry logic**: Handle packet loss gracefully
5. **Progressive enhancement**: Work on slow connections

## Example Test Command

```bash
# Run baseline test with Peru considerations documented
NETWORK_PROFILE=peru-urban npm run loadtest:baseline

# Or with explicit note
echo "Testing with Peru Urban profile (35 Mbps, 22ms latency)"
npm run loadtest:baseline
```

## Limitations and Notes

### k6 Limitations

- k6 doesn't support native bandwidth throttling
- Network simulation requires external tools or cloud execution
- Best practice: Run from geographically close region (AWS South America)

### Workarounds

1. **Run from AWS São Paulo**: Closest AWS region to Peru
2. **Use proxy with throttling**: HAProxy or similar
3. **Simulate in browser**: WebPageTest, Puppeteer with throttling
4. **Document expectations**: Clear about network assumptions

### Real-World Testing

For most accurate results:

1. **Test from actual Peru location**: VPN or local tester
2. **Test on actual devices**: Typical Peruvian smartphones
3. **Test during local hours**: Peak and off-peak
4. **Collect RUM data**: Real user monitoring most accurate

## Conclusion

Peruvian users typically experience:
- **22ms baseline latency** (mobile 4G)
- **35 Mbps download** (adequate for our JSON API)
- **Good overall experience** in urban areas
- **Acceptable experience** in suburban/rural areas

Our application should perform well for Peruvian users as it's primarily JSON API calls (small payloads). The main consideration is **accounting for the additional 22ms latency** in all performance targets and ensuring the application works acceptably even on slower rural connections.
