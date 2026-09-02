import OpenAI from "openai";
import { env } from "../../config/env.js";
import type { AIProvider, AIRequest, AIResponse } from "../interface.js";

export class ChatGPTProvider implements AIProvider {
  private readonly client?: OpenAI;
  private readonly model: string;

  constructor() {
    this.model = env.OPENAI_MODEL ?? "";
    if (env.OPENAI_API_KEY) this.client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }

  getName() { return "openai"; }
  supports(mode: string) { return mode === "chat"; }

  async generate(request: AIRequest): Promise<AIResponse> {
    if (!this.client || !this.model) throw new Error("OpenAI provider is not configured");
    const response = await this.client.responses.create({
      model: this.model,
      input: request.messages.map((m) => ({ role: m.role, content: m.content })),
      max_output_tokens: request.maxOutputTokens ?? env.AI_MAX_OUTPUT_TOKENS
    });
    const usage = response.usage;
    return {
      text: response.output_text,
      provider: this.getName(),
      model: this.model,
      inputTokens: usage?.input_tokens,
      outputTokens: usage?.output_tokens,
      totalTokens: usage ? usage.input_tokens + usage.output_tokens : undefined
    };
  }

  async healthCheck() { return Boolean(this.client && this.model); }
  normalizeError(error: unknown) { return error instanceof Error ? error : new Error("OpenAI provider error"); }
}
