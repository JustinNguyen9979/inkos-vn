# InkOS tiếng Việt

Đây là bản phân phối tiếng Việt của [InkOS](https://github.com/Narcooo/inkos). Bản fork giữ nguyên logic nghiệp vụ từ upstream và bổ sung lớp giao diện tiếng Việt độc lập.

## Cài đặt

Yêu cầu Node.js 22 trở lên.

```bash
npm install -g inkos-vn@latest
inkos --version
```

Package vẫn cung cấp lệnh `inkos` để tương thích với dự án gốc. Không nên cài global đồng thời `@actalk/inkos` và `inkos-vn`, vì hai package cùng cung cấp binary này.

## Chọn tiếng Việt

- Studio: chọn nút `VI` ở màn hình đầu hoặc thanh trên cùng.
- TUI: đặt `INKOS_TUI_LOCALE=vi` hoặc `INKOS_LOCALE=vi`.
- CLI: đặt `INKOS_LOCALE=vi`; các thông báo đã có trong overlay sẽ hiển thị tiếng Việt.

Ngôn ngữ giao diện được tách khỏi ngôn ngữ sáng tác. Chọn giao diện Việt không tự đổi sách hoặc pipeline sáng tác từ tiếng Trung/Anh sang tiếng Việt.

## Cấu trúc đồng bộ

- `master`: mirror fast-forward của `Narcooo/inkos:master`, không chứa thay đổi riêng.
- `inkos-vn`: default branch, chứa overlay Việt và automation.
- Workflow `InkOS VN - Sync, Translate and Release` kiểm tra upstream mỗi 6 giờ.
- Merge conflict, thiếu bản dịch, build lỗi hoặc test lỗi đều dừng trước khi publish.
- Package được phát hành theo thứ tự `inkos-vn-core` → `inkos-vn-studio` → `inkos-vn`.

## Thiết lập automation cho chủ repository

Trong GitHub repository:

1. Đặt `inkos-vn` làm default branch.
2. Cho GitHub Actions quyền ghi repository và tạo Issue/Release.
3. Cấu hình npm Trusted Publishing cho ba package, hoặc thêm secret `NPM_VN_TOKEN`.
4. Thêm secret `INKOS_VN_TRANSLATION_API_KEY`.
5. Thêm variable `INKOS_VN_TRANSLATION_MODEL`.
6. Nếu không dùng endpoint mặc định OpenAI, thêm variable `INKOS_VN_TRANSLATION_BASE_URL`.
7. Chạy workflow thủ công lần đầu với `release_version` là `1.8.0-vn.1`.

Ba tên package `inkos-vn`, `inkos-vn-core` và `inkos-vn-studio` trả về `404 Not Found` trên npm tại thời điểm kiểm tra ngày 26/08/2026. Lần publish đầu tiên vẫn cần tài khoản npm có quyền tạo package public.

## Cơ chế dịch tự động

Catalog Studio nằm riêng tại `packages/studio/src/i18n/vi.ts`. Script đồng bộ lưu hash nội dung nguồn trong `localization/studio-translation-state.json`. Khi upstream:

- thêm key mới;
- sửa câu tiếng Anh hoặc tiếng Trung của key hiện có;
- thay đổi placeholder;

workflow sẽ yêu cầu API tạo lại đúng các bản dịch bị ảnh hưởng, kiểm tra placeholder, rồi mới build và publish. Nếu API chưa được cấu hình hoặc trả dữ liệu không hợp lệ, workflow dừng an toàn và tạo GitHub Issue.

## Giấy phép

Dự án tiếp tục sử dụng giấy phép `AGPL-3.0-only` của upstream.
