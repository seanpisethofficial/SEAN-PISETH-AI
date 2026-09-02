# Localization — Version 1.2.0

`LanguageRegistry` is the single source of truth.

Locale files live under `locales/`. Runtime lookup is performed only after registry validation; user input is never used directly as a filesystem path.

All visible UI strings should be represented by localization keys.
