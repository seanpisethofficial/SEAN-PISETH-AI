import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { env } from "../config/env.js";
import { prisma } from "../database/client.js";
import { warmLocalization } from "../localization/localization.service.js";
import { bot } from "../bot/bot.js";

const app = Fastify({ logger: { level: env.LOG_LEVEL } });

await app.register(helmet);
await app.register(cors, { origin: false });
await app.register(rateLimit, { max: 120, timeWindow: "1 minute" });

app.get("/health", async () => ({ status: "ok", version: "1.2.0" }));

app.get("/ready", async (_request, reply) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: "ready" };
  } catch {
    return reply.code(503).send({ status: "not_ready" });
  }
});

await warmLocalization();

await app.listen({ port: env.PORT, host: "0.0.0.0" });
await bot.start();
