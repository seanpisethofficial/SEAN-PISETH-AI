# Operations — Version 1.2.0

Health:
- `/health` confirms process availability.
- `/ready` verifies database readiness.

Logs should remain structured and must not contain credentials, authentication tokens, or payment secrets.

Use database migrations for schema changes.
