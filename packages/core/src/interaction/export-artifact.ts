import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { EPub } from "epub-gen-memory";

export interface ExportStateLike {
  readonly bookDir: (bookId: string) => string;
  readonly loadBookConfig: (bookId: string) => Promise<{ readonly title: string; readonly language?: string }>;
  readonly loadChapterIndex: (bookId: string) => Promise<ReadonlyArray<{
    readonly number: number;
    readonly status: string;
    readonly wordCount: number;
  }>>;
}

export interface ExportArtifact {
  readonly outputPath: string;
  readonly fileName: string;
  readonly chaptersExported: number;
  readonly totalWords: number;
  readonly format: "txt" | "md" | "epub";
  readonly contentType: string;
  readonly payload: string | Buffer;
}

export function safeExportName(title: string, fallback = "book"): string {
  const cleaned = title
    .normalize("NFC")
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-")
    .replace(/[-. ]+$/g, "")
    .replace(/-+/g, "-")
    .slice(0, 120)
    .trim();
  const candidate = cleaned || fallback;
  return /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(candidate)
    ? `_${candidate}`
    : candidate;
}

function buildChapterFileLookup(files: ReadonlyArray<string>): ReadonlyMap<number, string> {
  const lookup = new Map<number, string>();
  for (const file of files) {
    if (!file.endsWith(".md") || !/^\d{4}/.test(file)) {
      continue;
    }
    const chapterNumber = parseInt(file.slice(0, 4), 10);
    if (!lookup.has(chapterNumber)) {
      lookup.set(chapterNumber, file);
    }
  }
  return lookup;
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function markdownToSimpleHtml(markdown: string): { title: string; html: string } {
  const title = markdown.match(/^#\s+(.+)/m)?.[1]?.trim() ?? "Untitled Chapter";
  const html = markdown
    .split("\n")
    .filter((line) => !line.startsWith("#"))
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("\n");
  return { title, html };
}

export async function buildExportArtifact(
  state: ExportStateLike,
  bookId: string,
  options: {
    readonly format?: "txt" | "md" | "epub";
    readonly approvedOnly?: boolean;
    readonly outputPath?: string;
  },
): Promise<ExportArtifact> {
  const format = options.format ?? "txt";
  const index = await state.loadChapterIndex(bookId);
  const book = await state.loadBookConfig(bookId);
  const chapters = options.approvedOnly
    ? index.filter((chapter) => chapter.status === "approved")
    : index;

  if (chapters.length === 0) {
    throw new Error("No chapters to export.");
  }

  const bookDir = state.bookDir(bookId);
  const chaptersDir = join(bookDir, "chapters");
  const projectRoot = dirname(dirname(bookDir));
  const exportName = safeExportName(book.title, bookId);
  const outputPath = options.outputPath ?? join(projectRoot, "Output", exportName, `${exportName}.${format}`);
  const chapterFiles = buildChapterFileLookup(await readdir(chaptersDir));
  const totalWords = chapters.reduce((sum, chapter) => sum + chapter.wordCount, 0);

  if (format === "epub") {
    const epubChapters: Array<{ title: string; content: string }> = [];
    for (const chapter of chapters) {
      const match = chapterFiles.get(chapter.number);
      if (!match) {
        continue;
      }
      const markdown = await readFile(join(chaptersDir, match), "utf-8");
      const { title, html } = markdownToSimpleHtml(markdown);
      epubChapters.push({ title, content: html });
    }
    const epubInstance = new EPub(
      { title: book.title, lang: book.language === "vi" ? "vi" : book.language === "en" ? "en" : "zh-CN" },
      epubChapters,
    );
    return {
      outputPath,
      fileName: `${exportName}.epub`,
      chaptersExported: chapters.length,
      totalWords,
      format,
      contentType: "application/epub+zip",
      payload: await epubInstance.genEpub(),
    };
  }

  const parts: string[] = [];
  parts.push(format === "md" ? `# ${book.title}\n\n---\n` : `${book.title}\n\n`);
  for (const chapter of chapters) {
    const match = chapterFiles.get(chapter.number);
    if (!match) {
      continue;
    }
    parts.push(await readFile(join(chaptersDir, match), "utf-8"));
    parts.push("\n\n");
  }

  return {
    outputPath,
    fileName: `${exportName}.${format}`,
    chaptersExported: chapters.length,
    totalWords,
    format,
    contentType: format === "md" ? "text/markdown; charset=utf-8" : "text/plain; charset=utf-8",
    payload: parts.join(format === "md" ? "\n---\n\n" : "\n"),
  };
}

export async function writeExportArtifact(
  state: ExportStateLike,
  bookId: string,
  options: {
    readonly format?: "txt" | "md" | "epub";
    readonly approvedOnly?: boolean;
    readonly outputPath?: string;
    readonly splitChapters?: boolean;
  },
): Promise<Omit<ExportArtifact, "payload" | "contentType" | "fileName">> {
  const artifact = await buildExportArtifact(state, bookId, options);
  const shouldSplitChapters = artifact.format !== "epub"
    && (options.splitChapters ?? options.outputPath === undefined);
  if (shouldSplitChapters) {
    const index = await state.loadChapterIndex(bookId);
    const chapters = options.approvedOnly
      ? index.filter((chapter) => chapter.status === "approved")
      : index;
    const chaptersDir = join(state.bookDir(bookId), "chapters");
    const chapterFiles = buildChapterFileLookup(await readdir(chaptersDir));
    const outputDir = options.outputPath ?? dirname(artifact.outputPath);
    await mkdir(outputDir, { recursive: true });

    for (const file of await readdir(outputDir)) {
      if (/^chapter\d+\.(?:txt|md)$/i.test(file)) {
        await rm(join(outputDir, file), { force: true });
      }
    }

    let chaptersExported = 0;
    for (const chapter of chapters) {
      const sourceFile = chapterFiles.get(chapter.number);
      if (!sourceFile) continue;
      const content = await readFile(join(chaptersDir, sourceFile), "utf-8");
      await writeFile(join(outputDir, `chapter${chapter.number}.${artifact.format}`), content, "utf-8");
      chaptersExported += 1;
    }

    return {
      outputPath: outputDir,
      chaptersExported,
      totalWords: artifact.totalWords,
      format: artifact.format,
    };
  }

  await mkdir(dirname(artifact.outputPath), { recursive: true });
  await writeFile(artifact.outputPath, artifact.payload);
  return {
    outputPath: artifact.outputPath,
    chaptersExported: artifact.chaptersExported,
    totalWords: artifact.totalWords,
    format: artifact.format,
  };
}
