---
name: Request Change
about: Code change
title: ''
labels: ''
assignees: ''

---

1) Objective: “Implement X so that Y happens for Z users.”

2) Background and constraints

Why this exists (business/technical driver)
Constraints (latency, cost, backward compatibility, API stability, security)

3) Scope

In scope ...
Out of scope ..

4) Interfaces

Inputs
Source (API endpoint / event / file)
Schema (types, required/optional)
Validation rules
Outputs
Schema
Side effects (DB writes, emitted events, logs)

5) Functional requirements (numbered, testable)

Write as “shall” statements. Example:
The service shall reject requests with missing user_id with HTTP 400 and a structured error body {code, message}.
The system shall be idempotent for the same request_id for 24 hours.

6) Non-functional requirements

Performance: p95 latency, throughput, timeouts
Reliability: retry policy, idempotency, failure modes
Security: authZ/authN, data handling, secrets, logging redaction
Observability: metrics, tracing, log fields

7) Acceptance criteria

Make it binary:
Unit tests added for cases A/B/C
Integration test passes
Lint/typecheck passes
No new high severity security findings
Migration plan documented if applicable

8) Examples

Provide:
At least 1 “happy path”
At least 3 edge cases
Expected outputs

9) Implementation notes (optional but powerful)

Files/modules to change
Existing functions to reuse
Forbidden approaches (e.g., “no new dependency,” “don’t change DB schema”)
