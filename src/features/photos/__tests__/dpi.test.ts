import { dpiLevel, effectiveDpi } from '../dpi';
import { PHOTO_FRAMES } from '@/features/pages/layout';

describe('effectiveDpi', () => {
  it('ảnh 12MP phủ khung trang tháng 122×156mm đủ nét', () => {
    const dpi = effectiveDpi({ width: 4000, height: 3000 }, PHOTO_FRAMES.month);
    // cover: dùng cả chiều cao 3000px cho 156mm → ~488dpi
    expect(dpi).toBeGreaterThan(450);
    expect(dpiLevel(dpi)).toBe('good');
  });

  it('crop 25% ảnh làm DPI giảm theo tỷ lệ', () => {
    const full = effectiveDpi({ width: 4000, height: 3000 }, PHOTO_FRAMES.cover, { width: 100, height: 100 });
    const quarter = effectiveDpi({ width: 4000, height: 3000 }, PHOTO_FRAMES.cover, { width: 25, height: 25 });
    expect(quarter).toBeCloseTo(full / 4, -1);
  });

  it('ảnh Zalo 1280px cho bìa 216mm bị vàng/đỏ', () => {
    const dpi = effectiveDpi({ width: 1280, height: 960 }, PHOTO_FRAMES.cover);
    expect(dpi).toBeLessThan(250);
    expect(dpiLevel(effectiveDpi({ width: 640, height: 480 }, PHOTO_FRAMES.cover))).toBe('bad');
  });
});
