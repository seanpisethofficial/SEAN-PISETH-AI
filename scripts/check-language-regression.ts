import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { LANGUAGE_REGISTRY, SUPPORTED_LANGUAGES } from "../src/localization/language.registry.js";

const forbiddenCodes = ["th", "thai"];
if (SUPPORTED_LANGUAGES.some((x) => forbiddenCodes.includes(x))) {
  throw new Error("Forbidden locale code detected");
}

const localeFiles = readdirSync("locales").filter((x) => x.endsWith(".json")).sort();
const expected = [...SUPPORTED_LANGUAGES].map((x) => `${x}.json`).sort();
if (JSON.stringify(localeFiles) !== JSON.stringify(expected)) {
  throw new Error(`Locale directory mismatch: ${localeFiles.join(",")}`);
}

for (const file of localeFiles) {
  const raw = readFileSync(join("locales", file), "utf8");
  if (!raw.trim()) throw new Error(`Empty locale: ${file}`);
}

if (LANGUAGE_REGISTRY.length !== 9) throw new Error("Expected exactly nine supported locales");
console.log("Language regression checks passed.");
