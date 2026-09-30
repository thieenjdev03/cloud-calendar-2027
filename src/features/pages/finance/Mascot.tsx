/**
 * Mascot xuyên suốt 12 tháng: máy tính Casio mini mặt 😐.
 * Mỗi tháng một biến thể (ôm tiền, cầm tim, khóc vì closing, phơi nắng, hoá ma, đội nón Noel…).
 */
import { IconGroup } from './icons';

export type MascotVariant =
  | 'neutral' | 'money' | 'love' | 'flower' | 'crying' | 'crown' | 'beach' | 'shopping'
  | 'papers' | 'team' | 'ghost' | 'coffee' | 'santa' | 'birthday' | 'hello';

const N = '#1F2A4D';
const line = { stroke: N, strokeWidth: 3.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

type Face = 'flat' | 'smile' | 'cry' | 'cool' | 'love' | 'shock';

const FACE: Record<MascotVariant, Face> = {
  neutral: 'flat', money: 'smile', love: 'love', flower: 'smile', crying: 'cry', crown: 'smile', beach: 'cool',
  shopping: 'smile', papers: 'flat', team: 'smile', ghost: 'shock', coffee: 'flat', santa: 'smile', birthday: 'smile', hello: 'smile',
};

function FaceShape({ face }: { face: Face }) {
  // màn hình: x 32..88, y 30..62
  const eyes =
    face === 'love' ? (
      <>
        <path d="M44 40 c-3-4-8 0-4 4 l4 4 4-4 c4-4-1-8-4-4z" fill="#FF4F8B" stroke="none" />
        <path d="M76 40 c-3-4-8 0-4 4 l4 4 4-4 c4-4-1-8-4-4z" fill="#FF4F8B" stroke="none" />
      </>
    ) : face === 'cool' ? (
      <path d="M36 42 H84 M38 42 h16 c0 8-3 10-8 10 s-8-2-8-10z M66 42 h16 c0 8-3 10-8 10 s-8-2-8-10z" fill={N} {...line} strokeWidth={2.5} />
    ) : (
      <>
        <circle cx="48" cy="44" r={face === 'shock' ? 4 : 3.2} fill={N} />
        <circle cx="72" cy="44" r={face === 'shock' ? 4 : 3.2} fill={N} />
      </>
    );
  const mouth =
    face === 'smile' || face === 'love' || face === 'cool' ? (
      <path d="M52 53 Q60 59 68 53" fill="none" {...line} strokeWidth={3} />
    ) : face === 'cry' ? (
      <path d="M52 57 Q56 53 60 57 Q64 53 68 57" fill="none" {...line} strokeWidth={3} />
    ) : face === 'shock' ? (
      <ellipse cx="60" cy="56" rx="4" ry="4.5" fill={N} />
    ) : (
      <path d="M53 55 H67" fill="none" {...line} strokeWidth={3} />
    );
  return (
    <g>
      {eyes}
      {mouth}
      {face === 'cry' && (
        <>
          <path d="M44 49 q-3 7 0 10 q3-3 0-10z" fill="#5BB8F5" stroke="none" />
          <path d="M76 49 q-3 7 0 10 q3-3 0-10z" fill="#5BB8F5" stroke="none" />
        </>
      )}
      {(face === 'smile' || face === 'love') && (
        <>
          <ellipse cx="42" cy="53" rx="4" ry="2.5" fill="#FF9EB0" stroke="none" />
          <ellipse cx="78" cy="53" rx="4" ry="2.5" fill="#FF9EB0" stroke="none" />
        </>
      )}
    </g>
  );
}

function Body({ ghost }: { ghost?: boolean }) {
  return (
    <g>
      {/* tay chân */}
      <path d="M22 80 Q10 84 8 96" fill="none" {...line} />
      <path d="M98 80 Q110 84 112 96" fill="none" {...line} />
      <path d="M44 130 V140 M76 130 V140" fill="none" {...line} />
      <rect x="22" y="20" width="76" height="112" rx="14" fill="#E7ECF5" {...line} />
      <rect x="32" y="30" width="56" height="32" rx="5" fill="#C6EBD6" {...line} strokeWidth={2.5} />
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <rect
            key={`${r}${c}`}
            x={33 + c * 14}
            y={72 + r * 18}
            width="10"
            height="11"
            rx="2.5"
            fill={c === 3 && r === 2 ? '#FF6B7A' : c === 3 ? '#FFD9A8' : '#fff'}
            {...line}
            strokeWidth={2}
          />
        )),
      )}
      {ghost && (
        <path
          d="M14 136 V52 C14 20 36 6 60 6 C84 6 106 20 106 52 V136 L94 126 L82 136 L70 126 L60 136 L50 126 L38 136 L26 126Z"
          fill="#fff"
          opacity={0.9}
          {...line}
        />
      )}
    </g>
  );
}

function Accessory({ variant }: { variant: MascotVariant }) {
  switch (variant) {
    case 'money':
      return (
        <>
          <IconGroup name="bill" x={-4} y={86} size={40} rotate={-15} />
          <IconGroup name="bill" x={84} y={80} size={36} rotate={18} />
          <IconGroup name="sparkle" x={96} y={2} size={22} />
        </>
      );
    case 'love':
      return <IconGroup name="heart" x={82} y={78} size={38} rotate={12} />;
    case 'flower':
      return <IconGroup name="flower" x={78} y={2} size={34} rotate={10} />;
    case 'crying':
      return <IconGroup name="excel" x={80} y={82} size={40} rotate={10} />;
    case 'crown':
      return <IconGroup name="crown" x={34} y={-14} size={52} />;
    case 'beach':
      return <IconGroup name="sun" x={90} y={-6} size={34} />;
    case 'shopping':
      return <IconGroup name="handbag" x={86} y={82} size={36} rotate={8} />;
    case 'papers':
      return <IconGroup name="papers" x={-6} y={84} size={38} rotate={-12} />;
    case 'team':
      return (
        <>
          <IconGroup name="heart" x={-2} y={-2} size={26} rotate={-12} />
          <IconGroup name="heart" x={96} y={6} size={22} rotate={14} />
        </>
      );
    case 'coffee':
      return <IconGroup name="coffee" x={86} y={80} size={34} rotate={6} />;
    case 'santa':
      return (
        <g {...line}>
          <path d="M26 24 Q56 -18 98 20 Z" fill="#E0393E" />
          <rect x="20" y="16" width="82" height="12" rx="6" fill="#fff" />
          <circle cx="100" cy="14" r="8" fill="#fff" />
        </g>
      );
    case 'birthday':
      return (
        <>
          <IconGroup name="partyHat" x={38} y={-30} size={44} rotate={8} />
          <IconGroup name="confetti" x={-8} y={-6} size={40} />
          <IconGroup name="confetti" x={86} y={20} size={36} />
        </>
      );
    case 'hello':
      return <IconGroup name="sparkle" x={94} y={0} size={22} />;
    default:
      return null;
  }
}

export function Mascot({ variant, size }: { variant: MascotVariant; size: number }) {
  return (
    <svg
      viewBox="-12 -32 144 176"
      aria-hidden
      style={{ width: `${size}mm`, height: `${(size * 176) / 144}mm`, display: 'block', overflow: 'visible' }}
    >
      <Body ghost={variant === 'ghost'} />
      <g transform={variant === 'ghost' ? 'translate(0 2)' : undefined}>
        <FaceShape face={FACE[variant]} />
      </g>
      <Accessory variant={variant} />
    </svg>
  );
}
