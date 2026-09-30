/** Bộ sticker SVG (viewBox 0 0 100 100) cho theme Chị Đẹp Tài Chính — vector để in nét. */
import type { ReactNode } from 'react';

const N = '#1F2A4D'; // navy outline
const sw = { stroke: N, strokeWidth: 3.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

export type IconName =
  | 'bill' | 'lixi' | 'sparkle' | 'heart' | 'calculator' | 'flower' | 'lipstick' | 'handbag'
  | 'excel' | 'coffee' | 'crown' | 'sunglasses' | 'laptop' | 'sun' | 'wave' | 'card' | 'receipt'
  | 'papers' | 'magnifier' | 'ghost' | 'gift' | 'tree' | 'partyHat' | 'cake' | 'confetti';

const ICONS: Record<IconName, ReactNode> = {
  bill: (
    <g {...sw}>
      <rect x="8" y="26" width="84" height="48" rx="6" fill="#8FD9B6" />
      <rect x="16" y="34" width="68" height="32" rx="4" fill="none" strokeWidth={2} />
      <circle cx="50" cy="50" r="11" fill="#E9FBF2" />
      <text x="50" y="56" textAnchor="middle" fontSize="16" fontWeight="800" fill={N} stroke="none" fontFamily="Lexend, sans-serif">đ</text>
    </g>
  ),
  lixi: (
    <g {...sw}>
      <rect x="22" y="10" width="56" height="80" rx="7" fill="#F2424B" />
      <path d="M22 30 L50 48 L78 30" fill="none" />
      <circle cx="50" cy="62" r="12" fill="#FFD166" />
      <text x="50" y="67" textAnchor="middle" fontSize="13" fontWeight="800" fill="#B3261E" stroke="none" fontFamily="Lexend, sans-serif">福</text>
    </g>
  ),
  sparkle: (
    <g {...sw}>
      <path d="M50 6 C54 36 64 46 94 50 C64 54 54 64 50 94 C46 64 36 54 6 50 C36 46 46 36 50 6Z" fill="#FFD166" />
    </g>
  ),
  heart: (
    <g {...sw}>
      <path d="M50 86 C18 64 8 46 10 32 A20 20 0 0 1 50 26 A20 20 0 0 1 90 32 C92 46 82 64 50 86Z" fill="#FF6B8B" />
      <path d="M26 34 a8 8 0 0 1 10 -6" fill="none" stroke="#fff" strokeWidth={3} />
    </g>
  ),
  calculator: (
    <g {...sw}>
      <rect x="20" y="6" width="60" height="88" rx="9" fill="#E7ECF5" />
      <rect x="28" y="14" width="44" height="18" rx="3" fill="#BFE3D0" />
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={29 + c * 15} y={40 + r * 16} width="11" height="10" rx="2" fill={r === 2 && c === 2 ? '#FF6B7A' : '#fff'} strokeWidth={2.5} />),
      )}
    </g>
  ),
  flower: (
    <g {...sw}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="50" cy="28" rx="14" ry="20" fill="#FF9EC0" transform={`rotate(${a} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="12" fill="#FFD166" />
    </g>
  ),
  lipstick: (
    <g {...sw}>
      <rect x="34" y="52" width="32" height="40" rx="4" fill="#1F2A4D" />
      <rect x="38" y="36" width="24" height="18" fill="#E8C27A" />
      <path d="M40 36 L40 16 L60 8 L60 36Z" fill="#E0395F" />
    </g>
  ),
  handbag: (
    <g {...sw}>
      <path d="M34 36 C34 14 66 14 66 36" fill="none" strokeWidth={5} />
      <path d="M16 36 H84 L78 90 H22Z" fill="#C79BEF" />
      <rect x="44" y="48" width="12" height="9" rx="2" fill="#FFD166" />
    </g>
  ),
  excel: (
    <g {...sw}>
      <rect x="8" y="12" width="84" height="76" rx="6" fill="#fff" />
      <rect x="8" y="12" width="84" height="16" rx="6" fill="#21A366" />
      <path d="M8 46 H92 M8 64 H92 M36 28 V88 M64 28 V88" fill="none" strokeWidth={2} />
      <text x="50" y="60" textAnchor="middle" fontSize="15" fontWeight="800" fill="#D93025" stroke="none" fontFamily="Lexend, sans-serif">#VALUE!</text>
    </g>
  ),
  coffee: (
    <g {...sw}>
      <path d="M24 30 H72 L66 90 H30Z" fill="#fff" />
      <rect x="20" y="20" width="56" height="12" rx="4" fill="#A56A3F" />
      <rect x="30" y="50" width="36" height="18" fill="#D9B38C" strokeWidth={2.5} />
      <path d="M48 20 V10" fill="none" />
    </g>
  ),
  crown: (
    <g {...sw}>
      <path d="M12 76 L16 30 L34 50 L50 20 L66 50 L84 30 L88 76Z" fill="#FFD166" />
      <circle cx="50" cy="62" r="6" fill="#FF6B8B" />
      <circle cx="30" cy="64" r="4" fill="#7FD1FF" />
      <circle cx="70" cy="64" r="4" fill="#7FD1FF" />
    </g>
  ),
  sunglasses: (
    <g {...sw}>
      <path d="M6 40 H94" fill="none" />
      <path d="M10 40 H44 C44 62 40 70 26 70 C14 70 10 60 10 40Z" fill="#1F2A4D" />
      <path d="M56 40 H90 C90 60 86 70 74 70 C60 70 56 62 56 40Z" fill="#1F2A4D" />
      <path d="M18 48 L28 46" stroke="#fff" strokeWidth={3} />
    </g>
  ),
  laptop: (
    <g {...sw}>
      <rect x="18" y="20" width="64" height="44" rx="4" fill="#E7ECF5" />
      <rect x="25" y="27" width="50" height="30" fill="#BDE3F7" strokeWidth={2} />
      <path d="M8 72 H92 L86 82 H14Z" fill="#C9D2E3" />
    </g>
  ),
  sun: (
    <g {...sw}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <path key={a} d="M50 6 V18" transform={`rotate(${a} 50 50)`} fill="none" />
      ))}
      <circle cx="50" cy="50" r="22" fill="#FFD166" />
    </g>
  ),
  wave: (
    <g {...sw}>
      <path d="M6 60 C20 40 36 40 50 56 C64 72 80 70 94 50 V90 H6Z" fill="#7FD1FF" />
      <path d="M6 76 C22 64 36 66 50 76 C64 86 80 84 94 72" fill="none" stroke="#fff" />
    </g>
  ),
  card: (
    <g {...sw}>
      <rect x="8" y="24" width="84" height="54" rx="8" fill="#9B6BD6" />
      <rect x="8" y="36" width="84" height="10" fill={N} stroke="none" />
      <rect x="18" y="56" width="18" height="12" rx="2" fill="#FFD166" strokeWidth={2} />
    </g>
  ),
  receipt: (
    <g {...sw}>
      <path d="M24 8 H76 V92 L68 86 L60 92 L52 86 L44 92 L36 86 L28 92 L24 88Z" fill="#fff" />
      <path d="M34 26 H66 M34 40 H60 M34 54 H66" fill="none" strokeWidth={3} />
      <text x="50" y="76" textAnchor="middle" fontSize="12" fontWeight="800" fill="#FF6B7A" stroke="none" fontFamily="Lexend, sans-serif">TOTAL</text>
    </g>
  ),
  papers: (
    <g {...sw}>
      <rect x="26" y="14" width="56" height="72" rx="4" fill="#F6EBD7" transform="rotate(8 54 50)" />
      <rect x="18" y="12" width="56" height="72" rx="4" fill="#fff" />
      <path d="M28 30 H64 M28 44 H64 M28 58 H52" fill="none" strokeWidth={3} />
    </g>
  ),
  magnifier: (
    <g {...sw}>
      <circle cx="42" cy="42" r="26" fill="#DDF3FF" />
      <path d="M62 62 L88 88" fill="none" strokeWidth={9} />
    </g>
  ),
  ghost: (
    <g {...sw}>
      <path d="M20 88 V44 C20 22 34 10 50 10 C66 10 80 22 80 44 V88 L70 80 L60 88 L50 80 L40 88 L30 80Z" fill="#fff" />
      <circle cx="40" cy="44" r="5" fill={N} />
      <circle cx="60" cy="44" r="5" fill={N} />
      <ellipse cx="50" cy="62" rx="6" ry="8" fill={N} />
    </g>
  ),
  gift: (
    <g {...sw}>
      <rect x="14" y="40" width="72" height="50" rx="4" fill="#FF6B7A" />
      <rect x="10" y="28" width="80" height="16" rx="3" fill="#FF8A95" />
      <path d="M50 28 V90" fill="none" stroke="#FFD166" strokeWidth={8} />
      <path d="M50 28 C40 10 26 16 32 26 C36 30 50 28 50 28 C50 28 64 30 68 26 C74 16 60 10 50 28Z" fill="#FFD166" />
    </g>
  ),
  tree: (
    <g {...sw}>
      <path d="M50 6 L80 50 H66 L88 80 H12 L34 50 H20Z" fill="#3BAA6B" />
      <rect x="42" y="80" width="16" height="14" fill="#A56A3F" />
      <circle cx="40" cy="60" r="4" fill="#FF6B7A" />
      <circle cx="62" cy="40" r="4" fill="#FFD166" />
      <circle cx="58" cy="68" r="4" fill="#7FD1FF" />
    </g>
  ),
  partyHat: (
    <g {...sw}>
      <path d="M50 6 L82 88 H18Z" fill="#FF6B8B" />
      <path d="M34 48 L60 40 M28 66 L70 56" fill="none" stroke="#FFD166" strokeWidth={6} />
      <circle cx="50" cy="8" r="7" fill="#FFD166" />
    </g>
  ),
  cake: (
    <g {...sw}>
      <rect x="16" y="46" width="68" height="40" rx="5" fill="#FFE1E4" />
      <path d="M16 58 C26 66 34 52 44 60 C54 68 62 52 72 60 C78 64 82 60 84 58" fill="none" stroke="#FF6B8B" strokeWidth={5} />
      <rect x="46" y="22" width="8" height="24" fill="#7FD1FF" />
      <path d="M50 8 C56 16 54 22 50 22 C46 22 44 16 50 8Z" fill="#FFD166" />
    </g>
  ),
  confetti: (
    <g strokeWidth={0}>
      <rect x="10" y="14" width="10" height="5" fill="#FF6B7A" transform="rotate(20 15 16)" />
      <rect x="70" y="10" width="10" height="5" fill="#FFD166" transform="rotate(-30 75 12)" />
      <rect x="40" y="36" width="10" height="5" fill="#7FD1FF" transform="rotate(50 45 38)" />
      <circle cx="84" cy="50" r="4" fill="#9B6BD6" />
      <circle cx="20" cy="66" r="4" fill="#2FB38A" />
      <rect x="56" y="74" width="10" height="5" fill="#FF6B8B" transform="rotate(-15 61 76)" />
    </g>
  ),
};

interface IconProps {
  name: IconName;
  size: number; // mm
  style?: React.CSSProperties;
  sticker?: boolean;
}

export function FinanceIcon({ name, size, style, sticker }: IconProps) {
  return (
    <svg viewBox="-6 -6 112 112" aria-hidden style={{ width: `${size}mm`, height: `${size}mm`, display: 'block', overflow: 'visible', ...style }}>
      {sticker && <circle cx="50" cy="50" r="52" fill="#fff" opacity={0.92} />}
      {ICONS[name]}
    </svg>
  );
}

/** Nhúng icon vào một SVG khác (dùng cho mascot): đặt ở (x,y) với cạnh `size` theo đơn vị viewBox cha. */
export function IconGroup({ name, x, y, size, rotate = 0 }: { name: IconName; x: number; y: number; size: number; rotate?: number }) {
  const k = size / 100;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate} ${size / 2} ${size / 2}) scale(${k})`}>{ICONS[name]}</g>
  );
}
