import {
  formatImportChaptersComplete,
  formatImportChaptersDiscovery,
  formatImportChaptersResume,
  formatWriteNextComplete,
  formatWriteNextProgress,
  formatWriteNextResultLines,
  type CliLanguage,
} from "./localization.js";
import { translateCliEnglish } from "./i18n/vi.js";

export { type CliLanguage };

export function formatWriteStartLine(
  language: CliLanguage,
  current: number,
  total: number,
  bookId: string,
): string {
  return formatWriteNextProgress(language, current, total, bookId);
}

export function formatWriteCompletionLines(
  language: CliLanguage,
  result: {
    readonly chapterNumber: number;
    readonly title: string;
    readonly wordCount: number;
    readonly passedAudit: boolean;
    readonly revised: boolean;
    readonly status: string;
    readonly issues: ReadonlyArray<{
      readonly severity: string;
      readonly category: string;
      readonly description: string;
    }>;
  },
): string[] {
  return [...formatWriteNextResultLines(language, result), ""];
}

export function formatWriteDoneLine(language: CliLanguage): string {
  return formatWriteNextComplete(language);
}

export function formatImportDiscoveryLine(
  language: CliLanguage,
  chapterCount: number,
  bookId: string,
): string {
  return formatImportChaptersDiscovery(language, chapterCount, bookId);
}

export function formatImportResumeLine(
  language: CliLanguage,
  resumeFrom: number,
): string {
  return formatImportChaptersResume(language, resumeFrom);
}

export function formatImportCompletionLines(
  language: CliLanguage,
  result: {
    readonly importedCount: number;
    readonly totalCountLabel: string;
    readonly nextChapter: number;
    readonly bookId: string;
  },
): string[] {
  return [
    language === "vi" ? translateCliEnglish("Import complete:") : language === "en" ? "Import complete:" : "导入完成：",
    language === "vi"
      ? translateCliEnglish(`  Chapters imported: ${result.importedCount}`)
      : language === "en" ? `  Chapters imported: ${result.importedCount}` : `  已导入章节：${result.importedCount}`,
    language === "vi"
      ? translateCliEnglish(`  Total length: ${result.totalCountLabel}`)
      : language === "en" ? `  Total length: ${result.totalCountLabel}` : `  总长度：${result.totalCountLabel}`,
    language === "vi"
      ? translateCliEnglish(`  Next chapter number: ${result.nextChapter}`)
      : language === "en" ? `  Next chapter number: ${result.nextChapter}` : `  下一章编号：${result.nextChapter}`,
    "",
    language === "vi"
      ? translateCliEnglish(`Run "inkos write next ${result.bookId}" to continue writing.`)
      : language === "en" ? `Run "inkos write next ${result.bookId}" to continue writing.` : `运行 "inkos write next ${result.bookId}" 继续写作。`,
  ];
}
