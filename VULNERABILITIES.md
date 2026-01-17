# Known Vulnerabilities

This document tracks known vulnerabilities in dependencies and the status of addressing them.

> **Note**: This document should be reviewed and updated monthly. The automated security workflow runs weekly and will detect new vulnerabilities.

Last reviewed: January 17, 2025

## Current Status

### Summary
- **Total vulnerabilities**: 14
- **Critical**: 0
- **High**: 2
- **Moderate**: 8
- **Low**: 4

### Production vs Development
- **Production dependencies**: 0 critical/high vulnerabilities ✅
- **Development dependencies**: All vulnerabilities are in dev dependencies only

## Development Dependency Vulnerabilities

These vulnerabilities are in development-only dependencies and do not affect production builds or runtime security.

### 1. React Router (@remix-run/router) - HIGH
- **Severity**: High
- **Issue**: XSS via Open Redirects
- **CVE**: GHSA-2w69-qvjg-hvjx
- **CVSS Score**: 8.0
- **Status**: Monitoring - Waiting for stable update
- **Impact**: Development only, not exploitable in production
- **Mitigation**: App does not use vulnerable redirect patterns

### 2. esbuild - MODERATE
- **Severity**: Moderate
- **Issue**: Development server can receive requests from any website
- **CVE**: GHSA-67mh-4wv8-2f99
- **Status**: Fixed in Vite 7.x (breaking changes, monitoring)
- **Impact**: Development server only
- **Mitigation**: Development server should not be exposed publicly

### 3. path-to-regexp (@vercel/node) - HIGH
- **Severity**: High
- **Issue**: Backtracking regular expressions (ReDoS)
- **CVE**: GHSA-9wv6-86v2-598j
- **Status**: Fixed in @vercel/node 4.x (breaking changes, monitoring)
- **Impact**: API routes in dev dependencies
- **Mitigation**: Not used in production runtime code

### 4. undici (@vercel/node) - MODERATE
- **Severity**: Moderate
- **Issues**: 
  - Insufficiently Random Values (GHSA-c76h-2ccp-4975)
  - DoS via bad certificate data (GHSA-cxrh-j4jr-qwg3)
  - Unbounded decompression (GHSA-g9mf-h72j-4rw9)
- **Status**: Monitoring for stable updates
- **Impact**: Development tooling only
- **Mitigation**: Not exposed in production

### 5. diff (jsdiff) - LOW
- **Severity**: Low
- **Issue**: DoS in parsePatch and applyPatch
- **CVE**: GHSA-73rr-hh4g-fpgx
- **Status**: Part of ts-node dev dependency
- **Impact**: Development tooling only
- **Mitigation**: Not used at runtime

## Resolution Strategy

### Immediate Actions (Completed)
1. ✅ Verified no critical/high vulnerabilities in production dependencies
2. ✅ Documented all known vulnerabilities
3. ✅ Set up automated security scanning (GitHub Actions)
4. ✅ Configured Dependabot for automatic updates
5. ✅ Added security policy (SECURITY.md)

### Ongoing Monitoring
1. 🔄 Weekly Dependabot scans for new vulnerabilities
2. 🔄 Automated CodeQL analysis on every PR
3. 🔄 Monthly review of this document
4. 🔄 Update dependencies when stable patches are available

### Blocked on Upstream
- **Vite 7.x**: Breaking changes, needs testing before upgrade
- **@vercel/node 4.x**: Breaking changes, needs Vercel compatibility check
- **React Router**: Waiting for stable release with fix

## Why Not Force Update?

Running `npm audit fix --force` would:
- Install Vite 7.x (breaking changes, not stable yet)
- Install @vercel/node 4.x (may break Vercel deployment)
- Potentially break the build system
- Risk introducing new bugs

**Risk Assessment**: Low
- All vulnerabilities are in dev dependencies
- None affect production builds or runtime
- Production dependencies are clean
- Development environments should not be exposed publicly

## How to Update This Document

When vulnerabilities change:
1. Run `npm audit` to get current status
2. Update the counts in Summary section
3. Add/remove/update vulnerability entries
4. Update the "Last updated" date
5. Commit changes to repository

## Monitoring Tools

We use several tools to monitor security:
- **npm audit**: Built-in npm vulnerability scanner
- **Dependabot**: Automated dependency updates
- **CodeQL**: Static code analysis for security issues
- **TruffleHog**: Secret scanning in repository
- **License Checker**: Ensure license compliance

## References

- [npm audit documentation](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [GitHub Security Advisories](https://github.com/advisories)
- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)
- Our [Security Policy](SECURITY.md)

## Questions?

If you have questions about these vulnerabilities:
1. Check [SECURITY.md](SECURITY.md) for reporting guidelines
2. Review existing [security advisories](https://github.com/SanGoku95/presidential-punch-peru/security/advisories)
3. Open a security advisory if you find a new issue
