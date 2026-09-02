import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const plans = [
  ["FREE", "Free", 0, 50, 1000, 3, 0, false],
  ["BASIC", "Basic", 200, 200, 5000, 14, 1, false],
  ["PRO", "Pro", 500, 600, 15000, 30, 2, false],
  ["PREMIUM", "Premium", 1000, 1500, 40000, 60, 3, true],
  ["ULTRA_PREMIUM", "Ultra Premium", 2000, 4000, 100000, 120, 4, true]
] as const;

for (const [code, name, priceCents, dailyRequests, monthlyRequests, historyDays, priority, fileAccess] of plans) {
  await prisma.plan.upsert({
    where: { code },
    update: { name, priceCents, dailyRequests, monthlyRequests, historyDays, priority, fileAccess },
    create: { code, name, priceCents, dailyRequests, monthlyRequests, historyDays, priority, fileAccess }
  });
}
await prisma.$disconnect();
