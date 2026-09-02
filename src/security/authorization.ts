import type { User } from "@prisma/client";

export function requireCompletedOnboarding(user: User): void {
  if (!user.onboardingComplete || user.onboardingState !== "COMPLETE") {
    throw new Error("Onboarding required");
  }
}
