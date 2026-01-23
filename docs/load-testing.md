# Load Testing Plan

This project includes a k6-based load testing suite under `load-tests/`.

## Goals

- Validate baseline performance and stability of the app and API.
- Catch regressions before releases.
- Provide repeatable scenarios (smoke, baseline, stress, spike, endurance).

## What’s in `load-tests/`

See `load-tests/README.md` for the full set of scenarios, configuration, and operational guidance.

## Quick start

From the repository root:

```bash
npm run loadtest:smoke
npm run loadtest:baseline
```

## Notes

- Run load tests only against environments you control/own.
- Prefer running `smoke` in PRs and `baseline/stress/endurance` before releases.
