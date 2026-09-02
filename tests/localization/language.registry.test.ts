import { describe, expect, it } from "vitest";
import { SUPPORTED_LANGUAGES, isSupportedLanguage } from "../../src/localization/language.registry.js";

describe("language registry", () => {
  it("contains exactly the supported nine codes", () => {
    expect(SUPPORTED_LANGUAGES).toEqual(["km","en","zh","vi","ja","ko","id","fil","ru"]);
  });
  it("rejects unsupported codes", () => {
    for (const value of ["th","thai","fr","de","es","ar","",null,undefined,"invalid"]) {
      expect(isSupportedLanguage(value)).toBe(false);
    }
  });
});
