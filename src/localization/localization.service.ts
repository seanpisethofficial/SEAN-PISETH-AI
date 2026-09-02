import type { LanguageCode } from "./language.registry.js";
import { LANGUAGE_REGISTRY, getLanguage, isSupportedLanguage } from "./language.registry.js";

type Dictionary = Record<string, string>;

const dictionaries: Partial<Record<LanguageCode, Dictionary>> = {};

async function load(code: LanguageCode): Promise<Dictionary> {
  const cached = dictionaries[code];
  if (cached) return cached;
  const module = await import(`../../locales/${getLanguage(code).localeFile}`, { with: { type: "json" } });
  const dict = module.default as Dictionary;
  dictionaries[code] = dict;
  return dict;
}

export async function t(code: LanguageCode, key: string, fallback?: string): Promise<string> {
  if (!isSupportedLanguage(code)) throw new Error("Unsupported locale");
  const dict = await load(code);
  return dict[key] ?? fallback ?? key;
}

export async function warmLocalization(): Promise<void> {
  await Promise.all(LANGUAGE_REGISTRY.map((x) => load(x.code)));
}
