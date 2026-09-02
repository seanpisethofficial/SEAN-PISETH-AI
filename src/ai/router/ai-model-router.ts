import type { AIProvider, AIRequest, AIResponse } from "../providers/interface.js";

export type AIMode = "smart" | "chat" | "language";

export class AIModelRouter {
  constructor(
    private readonly claude: AIProvider,
    private readonly chatgpt: AIProvider,
    private readonly gemini: AIProvider
  ) {}

  providerFor(mode: AIMode): AIProvider {
    if (mode === "smart") return this.claude;
    if (mode === "chat") return this.chatgpt;
    return this.gemini;
  }

  classify(text: string): AIMode {
    const s = text.toLowerCase();
    if (/(translate|translation|locali[sz]|grammar|rewrite|language)/i.test(s)) return "language";
    if (/(code|coding|debug|typescript|javascript|python|api|sql|architecture|refactor)/i.test(s)) return "smart";
    return "chat";
  }

  async generate(mode: AIMode, request: AIRequest): Promise<AIResponse> {
    return this.providerFor(mode).generate(request);
  }
}
