import { describe, expect, it } from "vitest";
import { AIModelRouter } from "../../src/ai/router/ai-model-router.js";

const provider = (name: string, supported: string) => ({
  getName: () => name,
  supports: (mode: string) => mode === supported,
  generate: async () => ({ text: "ok", provider: name, model: "test" }),
  healthCheck: async () => true,
  normalizeError: (e: unknown) => e instanceof Error ? e : new Error("x")
});

describe("AI router", () => {
  const router = new AIModelRouter(provider("claude","smart"), provider("openai","chat"), provider("gemini","language"));
  it("routes technical requests to smart mode", () => expect(router.classify("debug this Python API")).toBe("smart"));
  it("routes translation requests to language mode", () => expect(router.classify("translate this into Russian")).toBe("language"));
  it("routes general requests to chat mode", () => expect(router.classify("give me startup ideas")).toBe("chat"));
});
