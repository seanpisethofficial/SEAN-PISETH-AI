# Onboarding — Version 1.2.0

State machine:

NEW_USER → LANGUAGE_REQUIRED → LANGUAGE_SELECTED → WELCOME → TERMS_REQUIRED/PRIVACY_REQUIRED → COMPLETE.

Only COMPLETE may access the main AI experience.

Language callbacks are allowlisted and invalid callback data is rejected without persistence.
