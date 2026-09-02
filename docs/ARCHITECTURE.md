# Architecture — Version 1.2.0

Telegram update → user lookup → onboarding gate → entitlement/quota → rate limit → AI router → provider adapter → response persistence → usage recording → Telegram.

The bot layer never imports provider SDKs directly.

The database is authoritative for user language, onboarding state, subscriptions, usage, conversations, and audit records.

External services are configured through environment variables.
