# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of Presidential Punch Peru seriously. If you believe you have found a security vulnerability, please report it to us as described below.

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

1. **GitHub Security Advisories**: [Report a vulnerability](https://github.com/Italosayan/presidential-punch-peru/security/advisories/new)
2. **Email**: Send details to italosayan@gmail.com

### What to Include

Please include the following information in your report:

- Type of vulnerability (e.g., XSS, SQL injection, authentication bypass)
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability, including how an attacker might exploit it

### Response Timeline

- We will acknowledge your report within **48 hours**
- We will send a more detailed response within **7 days** indicating the next steps
- We will keep you informed about the progress toward fixing the vulnerability
- We will notify you when the vulnerability is fixed

## Security Best Practices for Contributors

When contributing to this project:

1. **Never commit secrets**: API keys, tokens, passwords, or credentials should never be in the codebase
2. **Use environment variables**: All sensitive configuration should use environment variables
3. **Sanitize user input**: Always validate and sanitize user inputs to prevent XSS and injection attacks
4. **Keep dependencies updated**: Regularly update dependencies to patch known vulnerabilities
5. **Follow the Facts Protocol**: When adding political data, ensure sources are verified and traceable
6. **Review security implications**: Consider security impact of all code changes

## Security Measures

This project implements several security measures:

- **Environment variable isolation**: Sensitive keys are never committed to the repository
- **Input validation**: User inputs are validated using Zod schemas
- **Content Security Policy**: Appropriate headers are set for API routes
- **Dependency scanning**: Regular npm audit checks
- **Code review**: All changes require review before merging

## Dependency Vulnerabilities

We regularly monitor dependencies for known vulnerabilities using `npm audit`. To check for vulnerabilities:

```bash
npm audit
```

To automatically fix vulnerabilities where possible:

```bash
npm audit fix
```

## Responsible Disclosure

We ask that you:

- Give us reasonable time to respond to and fix the vulnerability before public disclosure
- Make a good faith effort to avoid privacy violations, data destruction, and service interruption
- Do not exploit the vulnerability beyond what is necessary to demonstrate it

We commit to:

- Respond to your report promptly
- Keep you informed throughout the resolution process
- Credit you for the discovery (unless you prefer to remain anonymous)
- Work with you to understand and resolve the issue quickly

Thank you for helping keep Presidential Punch Peru and our users safe!
