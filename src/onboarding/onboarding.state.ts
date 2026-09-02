export const ONBOARDING_STATES = [
  "NEW_USER", "LANGUAGE_REQUIRED", "LANGUAGE_SELECTED",
  "WELCOME", "TERMS_REQUIRED", "PRIVACY_REQUIRED", "COMPLETE"
] as const;

export type OnboardingState = typeof ONBOARDING_STATES[number];

export function canAccessMain(state: OnboardingState): boolean {
  return state === "COMPLETE";
}
