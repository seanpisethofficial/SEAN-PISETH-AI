export const SUPPORTED_LANGUAGES = [
  "km", "en", "zh", "vi", "ja", "ko", "id", "fil", "ru"
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number];

export type LanguageDefinition = {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  enabled: true;
  localeFile: string;
};

export const LANGUAGE_REGISTRY: readonly LanguageDefinition[] = [
  { code: "km", name: "Khmer", nativeName: "ខ្មែរ", flag: "🇰🇭", enabled: true, localeFile: "km.json" },
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸", enabled: true, localeFile: "en.json" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳", enabled: true, localeFile: "zh.json" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳", enabled: true, localeFile: "vi.json" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", enabled: true, localeFile: "ja.json" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷", enabled: true, localeFile: "ko.json" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩", enabled: true, localeFile: "id.json" },
  { code: "fil", name: "Filipino", nativeName: "Filipino", flag: "🇵🇭", enabled: true, localeFile: "fil.json" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺", enabled: true, localeFile: "ru.json" }
] as const;

export function isSupportedLanguage(value: unknown): value is LanguageCode {
  return typeof value === "string" &&
    (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

export function getLanguage(code: LanguageCode): LanguageDefinition {
  return LANGUAGE_REGISTRY.find((x) => x.code === code)!;
}
