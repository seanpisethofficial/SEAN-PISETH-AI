import { InlineKeyboard } from "grammy";

export function mainKeyboard() {
  return new InlineKeyboard()
    .text("🧠 Smart AI", "mode:smart").text("💬 ChatGPT", "mode:chat").row()
    .text("🌍 Gemini", "mode:language").text("⚡ Auto AI", "mode:auto").row()
    .text("💎 Plans", "plans").text("👤 My Account", "account").row()
    .text("📊 Usage", "usage").text("🧾 Subscription", "subscription").row()
    .text("🌍 Language", "settings:language").text("⚙️ Settings", "settings").row()
    .text("❓ Help", "help");
}
