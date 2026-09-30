/**
 * Theme mới "12 Tháng Chị Đẹp Tài Chính" — Finance × nữ tính × vui × hơi đanh đá.
 * Theme cũ (cloud-pastel) giữ nguyên, không import gì từ đây.
 *
 * Hệ màu: 4 màu chung cho cả bộ + mỗi tháng 1 accent riêng.
 */
import type { IconName } from './icons';
import type { MascotVariant } from './Mascot';

export const financeColors = {
  babyBlue: '#CFE5F8',
  babyBlueDeep: '#A9D0F2',
  coral: '#FF6B7A',
  coralSoft: '#FFE1E4',
  cream: '#FFF8EC',
  creamDeep: '#F6EBD7',
  navy: '#1F2A4D',
  navyMuted: '#5C6788',
  lunar: '#8C95AE',
  outside: '#C9CEDB',
  line: '#EADFCB',
} as const;

export const financeFonts = {
  title: "'Lexend', 'Be Vietnam Pro', sans-serif",
  script: "'Charm', 'Mali', cursive", // Dancing Script vỡ dấu (ủ, ả, ị) nên dùng Charm
  body: "'Be Vietnam Pro', system-ui, sans-serif",
} as const;

export interface StickerSpec {
  icon: IconName;
  /** mm theo khung trang 216×156 */
  x: number;
  y: number;
  size: number;
  rotate?: number;
}

export interface FinanceMonth {
  emoji: string;
  concept: string; // tên concept, vd "Khai xuân phát tài"
  tagline: string; // câu nhỏ cạnh "THÁNG 1"
  quote: string; // câu cửa miệng dưới lịch
  accent: string;
  accentSoft: string;
  mascot: MascotVariant;
  stickers: StickerSpec[];
  /** Tiền bay quanh ảnh */
  flyingMoney?: boolean;
}

/**
 * Sticker bám mép ảnh (ảnh rộng 66mm), tránh vùng giữa để không che mặt.
 * Vị trí: góc trên-phải, mép phải giữa, mép trái, góc dưới-phải.
 */
const S = (icon: IconName, slot: 0 | 1 | 2 | 3, size = 15, rotate = 0): StickerSpec => {
  const slots = [
    { x: 47, y: 17 },
    { x: 55, y: 66 },
    { x: 2, y: 52 },
    { x: 50, y: 110 },
  ];
  return { icon, ...slots[slot], size, rotate };
};

export const FINANCE_MONTHS: Record<number, FinanceMonth> = {
  1: {
    emoji: '💸',
    concept: 'Khai xuân phát tài',
    tagline: 'Tiền vô như nước',
    quote: 'Đầu năm đừng hỏi ngân sách.',
    accent: '#2FB38A',
    accentSoft: '#D8F3EA',
    mascot: 'money',
    stickers: [S('lixi', 0, 16, 12), S('sparkle', 1, 11), S('bill', 2, 14, -18), S('bill', 3, 15, 10)],
    flyingMoney: true,
  },
  2: {
    emoji: '💗',
    concept: 'Love & Numbers',
    tagline: 'Tình cảm có thể sai, số liệu thì không',
    quote: 'Yêu thì yêu, số vẫn phải khớp.',
    accent: '#FF4F8B',
    accentSoft: '#FFE0EC',
    mascot: 'love',
    stickers: [S('heart', 0, 15, 10), S('calculator', 1, 14, -8), S('heart', 2, 10, -15), S('sparkle', 3, 12)],
  },
  3: {
    emoji: '💐',
    concept: 'Chị đẹp tháng 3',
    tagline: 'Tháng này ưu tiên nhan sắc',
    quote: 'Báo cáo để sau, son môi trước.',
    accent: '#E0569B',
    accentSoft: '#FBE0EE',
    mascot: 'flower',
    stickers: [S('flower', 0, 16, 8), S('lipstick', 1, 13, -14), S('flower', 2, 11, -10), S('handbag', 3, 15, 8)],
  },
  4: {
    emoji: '💻',
    concept: 'Closing Mode',
    tagline: 'Đừng hỏi. Đang chốt số.',
    quote: 'Đang chốt số. Có gì mai nói.',
    accent: '#1E9E5A',
    accentSoft: '#DBF1E3',
    mascot: 'crying',
    stickers: [S('excel', 0, 17, 10), S('coffee', 1, 13, -6), S('receipt', 2, 13, -14), S('papers', 3, 15, 6)],
  },
  5: {
    emoji: '👑',
    concept: 'Money Queen',
    tagline: 'Để chị tính',
    quote: 'Để chị tính. Tính xong rồi đó.',
    accent: '#E0A100',
    accentSoft: '#FBF0CF',
    mascot: 'crown',
    stickers: [S('crown', 0, 16, 12), S('bill', 1, 13, -10), S('calculator', 2, 13, -12), S('sparkle', 3, 12)],
    flyingMoney: true,
  },
  6: {
    emoji: '🏖️',
    concept: 'Out of Office',
    tagline: 'Đi chơi nhưng vẫn bị deadline tìm thấy',
    quote: 'Auto-reply: chị đang nghỉ, deadline thì không.',
    accent: '#1799D1',
    accentSoft: '#D6EEF9',
    mascot: 'beach',
    stickers: [S('sunglasses', 0, 16, 10), S('laptop', 1, 14, -8), S('sun', 2, 12), S('wave', 3, 15)],
  },
  7: {
    emoji: '👜',
    concept: 'Shopping Therapy',
    tagline: 'Chi đúng mục đích. Mục đích là vui.',
    quote: 'Không phải tiêu hoang, là đầu tư tinh thần.',
    accent: '#9B6BD6',
    accentSoft: '#EDE3FA',
    mascot: 'shopping',
    stickers: [S('handbag', 0, 16, 10), S('card', 1, 13, -12), S('receipt', 2, 12, -14), S('sparkle', 3, 12)],
  },
  8: {
    emoji: '🧮',
    concept: 'Calculator Girl',
    tagline: 'Không qua được mắt chị đâu',
    quote: 'Lệch 1 đồng chị cũng thấy.',
    accent: '#23958C',
    accentSoft: '#D7EFEC',
    mascot: 'papers',
    stickers: [S('calculator', 0, 16, 10), S('papers', 1, 13, -8), S('magnifier', 2, 12, -12), S('receipt', 3, 14, 8)],
  },
  9: {
    emoji: '🫶',
    concept: 'Team Month',
    tagline: 'Team nhỏ, chuyện không nhỏ',
    quote: 'Một team, nhiều drama, chung một deadline.',
    accent: '#FF8A4C',
    accentSoft: '#FFE7D9',
    mascot: 'team',
    stickers: [S('heart', 0, 13, 10), S('sparkle', 1, 11), S('coffee', 2, 12, -10), S('heart', 3, 12, -8)],
  },
  10: {
    emoji: '👻',
    concept: 'Deadline Horror',
    tagline: 'Thứ đáng sợ nhất không phải ma',
    quote: 'Ma không đáng sợ bằng file lệch số lúc 5 giờ chiều.',
    accent: '#FF7417',
    accentSoft: '#FFE6D2',
    mascot: 'ghost',
    stickers: [S('ghost', 0, 16, 8), S('excel', 1, 14, -10), S('receipt', 2, 12, -14), S('ghost', 3, 12, -6)],
  },
  11: {
    emoji: '☕',
    concept: 'Rich Girl Office',
    tagline: 'Bình tĩnh, để chị cân đối',
    quote: 'Cà phê trước, cân đối sau.',
    accent: '#A56A3F',
    accentSoft: '#F3E6DA',
    mascot: 'coffee',
    stickers: [S('coffee', 0, 16, 8), S('handbag', 1, 13, -10), S('sparkle', 2, 11), S('card', 3, 14, 10)],
  },
  12: {
    emoji: '🎄',
    concept: 'Final Closing',
    tagline: 'Chốt sổ. Chốt năm. Chốt nhan sắc.',
    quote: 'Năm nay chốt đẹp, năm sau chốt đẹp hơn.',
    accent: '#E0393E',
    accentSoft: '#FCE0E0',
    mascot: 'santa',
    stickers: [S('gift', 0, 16, 10), S('tree', 1, 14, -6), S('calculator', 2, 12, -12), S('sparkle', 3, 12)],
  },
};

/** Khi tháng có sinh nhật chị: đẹp nhất bộ, ít troll hơn. */
export const BIRTHDAY_OVERRIDE = {
  tagline: 'Tháng của nhân vật chính',
  quote: 'Tháng quan trọng nhất năm, vì nhân vật chính xuất hiện.',
  quoteBy: '— cả team',
  mascot: 'birthday' as MascotVariant,
  stickers: [S('partyHat', 0, 17, 14), S('cake', 1, 14, -6), S('sparkle', 2, 12), S('gift', 3, 15, 8)] as StickerSpec[],
};

export const QUOTE_BY = '— chị đẹp phòng Tài chính';

export const BIRTHDAY_LABEL_RE = /sinh\s*nh[aậ]t/i;
