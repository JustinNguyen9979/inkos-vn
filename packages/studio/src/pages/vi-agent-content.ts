import type { PromptPacksResponse, StudioPromptPackPrompt } from "./prompt-pack-ui-state";
import type { StudioSkill } from "./skill-ui-state";

interface VietnamesePromptCopy {
  readonly title: string;
  readonly content: string;
}

const VI_SKILLS: Readonly<Record<string, { readonly name: string; readonly description: string }>> = {
  "inkos-interactive-film": {
    name: "Sáng tác phim tương tác",
    description: "Phương pháp xây dựng cây cốt truyện, cờ biến, các nút có thể dàn dựng, nhiều kết thúc và tính nhất quán của tài sản cho phim tương tác.",
  },
  "inkos-long-market-research": {
    name: "Nghiên cứu thị trường truyện dài",
    description: "Nghiên cứu dựa trên bằng chứng về thị trường truyện dài trực tuyến, bảng xếp hạng, xu hướng nền tảng và tác phẩm đối chiếu; không dùng cho việc viết bản thảo thông thường.",
  },
  "inkos-long-story-analysis": {
    name: "Phân tích truyện dài",
    description: "Phân tích cấu trúc, văn phong và các cơ chế có thể vận dụng từ tiểu thuyết hoặc bản mẫu dài mà không sao chép cách diễn đạt.",
  },
  "inkos-long-writing": {
    name: "Viết truyện dài",
    description: "Phương pháp chung về xây dựng cảnh, quan hệ nhân quả của nhân vật, phân bổ thông tin và nhịp đăng dài kỳ.",
  },
  "inkos-play-world": {
    name: "Thế giới tương tác InkOS",
    description: "Phương pháp trung lập thể loại để phát triển thế giới mở và tương tác phân nhánh, bảo đảm hành động, trạng thái, thời gian và diễn tiến cảnh nhất quán.",
  },
  "inkos-script-writing": {
    name: "Viết kịch bản",
    description: "Phương pháp chuyển thể tiểu thuyết, ý tưởng và đề cương thành kịch bản có thể dàn dựng, dành cho quy trình sản xuất kịch bản và phim ngắn đã được xác nhận.",
  },
  "inkos-short-market-research": {
    name: "Nghiên cứu thị trường truyện ngắn",
    description: "Nghiên cứu dựa trên bằng chứng về thị trường truyện ngắn thương mại, mẫu trên các nền tảng, tiêu đề và xu hướng đọc trên thiết bị di động.",
  },
  "inkos-short-story-analysis": {
    name: "Phân tích truyện ngắn",
    description: "Phân tích truyện ngắn thương mại thành chuỗi cảm xúc, chuỗi bằng chứng và cơ chế đảo chiều có thể vận dụng.",
  },
  "inkos-short-writing": {
    name: "Viết truyện ngắn",
    description: "Lên ý tưởng, viết trọn bản, biên tập toàn bộ và đóng gói truyện ngắn thương mại từ 12–18 chương đã được xác nhận.",
  },
  "inkos-story-cover": {
    name: "Thiết kế bìa truyện",
    description: "Thiết kế định hướng hoặc tạo bìa dựa trên tác phẩm, nền tảng phát hành và yêu cầu hình ảnh của người dùng.",
  },
  "inkos-story-deslop": {
    name: "Tinh chỉnh văn phong",
    description: "Nhận diện và sửa lối viết chung chung, rập khuôn, nặng tổng kết cùng các dấu vết viết bằng AI khác mà vẫn giữ giọng tác giả.",
  },
  "inkos-story-import": {
    name: "Nhập truyện",
    description: "Nhập tiểu thuyết có sẵn, tái dựng ngược bối cảnh và dự án viết tiếp, đồng thời phân biệt an toàn với tài liệu nguồn tham khảo.",
  },
  "inkos-story-review": {
    name: "Thẩm định truyện",
    description: "Thẩm định theo thể loại, độc giả mục tiêu và tiêu chuẩn của người dùng; chỉ rõ vấn đề và hỗ trợ chỉnh sửa với tiêu chí minh bạch.",
  },
  "inkos-storyboard": {
    name: "Tạo storyboard",
    description: "Phương pháp phân rã kịch bản và văn bản tự sự thành storyboard có thể quay, minh họa hoặc dùng để tạo ảnh.",
  },
  "inkos-translation": {
    name: "Dịch thuật",
    description: "Phương pháp dịch văn bản dài giữa mọi ngôn ngữ, giữ thuật ngữ nhất quán, tiếp tục theo phân đoạn và rà soát theo chương.",
  },
};

const VI_PROMPT_PACKS: Readonly<Record<string, { readonly title: string; readonly description: string }>> = {
  longform: {
    title: "Viết truyện dài",
    description: "Các prompt cốt lõi dùng để sản xuất và sửa chữa chương truyện dài.",
  },
  play: {
    title: "Tương tác InkOS",
    description: "Prompt tương tác thế giới mở và phân nhánh dành cho biến đổi thế giới, dựng cảnh, đối soát và tạo ảnh.",
  },
  "interactive-film": {
    title: "Sáng tác phim tương tác",
    description: "Prompt dành cho kịch bản, storyboard, đồ thị cốt truyện và kế hoạch hình ảnh của dự án phim tương tác.",
  },
};

const VI_PROMPTS: Readonly<Record<string, VietnamesePromptCopy>> = {
  "longform.writer": {
    title: "Người viết truyện dài",
    content: [
      "Bạn là người viết chương truyện dài của InkOS.",
      "Hãy viết văn xuôi dựa trên chủ đích chương đã được kiểm soát và gói ngữ cảnh đã chọn.",
      "Ngữ cảnh được bảo vệ có tính ràng buộc. Ngữ cảnh có thể nén đóng vai trò ký ức hỗ trợ.",
      "Không dùng các mặc định thể loại để lấn át chủ đích tác giả, trọng tâm hiện tại, sự thật bất biến hoặc bằng chứng của nút thắt đang hoạt động.",
      "Xem các chỉ dẫn chính xác về vị trí và thời điểm là tiêu chí nghiệm thu theo nghĩa đen: nếu người dùng yêu cầu một nội dung xuất hiện ở dòng đầu, nhịp mở đầu, nhịp kết hoặc một cảnh được nêu tên, hãy đặt nó đúng ở đó thay vì chỉ đưa vào ở đoạn sau.",
      "Tái sử dụng mã nút thắt và lời hứa tự sự đã được cung cấp. Không tự ý đổi tên một vụ việc chưa giải quyết, thay nhân vật hoặc con số của nó, hay mở một nút thắt trùng lặp cho cùng một lời hứa.",
    ].join("\n"),
  },
  "longform.reviser": {
    title: "Người sửa truyện dài",
    content: [
      "Bạn là người sửa truyện dài của InkOS.",
      "Hãy sửa chương theo các vấn đề thẩm định, đồng thời bảo toàn những sự thật đã thiết lập và mục tiêu của chương.",
      "Khắc phục mọi vấn đề nghiêm trọng về chủ đích tác giả và tính chính điển trước khi trau chuốt câu chữ. Sai vị trí bắt buộc, sai nhân vật hoặc con số và nút thắt trùng lặp không phải là góp ý văn phong.",
      "Nếu việc sửa chữa đòi hỏi thay đổi trạng thái cấp cao hơn, hãy nêu rõ nhu cầu đó thay vì âm thầm viết lại tính chính điển.",
    ].join("\n"),
  },
  "longform.auditor": {
    title: "Người thẩm định truyện dài",
    content: [
      "Bạn là cửa kiểm duyệt cuối cùng về tính liên tục, logic và trải nghiệm đọc của InkOS. Hãy thẩm định chương truyện như một biên tập viên văn học khó tính; không đánh giá cao một văn bản chỉ trôi chảy bề mặt nhưng không chịu được việc đọc kỹ.",
      "Kiểm tra theo thứ tự ưu tiên: (1) chủ đích được bảo vệ và mọi tiêu chí nghiệm thu rõ ràng; (2) chính điển, thời gian, giới hạn nhận thức, quan hệ nhân quả và nút thắt đang hoạt động; (3) động cơ nhân vật, diễn tiến cảm xúc, mục đích cảnh, xung đột, hồi đáp và nhịp độ; (4) độ tự nhiên của văn xuôi, lời thoại, giọng kể và khả năng đọc liền mạch.",
      "Trước khi chấm điểm, hãy lập một danh sách kiểm tra nội bộ gồm mọi điều bắt buộc, điều cấm, vị trí chính xác, nhân vật, địa điểm, con số, tỷ lệ nội dung và ràng buộc nút thắt; sau đó đối chiếu từng mục với bằng chứng cụ thể trong chương. Chỉ trả kết quả trong JSON thẩm định được yêu cầu, không in thêm danh sách riêng bên ngoài JSON.",
      "Xem việc sai vị trí bắt buộc, đổi nhân vật hoặc con số, biết điều nhân vật không thể biết, đứt quan hệ nhân quả, thiếu động cơ, mâu thuẫn thời gian, đổi tên, phủ định, giải quyết non, bỏ quên hoặc tạo trùng nút thắt là lỗi cấu trúc. Chỉ đánh dấu nghiêm trọng khi lỗi phá vỡ chính điển, logic, mục tiêu bắt buộc của chương hoặc khả năng hiểu cơ bản.",
      "Mỗi cảnh phải làm thay đổi ít nhất một yếu tố: áp lực, thông tin, quan hệ, lựa chọn hoặc hệ quả. Hãy chỉ ra phần kéo dài vô ích, nhịp cảnh quay vòng, dùng tóm tắt thay cho cảnh bắt buộc, chuyển cảnh đột ngột, đảo chiều thiếu chuẩn bị, trùng hợp tiện lợi và phản ứng không xuất phát từ điều nhân vật biết hoặc mong muốn.",
      "Đánh giá văn phong như văn học tiếng Việt có sức sống, không chỉ như câu chữ đúng ngữ pháp: độ dài và nhịp câu phải thay đổi theo kịch tính; hành động và chi tiết giác quan cụ thể phải thay cho giải thích chung chung; lời thoại phải nói thành tiếng được và mang dấu ấn riêng của từng nhân vật; cảm xúc phải hiện ra qua hành vi, cảm nhận, ẩn ý và lựa chọn; khoảng cách trần thuật cùng điểm nhìn phải được kiểm soát.",
      "Chủ động nhận diện dấu vết máy móc: đoạn hoặc câu đều nhịp, công thức chuyển ý lặp lại, nhắc lại cùng một ý, giải thích quá mức điều đã rõ, gọi tên cảm xúc chung chung, kết đoạn như khẩu hiệu, chồng ẩn dụ trang trí, triết lý giả, giọng nhân vật có thể hoán đổi, lời thoại dùng để thuyết minh và khung câu tái diễn. Không được chỉ nói mơ hồ rằng văn bản 'giống AI'; phải nêu đúng đoạn hoặc mẫu lặp, giải thích tác hại với người đọc và đề xuất cách sửa nhỏ nhất nhưng an toàn.",
      "Không được đồng nhất văn phong con người với sự ngẫu nhiên, lạm dụng khẩu ngữ, cố ý phá ngữ pháp hoặc làm lệch sự thật. Không đề nghị đổi dữ kiện đã thiết lập chỉ để làm câu chữ đa dạng, và không tối ưu cho việc qua mặt máy dò nếu phải hy sinh giọng văn, độ rõ hoặc tính liên tục.",
      "Vấn đề văn phong và độ tự nhiên thường là cảnh báo có phạm vi sửa cục bộ, nhưng bắt buộc phải ảnh hưởng đến overall_score. Lỗi cấu trúc phải có repair_scope là structural. Báo cáo đầy đủ mọi vấn đề chưa xử lý; không gọi chương là đã sửa, có thể xuất bản hoặc tự nhiên như người viết khi vẫn còn lỗi đáng kể.",
      "Chỉ dành mức 95–100 cho chương vững cấu trúc, hợp logic, diễn tiến có nguyên nhân, nhất quán giọng, tự nhiên khi đọc thành tiếng và có thể xuất bản mà không cần sửa đáng kể. Nếu còn nhiều mẫu câu máy móc, lời thoại phẳng, cảm xúc chung chung hoặc dấu vết giải thích lộ liễu thì điểm phải dưới 85 để kích hoạt vòng sửa tự động.",
    ].join("\n"),
  },
  "play.start": {
    title: "Khởi tạo tương tác",
    content: [
      "Bạn là người hướng dẫn khởi tạo thế giới của InkOS Play.",
      "Hãy giúp xác nhận tiền đề có thể chơi, quy ước thế giới, vai trò người chơi, quy tắc thời gian và quy ước hình ảnh trước khi bắt đầu.",
      "Không áp đặt cấp độ RPG hoặc chỉ số cố định trừ khi người dùng yêu cầu.",
    ].join("\n"),
  },
  "play.mutator": {
    title: "Bộ biến đổi thế giới",
    content: [
      "Bạn là bộ máy biến đổi thế giới của InkOS Play.",
      "Chuyển hành động của người chơi thành các thay đổi về trạng thái: cảnh, thực thể, quan hệ, bằng chứng, hành trang, thời gian và hệ quả.",
      "Tuân thủ quy ước thế giới và giữ actor_player làm mã thực thể của người chơi.",
    ].join("\n"),
  },
  "play.renderer": {
    title: "Bộ dựng cảnh tương tác",
    content: [
      "Bạn là bộ dựng cảnh của InkOS Play.",
      "Diễn đạt biến đổi thế giới đã áp dụng thành văn xuôi tương tác sống động.",
      "Không tự tạo vật thể, bằng chứng hoặc nhân vật cụ thể vắng mặt trong trạng thái đã áp dụng, trừ khi bộ đối soát có thể ghi nhận chúng.",
    ].join("\n"),
  },
  "play.reconciler": {
    title: "Bộ đối soát cảnh",
    content: [
      "Bạn đối soát phần văn xuôi của cảnh đã dựng trở lại trạng thái đồ thị.",
      "Trích xuất các thực thể, bằng chứng, quan hệ và địa điểm cụ thể mới được nhắc đến để trạng thái không lệch khỏi lời kể.",
    ].join("\n"),
  },
  "play.image": {
    title: "Prompt hình ảnh tương tác",
    content: [
      "Tạo prompt hình ảnh từ cảnh tương tác và quy ước hình ảnh hiện tại.",
      "Tuân thủ ngữ nghĩa hình ảnh do người dùng xác định. Không thêm hình mờ, khung giao diện, chữ phủ hoặc viền độ hiếm mặc định trừ khi được yêu cầu.",
    ].join("\n"),
  },
  "interactive-film.script": {
    title: "Kịch bản phim tương tác",
    content: [
      "Bạn là người viết kịch bản phim tương tác.",
      "Chuyển tiền đề hoặc nguồn đã xác nhận thành các cảnh có thể chơi, lời thoại, lựa chọn, biến và kết thúc.",
      "Để lại không gian sáng tạo cho người dùng; hãy hỏi hoặc giữ nguyên các ràng buộc định dạng thay vì tự đặt ra quy tắc sản xuất.",
    ].join("\n"),
  },
  "interactive-film.storyboard": {
    title: "Storyboard phim tương tác",
    content: [
      "Bạn là người thiết kế storyboard phim tương tác.",
      "Chuyển các nhịp kịch bản thành kế hoạch hình ảnh theo từng cú máy với hành động, bố cục và prompt hình ảnh rõ ràng.",
      "Không bắt buộc đầu ra video; tạo ảnh tĩnh hoặc tài sản storyboard trừ khi người dùng yêu cầu khác.",
    ].join("\n"),
  },
  "interactive-film.story-graph": {
    title: "Đồ thị cốt truyện phim tương tác",
    content: [
      "Bạn là người thiết kế đồ thị cốt truyện phim tương tác.",
      "Tạo một đồ thị có thể chơi gồm các nút, lựa chọn, biến hoặc cờ và nhiều kết thúc.",
      "Mọi nhánh phải có thể truy cập và mọi tuyến đường đều cần dẫn đến một kết thúc.",
    ].join("\n"),
  },
  "interactive-film.image-plan": {
    title: "Kế hoạch hình ảnh phim tương tác",
    content: [
      "Tạo kế hoạch hình ảnh cho các nút và tài sản của phim tương tác.",
      "Dùng tính liên tục của sceneKey và địa điểm khi có, nhưng không yêu cầu giao diện trò chơi toàn màn hình hoặc chuyển đổi sang video.",
    ].join("\n"),
  },
};

export function localizeSkillForVietnamese(skill: StudioSkill): StudioSkill {
  if (skill.source !== "builtin") return skill;
  const copy = VI_SKILLS[skill.id];
  return copy ? { ...skill, ...copy } : skill;
}

const VI_AGENT_SOURCES: Readonly<Record<string, string>> = {
  builtin: "tích hợp",
  project: "dự án",
  user: "người dùng",
  external: "bên ngoài",
};

export function localizeAgentSourceForVietnamese(source: string): string {
  return VI_AGENT_SOURCES[source] ?? source;
}

function localizePromptForVietnamese(prompt: StudioPromptPackPrompt): StudioPromptPackPrompt {
  const copy = VI_PROMPTS[prompt.id];
  if (!copy) return prompt;
  return {
    ...prompt,
    title: copy.title,
    defaultContent: copy.content,
    // Preserve project overrides verbatim. Only the built-in display copy is localized.
    content: prompt.overridden ? prompt.content : copy.content,
  };
}

export function localizePromptPacksForVietnamese(input: PromptPacksResponse): PromptPacksResponse {
  return {
    packs: input.packs.map((pack) => {
      const copy = VI_PROMPT_PACKS[pack.id];
      return copy ? { ...pack, ...copy } : pack;
    }),
    prompts: input.prompts.map(localizePromptForVietnamese),
  };
}
