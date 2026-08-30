import { afterEach, describe, expect, it } from "vitest";
import { setAppLanguage } from "../lib/app-language";
import { localizeProgressText } from "./vi-progress";

describe("localizeProgressText", () => {
  afterEach(() => setAppLanguage("zh"));

  it("localizes restored Chinese create-book progress", () => {
    setAppLanguage("vi");
    expect(localizeProgressText("建书")).toBe("Tạo quyển");
    expect(localizeProgressText("生成基础设定")).toBe("Tạo nền tảng truyện");
    expect(localizeProgressText("阶段：生成基础设定")).toBe("Giai đoạn: Tạo nền tảng truyện");
  });

  it("localizes English progress and preserves other UI languages", () => {
    setAppLanguage("vi");
    expect(localizeProgressText("Stage: saving book config")).toBe("Giai đoạn: Đang lưu cấu hình quyển");
    setAppLanguage("en");
    expect(localizeProgressText("生成基础设定")).toBe("生成基础设定");
  });
});
