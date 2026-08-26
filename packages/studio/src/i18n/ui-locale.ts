import { useSyncExternalStore } from "react";

export type UiLocale = "zh" | "en" | "vi";

export const UI_LOCALE_STORAGE_KEY = "inkos:studio:ui-locale";

const listeners = new Set<() => void>();

export function normalizeUiLocale(value: string | null | undefined): UiLocale | undefined {
  const normalized = value?.trim().toLowerCase().replace("_", "-");
  if (!normalized) return undefined;
  if (normalized.startsWith("vi")) return "vi";
  if (normalized.startsWith("en")) return "en";
  if (normalized.startsWith("zh")) return "zh";
  return undefined;
}

function detectInitialUiLocale(): UiLocale {
  if (typeof window === "undefined") return "zh";

  try {
    const stored = normalizeUiLocale(window.localStorage.getItem(UI_LOCALE_STORAGE_KEY));
    if (stored) return stored;
  } catch {
    // Storage can be unavailable in private/sandboxed browser contexts.
  }

  return normalizeUiLocale(window.navigator.language) ?? "zh";
}

let currentUiLocale: UiLocale = detectInitialUiLocale();

export function getUiLocale(): UiLocale {
  return currentUiLocale;
}

export function setUiLocale(locale: UiLocale): void {
  if (currentUiLocale === locale) return;
  currentUiLocale = locale;

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(UI_LOCALE_STORAGE_KEY, locale);
    } catch {
      // Keep the in-memory selection when storage is unavailable.
    }
  }

  for (const listener of listeners) listener();
}

function subscribeUiLocale(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useUiLocale(): UiLocale {
  return useSyncExternalStore(subscribeUiLocale, getUiLocale, getUiLocale);
}
