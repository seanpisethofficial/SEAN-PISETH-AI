# Testing — Version 1.2.0

Run:

- `npm run typecheck`
- `npm test`
- `npm run check:languages`
- `npm run build`

CI also builds the Docker image.

Tests cover locale allowlisting, onboarding gates, prompt safety, and deterministic AI routing. Add provider integration tests only in environments with real credentials and explicit test budgets.
