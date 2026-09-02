# Deployment — Version 1.2.0

Use Docker with PostgreSQL. Redis is optional during simple development and can be enabled for distributed rate limiting/caching.

Required production secrets/configuration must be injected by the deployment platform. Never commit `.env`.
