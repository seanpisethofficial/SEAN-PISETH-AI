import { adminTelegramIds } from "../config/env.js";

export type AdminRole = "OWNER" | "ADMIN" | "MODERATOR" | "SUPPORT";

export function isAdmin(telegramUserId: bigint): boolean {
  return adminTelegramIds.has(telegramUserId.toString());
}
