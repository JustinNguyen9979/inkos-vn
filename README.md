<div align="center">
  <img src="assets/logo.svg" width="120" height="120" alt="Logo InkOS">
  <img src="assets/inkos-text.svg" width="240" height="65" alt="InkOS">

# InkOS tiếng Việt

Trợ lý viết tiểu thuyết bằng AI, hoạt động trên terminal và trình duyệt.

[![npm](https://img.shields.io/npm/v/inkos-vn?label=npm%20inkos-vn)](https://www.npmjs.com/package/inkos-vn)
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](LICENSE)
[![CI/CD](https://github.com/JustinNguyen9979/inkos-vn/actions/workflows/inkos-vn-sync.yml/badge.svg)](https://github.com/JustinNguyen9979/inkos-vn/actions/workflows/inkos-vn-sync.yml)
</div>

> [!IMPORTANT]
> Đây là bản phân phối tiếng Việt được phát triển dựa trên dự án InkOS của Narcooo.<br>
> **Repository gốc của tác giả: [Narcooo/inkos](https://github.com/Narcooo/inkos)**<br>
> Dự án này không tuyên bố quyền sở hữu đối với mã nguồn gốc. Vui lòng tôn trọng giấy phép AGPL-3.0 và ủng hộ tác giả tại repository chính thức.

## Giới thiệu

InkOS là một trợ lý viết tiểu thuyết bằng AI dành cho những dự án dài hơi. Thay vì chỉ tạo từng đoạn văn rời rạc, hệ thống tổ chức quá trình sáng tác theo dự án, thể loại, nhân vật, bối cảnh, chương truyện và các quy tắc viết.

Bản <code>inkos-vn</code> tập trung Việt hóa giao diện người dùng phía frontend. Tên lệnh, biến môi trường, API và mã nguồn kỹ thuật được giữ nguyên để tương thích với dự án gốc.

### Tính năng chính

- Viết, mở rộng và chỉnh sửa nội dung bằng nhiều AI agent chuyên biệt.
- Quản lý nhân vật, thế giới, cốt truyện, chương và ghi chú trong cùng một dự án.
- Giao diện Studio trên trình duyệt và giao diện TUI trong terminal.
- Chọn thể loại, ngôn ngữ đầu ra và các quy tắc viết riêng.
- Hỗ trợ OpenAI, Anthropic và các dịch vụ tương thích API OpenAI.
- Lưu dự án cục bộ, dễ sao lưu và quản lý bằng Git.
- Tự động đồng bộ thay đổi từ repository gốc, kiểm tra đa nền tảng và phát hành npm khi mã sản phẩm thay đổi.

## Yêu cầu hệ thống

- Node.js 22 trở lên.
- npm đi kèm với Node.js.
- Một API key của nhà cung cấp mô hình mà bạn muốn sử dụng.

Quy trình CI/CD kiểm tra gói npm trên Ubuntu, Windows và macOS với Node.js 22 và 24.

## Cài đặt

### Cài toàn cục từ npm

~~~bash
npm install -g inkos-vn@latest
~~~

Sau khi cài đặt, lệnh sử dụng vẫn là:

~~~bash
inkos
~~~

### Chạy trực tiếp bằng npx

~~~bash
npx inkos-vn@latest
~~~

## Bắt đầu nhanh

### 1. Cấu hình API key

Ví dụ với OpenAI trên macOS hoặc Linux:

~~~bash
export OPENAI_API_KEY="your-api-key"
~~~

Trên Windows PowerShell:

~~~powershell
$env:OPENAI_API_KEY="your-api-key"
~~~

Bạn cũng có thể cấu hình nhà cung cấp và mô hình trực tiếp trong phần cài đặt của InkOS Studio.

### 2. Tạo dự án và khởi động InkOS

~~~bash
inkos init tieu-thuyet-cua-toi
cd tieu-thuyet-cua-toi
inkos
~~~

Lệnh <code>inkos</code> khởi động Studio. Terminal sẽ hiển thị địa chỉ cục bộ để bạn mở bằng trình duyệt.

### 3. Chọn tiếng Việt

Khi tạo hoặc chỉnh sửa thể loại:

1. Mở phần quản lý thể loại.
2. Chọn <strong>Tiếng Việt</strong> tại trường <strong>Ngôn ngữ</strong>.
3. Điền các quy tắc viết nếu cần.
4. Nhấn lưu.

Ngôn ngữ này quyết định ngôn ngữ nội dung mà AI tạo ra, không làm thay đổi tên biến, lệnh CLI hoặc mã nguồn.

## Các chế độ sử dụng

### Studio

Studio là giao diện web cục bộ, phù hợp khi bạn muốn quản lý toàn bộ dự án một cách trực quan:

- Soạn và chỉnh sửa chương.
- Quản lý nhân vật, địa điểm và ghi chú.
- Tạo thể loại và quy tắc viết.
- Trò chuyện với agent.
- Theo dõi tiến trình tạo nội dung.

Khởi động bằng:

~~~bash
inkos
~~~

Sau đó chọn Studio nếu trình khởi động yêu cầu chọn chế độ.

### TUI

TUI là giao diện tương tác ngay trong terminal, phù hợp với người quen làm việc bằng bàn phím và dòng lệnh.

### CLI

Để xem toàn bộ tùy chọn đang được hỗ trợ:

~~~bash
inkos --help
~~~

Để kiểm tra phiên bản:

~~~bash
inkos --version
~~~

## Cấu hình mô hình AI

InkOS có thể sử dụng nhiều nhà cung cấp mô hình. Những biến môi trường thường gặp gồm:

| Nhà cung cấp | Biến môi trường |
| --- | --- |
| OpenAI | <code>OPENAI_API_KEY</code> |
| Anthropic | <code>ANTHROPIC_API_KEY</code> |
| Dịch vụ tương thích OpenAI | API key và base URL tương ứng |

Tên mô hình và nhà cung cấp có thể được cấu hình trong ứng dụng. Không nên commit API key vào Git hoặc chia sẻ khóa trong ảnh chụp màn hình và log CI.

## Agent Skills

InkOS sử dụng các kỹ năng dành cho agent để tổ chức quy trình sáng tác. Tùy cấu hình dự án, agent có thể đảm nhiệm những vai trò như:

| Vai trò | Công việc |
| --- | --- |
| Lập kế hoạch | Xây dựng dàn ý, nhịp truyện và mục tiêu của chương |
| Sáng tác | Viết nội dung mới dựa trên bối cảnh và quy tắc |
| Biên tập | Sửa câu chữ, tính nhất quán và lỗi diễn đạt |
| Kiểm tra | Phát hiện mâu thuẫn về nhân vật, thời gian và thế giới |
| Nghiên cứu | Tổng hợp thông tin cần thiết cho nội dung |

Kết quả vẫn nên được tác giả đọc lại và quyết định trước khi đưa vào bản thảo chính thức.

## Thể loại và quy tắc viết

Mỗi thể loại có thể lưu các hướng dẫn riêng để AI duy trì phong cách nhất quán:

- <strong>Từ ngữ lặp gây nhàm chán:</strong> những từ hoặc cụm từ cần hạn chế lặp lại.
- <strong>Quy tắc nhịp độ:</strong> hướng dẫn tốc độ diễn biến, độ dài cảnh, mức độ xen kẽ giữa hành động, đối thoại và mô tả.
- <strong>Quy tắc (Markdown):</strong> tập hợp hướng dẫn chi tiết được lưu và hiển thị dưới dạng Markdown.

Ví dụ quy tắc nhịp độ:

~~~markdown
- Cảnh hành động dùng câu ngắn và chuyển cảnh nhanh.
- Sau mỗi cao trào cần có một đoạn lắng để nhân vật phản ứng.
- Không đưa quá ba thông tin thế giới mới trong cùng một cảnh.
~~~

Ví dụ quy tắc Markdown:

~~~markdown
## Góc nhìn

- Viết ở ngôi thứ ba giới hạn.
- Không chuyển góc nhìn giữa một cảnh.

## Hội thoại

- Hội thoại phải phù hợp với tuổi và xuất thân của nhân vật.
- Hạn chế dùng lời thoại để giải thích trực tiếp bối cảnh.
~~~

Sau khi lưu, nội dung của trường này được hiển thị dưới dạng Markdown; dữ liệu gốc vẫn có thể được chỉnh sửa lại trong biểu mẫu.

## Dữ liệu dự án

Nên sao lưu thư mục dự án thường xuyên. Nếu quản lý bản thảo bằng Git:

- Không commit API key hoặc tệp chứa bí mật.
- Xem lại thay đổi trước khi commit nội dung do AI tạo.
- Dùng nhánh riêng cho các thử nghiệm lớn.

## Đồng bộ và phát hành tự động

Repository này có quy trình GitHub Actions dành cho bản phân phối tiếng Việt:

1. Kiểm tra thay đổi mới từ repository gốc.
2. Đồng bộ mã nguồn.
3. Áp dụng và xác minh phần Việt hóa giao diện frontend.
4. Chạy kiểm tra chất lượng, build và test.
5. Smoke-test gói npm trên Ubuntu, Windows và macOS.
6. Phát hành phiên bản mới khi có thay đổi ảnh hưởng đến sản phẩm.

Thay đổi chỉ liên quan đến tài liệu sẽ không tạo một phiên bản npm mới.

### Quy ước phiên bản

Tên bản phát hành GitHub dùng định dạng ngày:

- <code>2026-08-30</code> cho bản đầu tiên trong ngày.
- <code>2026-08-30-1</code>, <code>2026-08-30-2</code>... cho các bản tiếp theo.

Do npm yêu cầu Semantic Versioning, phiên bản npm tương ứng dùng dấu chấm:

- <code>2026.8.30</code>
- <code>2026.8.30-1</code>
- <code>2026.8.30-2</code>

## Phát triển từ mã nguồn

~~~bash
git clone https://github.com/JustinNguyen9979/inkos-vn.git
cd inkos-vn
corepack enable
pnpm install
pnpm build
~~~

Các lệnh kiểm tra chính xác có thể thay đổi theo phiên bản. Hãy xem các script trong <code>package.json</code> và workflow tại <code>.github/workflows/inkos-vn-sync.yml</code> trước khi đóng góp.

## Báo lỗi và đóng góp

- Lỗi chỉ xuất hiện trong bản Việt hóa: báo tại [JustinNguyen9979/inkos-vn](https://github.com/JustinNguyen9979/inkos-vn/issues).
- Lỗi thuộc chức năng hoặc mã nguồn gốc: kiểm tra và báo tại [Narcooo/inkos](https://github.com/Narcooo/inkos/issues).
- Khi gửi lỗi, vui lòng cung cấp hệ điều hành, phiên bản Node.js, phiên bản <code>inkos-vn</code>, các bước tái hiện và log đã xóa thông tin nhạy cảm.

## Giấy phép

Dự án được phân phối theo giấy phép [GNU Affero General Public License v3.0](LICENSE). Khi sửa đổi hoặc triển khai lại, bạn có trách nhiệm tuân thủ đầy đủ điều khoản của giấy phép và giữ nguyên thông tin ghi công cần thiết.

---

**Dự án gốc:** [Narcooo/inkos](https://github.com/Narcooo/inkos)<br>
**Bản phân phối tiếng Việt:** [JustinNguyen9979/inkos-vn](https://github.com/JustinNguyen9979/inkos-vn)
