import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  buildExportArtifact,
  safeExportName,
  type ExportStateLike,
  writeExportArtifact,
} from "../interaction/export-artifact.js";

const roots: string[] = [];

async function createExportFixture(): Promise<{ root: string; state: ExportStateLike }> {
  const root = await mkdtemp(join(tmpdir(), "inkos-export-"));
  roots.push(root);
  const bookDir = join(root, "books", "truy-n-nhan-cuoi-cung");
  await mkdir(join(bookDir, "chapters"), { recursive: true });
  await writeFile(join(bookDir, "chapters", "0001_Khoi_Dau.md"), "# Chương 1\n\nKhởi đầu.", "utf-8");
  await writeFile(join(bookDir, "chapters", "0002_Ke_Thua.md"), "# Chương 2\n\nKế thừa.", "utf-8");

  return {
    root,
    state: {
      bookDir: () => bookDir,
      loadBookConfig: async () => ({ title: "Truyền nhân cuối cùng", language: "vi" }),
      loadChapterIndex: async () => [
        { number: 1, status: "approved", wordCount: 2 },
        { number: 2, status: "ready-for-review", wordCount: 2 },
      ],
    },
  };
}

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("book export artifacts", () => {
  it("preserves Vietnamese titles while removing unsafe path characters", () => {
    expect(safeExportName("  Truyền nhân cuối cùng  ")).toBe("Truyền nhân cuối cùng");
    expect(safeExportName("Truyện: hay/ngắn? ")).toBe("Truyện- hay-ngắn");
    expect(safeExportName("CON")).toBe("_CON");
  });

  it("uses the readable book title for downloadable artifacts", async () => {
    const { state } = await createExportFixture();
    const artifact = await buildExportArtifact(state, "truy-n-nhan-cuoi-cung", { format: "txt" });

    expect(artifact.fileName).toBe("Truyền nhân cuối cùng.txt");
    expect(artifact.outputPath).toContain(join("Output", "Truyền nhân cuối cùng", "Truyền nhân cuối cùng.txt"));
  });

  it("writes each chapter into Output/<book title>/chapterN.txt by default", async () => {
    const { root, state } = await createExportFixture();
    const result = await writeExportArtifact(state, "truy-n-nhan-cuoi-cung", { format: "txt" });
    const expectedDir = join(root, "Output", "Truyền nhân cuối cùng");

    expect(result.outputPath).toBe(expectedDir);
    expect(result.chaptersExported).toBe(2);
    await expect(readFile(join(expectedDir, "chapter1.txt"), "utf-8")).resolves.toContain("Khởi đầu.");
    await expect(readFile(join(expectedDir, "chapter2.txt"), "utf-8")).resolves.toContain("Kế thừa.");
  });
});
