# SEAN PISETH AI — Version 1.2.0

Production-oriented multilingual Telegram AI SaaS foundation.

## Stack
Node.js 22+, TypeScript strict, grammY, Fastify, PostgreSQL/Prisma, Redis-ready architecture, Zod, Vitest, Docker.

## Modes
- Smart AI → Claude adapter
- Chat AI → OpenAI adapter
- Language AI → Gemini adapter
- Auto AI → server-side intent routing

Provider SDK/API calls are isolated behind adapters. Credentials are environment-only.

## Language-first onboarding
A new Telegram user is persisted with `LANGUAGE_REQUIRED` and cannot access AI until a supported locale is selected and onboarding is completed.

Supported locale codes are centralized in `src/localization/language.registry.ts`.

## Run
1. Copy `.env.example` to `.env`.
2. Add Telegram and database configuration.
3. Add provider credentials/model IDs for the AI modes you want enabled.
4. `npm ci`
5. `npm run db:generate`
6. `npm run db:migrate`
7. `npm run db:seed`
8. `npm run dev`

The payment layer is intentionally provider-neutral. No payment is considered successful without a real provider implementation and verified webhook flow.
