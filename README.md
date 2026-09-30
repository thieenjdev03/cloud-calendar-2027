# Cloud Calendar 2027 ☁

Web app frontend-only để thiết kế bộ lịch để bàn 2027 (14 trang: bìa, 12 tháng, trang cuối) theme mây pastel, rồi xuất PDF đúng khổ gửi nhà in. Quà của team gửi chị Vân.

## Chạy

```bash
npm install
npm run dev            # http://localhost:3000 — editor
npm test               # Jest + RTL (calendar engine, DPI, editor)
npm run print:year     # in 12 tháng 2027 + âm lịch + ngày lễ ra console
npm run build
```

- `/` — editor: trái danh sách 14 trang (trạng thái ảnh / caption / DPI), giữa canvas, phải panel chỉnh.
- `/print` — render 14 trang ảnh gốc để in. `/print?demo=1` = dữ liệu giả để soát layout.
- Nút **Xuất PDF** chạy preflight (thiếu ảnh, ảnh < 150dpi = chặn; thiếu caption/lời nhắn, ảnh < 250dpi = cảnh báo), rồi mở `/print?auto=1`, đợi font + ảnh load xong mới gọi `window.print()`.

**Lưu PDF trong Chrome:** Save as PDF · tắt Headers and footers · bật Background graphics · Margins None · Scale 100%. Chỉ xuất trên một máy/một bản Chrome.

## Khổ in

| | |
|---|---|
| File | 216 × 156 mm (thành phẩm 210 × 150 + bleed 3mm) |
| Safe zone | cách mép cắt 5mm (8mm từ mép file) |
| Lò xo | chừa 12mm cạnh trên — **hỏi nhà in số đo thật**, sửa `BINDING_TOP` trong `src/features/pages/layout.ts` |
| Lưới tháng | cố định 6 hàng tuần, tuần bắt đầu thứ Hai |

Chrome làm tròn khổ trang về số px nguyên nên PDF ra 215.9 × 156.0mm (lệch 0.1mm, nằm trong bleed).

## Cấu trúc

```
src/
  app/page.tsx, app/print/page.tsx
  features/
    calendar-engine/   lunar.ts (Hồ Ngọc Đức, UTC+7), holidays.ts, month-grid.ts + __tests__
    pages/             CoverPage, MonthPage, BackPage, MonthGrid, PhotoFrame, layout.ts (mm)
    editor/            Editor, Sidebar, Canvas, PropertiesPanel, OverviewGrid, MarkedDatesPanel, ExportDialog, preflight
    photos/            process-image, photo-store (IndexedDB), CropModal, dpi, use-photo-url
  themes/cloud-pastel.ts   design token + SVG mây, màu nhấn theo tháng
  store/project-store.ts   Zustand + persist vào IndexedDB
  lib/project-io.ts        project mặc định, import/export JSON + validate
```

- Metadata project (Zustand) tách khỏi blob ảnh (IndexedDB riêng, tham chiếu `photoId`).
- Crop chỉ lưu toạ độ (`crop.area` theo % ảnh gốc), không cắt ảnh thật; bản in dùng ảnh `original`, editor dùng `preview` ~800px.
- DPI hiệu dụng = px vùng crop / (kích thước khung in mm / 25.4), lấy chiều kém hơn. ≥250 xanh, 150–249 vàng, <150 đỏ.
- Font tự host qua `@fontsource` (Baloo 2, Mali, Be Vietnam Pro — đều có subset tiếng Việt), không cần mạng khi build.
- Ảnh HEIC bị từ chối kèm hướng dẫn chuyển sang JPG.

## Chưa làm (ngoài MVP)

Nhiều theme/khổ, đăng nhập, backend, cộng tác realtime (Phase 5 tuỳ chọn trong plan).
