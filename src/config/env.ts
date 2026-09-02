import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.string().default("info"),
  TELEGRAM_BOT_TOKEN: z.string().min(1),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().optional(),
  CLAUDE_API_KEY: z.string().optional(),
  CLAUDE_MODEL: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().optional(),
  TERMS_URL: z.string().url(),
  PRIVACY_URL: z.string().url(),
  TERMS_VERSION: z.string().min(1).default("1.2.0"),
  PRIVACY_VERSION: z.string().min(1).default("1.2.0"),
  ADMIN_TELEGRAM_IDS: z.string().default(""),
  PAYMENT_PROVIDER: z.string().optional(),
  PAYMENT_WEBHOOK_SECRET: z.string().optional(),
  PAYMENT_API_KEY: z.string().optional(),
  MAX_MESSAGE_CHARS: z.coerce.number().int().positive().default(12000),
  AI_TIMEOUT_MS: z.coerce.number().int().positive().default(45000),
  AI_MAX_OUTPUT_TOKENS: z.coerce.number().int().positive().default(4096)
});

export const env = schema.parse(process.env);

export const adminTelegramIds = new Set(
  env.ADMIN_TELEGRAM_IDS.split(",").map((v) => v.trim()).filter(Boolean)
);
