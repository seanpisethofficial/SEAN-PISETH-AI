import { prisma } from "../database/client.js";

export async function canUseAI(userId: string, dailyLimit: number, monthlyLimit: number): Promise<boolean> {
  const now = new Date();
  const dayStart = new Date(now); dayStart.setHours(0, 0, 0, 0);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [daily, monthly] = await Promise.all([
    prisma.usageRecord.count({ where: { userId, createdAt: { gte: dayStart }, success: true } }),
    prisma.usageRecord.count({ where: { userId, createdAt: { gte: monthStart }, success: true } })
  ]);
  return daily < dailyLimit && monthly < monthlyLimit;
}

export async function recordUsage(input: {
  userId: string; provider: string; model: string; success: boolean;
  inputTokens?: number; outputTokens?: number; totalTokens?: number;
  estimatedCost?: number; latencyMs?: number;
}) {
  return prisma.usageRecord.create({ data: {
    userId: input.userId,
    provider: input.provider,
    model: input.model,
    success: input.success,
    inputTokens: input.inputTokens ?? 0,
    outputTokens: input.outputTokens ?? 0,
    totalTokens: input.totalTokens ?? 0,
    estimatedCost: input.estimatedCost ?? 0,
    latencyMs: input.latencyMs ?? 0
  }});
}
