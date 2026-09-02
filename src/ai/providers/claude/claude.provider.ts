import Anthropic from "@anthropic-ai/sdk";
import { env } from "../../config/env.js";
import type { AIProvider, AIRequest, AIResponse } from "../interface.js";

export class ClaudeProvider implements AIProvider {
  private readonly client?: Anthropic;
  private readonly model: string;

  constructor() {
    this.model = env.CLAUDE_MODEL ?? "";
    if (env.CLAUDE_API_KEY) this.client = new Anthropic({ apiKey: env.CLAUDE_API_KEY });
  }

  getName() { return "claude"; }
  supports(mode: string) { return mode === "smart"; }

  async generate(request: AIRequest): Promise<AIResponse> {
    if (!this.client || !this.model) throw new Error("Claude provider is not configured");
    const system = request.messages.find((m) => m.role === "system")?.content;
    const messages = request.messages.filter((m) => m.role !== "system").map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content
    }));
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: request.maxOutputTokens ?? env.AI_MAX_OUTPUT_TOKENS,
      system,
      messages
    });
    const text = response.content
      .filter((x): x is Anthropic.TextBlock => x.type === "text")
      .map((x) => x.text).join("\n");
    return {
      text, provider: this.getName(), model: this.model,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      totalTokens: response.usage.input_tokens + response.usage.output_tokens
    };
  }

  async healthCheck() { return Boolean(this.client && this.model); }
  normalizeError(error: unknown) { return error instanceof Error ? error : new Error("Claude provider error"); }
}
