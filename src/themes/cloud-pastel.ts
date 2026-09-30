/**
 * Theme "Mây pastel" — mọi component in chỉ đọc token ở đây, không hardcode màu.
 * Màu chọn đủ đậm để khỏi bị xỉn khi in CMYK (tránh pastel quá nhạt và xanh neon).
 */
export interface CloudCell {
  /** Vị trí tính bằng mm theo khung trang 216×156 (tính cả bleed). */
  x: number;
  y: number;
  w: number;
  variant: 0 | 1 | 2 | 3;
  opacity: number;
}

export interface MonthAccent {
  accent: string;
  accentSoft: string;
}

export const cloudPastel = {
  id: 'cloud-pastel' as const,
  name: 'Mây pastel',
  colors: {
    background: '#F4F8FD',
    backgroundTop: '#E3EEFB',
    paper: '#FFFFFF',
    text: '#34405A',
    textMuted: '#7C88A3',
    lunar: '#98A3BB',
    sunday: '#E0607E',
    holidayPublic: '#E0607E',
    holidayLunar: '#C98A2E',
    holidaySpecial: '#B86BC4',
    cellBorder: '#DCE5F2',
    outsideMonth: '#C7CFDE',
    cloud: '#FFFFFF',
    cloudShade: '#D7E4F6',
  },
  fonts: {
    title: 'var(--font-title)',
    hand: 'var(--font-hand)',
    body: 'var(--font-body)',
  },
  /** Mỗi tháng một màu nhấn, nền giữ chung. */
  monthAccents: {
    1: { accent: '#E0607E', accentSoft: '#FBE3EA' }, // hồng Tết
    2: { accent: '#E0607E', accentSoft: '#FBE3EA' },
    3: { accent: '#C9699F', accentSoft: '#F7E2EE' },
    4: { accent: '#6FA86B', accentSoft: '#E4F1E2' },
    5: { accent: '#E08A4E', accentSoft: '#FBE9DC' },
    6: { accent: '#3E8FC7', accentSoft: '#DDEEF9' }, // xanh biển
    7: { accent: '#3E9FA8', accentSoft: '#DDF1F2' },
    8: { accent: '#7A74C9', accentSoft: '#E8E6F8' },
    9: { accent: '#D19A1E', accentSoft: '#FBF0D5' }, // vàng Trung thu
    10: { accent: '#C9699F', accentSoft: '#F7E2EE' },
    11: { accent: '#B0784A', accentSoft: '#F4E7DC' },
    12: { accent: '#3F8F6B', accentSoft: '#DDF0E6' },
  } as Record<number, MonthAccent>,
  /** Vị trí mây trang trí theo tháng (mm), xoay vòng 4 bố cục cho đỡ đơn điệu. */
  cloudLayouts: [
    [
      { x: 150, y: 128, w: 30, variant: 0, opacity: 0.9 },
      { x: 190, y: 6, w: 22, variant: 2, opacity: 0.8 },
    ],
    [
      { x: 184, y: 130, w: 28, variant: 1, opacity: 0.9 },
      { x: 128, y: 4, w: 20, variant: 3, opacity: 0.8 },
    ],
    [
      { x: 124, y: 132, w: 24, variant: 3, opacity: 0.85 },
      { x: 186, y: 8, w: 26, variant: 0, opacity: 0.8 },
    ],
    [
      { x: 196, y: 124, w: 20, variant: 2, opacity: 0.9 },
      { x: 150, y: 5, w: 24, variant: 1, opacity: 0.75 },
    ],
  ] as CloudCell[][],
};

export type Theme = typeof cloudPastel;

/** 4 hình mây SVG (viewBox 0 0 100 60). */
export const CLOUD_PATHS = [
  'M20 50a14 14 0 0 1 2-28 20 20 0 0 1 38-6 16 16 0 0 1 26 12 12 12 0 0 1-2 22z',
  'M16 50a12 12 0 0 1 4-23 18 18 0 0 1 32-10 22 22 0 0 1 36 14 10 10 0 0 1-2 19z',
  'M24 52a16 16 0 0 1-2-30 16 16 0 0 1 28-10 18 18 0 0 1 32 4 14 14 0 0 1 4 36z',
  'M12 50a10 10 0 0 1 6-19 14 14 0 0 1 24-12 20 20 0 0 1 36 6 13 13 0 0 1 8 25z',
];

export const HEART_PATH =
  'M50 88 C20 66 6 48 6 30 A20 20 0 0 1 50 22 A20 20 0 0 1 94 30 C94 48 80 66 50 88z';
