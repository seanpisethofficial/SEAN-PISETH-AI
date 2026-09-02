import type { LanguageCode } from "../../localization/language.registry.js";

export type AIMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AIRequest = {
  messages: AIMessage[];
  responseLanguage: LanguageCode;
  model?: string;
  maxOutputTokens?: number;
};

export type AIResponse = {
  text: string;
  provider: string;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
};

export interface AIProvider {
  getName(): string;
  supports(mode: string): boolean;
  generate(request: AIRequest): Promise<AIResponse>;
  healthCheck(): Promise<boolean>;
  normalizeError(error: unknown): Error;
}
