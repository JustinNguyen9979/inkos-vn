export type WritingLanguage = "zh" | "en" | "vi";

const VIETNAMESE_DIACRITICS = /[ăâđêôơưáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/iu;
const VIETNAMESE_WORDS = new Set([
  "anh", "chị", "em", "mình", "tôi", "chúng", "những", "được", "không", "với",
  "của", "trong", "người", "này", "rồi", "nhưng", "hãy", "viết", "truyện", "chương",
]);
const VIETNAMESE_ASCII_WORDS = new Set([
  "anh", "chi", "em", "minh", "toi", "chung", "nhung", "duoc", "khong", "voi",
  "cua", "trong", "nguoi", "nay", "roi", "nhung", "hay", "viet", "truyen", "chuong",
  "cho", "ve", "mot",
]);

export function isVietnameseLanguage(language?: string | null): language is "vi" {
  return language === "vi";
}

/** Vietnamese and English both use word-based length governance. */
export function usesWordBasedLength(language?: string | null): boolean {
  return language === "en" || language === "vi";
}

/** Keep parser-facing structure stable while requiring idiomatic Vietnamese prose. */
export function withVietnameseOutputContract(prompt: string, language?: string | null): string {
  if (language !== "vi") return prompt;
  return `${prompt}\n\n## Vietnamese language and prose contract (mandatory)\n\n- Write all narrative prose, dialogue, descriptions, plans, summaries, labels intended for readers, and natural-language field values in Vietnamese.\n- Follow the user's Vietnamese register and voice: preserve their level of formality, regional flavor, rhythm, point of view, and preferred forms of address when supplied.\n- Use natural Vietnamese syntax and cadence. Do not translate English or Chinese sentence structures literally; avoid stiff machine-translated phrasing and unnecessary Sino-Vietnamese or English jargon.\n- Keep Vietnamese pronouns and kinship terms consistent with age, status, intimacy, conflict, and scene context. Dialogue must sound speakable to a Vietnamese reader.\n- Preserve proper names, canon facts, terminology, Markdown structure, machine-readable keys, exact section markers, IDs, and tool schemas. Required technical headings may remain in their specified form when a parser depends on them, but their prose content must be Vietnamese.\n- When the user provides a style sample or existing Vietnamese chapters, treat their vocabulary, sentence length, imagery density, dialogue rhythm, and narrative distance as the primary style reference. Do not homogenize them into generic web-fiction prose.\n- Unless explicitly requested otherwise, never switch the creative output to English or Chinese merely because the control instructions use those languages.`;
}

/**
 * Infer the writing language from a free-text brief/premise when the user did not set one explicitly.
 *
 * Conservative by design: defaults to "zh" (preserving prior behaviour for Chinese users) and only
 * returns "en" when the text is clearly Latin-dominant. A Chinese brief that mentions an English name
 * or term still resolves to "zh"; incidental CJK inside an otherwise English brief resolves to "en".
 */
export function inferLanguage(text?: string | null): WritingLanguage {
  const t = text ?? "";
  if (VIETNAMESE_DIACRITICS.test(t)) return "vi";
  const words = t.toLocaleLowerCase("vi").match(/[a-z]+/g) ?? [];
  const vietnameseWordCount = words.reduce(
    (count, word) => count + (VIETNAMESE_WORDS.has(word) ? 1 : 0),
    0,
  );
  if (vietnameseWordCount >= 2) return "vi";
  const vietnameseAsciiWordCount = words.reduce(
    (count, word) => count + (VIETNAMESE_ASCII_WORDS.has(word) ? 1 : 0),
    0,
  );
  if (vietnameseAsciiWordCount >= 3) return "vi";
  const cjk = (t.match(/[一-鿿]/g) ?? []).length;
  const latin = (t.match(/[A-Za-z]/g) ?? []).length;
  if (cjk === 0 && latin > 0) return "en";
  if (latin > 0 && cjk * 4 < latin) return "en";
  return "zh";
}
