import { describe, expect, it } from "vitest";
import { STUDIO_SOURCE_STRINGS } from "../hooks/use-i18n";
import { getUiLocale, normalizeUiLocale, setUiLocale } from "./ui-locale";
import { VI_STRINGS } from "./vi";

function placeholders(value: string): string[] {
  return value.match(/\{[^}]+\}/g)?.sort() ?? [];
}

describe("Vietnamese Studio overlay", () => {
  it("has exactly the same keys and placeholders as the source catalog", () => {
    expect(Object.keys(VI_STRINGS).sort()).toEqual(Object.keys(STUDIO_SOURCE_STRINGS).sort());

    for (const key of Object.keys(STUDIO_SOURCE_STRINGS) as Array<keyof typeof STUDIO_SOURCE_STRINGS>) {
      expect(VI_STRINGS[key].trim(), key).not.toBe("");
      expect(placeholders(VI_STRINGS[key]), key).toEqual(placeholders(STUDIO_SOURCE_STRINGS[key].en));
    }
  });

  it("normalizes Vietnamese browser and environment-style locale tags", () => {
    expect(normalizeUiLocale("vi-VN")).toBe("vi");
    expect(normalizeUiLocale("vi_VN.UTF-8")).toBe("vi");
    expect(normalizeUiLocale("en-US")).toBe("en");
    expect(normalizeUiLocale("zh-CN")).toBe("zh");
    expect(normalizeUiLocale("fr-FR")).toBeUndefined();
  });

  it("changes UI locale without touching project content language", () => {
    setUiLocale("vi");
    expect(getUiLocale()).toBe("vi");
    setUiLocale("zh");
  });
});
