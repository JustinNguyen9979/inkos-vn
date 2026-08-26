/**
 * Vietnamese overlay for legacy `tr(zh, en)` call sites.
 *
 * New UI copy should use a stable catalog key. This map lets the fork localize
 * upstream inline copy without editing every upstream component, which keeps
 * future merges small and predictable.
 */
const VI_INLINE: Readonly<Record<string, string>> = {
  "Resize sidebar": "Điều chỉnh độ rộng thanh bên",
  "Drag to resize; double-click to reset": "Kéo để đổi độ rộng; nhấp đúp để đặt lại",
  "Loading...": "Đang tải...",
  "Saving...": "Đang lưu...",
  "Save": "Lưu",
  "Cancel": "Hủy",
  "Delete": "Xóa",
  "Edit": "Chỉnh sửa",
  "Close": "Đóng",
  "Confirm": "Xác nhận",
  "Retry": "Thử lại",
  "Refresh": "Làm mới",
  "Error": "Lỗi",
  "Unknown": "Không xác định",
  "No data": "Không có dữ liệu",
  "Copy": "Sao chép",
  "Copied": "Đã sao chép",
  "Search": "Tìm kiếm",
  "Back": "Quay lại",
  "Next": "Tiếp theo",
  "Create": "Tạo",
  "Update": "Cập nhật",
  "Running": "Đang chạy",
  "Completed": "Đã hoàn tất",
  "Failed": "Thất bại",
  "Pending": "Đang chờ",
  "Agent Skills": "Kỹ năng Agent",
  "Import standard SKILL.md expertise packages. Chat can choose a skill from intent, or you can force one from the + menu.": "Nhập các gói chuyên môn SKILL.md tiêu chuẩn. Chat có thể tự chọn kỹ năng theo ý định, hoặc bạn có thể buộc dùng một kỹ năng từ menu +.",
  "Some external skills were not loaded": "Một số kỹ năng bên ngoài chưa được tải",
  "Invalid format": "Định dạng không hợp lệ",
  "Import external skill": "Nhập kỹ năng bên ngoài",
  "AgentSkills / OpenClaw compatible: select a complete folder containing SKILL.md. Static references are imported; scripts are never auto-executed.": "Tương thích AgentSkills / OpenClaw: chọn toàn bộ thư mục chứa SKILL.md. Tài liệu tham khảo tĩnh sẽ được nhập; script không bao giờ tự động chạy.",
  "Importing...": "Đang nhập...",
  "Choose skill folder": "Chọn thư mục kỹ năng",
  "No skills yet.": "Chưa có kỹ năng nào.",
  "No description": "Không có mô tả",
  "Skill deleted": "Đã xóa kỹ năng",
  "Prompt packs": "Các bộ prompt",
  "Review and tune built-in prompt packs. Edits are saved as project overrides without changing the defaults.": "Xem và điều chỉnh các bộ prompt tích hợp. Nội dung chỉnh sửa được lưu thành bản ghi đè của dự án mà không thay đổi mặc định.",
  "No prompt packs available.": "Không có bộ prompt nào để chỉnh sửa.",
  "custom": "đã sửa",
  "Source": "Nguồn",
  "Prompt reset to default": "Đã khôi phục prompt mặc định",
  "Reset": "Khôi phục",
  "Prompt saved": "Đã lưu prompt",
  "View built-in default": "Xem bản dịch của mặc định tích hợp",
  "Select a prompt on the left to edit it.": "Chọn một prompt ở bên trái để chỉnh sửa.",
  "Select Agent Skills": "Chọn kỹ năng Agent",
  "The agent can choose a skill from your intent; selecting one forces it for the next message.": "Agent có thể tự chọn kỹ năng theo ý định; kỹ năng bạn đánh dấu sẽ được buộc dùng cho tin nhắn tiếp theo.",
  "Import": "Nhập",
  "Loading skills...": "Đang tải kỹ năng...",
  "No skills available yet.": "Chưa có kỹ năng khả dụng.",
};

export function translateInlineToVietnamese(english: string): string | undefined {
  return VI_INLINE[english];
}
