/** Mọi kích thước in tính bằng mm. File = khổ thành phẩm 210×150 + bleed 3mm mỗi cạnh. */
export const TRIM_W = 210;
export const TRIM_H = 150;
export const BLEED = 3;
export const PAGE_W = TRIM_W + BLEED * 2; // 216
export const PAGE_H = TRIM_H + BLEED * 2; // 156

/** Safe zone: cách mép cắt 5mm → 8mm tính từ mép file. */
export const SAFE = 5;
export const SAFE_INSET = BLEED + SAFE; // 8
/** Chừa cạnh trên cho lỗ lò xo (hỏi nhà in số đo chính xác). */
export const BINDING_TOP = 12;
export const TOP_INSET = BLEED + BINDING_TOP; // 15

export interface Frame {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Khung ảnh theo loại trang — dùng cho cropper (khoá tỷ lệ) và tính DPI. */
export const PHOTO_FRAMES: Record<'cover' | 'month' | 'back', Frame> = {
  cover: { x: 0, y: 0, w: PAGE_W, h: PAGE_H },
  month: { x: 0, y: 0, w: 66, h: PAGE_H }, // ảnh ~3 phần, lịch ~7 phần
  back: { x: 20, y: TOP_INSET + 6, w: 104, h: 118 },
};

/** Panel lưới ngày của trang tháng. */
export const MONTH_PANEL = {
  x: 74,
  right: PAGE_W - SAFE_INSET, // 208
  titleY: TOP_INSET,
  gridY: TOP_INSET + 19,
  headerH: 5,
  rowH: 12,
};

export const mm = (v: number) => `${v}mm`;
