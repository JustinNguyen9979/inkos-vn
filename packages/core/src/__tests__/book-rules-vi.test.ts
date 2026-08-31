import { describe, expect, it } from "vitest";
import { parseBookRules } from "../models/book-rules.js";

describe("Vietnamese Markdown book rules", () => {
  it("parses localized headings and labels without losing runtime constraints", () => {
    const parsed = parseBookRules([
      "## Nhân vật chính",
      "- Tên: Triệu Ninh",
      "- Khóa tính cách: điềm tĩnh, kiên định",
      "- Ràng buộc hành vi: không bỏ mặc dân thường, không nói dối đồng đội",
      "",
      "## Khóa thể loại",
      "- Thể loại chính: huyền nghi đô thị",
      "- Không được pha trộn: giao diện trò chơi, sức mạnh vô cớ",
      "",
      "## Ngôi kể",
      "Ngôi thứ nhất",
      "",
      "## Quy tắc số liệu / tài nguyên",
      "- Tài nguyên cốt lõi: linh lực, bùa chú",
      "- Giới hạn cứng: không hồi phục vô hạn",
      "",
      "## Ràng buộc thời đại",
      "- Thời kỳ: hiện đại",
      "- Khu vực: Trung Quốc",
      "",
      "## Điều cấm",
      "- Không dùng tên Pinyin trong nội dung hướng đến người đọc",
    ].join("\n"));

    expect(parsed?.rules.protagonist).toEqual({
      name: "Triệu Ninh",
      personalityLock: ["điềm tĩnh", "kiên định"],
      behavioralConstraints: ["không bỏ mặc dân thường", "không nói dối đồng đội"],
    });
    expect(parsed?.rules.genreLock).toEqual({
      primary: "huyền nghi đô thị",
      forbidden: ["giao diện trò chơi", "sức mạnh vô cớ"],
    });
    expect(parsed?.rules.narrativePerson).toBe("first");
    expect(parsed?.rules.numericalSystemOverrides).toEqual({
      resourceTypes: ["linh lực", "bùa chú"],
      hardCap: "không hồi phục vô hạn",
    });
    expect(parsed?.rules.eraConstraints).toEqual({
      enabled: true,
      period: "hiện đại",
      region: "Trung Quốc",
    });
    expect(parsed?.rules.prohibitions).toEqual([
      "Không dùng tên Pinyin trong nội dung hướng đến người đọc",
    ]);
  });
});
