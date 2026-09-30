export type PageKind = 'cover' | 'month' | 'back';

export type ThemeId = 'cloud-pastel' | 'chi-dep-tai-chinh';
export const THEME_IDS: ThemeId[] = ['cloud-pastel', 'chi-dep-tai-chinh'];

/** Vùng crop tính theo % ảnh gốc (0–100), lấy từ react-easy-crop `croppedArea`. */
export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PageCrop {
  x: number;
  y: number;
  zoom: number;
  /** Vùng ảnh thực sự hiển thị, dùng cho render in + tính DPI. */
  area?: CropArea;
}

export interface CalendarPage {
  id: string;
  kind: PageKind;
  month?: number; // 1–12, chỉ với kind = 'month'
  photoId?: string; // key trong photo-store
  /** Kích thước px ảnh gốc, lưu kèm để tính DPI mà không cần đọc blob. */
  photoSize?: { width: number; height: number };
  crop?: PageCrop;
  caption?: string;
  message?: { author: string; text: string };
  /** Theme Chị Đẹp Tài Chính: câu nhỏ cạnh tên tháng + quote dưới lịch (trống = dùng mặc định). */
  tagline?: string;
  quote?: string;
}

export interface MarkedDate {
  id: string;
  date: string; // 'YYYY-MM-DD'
  label: string;
  color: string;
  icon?: 'heart' | 'cloud' | 'star' | 'none';
  /** Ngày sinh nhật chị — tháng này được "phá format" ở theme mới. */
  isBirthday?: boolean;
}

export interface CalendarProject {
  version: 1;
  year: number; // 2027
  themeId: ThemeId;
  recipientName: string; // 'Vân'
  pages: CalendarPage[]; // luôn 14 phần tử
  markedDates: MarkedDate[];
}

export interface StoredPhoto {
  id: string;
  original: Blob; // dùng khi in
  preview: Blob; // ~800px, dùng trong editor
  width: number;
  height: number;
  name?: string;
}

export type HolidayType = 'public' | 'lunar' | 'special' | 'custom';

export interface CalendarEvent {
  date: string; // 'YYYY-MM-DD'
  label: string;
  type: HolidayType;
  color?: string;
  icon?: MarkedDate['icon'];
  isBirthday?: boolean;
}
