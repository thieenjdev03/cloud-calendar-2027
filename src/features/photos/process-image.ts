import imageCompression from 'browser-image-compression';
import type { StoredPhoto } from '@/types/calendar';
import { newId } from '@/lib/id';

export const PREVIEW_MAX = 800;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

export class UnsupportedImageError extends Error {}

export function isHeic(file: File): boolean {
  return /image\/hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name);
}

async function readSize(blob: Blob): Promise<{ width: number; height: number }> {
  if (typeof createImageBitmap === 'function') {
    const bmp = await createImageBitmap(blob);
    const size = { width: bmp.width, height: bmp.height };
    bmp.close();
    return size;
  }
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return { width: img.naturalWidth, height: img.naturalHeight };
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Giữ nguyên bản gốc để in, tạo thêm preview ~800px cho editor. */
export async function processImage(file: File): Promise<StoredPhoto> {
  if (isHeic(file)) {
    throw new UnsupportedImageError(
      'Ảnh HEIC (iPhone) trình duyệt không đọc được. Nhờ bạn gửi lại dạng JPG (trên iPhone: Cài đặt → Camera → Định dạng → Tương thích nhất).',
    );
  }
  if (!ACCEPTED.includes(file.type)) {
    throw new UnsupportedImageError(`Định dạng ${file.type || 'không rõ'} chưa hỗ trợ — dùng JPG hoặc PNG.`);
  }
  const [size, preview] = await Promise.all([
    readSize(file),
    imageCompression(file, { maxWidthOrHeight: PREVIEW_MAX, useWebWorker: true, fileType: 'image/jpeg', initialQuality: 0.85 }),
  ]);
  return { id: newId('ph'), original: file, preview, width: size.width, height: size.height, name: file.name };
}
