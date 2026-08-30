import { getAppLanguage } from "../lib/app-language";

const VI_PROGRESS_COPY: Readonly<Record<string, string>> = {
  "建书": "Tạo quyển",
  "Create book": "Tạo quyển",
  "Book setup": "Tạo quyển",
  "写作": "Sáng tác",
  "Write": "Sáng tác",
  "Writing": "Sáng tác",
  "审计": "Kiểm tra",
  "Audit": "Kiểm tra",
  "修订": "Chỉnh sửa",
  "Revise": "Chỉnh sửa",
  "Revision": "Chỉnh sửa",
  "导出": "Xuất bản",
  "Export": "Xuất bản",

  "生成基础设定": "Tạo nền tảng truyện",
  "Generate foundation": "Tạo nền tảng truyện",
  "generating foundation": "Đang tạo nền tảng truyện",
  "保存书籍配置": "Lưu cấu hình quyển",
  "Save book config": "Lưu cấu hình quyển",
  "saving book config": "Đang lưu cấu hình quyển",
  "写入基础设定文件": "Ghi các tệp nền tảng",
  "Write foundation files": "Ghi các tệp nền tảng",
  "writing foundation files": "Đang ghi các tệp nền tảng",
  "初始化控制文档": "Khởi tạo tài liệu điều khiển",
  "Initialize control documents": "Khởi tạo tài liệu điều khiển",
  "Initialize control docs": "Khởi tạo tài liệu điều khiển",
  "initializing control documents": "Đang khởi tạo tài liệu điều khiển",
  "创建初始快照": "Tạo ảnh chụp trạng thái ban đầu",
  "Create initial snapshot": "Tạo ảnh chụp trạng thái ban đầu",
  "creating initial snapshot": "Đang tạo ảnh chụp trạng thái ban đầu",

  "准备章节输入": "Chuẩn bị dữ liệu chương",
  "Prepare chapter input": "Chuẩn bị dữ liệu chương",
  "preparing chapter inputs": "Đang chuẩn bị dữ liệu chương",
  "撰写章节草稿": "Viết bản nháp chương",
  "Write chapter draft": "Viết bản nháp chương",
  "Draft the chapter": "Viết bản nháp chương",
  "writing chapter draft": "Đang viết bản nháp chương",
  "落盘最终章节": "Lưu chương hoàn chỉnh",
  "Save final chapter": "Lưu chương hoàn chỉnh",
  "persisting final chapter": "Đang lưu chương hoàn chỉnh",
  "生成最终真相文件": "Tạo các tệp sự thật cuối cùng",
  "Generate final truth files": "Tạo các tệp sự thật cuối cùng",
  "rebuilding final truth files": "Đang tạo lại các tệp sự thật cuối cùng",
  "校验真相文件变更": "Xác thực thay đổi tệp sự thật",
  "Validate truth file changes": "Xác thực thay đổi tệp sự thật",
  "validating truth file updates": "Đang xác thực thay đổi tệp sự thật",
  "同步记忆索引": "Đồng bộ chỉ mục bộ nhớ",
  "Sync memory index": "Đồng bộ chỉ mục bộ nhớ",
  "syncing memory indexes": "Đang đồng bộ chỉ mục bộ nhớ",
  "更新章节索引与快照": "Cập nhật chỉ mục chương và ảnh chụp trạng thái",
  "Update chapter index and snapshot": "Cập nhật chỉ mục chương và ảnh chụp trạng thái",
  "updating chapter index and snapshots": "Đang cập nhật chỉ mục chương và ảnh chụp trạng thái",

  "加载修订上下文": "Tải ngữ cảnh chỉnh sửa",
  "Load revision context": "Tải ngữ cảnh chỉnh sửa",
  "修订章节": "Chỉnh sửa chương",
  "Revise chapter": "Chỉnh sửa chương",
  "落盘修订结果": "Lưu kết quả chỉnh sửa",
  "Save revision result": "Lưu kết quả chỉnh sửa",
  "更新索引与快照": "Cập nhật chỉ mục và ảnh chụp trạng thái",
  "Update index and snapshot": "Cập nhật chỉ mục và ảnh chụp trạng thái",
  "审计章节": "Kiểm tra chương",
  "Audit chapter": "Kiểm tra chương",
};

export function localizeProgressText(value: string): string {
  if (getAppLanguage() !== "vi") return value;
  const exact = VI_PROGRESS_COPY[value];
  if (exact) return exact;

  for (const prefix of ["阶段：", "Stage: "] as const) {
    if (value.startsWith(prefix)) {
      return `Giai đoạn: ${localizeProgressText(value.slice(prefix.length).trim())}`;
    }
  }
  return value;
}
