# Kế hoạch xây dựng và tự động duy trì InkOS tiếng Việt

> Trạng thái: tài liệu lập kế hoạch, chưa triển khai.
>
> Mục tiêu: giữ một nhánh mirror nguyên vẹn từ repository gốc, duy trì bản Việt hóa trên nhánh `inkos-vn`, tự động kiểm tra thay đổi upstream, bổ sung bản dịch tiếng Việt khi cần, kiểm thử và phát hành npm mà không gửi thay đổi ngược về tác giả.

## 1. Kết quả khảo sát repository

### 1.1. Git và phiên bản hiện tại

- Fork hiện chỉ có remote `origin`: `https://github.com/JustinNguyen9979/inkos-vn.git`.
- Chưa cấu hình remote `upstream` trỏ tới `https://github.com/Narcooo/inkos.git`.
- Nhánh mặc định trong bản clone hiện là `master`, không phải `main`.
- `origin/HEAD` cũng đang trỏ tới `origin/master`.
- Working tree sạch tại thời điểm khảo sát.
- Phiên bản workspace hiện tại là `1.8.0`.
- License là `AGPL-3.0-only`; bản fork và các bản phân phối phải tiếp tục tuân thủ AGPL-3.0.

### 1.2. Kiến trúc dự án

Đây là pnpm/TypeScript monorepo, yêu cầu Node.js 22 trở lên, gồm ba package có thể publish:

| Package hiện tại | Vai trò | Công nghệ chính |
| --- | --- | --- |
| `@actalk/inkos-core` | Pipeline, agent, prompt, state, model và logic nghiệp vụ | TypeScript |
| `@actalk/inkos-studio` | Web UI và API server | React, Vite, Hono |
| `@actalk/inkos` | CLI và TUI, đồng thời là package người dùng cài | Commander, Ink, React |

Package CLI phụ thuộc cả Core và Studio. Vì vậy, chỉ đổi tên/publish CLI thành `inkos-vn` nhưng vẫn dùng hai package gốc sẽ không đưa phần giao diện Studio tiếng Việt tới người dùng. Bản fork cần phát hành đủ các package nội bộ của chính nó, dù người dùng cuối chỉ cần cài `inkos-vn`.

### 1.3. Cơ chế ngôn ngữ hiện tại

Repository chưa dùng một thư viện i18n tiêu chuẩn hoặc các catalog JSON riêng. Có nhiều lớp localization độc lập:

1. **Studio catalog** tại `packages/studio/src/hooks/use-i18n.ts`:
   - Khoảng 335 key.
   - Mỗi key chứa trực tiếp `{ zh, en }`.
   - `useI18n()` đọc `project.language` từ API.

2. **Studio inline translation** tại `packages/studio/src/lib/app-language.ts`:
   - `AppLanguage` hiện chỉ có `"zh" | "en"`.
   - Helper `tr(zh, en)` được dùng trong component, store và utility không gọi được React hook.
   - Có hơn 300 lượt gọi `tr(...)` trong mã Studio.

3. **Các chuỗi/nhánh điều kiện viết trực tiếp trong UI**:
   - Nhiều component dùng `isZh`, `language === "en"` hoặc ternary Trung/Anh.
   - Một số response và lỗi từ Studio API cũng chọn giữa Trung/Anh.

4. **CLI localization** tại `packages/cli/src/localization.ts`:
   - `CliLanguage` chỉ có `"zh" | "en"`.
   - Nội dung được truyền dưới dạng `{ zh, en }`.
   - Locale được suy ra từ tham số, `INKOS_LOCALE`, rồi tới locale của hệ điều hành.

5. **TUI localization** tại `packages/cli/src/tui/i18n.ts`:
   - `TuiLocale` chỉ có `"zh-CN" | "en"`.
   - Có hai object copy riêng `ZH_CN` và `EN`.

6. **Ngôn ngữ sáng tác trong Core**:
   - `project.language`, book language, prompt language và quy tắc đếm độ dài đang giới hạn ở `zh | en` tại nhiều schema/pipeline.
   - Giá trị này quyết định ngôn ngữ nội dung được AI tạo, đơn vị đếm ký tự/từ và prompt nghiệp vụ.

### 1.4. Vấn đề kiến trúc cần xử lý trước khi thêm tiếng Việt

Studio hiện dùng chung `project.language` cho hai trách nhiệm:

- ngôn ngữ giao diện;
- ngôn ngữ sáng tác/nội dung.

Ví dụ, nút `中/EN` trên header gọi API để ghi trực tiếp `language` vào `inkos.json`. Nếu chỉ mở rộng giá trị này thành `vi`, nhiều schema và pipeline trong Core sẽ không hiểu cách viết/đếm độ dài tiếng Việt. Vì mục tiêu hiện tại là Việt hóa giao diện, kế hoạch phải tách riêng:

```text
uiLocale: zh | en | vi       Ngôn ngữ chrome/UI
contentLanguage: zh | en     Ngôn ngữ sáng tác hiện có
```

Trong giai đoạn đầu, không mở rộng pipeline sáng tác sang tiếng Việt. Người dùng có thể dùng giao diện Việt nhưng vẫn chọn dự án/nội dung tiếng Trung hoặc tiếng Anh.

### 1.5. CI và release hiện tại

- CI chạy trên Ubuntu và Windows, Node 22 và 24.
- CI hiện chỉ trigger khi push/PR vào `master` hoặc `main`; chưa chạy cho `inkos-vn`.
- Release chạy khi có tag `v*`.
- Release hiện:
  1. build/typecheck/test;
  2. publish canary cho cả ba package;
  3. cài package canary để smoke test;
  4. publish bản chính thức cho cả ba package;
  5. kiểm tra npm và tạo GitHub Release.
- Release dùng secret `NPM_TOKEN` và tên package `@actalk/*`; workflow này không được phép dùng nguyên trạng trên fork.
- Script `prepare-package-for-publish.mjs` đang thay `workspace:*` bằng version thật trước khi đóng gói.
- Script `set-package-versions.mjs` cập nhật đồng bộ version của root và ba package.

## 2. Kiến trúc nhánh đề xuất

Do upstream thực tế dùng `master`, nên giữ tên `master` trên fork để giảm cấu hình và tránh nhầm lẫn:

```text
Narcooo/inkos:master
          |
          | fast-forward có kiểm tra
          v
JustinNguyen9979/inkos-vn:master      Mirror sạch, không commit riêng
          |
          | merge tự động trên nhánh tạm
          v
JustinNguyen9979/inkos-vn:inkos-vn    Default branch của fork
          |
          | test + tag + publish
          v
npm: inkos-vn
```

Quy tắc:

- Không commit bản Việt hóa, workflow riêng hoặc metadata npm riêng lên `master`.
- Không mở pull request hoặc push tới repository `Narcooo/inkos`.
- Đặt `inkos-vn` làm default branch để GitHub scheduled workflow chạy từ nhánh này.
- `master` chỉ được cập nhật bằng fast-forward từ `upstream/master`.
- Không force-push tự động. Nếu lịch sử `master` bị phân kỳ, workflow dừng và tạo Issue.
- `inkos-vn` nhận thay đổi bằng merge, không rebase/force-push, để lịch sử đã phát hành luôn truy vết được.

Nếu sau này upstream đổi default branch sang `main`, workflow sẽ cần một thay đổi cấu hình có chủ đích; không tự đoán và chuyển branch.

## 3. Phạm vi Việt hóa

### 3.1. Bắt buộc trong bản đầu tiên

- Studio web UI.
- Màn hình chọn ngôn ngữ và nút đổi ngôn ngữ trên header.
- CLI output dành cho người dùng.
- TUI chrome, trạng thái, trợ giúp và lệnh nội bộ.
- Các lỗi phổ biến từ Studio API được hiển thị trực tiếp.
- Test bảo đảm locale `vi` không rơi về tiếng Trung ngoài các trường hợp đã khai báo.
- `README.vi.md` với hướng dẫn cài `inkos-vn` và giải thích quan hệ với upstream.

### 3.2. Không thuộc phạm vi bản đầu tiên

- Thêm `vi` vào ngôn ngữ sáng tác của Core.
- Dịch prompt nghiệp vụ để AI viết truyện tiếng Việt như một content language chính thức.
- Dịch nội dung người dùng, tên sách hoặc output do model tạo.
- Gửi thay đổi về repository gốc.

Việc hỗ trợ sáng tác tiếng Việt có thể làm ở một giai đoạn độc lập sau khi UI locale ổn định, vì nó ảnh hưởng schema, prompt, đếm độ dài, test chất lượng và nhiều pipeline nghiệp vụ.

## 4. Thiết kế i18n mục tiêu

### 4.1. Tách UI locale khỏi project language

Đề xuất:

- Studio lưu `uiLocale` trong browser `localStorage`, mặc định theo thứ tự:
  1. lựa chọn đã lưu;
  2. locale trình duyệt (`vi*`, `en*`, `zh*`);
  3. fallback `zh` để giữ hành vi upstream.
- `project.language` tiếp tục là `zh | en` và chỉ điều khiển ngôn ngữ nội dung.
- CLI/TUI dùng `INKOS_LOCALE=vi` hoặc locale hệ điều hành `vi_*` cho giao diện.
- Nếu cần đồng bộ locale giữa nhiều trình duyệt/máy, có thể bổ sung file preferences riêng sau; không đưa `uiLocale` vào schema nghiệp vụ ở bước đầu để giảm xung đột upstream.

### 4.2. Chuẩn hóa catalog

Mục tiêu dài hạn là giảm các cặp chuỗi inline và có một nguồn dữ liệu dễ kiểm tra tự động:

```text
packages/studio/src/i18n/
  types.ts
  zh.ts
  en.ts
  vi.ts
  index.ts
```

Mỗi locale phải có cùng tập key. TypeScript sẽ kiểm tra catalog `vi` thỏa mãn cấu trúc catalog nguồn.

Đối với các module hiện đang dùng `tr(zh, en)`, chuyển dần sang key có nghĩa, ví dụ:

```ts
tr("chat.status.processing")
```

Không thực hiện một lần trên toàn bộ repository nếu gây diff quá lớn. Giai đoạn đầu có thể hỗ trợ tương thích ba ngôn ngữ, sau đó chuyển từng khu vực sang key để giảm conflict khi sync upstream.

### 4.3. Tách UI copy và content copy

Các biến đang có tên chung `language` cần được phân loại:

- `uiLocale`: chỉ chrome, label, error, help text.
- `contentLanguage`: sách, prompt, pipeline, word-count.
- `translationSourceLanguage`/`translationTargetLanguage`: tính năng dịch tác phẩm, không liên quan UI locale.

Không thay hàng loạt mọi `"zh" | "en"` thành thêm `vi`; chỉ mở rộng những type thực sự đại diện cho giao diện.

## 5. Chiến lược npm cho monorepo

### 5.1. Các package cần phát hành

Đề xuất publish:

| Vai trò | Tên đề xuất |
| --- | --- |
| Package người dùng cài | `inkos-vn` |
| Core nội bộ của fork | `inkos-vn-core` |
| Studio nội bộ của fork | `inkos-vn-studio` |

Người dùng chỉ cần:

```bash
npm install -g inkos-vn@latest
```

CLI binary vẫn có thể giữ tên lệnh `inkos` để tương thích tài liệu và thói quen sử dụng. Cần cảnh báo rằng không nên cài đồng thời `@actalk/inkos` và `inkos-vn` ở global vì cả hai cùng cung cấp binary `inkos`.

Tên package npm chưa được kiểm tra availability trong giai đoạn khảo sát này. Trước khi triển khai phải xác minh quyền sở hữu cả ba tên. Nếu tên nội bộ đã bị chiếm, dùng scope npm thuộc quyền của chủ fork.

### 5.2. Không đổi toàn bộ import source

Để giảm diff với upstream, không nên đổi hàng loạt import `@actalk/inkos-core`. Script đóng gói riêng của fork có thể chuyển dependency nội bộ thành npm alias, ví dụ về nguyên tắc:

```json
{
  "@actalk/inkos-core": "npm:inkos-vn-core@<version>",
  "@actalk/inkos-studio": "npm:inkos-vn-studio@<version>"
}
```

Nhờ vậy mã nguồn tiếp tục dùng import upstream, nhưng tarball phát hành cài đúng package của fork. Script kiểm tra manifest phải xác nhận tarball không còn `workspace:*` và không phụ thuộc nhầm bản `@actalk/*` từ registry.

### 5.3. Version và tag

Version đề xuất:

```text
Upstream package.json: 1.8.0
Fork release đầu:       1.8.0-vn.1
Fork sửa bản dịch:      1.8.0-vn.2
Upstream lên 1.8.1:     1.8.1-vn.1
```

- Publish bản Việt bằng dist-tag `latest` dù version có suffix prerelease.
- Git tag dùng namespace riêng, ví dụ `inkos-vn-v1.8.0-vn.1`, để không va chạm tag upstream.
- Ghi upstream commit SHA vào GitHub Release và metadata build.
- Revision `vn.N` được xác định từ tag/release đã tồn tại; workflow phải idempotent khi chạy lại.

## 6. Pipeline đồng bộ và phát hành hoàn toàn tự động

### 6.1. Trigger

- `schedule`: mỗi 6 giờ.
- `workflow_dispatch`: chạy thủ công khi cần.
- `concurrency`: chỉ cho phép một lần sync/release hoạt động; lượt mới không được chen ngang lượt đang publish.

Workflow nằm trên default branch `inkos-vn`.

### 6.2. Job A — kiểm tra và cập nhật mirror

1. Checkout đầy đủ lịch sử và tag.
2. Fetch `https://github.com/Narcooo/inkos.git` vào remote tạm `upstream`.
3. Xác nhận `origin/master` là ancestor của `upstream/master`.
4. Nếu bằng nhau: kết thúc với trạng thái không có update.
5. Nếu fast-forward được: cập nhật `origin/master` đúng tới upstream SHA.
6. Nếu phân kỳ: không force-push; tạo/cập nhật GitHub Issue và dừng.

### 6.3. Job B — tích hợp trên ref tạm

1. Tạo branch tạm từ `origin/inkos-vn`.
2. Merge `origin/master` với merge commit ghi rõ upstream SHA.
3. Nếu conflict:
   - abort merge;
   - không cập nhật `inkos-vn`;
   - tạo Issue kèm danh sách file conflict.
4. Không push branch tạm nếu chưa qua toàn bộ gate.

### 6.4. Job C — phân loại thay đổi

Phân loại dựa trên diff từ upstream SHA đã tích hợp lần trước:

- **Docs/assets only**: cập nhật `inkos-vn`, không publish npm.
- **Code/dependency/build thay đổi**: chạy đầy đủ test và chuẩn bị release.
- **UI/i18n thay đổi**: chạy bước phát hiện/dịch trước test.
- **Workflow/release thay đổi upstream**: luôn đánh dấu cần kiểm tra guard; không cho workflow upstream publish tên `@actalk/*` từ fork.

Quyết định publish cuối cùng nên dựa thêm trên nội dung distributable của ba package, không chỉ dựa vào tên thư mục. Điều này tránh publish khi upstream chỉ sửa ảnh hoặc README.

### 6.5. Job D — phát hiện nhu cầu dịch

Script kiểm tra cần phát hiện:

- Key mới trong catalog `zh`/`en`.
- Nội dung tiếng Anh của key cũ đã đổi nhưng key không đổi.
- Chuỗi mới được thêm qua helper inline.
- Ternary `isZh` hoặc `language === "en"` mới trong vùng UI.
- Chuỗi literal Trung/Anh mới trong TSX thuộc vùng hiển thị.
- Placeholder khác nhau giữa `en` và `vi`, gồm `{name}`, `%s`, template token và markup.
- Key Việt bị thiếu, thừa hoặc có giá trị rỗng.

Lưu manifest/hash bản dịch để biết câu nguồn nào đã được dịch theo phiên bản nào. Nếu chỉ so sánh key, workflow sẽ bỏ sót trường hợp upstream sửa câu tiếng Anh nhưng giữ nguyên key.

### 6.6. Job E — tự động tạo bản dịch Việt

Đề xuất dùng một API AI tương thích OpenAI, cấu hình qua GitHub Secrets:

- endpoint;
- API key;
- model;
- glossary tiếng Việt;
- prompt version.

Mỗi request phải cung cấp key, câu Anh, câu Trung nếu có, tên file/component và placeholder. Output phải là JSON có schema cố định.

Guard bắt buộc:

- Không chấp nhận thiếu placeholder.
- Không chấp nhận output rỗng hoặc sai schema.
- Giữ nguyên tên sản phẩm, command, flag, env var và đường dẫn.
- Giữ nguyên Markdown/HTML/code token.
- Dùng glossary thống nhất.
- Retry có giới hạn; hết retry thì dừng, không fallback âm thầm sang tiếng Trung.

Nếu translation API lỗi, workflow tạo Issue và không cập nhật `inkos-vn`/không publish.

### 6.7. Job F — quality gates

Chạy tối thiểu:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm typecheck
pnpm test
pnpm verify:publish-manifests
```

Bổ sung:

- locale parity test `zh/en/vi`;
- placeholder parity test;
- test resolver cho `vi`, `vi-VN`, `vi_VN.UTF-8`;
- Studio component tests cho chuyển locale mà không đổi content language;
- CLI/TUI snapshot hoặc assertion tiếng Việt;
- smoke test Studio;
- Playwright cho màn hình chọn ngôn ngữ/header và một số trang chính;
- `npm pack` cả ba package và kiểm tra nội dung tarball;
- cài tarball vào thư mục tạm, chạy `inkos --version`, `inkos --help` và khởi động Studio.

Giữ matrix Ubuntu/Windows và Node 22/24 của upstream. E2E đầy đủ có thể chạy một lần trên Ubuntu để giới hạn thời gian CI.

### 6.8. Job G — commit, tag và publish

Chỉ sau khi mọi gate đạt:

1. Commit merge + translation/generated metadata lên `inkos-vn`.
2. Nếu distributable không đổi: kết thúc, không tag npm release.
3. Nếu distributable đổi: tính version `upstream-vn.N`.
4. Build và pack lại từ chính commit chuẩn bị phát hành.
5. Tạo tag namespaced.
6. Publish theo thứ tự:
   - Core;
   - Studio;
   - CLI `inkos-vn` cuối cùng.
7. Verify từng package/version trên npm.
8. Cài `inkos-vn@latest` trong môi trường sạch và chạy smoke test.
9. Tạo GitHub Release kèm upstream SHA, danh sách file thay đổi và trạng thái dịch.

CLI được publish cuối để người dùng không nhìn thấy một release chính khi dependency nội bộ chưa sẵn sàng. Khi rerun, workflow kiểm tra version đã tồn tại và bỏ qua package đã publish thành công, giúp phục hồi trường hợp publish một phần.

Không dựa vào việc tag do `GITHUB_TOKEN` tạo sẽ tự kích hoạt workflow khác. Dùng một orchestrator workflow với các job phụ thuộc nhau hoặc reusable workflow được gọi trực tiếp trong cùng run.

## 7. Bảo vệ GitHub và npm

### 7.1. GitHub

- Default branch: `inkos-vn`.
- Branch protection cho `master`: cấm commit trực tiếp, chỉ automation mirror được phép cập nhật fast-forward.
- Branch protection cho `inkos-vn`: cho phép GitHub Actions bot push sau khi gate đạt.
- Workflow permissions theo nguyên tắc tối thiểu:
  - `contents: write` chỉ ở job cần push/tag/release;
  - `issues: write` cho cảnh báo;
  - `id-token: write` chỉ nếu dùng npm trusted publishing.
- Thêm guard `github.repository == 'JustinNguyen9979/inkos-vn'` cho mọi job có quyền ghi hoặc publish.
- Không lưu PAT có quyền tới repository upstream.

### 7.2. npm

- Ưu tiên npm Trusted Publishing/OIDC nếu cấu hình package cho phép.
- Nếu buộc dùng token, tạo automation token chỉ có quyền với package fork và lưu dưới secret riêng, không dùng tên `NPM_TOKEN` của workflow upstream.
- Workflow fork không bao giờ chạy lệnh publish package `@actalk/*`.
- Bật provenance khi publish nếu npm hỗ trợ cho cấu hình tương ứng.
- Không tự động unpublish; release lỗi được sửa bằng revision `vn.N+1` và deprecate bản lỗi nếu cần.

## 8. Các giai đoạn triển khai

### Giai đoạn 0 — chốt thông số và baseline

- Xác minh availability/quyền sở hữu ba package npm.
- Chọn translation provider/model.
- Chốt glossary ban đầu.
- Cấu hình `upstream` và xác nhận branch upstream là `master`.
- Chạy baseline build/test hiện tại trước khi chỉnh sửa.

**Điều kiện hoàn thành:** baseline xanh và các tên npm đã được giữ/quản lý bởi chủ fork.

### Giai đoạn 1 — nền tảng i18n ba ngôn ngữ

- Tạo type `UiLocale = "zh" | "en" | "vi"` riêng.
- Tách locale UI Studio khỏi `project.language`.
- Thêm persistence và browser locale detection.
- Thêm catalog Việt cho Studio.
- Mở rộng helper inline có kiểm soát.
- Thêm copy Việt cho CLI/TUI.
- Refactor các nhánh UI quan trọng đang phụ thuộc trực tiếp `isZh`.
- Thêm test parity/placeholder/resolver.

**Điều kiện hoàn thành:** chuyển UI sang Việt không thay đổi ngôn ngữ sáng tác và các bề mặt chính không còn fallback Trung/Anh ngoài danh sách cho phép.

### Giai đoạn 2 — package fork và release thủ công thử nghiệm

- Đổi metadata package fork.
- Viết rewrite/verify script cho dependency alias nội bộ.
- Pack đủ ba package.
- Cài tarball trong thư mục sạch.
- Publish một bản canary thủ công có kiểm soát.
- Verify CLI, TUI và Studio từ package đã cài.

**Điều kiện hoàn thành:** `npm install -g inkos-vn@canary` hoạt động độc lập với package `@actalk/*` đã cài sẵn.

### Giai đoạn 3 — automation sync/integration

- Thêm scheduled workflow trên `inkos-vn`.
- Thêm fast-forward guard cho `master`.
- Thêm merge tạm, conflict reporting và concurrency lock.
- Phân loại docs-only/code/i18n/distributable change.
- Chạy test nhưng chưa tự publish latest trong những lần thử đầu.

**Điều kiện hoàn thành:** một update upstream giả lập được mirror và tích hợp đúng; conflict/test failure không làm thay đổi `inkos-vn`.

### Giai đoạn 4 — automation dịch

- Tạo extractor/detector.
- Tạo translation manifest/hash.
- Kết nối provider qua secret.
- Thêm glossary, schema validation, placeholder validation và retry.
- Tạo Issue khi không thể dịch an toàn.

**Điều kiện hoàn thành:** thêm/sửa một key tiếng Anh giả lập tạo ra bản Việt hợp lệ; lỗi provider không làm branch/release thay đổi.

### Giai đoạn 5 — fully automatic production release

- Kích hoạt version/tag tự động.
- Publish Core → Studio → CLI.
- Verify registry và cài mới.
- Tạo GitHub Release/Issue tự động.
- Chạy diễn tập retry sau lỗi publish từng phần.
- Bật lịch 6 giờ chính thức.

**Điều kiện hoàn thành:** một upstream update có thay đổi code và một update có thay đổi UI đều đi hết pipeline; docs-only update không tạo npm release.

## 9. Kịch bản kiểm thử chấp nhận

1. Upstream không đổi → workflow không tạo commit/tag/release.
2. Upstream chỉ đổi README → `master` và `inkos-vn` cập nhật, npm không publish.
3. Upstream đổi Core không liên quan UI → merge, full test, publish revision mới.
4. Upstream thêm một catalog key → tự dịch Việt, kiểm tra placeholder, publish.
5. Upstream sửa câu Anh nhưng giữ key → hash phát hiện và dịch lại.
6. Upstream thêm chuỗi UI inline → detector cảnh báo hoặc chuyển thành catalog trước khi publish.
7. Translation API timeout → retry rồi tạo Issue; không push `inkos-vn`, không publish.
8. Merge conflict → mirror `master` vẫn cập nhật; `inkos-vn` giữ release tốt gần nhất.
9. Test/build fail → không tag và không publish.
10. Core publish thành công nhưng Studio lỗi → rerun bỏ qua Core cùng version, tiếp tục Studio rồi CLI.
11. Chọn giao diện Việt trong Studio → `project.language`/book language không đổi.
12. `INKOS_LOCALE=vi-VN` → CLI/TUI hiển thị Việt.
13. Cài package trong máy sạch → không tải nhầm `@actalk/inkos-studio` thay cho Studio fork.
14. Tag upstream tồn tại → không va chạm tag `inkos-vn-v*`.

## 10. Rủi ro chính và cách giảm thiểu

| Rủi ro | Giảm thiểu |
| --- | --- |
| UI locale làm thay đổi ngôn ngữ sáng tác | Tách type, storage và API; thêm regression test |
| Số lượng chuỗi inline lớn gây sót | Catalog parity + AST/literal detector + allowlist có lý do |
| Merge conflict thường xuyên ở file i18n lớn | Tách catalog Việt; hạn chế sửa cấu trúc file upstream; merge trên ref tạm |
| Publish nhầm package của tác giả | Đổi secret, package allowlist và repository guard |
| Chỉ publish CLI nhưng cài Studio gốc | Publish đủ package fork và kiểm tra tarball/dependency alias |
| Publish ba package bị gián đoạn | Core → Studio → CLI, idempotent retry, CLI publish cuối |
| Dịch AI làm hỏng placeholder/markup | JSON schema, placeholder parity, glossary và fail closed |
| Scheduled workflow bị ngừng | Đặt `inkos-vn` làm default branch; theo dõi run thất bại và Issue |
| Upstream đổi branch hoặc release layout | Dừng với Issue thay vì tự đoán/force |
| Docs-only tạo quá nhiều npm version | So sánh distributable trước khi release |

## 11. Các quyết định cần được chủ repository phê duyệt trước khi triển khai

1. Giữ `master` làm mirror đúng theo upstream hay tạo thêm nhánh mirror tên `main`. Khuyến nghị: giữ `master`.
2. Cho phép đặt `inkos-vn` làm default branch của fork.
3. Xác nhận mô hình ba package: `inkos-vn`, `inkos-vn-core`, `inkos-vn-studio` hoặc cung cấp npm scope thay thế.
4. Chọn translation provider/model và mức ngân sách API.
5. Xác nhận binary vẫn là `inkos` hay đổi thành `inkos-vn`. Khuyến nghị: giữ `inkos` để tương thích, đồng thời tài liệu cảnh báo xung đột global install.
6. Chọn npm Trusted Publishing hay automation token. Khuyến nghị: Trusted Publishing.

## 12. Thứ tự công việc được khuyến nghị

Không bật tự động publish ngay từ đầu. Thứ tự an toàn là:

```text
baseline
→ tách UI locale
→ hoàn tất bản Việt + test
→ pack/cài thử ba package
→ publish canary
→ automation sync ở chế độ dry-run
→ automation dịch
→ diễn tập lỗi/retry
→ bật auto publish latest
```

Mỗi giai đoạn chỉ chuyển tiếp khi điều kiện hoàn thành của giai đoạn trước đã đạt. Trong suốt quá trình, `master` phải luôn có thể so sánh trực tiếp với `upstream/master`, còn bản phát hành gần nhất trên `inkos-vn` phải tiếp tục cài và chạy được nếu một lần sync mới thất bại.
