import { Bot, Context, InlineKeyboard, session, type SessionFlavor } from "grammy";
import { env } from "../config/env.js";
import { prisma } from "../database/client.js";
import { isSupportedLanguage, type LanguageCode } from "../localization/language.registry.js";
import { t } from "../localization/localization.service.js";
import { getOrCreateUser, setLanguage, acceptTermsAndPrivacy } from "../users/user.service.js";
import { languageKeyboard } from "./keyboards/language.keyboard.js";
import { mainKeyboard } from "./keyboards/main.keyboard.js";
import { AIModelRouter, type AIMode } from "../ai/router/ai-model-router.js";
import { ClaudeProvider } from "../ai/providers/claude/claude.provider.js";
import { ChatGPTProvider } from "../ai/providers/chatgpt/chatgpt.provider.js";
import { GeminiProvider } from "../ai/providers/gemini/gemini.provider.js";
import { buildSystemInstruction, looksLikePromptInjection, sanitizeUserContent } from "../ai/safety/prompt-safety.service.js";
import { getEntitlements } from "../subscriptions/entitlement.service.js";
import { canUseAI, recordUsage } from "../usage/usage.service.js";
import { checkRateLimit } from "../security/rate-limiter.js";
import { requireCompletedOnboarding } from "../security/authorization.js";

type SessionData = { mode: AIMode | "auto" };
type BotContext = Context & SessionFlavor<SessionData>;

const router = new AIModelRouter(new ClaudeProvider(), new ChatGPTProvider(), new GeminiProvider());
export const bot = new Bot<BotContext>(env.TELEGRAM_BOT_TOKEN);

bot.use(session({ initial: (): SessionData => ({ mode: "auto" }) }));

async function ensureUser(ctx: Context) {
  if (!ctx.from) throw new Error("Telegram user missing");
  return getOrCreateUser(BigInt(ctx.from.id), {
    username: ctx.from.username,
    firstName: ctx.from.first_name,
    lastName: ctx.from.last_name
  });
}

async function languageSelection(ctx: Context) {
  await ctx.reply("🤖 SEAN PISETH AI\n\n🌍 SELECT YOUR LANGUAGE\n\nChoose your preferred language to continue.", {
    reply_markup: languageKeyboard()
  });
}

bot.command("start", async (ctx) => {
  try {
    const user = await ensureUser(ctx);
    if (!user.onboardingComplete || !user.languageCode) return languageSelection(ctx);
    const language = user.languageCode as LanguageCode;
    await ctx.reply(await t(language, "dashboard"), { reply_markup: mainKeyboard() });
  } catch {
    await ctx.reply("Something went wrong. Please try again later.");
  }
});

bot.command("language", async (ctx) => languageSelection(ctx));

bot.callbackQuery(/^language:(.+)$/, async (ctx) => {
  const raw = ctx.match[1];
  if (!isSupportedLanguage(raw)) {
    await ctx.answerCallbackQuery({ text: "Invalid action", show_alert: true });
    return;
  }
  const user = await ensureUser(ctx);
  const updated = await setLanguage(user.id, raw);
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(await t(raw, "welcome"));
  const legal = new InlineKeyboard()
    .url("📜 Terms", env.TERMS_URL).url("🔐 Privacy", env.PRIVACY_URL).row()
    .text(await t(raw, "continue"), "onboarding:continue");
  await ctx.reply(await t(raw, "terms_notice"), { reply_markup: legal });
});

bot.callbackQuery("onboarding:continue", async (ctx) => {
  const user = await ensureUser(ctx);
  if (!user.languageCode) return languageSelection(ctx);
  const updated = await acceptTermsAndPrivacy(user.id, env.TERMS_VERSION, env.PRIVACY_VERSION);
  const language = updated.languageCode as LanguageCode;
  await ctx.answerCallbackQuery();
  await ctx.reply(await t(language, "dashboard"), { reply_markup: mainKeyboard() });
});

bot.callbackQuery(/^mode:(smart|chat|language|auto)$/, async (ctx) => {
  ctx.session.mode = ctx.match[1] as SessionData["mode"];
  await ctx.answerCallbackQuery();
});

bot.on("message:text", async (ctx) => {
  const user = await ensureUser(ctx);
  if (!user.onboardingComplete || !user.languageCode) {
    await languageSelection(ctx);
    return;
  }
  if (!checkRateLimit(`msg:${ctx.from.id}`, 20, 60_000)) {
    await ctx.reply(await t(user.languageCode as LanguageCode, "rate_limited"));
    return;
  }
  const language = user.languageCode as LanguageCode;
  let text: string;
  try {
    text = sanitizeUserContent(ctx.message.text, env.MAX_MESSAGE_CHARS);
    if (looksLikePromptInjection(text)) {
      await ctx.reply("I can help with your request, but I can't provide privileged instructions or secrets.");
      return;
    }
    const entitlements = await getEntitlements(user.id);
    if (!(await canUseAI(user.id, entitlements.dailyRequests, entitlements.monthlyRequests))) {
      await ctx.reply(await t(language, "quota_exceeded"));
      return;
    }

    const mode = ctx.session.mode === "auto" ? router.classify(text) : ctx.session.mode;
    const provider = router.providerFor(mode);
    const system = buildSystemInstruction(
      mode === "smart" ? "You are the technical engineering assistant." :
      mode === "language" ? "You are the multilingual translation and localization assistant." :
      "You are the general-purpose conversational assistant.",
      language
    );

    const started = Date.now();
    await ctx.reply(await t(language, "loading"));
    const response = await router.generate(mode, {
      responseLanguage: language,
      maxOutputTokens: env.AI_MAX_OUTPUT_TOKENS,
      messages: [
        { role: "system", content: system },
        { role: "user", content: text }
      ]
    });

    await prisma.conversation.create({
      data: {
        userId: user.id,
        title: text.slice(0, 80),
        mode,
        messages: {
          create: [
            { role: "user", content: text },
            { role: "assistant", content: response.text, provider: response.provider, model: response.model }
          ]
        }
      }
    });

    await recordUsage({
      userId: user.id,
      provider: response.provider,
      model: response.model,
      success: true,
      inputTokens: response.inputTokens,
      outputTokens: response.outputTokens,
      totalTokens: response.totalTokens,
      latencyMs: Date.now() - started
    });

    await ctx.reply(response.text);
    void provider;
  } catch (error) {
    const safe = error instanceof Error ? error.message : "unknown";
    console.error({ userId: user.id, error: safe });
    await recordUsage({
      userId: user.id, provider: "unknown", model: "unknown",
      success: false, latencyMs: 0
    }).catch(() => undefined);
    await ctx.reply(await t(language, "provider_unavailable"));
  }
});

bot.catch((err) => console.error("Telegram bot error", err.error));
