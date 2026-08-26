// 全局应用语言：非 React 模块（store slice、parts-builder、error-copy 等）无法用
// useI18n hook，从这里读取。App.tsx 在 UI locale 切换时调用 setAppLanguage 同步。
import type { UiLocale } from "../i18n/ui-locale";
import { translateInlineToVietnamese } from "../i18n/vi-inline";

export type AppLanguage = UiLocale;

let current: AppLanguage = "zh";

export function setAppLanguage(lang: AppLanguage): void {
  current = lang;
}

export function getAppLanguage(): AppLanguage {
  return current;
}

/** 内联双语兼容层。vi 优先从 overlay 独立词典读取，缺失时回退英文。 */
export function tr(zh: string, en: string): string {
  if (current === "vi") return translateInlineToVietnamese(en) ?? en;
  return current === "en" ? en : zh;
}
