import { describe, expect, it } from "vitest";
import { canAccessMain } from "../../src/onboarding/onboarding.state.js";

describe("onboarding gate", () => {
  it("blocks every incomplete state", () => {
    for (const state of ["NEW_USER","LANGUAGE_REQUIRED","LANGUAGE_SELECTED","WELCOME","TERMS_REQUIRED","PRIVACY_REQUIRED"] as const) {
      expect(canAccessMain(state)).toBe(false);
    }
  });
  it("allows only COMPLETE", () => expect(canAccessMain("COMPLETE")).toBe(true));
});
