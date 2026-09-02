# Billing — Version 1.2.0

`PaymentProvider` defines checkout, verification, webhook handling, and refund contracts.

This repository does not fake a payment provider. A production deployment must select a real provider, implement signature verification and idempotent webhook processing, and only then activate subscriptions.

Plan definitions and entitlement decisions are server-side.
