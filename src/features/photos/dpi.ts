import type { CalendarPage } from '@/types/calendar';
import { PHOTO_FRAMES, type Frame } from '@/features/pages/layout';

export const DPI_GOOD = 250;
export const DPI_MIN = 150;

export type DpiLevel = 'good' | 'warn' | 'bad';

/**
 * DPI hiệu dụng = số px của vùng crop / (kích thước khung in mm / 25.4).
 * Lấy cạnh kém hơn (min 2 chiều) để không bỏ sót trường hợp ảnh bị kéo giãn.
 */
export function effectiveDpi(
  photo: { width: number; height: number },
  frame: Pick<Frame, 'w' | 'h'>,
  area?: { width: number; height: number },
): number {
  let pxW: number;
  let pxH: number;
  if (area) {
    pxW = (photo.width * area.width) / 100;
    pxH = (photo.height * area.height) / 100;
  } else {
    // object-fit: cover — vùng hiển thị theo tỷ lệ khung
    const frameRatio = frame.w / frame.h;
    const photoRatio = photo.width / photo.height;
    if (photoRatio > frameRatio) {
      pxH = photo.height;
      pxW = photo.height * frameRatio;
    } else {
      pxW = photo.width;
      pxH = photo.width / frameRatio;
    }
  }
  return Math.round(Math.min(pxW / (frame.w / 25.4), pxH / (frame.h / 25.4)));
}

export function dpiLevel(dpi: number): DpiLevel {
  if (dpi >= DPI_GOOD) return 'good';
  if (dpi >= DPI_MIN) return 'warn';
  return 'bad';
}

export function pageDpi(page: CalendarPage): number | null {
  if (!page.photoId || !page.photoSize) return null;
  return effectiveDpi(page.photoSize, PHOTO_FRAMES[page.kind], page.crop?.area);
}
