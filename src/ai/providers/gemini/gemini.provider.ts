import { GoogleGenAI } from "@google/genai";
import { env } from "../../config/env.js";
import type { AIProvider, AIRequest, AIResponse } from "../interface.js";

export class GeminiProvider implements AIProvider {
  private readonly client?: GoogleGenAI;
  private readonly model: string;

  constructor() {
    this.model = env.GEMINI_MODEL ?? "";
    if (env.GEMINI_API_KEY) this.client = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  }

  getName() { return "gemini"; }
  supports(mode: string) { return mode === "language"; }

  async generate(request: AIRequest): Promise<AIResponse> {
    if (!this.client || !this.model) throw new Error("Gemini provider is not configured");
    const system = request.messages.find((m) => m.role === "system")?.content ?? "";
    const history = request.messages.filter((m) => m.role !== "system")
      .map((m) => `${m.role}: ${m.content}`).join("\n");
    const response = await this.client.models.generateContent({
      model: this.model,
      contents: history,
      config: {
        systemInstruction: system,
        maxOutputTokens: request.maxOutputTokens ?? env.AI_MAX_OUTPUT_TOKENS
      }
    });
    return {
      text: response.text ?? "",
      provider: this.getName(),
      model: this.model
    };
  }

  async healthCheck() { return Boolean(this.client && this.model); }
  normalizeError(error: unknown) { return error instanceof Error ? error : new Error("Gemini provider error"); }
}
