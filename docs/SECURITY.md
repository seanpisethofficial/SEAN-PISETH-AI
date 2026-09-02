# Security — Version 1.2.0

Principles:
- Client input is untrusted.
- Server-side subscription and quota state is authoritative.
- Secrets exist only in environment/configuration.
- User-owned data is queried by user ID.
- Sensitive admin operations must be authenticated and audited.
- Prompt-injection signals are handled before privileged instructions are constructed.
- Internal errors are logged server-side and replaced with safe user-facing errors.
