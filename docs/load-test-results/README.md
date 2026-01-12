# Load Test Results

This directory contains documented results from load testing sessions.

## Structure

Each test result should be documented in a separate markdown file with the following naming convention:

```
YYYY-MM-DD-{test-type}.md
```

Example:
- `2026-01-15-baseline.md`
- `2026-01-20-peak.md`
- `2026-02-01-stress.md`

## Template

Use this template for documenting test results:

```markdown
# Load Test Results - {Test Type}

**Date**: YYYY-MM-DD
**Test Duration**: X minutes
**Target**: https://example.com
**Tester**: Name

## Test Configuration

- **Test Type**: Baseline/Peak/Stress/Spike/Endurance
- **Virtual Users**: X concurrent users
- **Duration**: X minutes
- **Ramp-up**: X minutes

## Results Summary

### Key Metrics

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Total Requests | X | - | - |
| Requests/sec | X | - | - |
| Error Rate | X% | <1% | ✅/❌ |
| p95 Vote Response | Xms | <500ms | ✅/❌ |
| p95 Ranking Response | Xms | <1000ms | ✅/❌ |

### Response Times

```
http_req_duration:
  avg=Xms min=Xms med=Xms max=Xms
  p(90)=Xms p(95)=Xms p(99)=Xms
```

### Checks

```
✓ checks.........................: XX.X%  ✓ XXXX ✗ XX
✓ vote status is 200.............: XX.X%  ✓ XXXX ✗ XX
✓ ranking status is 200..........: XX.X%  ✓ XXXX ✗ XX
```

## Observations

### What Went Well
- Point 1
- Point 2

### Issues Encountered
- Issue 1
- Issue 2

### Performance Notes
- Note 1
- Note 2

## System Behavior

### Resource Usage
- Function executions: X
- Average memory: X MB
- Peak memory: X MB
- Bandwidth: X GB

### Error Analysis
- Error type 1: X occurrences
- Error type 2: X occurrences

## Recommendations

1. Recommendation 1
2. Recommendation 2
3. Recommendation 3

## Action Items

- [ ] Action item 1
- [ ] Action item 2
- [ ] Action item 3

## Attachments

- `results.json` - Raw k6 output
- `grafana-dashboard.png` - Performance dashboard screenshot
- `vercel-logs.txt` - Relevant log excerpts
```

## Quick Links

- [Load Testing Plan](../load-testing.md)
- [Load Test Scripts](../../load-tests/)
- [GitHub Actions Workflow](../../.github/workflows/load-testing.yml)
