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
- Workflow `InkOS VN - Sync, Translate and Release` kiểm tra upstream mỗi 6 giờ và cũng chạy khi có code được push vào `inkos-vn`.
- Thay đổi code/package sau khi vượt qua kiểm tra bản dịch, build, typecheck, unit test và Studio E2E sẽ tạo bản npm mới; thay đổi chỉ liên quan tài liệu thì không publish.
- Quality gate chạy Node.js 22 và 24 trên Ubuntu, Windows và macOS. Sau khi publish, workflow còn cài và chạy lại package thật từ npm trên cả ba hệ điều hành rồi mới tạo Git tag/GitHub Release.
- Merge conflict, thiếu bản dịch, lỗi đóng gói hoặc bất kỳ kiểm thử nào thất bại đều dừng trước khi tạo release.
- Package được phát hành theo thứ tự `inkos-vn-core` → `inkos-vn-studio` → `inkos-vn`.

## Quy tắc version

Nhãn GitHub Release hiển thị dạng `yyyy-mm-dd`, ví dụ `2026-08-30`. Nếu có nhiều lần phát hành trong ngày, các nhãn tiếp theo là `2026-08-30-1`, `2026-08-30-2` và tăng dần.

npm bắt buộc version tuân theo Semantic Versioning nên không chấp nhận dấu gạch ngang giữa năm, tháng và ngày. Vì vậy version npm tương ứng sẽ là `2026.8.30`, `2026.8.30-1`, `2026.8.30-2`. Workflow tự tính hai định dạng này theo múi giờ `Asia/Ho_Chi_Minh`.

## Thiết lập automation cho chủ repository

Trong GitHub repository:

1. Đặt `inkos-vn` làm default branch.
2. Cho GitHub Actions quyền ghi repository và tạo Issue/Release.
3. Cấu hình npm Trusted Publishing cho ba package, hoặc thêm secret `NPM_VN_TOKEN`.
4. Thêm secret `INKOS_VN_TRANSLATION_API_KEY`.
5. Thêm variable `INKOS_VN_TRANSLATION_MODEL`.
6. Nếu không dùng endpoint mặc định OpenAI, thêm variable `INKOS_VN_TRANSLATION_BASE_URL`.
7. Khi cần chạy lại một version đã publish dở, chạy workflow thủ công với `release_version`, ví dụ `2026.8.30-1`. Bình thường nên để trống để workflow tự tăng version.

## Cơ chế dịch tự động

Catalog Studio nằm riêng tại `packages/studio/src/i18n/vi.ts`. Script đồng bộ lưu hash nội dung nguồn trong `localization/studio-translation-state.json`. Khi upstream:

- thêm key mới;
- sửa câu tiếng Anh hoặc tiếng Trung của key hiện có;
- thay đổi placeholder;

workflow sẽ yêu cầu API tạo lại đúng các bản dịch bị ảnh hưởng, kiểm tra placeholder, rồi mới build và publish. Nếu API chưa được cấu hình hoặc trả dữ liệu không hợp lệ, workflow dừng an toàn và tạo GitHub Issue.

## Giấy phép

Dự án tiếp tục sử dụng giấy phép `AGPL-3.0-only` của upstream.
