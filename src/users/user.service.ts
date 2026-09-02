import type { User } from "@prisma/client";
import { prisma } from "../database/client.js";
import { isSupportedLanguage, type LanguageCode } from "../localization/language.registry.js";
import type { OnboardingState } from "../onboarding/onboarding.state.js";

export async function getOrCreateUser(telegramUserId: bigint, data: {
  username?: string;
  firstName?: string;
  lastName?: string;
}): Promise<User> {
  return prisma.user.upsert({
    where: { telegramUserId },
    create: {
      telegramUserId,
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      onboardingState: "LANGUAGE_REQUIRED",
      onboardingComplete: false,
      lastSeenAt: new Date()
    },
    update: {
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      lastSeenAt: new Date()
    }
  });
}

export async function setLanguage(userId: string, language: LanguageCode): Promise<User> {
  if (!isSupportedLanguage(language)) throw new Error("Unsupported language");
  return prisma.user.update({
    where: { id: userId },
    data: { languageCode: language, onboardingState: "LANGUAGE_SELECTED" }
  });
}

export async function acceptTermsAndPrivacy(userId: string, termsVersion: string, privacyVersion: string): Promise<User> {
  return prisma.user.update({
    where: { id: userId },
    data: {
      termsAcceptedAt: new Date(),
      privacyAcceptedAt: new Date(),
      termsVersion,
      privacyVersion,
      onboardingState: "COMPLETE",
      onboardingComplete: true
    }
  });
}
