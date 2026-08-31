import { describe, it, expect } from "vitest";
import {
  inferLanguage,
  needsVietnameseOutputRepair,
  usesWordBasedLength,
  withVietnameseOutputContract,
} from "../utils/language.js";

describe("inferLanguage", () => {
  it("infers en for Latin-dominant briefs", () => {
    expect(inferLanguage("A detective investigates a murder in 1920s London.")).toBe("en");
  });

  it("infers zh for Chinese briefs", () => {
    expect(inferLanguage("一个修仙者重生回到宗门入门那年。")).toBe("zh");
  });

  it("infers vi from Vietnamese diacritics", () => {
    expect(inferLanguage("Hãy viết một chương truyện có giọng kể nhẹ nhàng, gần gũi.")).toBe("vi");
  });

  it("infers vi from a clearly Vietnamese brief without diacritics", () => {
    expect(inferLanguage("hay viet truyen cho minh ve mot nguoi anh hung")).toBe("vi");
  });

  it("treats Vietnamese as a word-based writing language", () => {
    expect(usesWordBasedLength("vi")).toBe(true);
  });

  it("adds an idiomatic Vietnamese prose contract only for vi", () => {
    const prompt = withVietnameseOutputContract("Base instructions", "vi");
    expect(prompt).toContain("all narrative prose");
    expect(prompt).toContain("natural Vietnamese syntax and cadence");
    expect(prompt).toContain("pronouns and kinship terms consistent");
    expect(prompt).toContain("reader-facing Markdown headings");
    expect(prompt).toContain("Hán–Việt readings");
    expect(prompt).toContain('set it to "vi"');
    expect(withVietnameseOutputContract("Base instructions", "en")).toBe("Base instructions");
  });

  it("stays zh when CJK dominates despite an English name", () => {
    expect(inferLanguage("主角叫 Jack，一部都市重生爽文。")).toBe("zh");
  });

  it("treats incidental CJK in an English brief as en", () => {
    expect(inferLanguage("A xianxia (修仙) progression story for Royal Road.")).toBe("en");
  });

  it("defaults to zh for empty or missing input", () => {
    expect(inferLanguage("")).toBe("zh");
    expect(inferLanguage(undefined)).toBe("zh");
    expect(inferLanguage(null)).toBe("zh");
  });

  it("detects Chinese, Pinyin, and English prose that leaks into Vietnamese output", () => {
    expect(needsVietnameseOutputRepair("世界观与核心设定")).toBe(true);
    expect(needsVietnameseOutputRepair("Shen Yu enters the haunted apartment.")).toBe(true);
    expect(needsVietnameseOutputRepair("The character enters a haunted apartment.")).toBe(true);
    expect(needsVietnameseOutputRepair("Thẩm Vũ bước vào căn hộ bị ám.")).toBe(false);
  });
});
