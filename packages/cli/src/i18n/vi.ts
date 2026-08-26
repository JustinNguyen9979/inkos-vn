/**
 * Vietnamese overlay for legacy CLI messages.
 *
 * The upstream formatter still owns interpolation. We translate the rendered
 * English copy here so upstream formatter changes remain easy to merge.
 */
const EXACT: Readonly<Record<string, string>> = {
  "Done.": "Hoàn tất.",
  "Import complete:": "Nhập dữ liệu hoàn tất:",
  "Canon imported: story/parent_canon.md": "Đã nhập bản gốc: story/parent_canon.md",
  "Writer and auditor will auto-detect this file for spinoff mode.": "Trình viết và kiểm tra sẽ tự nhận diện tệp này trong chế độ ngoại truyện.",
  "Cancelled.": "Đã hủy.",
  "Check that the API key is valid, the model is available, and the account has enough balance or quota.": "Kiểm tra API key, khả dụng của mô hình và số dư hoặc hạn mức tài khoản.",
  "All chat/responses and stream on/off combinations were already probed; if it still fails, the problem is more likely the model name, the baseUrl path, or provider compatibility itself.": "Đã thử mọi kết hợp chat/responses và bật/tắt stream. Nếu vẫn lỗi, hãy kiểm tra tên mô hình, đường dẫn baseUrl hoặc khả năng tương thích của nhà cung cấp.",
  "The baseUrl may be wrong. Check that INKOS_LLM_BASE_URL includes the full path (e.g. /v1).": "baseUrl có thể không đúng. Hãy kiểm tra INKOS_LLM_BASE_URL có chứa đường dẫn đầy đủ, ví dụ /v1.",
  "Check the provider docs to confirm whether the endpoint requires stream=true, stream=false, or does not support streaming at all.": "Kiểm tra tài liệu nhà cung cấp để xác nhận endpoint yêu cầu stream=true, stream=false hay không hỗ trợ stream.",
  "Check that the model name is correct (INKOS_LLM_MODEL).": "Kiểm tra tên mô hình trong INKOS_LLM_MODEL.",
  "The API key is invalid. Check INKOS_LLM_API_KEY.": "API key không hợp lệ. Hãy kiểm tra INKOS_LLM_API_KEY.",
};

const PATTERNS: ReadonlyArray<readonly [RegExp, (...parts: string[]) => string]> = [
  [/^Creating book "(.+)" \((.+) \/ (.+)\)\.\.\.$/, (title, genre, platform) => `Đang tạo sách "${title}" (${genre} / ${platform})...`],
  [/^Book created: (.+)$/, (id) => `Đã tạo sách: ${id}`],
  [/^Next: (.+)$/, (command) => `Tiếp theo: ${command}`],
  [/^\[(\d+)\/(\d+)\] Writing chapter for "(.+)"\.\.\.$/, (current, total, id) => `[${current}/${total}] Đang viết chương cho "${id}"...`],
  [/^Chapter (\d+): (.+)$/, (chapter, title) => `  Chương ${chapter}: ${title}`],
  [/^  Length: (.+)$/, (length) => `  Độ dài: ${length}`],
  [/^  Audit: PASSED$/, () => "  Kiểm tra: ĐẠT"],
  [/^  Audit: NEEDS REVIEW$/, () => "  Kiểm tra: CẦN XEM LẠI"],
  [/^  Status: (.+)$/, (status) => `  Trạng thái: ${status}`],
  [/^  Issues:$/, () => "  Vấn đề:"],
  [/^Auto-writing "(.+)": chapter (\d+) through chapter (\d+)\.\.\.$/, (id, start, end) => `Đang tự động viết "${id}": từ chương ${start} đến chương ${end}...`],
  [/^Found (\d+) chapters to import into "(.+)"\.$/, (count, id) => `Tìm thấy ${count} chương để nhập vào "${id}".`],
  [/^Resuming from chapter (\d+)\.$/, (chapter) => `Tiếp tục nhập từ chương ${chapter}.`],
  [/^  Chapters imported: (\d+)$/, (count) => `  Số chương đã nhập: ${count}`],
  [/^  Total length: (.+)$/, (length) => `  Tổng độ dài: ${length}`],
  [/^  Next chapter number: (\d+)$/, (chapter) => `  Số chương tiếp theo: ${chapter}`],
  [/^Run "(.+)" to continue writing\.$/, (command) => `Chạy "${command}" để tiếp tục viết.`],
  [/^Importing canon from "(.+)" into "(.+)"\.\.\.$/, (source, target) => `Đang nhập bản gốc từ "${source}" vào "${target}"...`],
  [/^No models available for (.+) \(you may need --api-key and --base-url\)$/, (service) => `${service} không có mô hình khả dụng; có thể cần --api-key và --base-url.`],
  [/^(.+): (\d+) model\(s\)$/, (service, count) => `${service}: ${count} mô hình`],
  [/^Error: (.*)$/s, (detail) => `Lỗi: ${detail}`],
  [/^Checked (\d+) chapter\(s\); index\.json word counts already match the files\.$/, (count) => `Đã kiểm tra ${count} chương; số lượng trong index.json đã khớp với tệp.`],
  [/^Backed up (.+) → (.+)$/, (id, path) => `Đã sao lưu ${id} → ${path}`],
  [/^No backups for (.+) yet\. Create one with: (.+)$/, (id, command) => `${id} chưa có bản sao lưu. Tạo bằng: ${command}`],
];

export function translateCliEnglish(english: string): string {
  const exact = EXACT[english];
  if (exact) return exact;

  for (const [pattern, render] of PATTERNS) {
    const match = pattern.exec(english);
    if (match) return render(...match.slice(1));
  }

  return english;
}
