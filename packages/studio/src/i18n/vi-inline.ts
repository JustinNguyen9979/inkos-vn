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
};

export function translateInlineToVietnamese(english: string): string | undefined {
  return VI_INLINE[english];
}
