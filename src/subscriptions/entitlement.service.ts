import { prisma } from "../database/client.js";

export type Entitlements = {
  planCode: string;
  dailyRequests: number;
  monthlyRequests: number;
  historyDays: number;
  priority: number;
  fileAccess: boolean;
};

export async function getEntitlements(userId: string): Promise<Entitlements> {
  const subscription = await prisma.subscription.findFirst({
    where: { userId, status: "ACTIVE", currentPeriodEnd: { gt: new Date() } },
    include: { plan: true },
    orderBy: { createdAt: "desc" }
  });
  const plan = subscription?.plan ?? await prisma.plan.findUniqueOrThrow({ where: { code: "FREE" } });
  return {
    planCode: plan.code,
    dailyRequests: plan.dailyRequests,
    monthlyRequests: plan.monthlyRequests,
    historyDays: plan.historyDays,
    priority: plan.priority,
    fileAccess: plan.fileAccess
  };
}
