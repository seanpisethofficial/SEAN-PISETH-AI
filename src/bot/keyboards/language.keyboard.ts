import { InlineKeyboard } from "grammy";
import { LANGUAGE_REGISTRY } from "../../localization/language.registry.js";

export function languageKeyboard(): InlineKeyboard {
  const keyboard = new InlineKeyboard();
  LANGUAGE_REGISTRY.forEach((language, index) => {
    keyboard.text(`${language.flag} ${language.nativeName}`, `language:${language.code}`);
    if (index % 2 === 1) keyboard.row();
  });
  return keyboard;
}
