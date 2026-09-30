/**
 * Theme "12 Tháng Chị Đẹp Tài Chính" — bộ component trang riêng.
 * Dùng chung khung ảnh (PHOTO_FRAMES) với theme cũ để crop/DPI không đổi khi switch theme.
 */
import { useMemo, type CSSProperties, type ReactNode } from 'react';
import { buildMonthGrid, canChiYear, WEEKDAY_LABELS_MON_FIRST, type DayCell } from '@/features/calendar-engine';
import type { CalendarEvent, CalendarPage } from '@/types/calendar';
import { cloudPastel } from '@/themes/cloud-pastel';
import { PhotoFrame } from '../PhotoFrame';
import { BINDING_TOP, BLEED, PAGE_H, PAGE_W, PHOTO_FRAMES, SAFE_INSET, TOP_INSET, mm } from '../layout';
import { FinanceIcon, type IconName } from './icons';
import { Mascot } from './Mascot';
import {
  BIRTHDAY_LABEL_RE,
  BIRTHDAY_OVERRIDE,
  FINANCE_MONTHS,
  QUOTE_BY,
  financeColors as C,
  financeFonts as F,
  type StickerSpec,
} from './theme';

const photoBg: CSSProperties = { background: `linear-gradient(160deg, ${C.cream}, ${C.babyBlueDeep})` };

export function isBirthdayEvent(e: CalendarEvent): boolean {
  return e.type === 'custom' && (!!e.isBirthday || BIRTHDAY_LABEL_RE.test(e.label));
}

/* ---------------- khung trang ---------------- */

function FinanceShell({ children, label, showGuides }: { children: ReactNode; label: string; showGuides?: boolean }) {
  return (
    <div
      className="print-page"
      data-page-label={label}
      data-theme="chi-dep-tai-chinh"
      style={{
        position: 'relative',
        width: mm(PAGE_W),
        height: mm(PAGE_H),
        overflow: 'hidden',
        background: `radial-gradient(${C.babyBlueDeep} 0.35mm, transparent 0.4mm) 0 0 / 5mm 5mm, ${C.babyBlue}`,
        color: C.navy,
        fontFamily: F.body,
      }}
    >
      {children}
      {showGuides && (
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', inset: mm(BLEED), outline: `${mm(BLEED)} solid rgba(255,60,60,0.18)`, border: '0.3mm dashed rgba(220,40,40,0.9)' }} />
          <div style={{ position: 'absolute', left: mm(SAFE_INSET), right: mm(SAFE_INSET), top: mm(TOP_INSET), bottom: mm(SAFE_INSET), border: '0.3mm dashed rgba(40,120,220,0.9)' }} />
          <div
            style={{
              position: 'absolute', left: mm(BLEED), right: mm(BLEED), top: mm(BLEED), height: mm(BINDING_TOP),
              background: 'repeating-linear-gradient(90deg, rgba(120,120,140,0.25) 0 3mm, transparent 3mm 7mm)',
            }}
          />
        </div>
      )}
    </div>
  );
}

function Sticker({ s }: { s: StickerSpec }) {
  return (
    <div style={{ position: 'absolute', left: mm(s.x), top: mm(s.y), transform: `rotate(${s.rotate ?? 0}deg)` }}>
      <FinanceIcon name={s.icon} size={s.size} sticker />
    </div>
  );
}

function Pill({ children, bg, color }: { children: ReactNode; bg: string; color: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        background: bg,
        color,
        borderRadius: mm(3),
        padding: `${mm(0.6)} ${mm(2.2)}`,
        fontFamily: F.title,
        fontWeight: 700,
        fontSize: '6.5pt',
        letterSpacing: '0.6pt',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </span>
  );
}

/* ---------------- lưới tháng ---------------- */

interface GridProps {
  grid: DayCell[][];
  accent: string;
  accentSoft: string;
  x: number;
  y: number;
  width: number;
  headerH: number;
  rowH: number;
}

function FinanceMonthGrid({ grid, accent, accentSoft, x, y, width, headerH, rowH }: GridProps) {
  const colW = width / 7;
  return (
    <div style={{ position: 'absolute', left: mm(x), top: mm(y), width: mm(width) }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(7, ${mm(colW)})`, height: mm(headerH) }}>
        {WEEKDAY_LABELS_MON_FIRST.map((l, i) => (
          <div
            key={l}
            style={{
              textAlign: 'center',
              fontFamily: F.title,
              fontWeight: 700,
              fontSize: '7.5pt',
              letterSpacing: '0.5pt',
              lineHeight: mm(headerH),
              color: i === 6 ? C.coral : C.navyMuted,
            }}
          >
            {l}
          </div>
        ))}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(7, ${mm(colW)})`,
          gridTemplateRows: `repeat(${grid.length}, ${mm(rowH)})`,
          borderTop: `0.35mm solid ${C.navy}`,
        }}
      >
        {grid.flat().map((cell) => {
          const inMonth = cell.isCurrentMonth;
          const birthday = inMonth && cell.events.some(isBirthdayEvent);
          const custom = inMonth && !birthday && cell.events.some((e) => e.type === 'custom');
          const holiday = cell.events.find((e) => e.type === 'public');
          const main = cell.events.find((e) => e.type !== 'lunar') ?? cell.events[0];
          const red = inMonth && (cell.isSunday || !!holiday);
          return (
            <div
              key={cell.date}
              data-date={cell.date}
              data-birthday={birthday || undefined}
              style={{
                position: 'relative',
                borderBottom: `0.25mm dashed ${C.line}`,
                textAlign: 'center',
                paddingTop: mm(0.7),
              }}
            >
              {custom && (
                <div style={{ position: 'absolute', inset: `${mm(0.6)} ${mm(1)}`, background: accentSoft, borderRadius: mm(2) }} />
              )}
              {birthday && (
                <>
                  <div style={{ position: 'absolute', left: '50%', top: mm(0.3), width: mm(7.4), height: mm(7.4), marginLeft: mm(-3.7), borderRadius: '50%', background: C.coral, boxShadow: `0 0 0 0.6mm ${C.coralSoft}` }} />
                  <div style={{ position: 'absolute', left: mm(-2), top: mm(-2.5) }}>
                    <FinanceIcon name="confetti" size={8} />
                  </div>
                  <div style={{ position: 'absolute', right: mm(-1.5), top: mm(-2) }}>
                    <FinanceIcon name="sparkle" size={4} />
                  </div>
                </>
              )}
              <div
                style={{
                  position: 'relative',
                  fontFamily: F.title,
                  fontWeight: 700,
                  fontSize: '12pt',
                  lineHeight: 1.05,
                  color: !inMonth ? C.outside : birthday ? '#fff' : red ? C.coral : C.navy,
                }}
              >
                {cell.day}
              </div>
              <div
                style={{
                  position: 'relative',
                  fontFamily: F.body,
                  fontSize: '6.3pt',
                  lineHeight: 1.15,
                  color: !inMonth ? C.outside : cell.lunar.day === 1 || cell.lunar.day === 15 ? accent : C.lunar,
                  marginTop: birthday ? mm(0.6) : 0,
                }}
              >
                {cell.lunarLabel}
              </div>
              {inMonth && main && (
                <div
                  style={{
                    position: 'relative',
                    fontFamily: F.body,
                    fontWeight: 600,
                    fontSize: '5.2pt',
                    lineHeight: 1.05,
                    color: birthday ? C.coral : main.type === 'custom' ? (main.color ?? accent) : main.type === 'public' ? C.coral : accent,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    padding: `0 ${mm(0.5)}`,
                  }}
                >
                  {main.label}
                </div>
              )}
              {birthday && (
                <div style={{ position: 'absolute', left: mm(0.8), top: mm(0.8) }}>
                  <FinanceIcon name="cake" size={3.6} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- trang tháng ---------------- */

interface MonthProps {
  page: CalendarPage;
  year: number;
  eventIndex: Map<string, CalendarEvent[]>;
  photoSrc?: string;
  showGuides?: boolean;
}

const CARD = { x: 71, y: 14, right: PAGE_W - SAFE_INSET + 1, bottom: PAGE_H - SAFE_INSET + 1 };
const GRID = { x: 76, width: 128, y: 39, headerH: 5, rowH: 10.6 };

export function FinanceMonthPage({ page, year, eventIndex, photoSrc, showGuides }: MonthProps) {
  const month = page.month ?? 1;
  const spec = FINANCE_MONTHS[month];
  const grid = useMemo(() => buildMonthGrid(year, month, { eventIndex }), [year, month, eventIndex]);
  const isBirthdayMonth = grid.flat().some((c) => c.isCurrentMonth && c.events.some(isBirthdayEvent));

  const tagline = page.tagline?.trim() || (isBirthdayMonth ? BIRTHDAY_OVERRIDE.tagline : spec.tagline);
  const quote = page.quote?.trim() || (isBirthdayMonth ? BIRTHDAY_OVERRIDE.quote : spec.quote);
  const quoteBy = isBirthdayMonth && !page.quote?.trim() ? BIRTHDAY_OVERRIDE.quoteBy : QUOTE_BY;
  const stickers = isBirthdayMonth ? BIRTHDAY_OVERRIDE.stickers : spec.stickers;
  const mascot = isBirthdayMonth ? BIRTHDAY_OVERRIDE.mascot : spec.mascot;
  const concept = isBirthdayMonth ? 'Happy Birthday' : spec.concept;

  const frame = PHOTO_FRAMES.month;
  const gridBottom = GRID.y + GRID.headerH + GRID.rowH * grid.length;
  const bottomTop = gridBottom + 3.5;
  const bottomH = CARD.bottom - 4 - bottomTop;
  const hasMessage = !!page.message?.text?.trim();
  const quoteW = hasMessage ? 62 : GRID.width;

  return (
    <FinanceShell label={`Tháng ${month}`} showGuides={showGuides}>
      <PhotoFrame frame={frame} src={photoSrc} area={page.crop?.area} theme={cloudPastel} style={photoBg} />
      {/* viền kem tách ảnh và nền */}
      <div style={{ position: 'absolute', left: mm(frame.w), top: 0, width: mm(1.4), height: mm(PAGE_H), background: C.cream }} />

      {spec.flyingMoney && (
        <>
          <Sticker s={{ icon: 'bill', x: 57, y: 36, size: 10, rotate: -24 }} />
          <Sticker s={{ icon: 'bill', x: 3, y: 26, size: 9, rotate: 18 }} />
          <Sticker s={{ icon: 'sparkle', x: 60, y: 92, size: 7 }} />
        </>
      )}
      {isBirthdayMonth && (
        <>
          <Sticker s={{ icon: 'confetti', x: 2, y: 16, size: 16 }} />
          <Sticker s={{ icon: 'confetti', x: 44, y: 84, size: 14, rotate: 40 }} />
        </>
      )}
      {stickers.map((s, i) => (
        <Sticker key={i} s={s} />
      ))}

      {page.caption ? (
        <div
          style={{
            position: 'absolute',
            left: mm(SAFE_INSET),
            bottom: mm(SAFE_INSET + 1),
            maxWidth: mm(frame.w - SAFE_INSET - 8),
            background: C.cream,
            border: `0.35mm solid ${C.navy}`,
            borderRadius: mm(2.5),
            padding: `${mm(1.2)} ${mm(2.4)}`,
            transform: 'rotate(-2deg)',
            boxShadow: `1mm 1mm 0 ${spec.accent}`,
          }}
        >
          <div data-overflow-check="caption" style={{ maxHeight: mm(15), overflow: 'hidden', fontFamily: F.script, fontWeight: 700, fontSize: '11pt', lineHeight: 1.45 }}>
            {page.caption}
          </div>
        </div>
      ) : null}

      {/* card lịch */}
      <div
        style={{
          position: 'absolute',
          left: mm(CARD.x),
          top: mm(CARD.y),
          width: mm(CARD.right - CARD.x),
          height: mm(CARD.bottom - CARD.y),
          background: C.cream,
          borderRadius: mm(5),
          border: `0.35mm solid ${C.navy}`,
          boxShadow: `1.4mm 1.4mm 0 ${spec.accent}`,
        }}
      />
      {isBirthdayMonth && (
        <>
          <div style={{ position: 'absolute', left: mm(CARD.x + 2), top: mm(CARD.bottom - 16) }}>
            <FinanceIcon name="confetti" size={14} />
          </div>
          <div style={{ position: 'absolute', left: mm(150), top: mm(CARD.y + 1) }}>
            <FinanceIcon name="confetti" size={12} />
          </div>
        </>
      )}

      <div style={{ position: 'absolute', left: mm(GRID.x), top: mm(CARD.y + 3.5), width: mm(106) }}>
        <Pill bg={spec.accentSoft} color={spec.accent}>
          {concept}
        </Pill>
        <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', columnGap: mm(2.5), marginTop: mm(1) }}>
          <span style={{ fontFamily: F.title, fontWeight: 800, fontSize: '21pt', lineHeight: 1, color: C.coral, letterSpacing: '-0.3pt' }}>
            THÁNG {month}
          </span>
          <span
            data-overflow-check="tagline"
            style={{ fontFamily: F.script, fontWeight: 700, fontSize: '12.5pt', lineHeight: 1.45, color: spec.accent, maxHeight: mm(13), overflow: 'hidden' }}
          >
            · {tagline}
          </span>
        </div>
      </div>

      <div style={{ position: 'absolute', left: mm(CARD.right - 24), top: mm(CARD.y - 6) }}>
        <Mascot variant={mascot} size={20} />
      </div>

      <FinanceMonthGrid
        grid={grid}
        accent={spec.accent}
        accentSoft={spec.accentSoft}
        x={GRID.x}
        y={GRID.y}
        width={GRID.width}
        headerH={GRID.headerH}
        rowH={GRID.rowH}
      />

      {/* quote tháng */}
      <div style={{ position: 'absolute', left: mm(GRID.x), top: mm(bottomTop), width: mm(quoteW), height: mm(bottomH), display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div data-overflow-check="quote" style={{ fontFamily: F.script, fontWeight: 700, fontSize: hasMessage ? '13pt' : '15pt', lineHeight: 1.4, color: C.navy, maxHeight: mm(bottomH - 5), overflow: 'hidden' }}>
          “{quote}”
        </div>
        <div style={{ fontFamily: F.body, fontSize: '6.5pt', fontWeight: 600, color: C.navyMuted, marginTop: mm(1) }}>{quoteBy}</div>
      </div>

      {hasMessage && (
        <div
          style={{
            position: 'absolute',
            left: mm(GRID.x + quoteW + 3),
            top: mm(bottomTop),
            width: mm(GRID.width - quoteW - 3),
            height: mm(bottomH),
            background: '#fff',
            border: `0.3mm dashed ${spec.accent}`,
            borderRadius: mm(3),
            padding: `${mm(2)} ${mm(2.6)}`,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div data-overflow-check="message" style={{ flex: 1, overflow: 'hidden', fontFamily: F.body, fontSize: '7.5pt', lineHeight: 1.35, whiteSpace: 'pre-wrap' }}>
            {page.message!.text}
          </div>
          {page.message!.author && (
            <div style={{ textAlign: 'right', fontFamily: F.script, fontWeight: 700, fontSize: '10pt', color: spec.accent }}>— {page.message!.author}</div>
          )}
        </div>
      )}
    </FinanceShell>
  );
}

/* ---------------- bìa ---------------- */

interface CoverProps {
  page: CalendarPage;
  year: number;
  recipientName: string;
  photoSrc?: string;
  showGuides?: boolean;
}

export function FinanceCoverPage({ page, year, recipientName, photoSrc, showGuides }: CoverProps) {
  const stickers: { icon: IconName; x: number; y: number; size: number; rotate?: number }[] = [
    { icon: 'sparkle', x: 12, y: 16, size: 12 },
    { icon: 'bill', x: 184, y: 18, size: 16, rotate: 16 },
    { icon: 'calculator', x: 190, y: 50, size: 13, rotate: -10 },
    { icon: 'heart', x: 20, y: 44, size: 10, rotate: -14 },
  ];
  return (
    <FinanceShell label="Bìa" showGuides={showGuides}>
      <PhotoFrame frame={PHOTO_FRAMES.cover} src={photoSrc} area={page.crop?.area} theme={cloudPastel} placeholder="Ảnh bìa" style={photoBg} />
      {stickers.map((s, i) => (
        <Sticker key={i} s={s} />
      ))}
      <div
        style={{
          position: 'absolute',
          left: mm(SAFE_INSET + 2),
          bottom: mm(SAFE_INSET + 2),
          width: mm(112),
          background: C.cream,
          border: `0.4mm solid ${C.navy}`,
          borderRadius: mm(5),
          boxShadow: `1.6mm 1.6mm 0 ${C.coral}`,
          padding: `${mm(4)} ${mm(5)}`,
        }}
      >
        <Pill bg={C.coralSoft} color={C.coral}>
          Bộ lịch {year} · Năm {canChiYear(year)}
        </Pill>
        <div style={{ fontFamily: F.title, fontWeight: 800, fontSize: '13pt', lineHeight: 1.1, marginTop: mm(2), color: C.navy }}>12 THÁNG CỦA</div>
        <div style={{ fontFamily: F.title, fontWeight: 800, fontSize: '24pt', lineHeight: 1, color: C.coral, letterSpacing: '-0.4pt' }}>
          CHỊ ĐẸP TÀI CHÍNH
        </div>
        <div style={{ fontFamily: F.script, fontWeight: 700, fontSize: '15pt', marginTop: mm(1.5), color: C.navy }}>Gửi chị {recipientName}</div>
        {page.caption ? (
          <div data-overflow-check="caption" style={{ fontFamily: F.body, fontSize: '8pt', color: C.navyMuted, maxHeight: mm(10), overflow: 'hidden', marginTop: mm(0.5) }}>
            {page.caption}
          </div>
        ) : null}
      </div>
      <div style={{ position: 'absolute', left: mm(SAFE_INSET + 104), bottom: mm(SAFE_INSET + 16) }}>
        <Mascot variant="money" size={22} />
      </div>
    </FinanceShell>
  );
}

/* ---------------- trang cuối ---------------- */

export function FinanceBackPage({ page, year, recipientName, photoSrc, showGuides }: CoverProps) {
  const frame = PHOTO_FRAMES.back;
  const textX = frame.x + frame.w + 10;
  const textW = PAGE_W - SAFE_INSET - textX;
  return (
    <FinanceShell label="Trang cuối" showGuides={showGuides}>
      <div
        style={{
          position: 'absolute',
          left: mm(frame.x - 3),
          top: mm(frame.y - 3),
          width: mm(frame.w + 6),
          height: mm(frame.h + 6),
          background: C.cream,
          border: `0.4mm solid ${C.navy}`,
          borderRadius: mm(4),
          boxShadow: `1.6mm 1.6mm 0 ${C.coral}`,
        }}
      />
      <PhotoFrame frame={frame} src={photoSrc} area={page.crop?.area} theme={cloudPastel} radius={2.5} placeholder="Ảnh cả team" style={photoBg} />
      <Sticker s={{ icon: 'sparkle', x: frame.x + frame.w - 8, y: frame.y - 8, size: 13 }} />
      <Sticker s={{ icon: 'heart', x: frame.x - 8, y: frame.y + frame.h - 12, size: 14, rotate: -12 }} />
      <div
        style={{
          position: 'absolute',
          left: mm(textX),
          top: mm(TOP_INSET + 4),
          width: mm(textW),
          height: mm(PAGE_H - TOP_INSET - 4 - SAFE_INSET - 26),
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Pill bg={C.coralSoft} color={C.coral}>
          Chốt sổ {year}
        </Pill>
        <div style={{ fontFamily: F.title, fontWeight: 800, fontSize: '18pt', lineHeight: 1.05, color: C.coral, marginTop: mm(2) }}>
          Cảm ơn chị {recipientName}
        </div>
        {page.caption ? (
          <div style={{ fontFamily: F.script, fontWeight: 700, fontSize: '12pt', color: C.navyMuted, marginTop: mm(1) }}>{page.caption}</div>
        ) : null}
        <div data-overflow-check="message" style={{ flex: 1, overflow: 'hidden', marginTop: mm(3), fontFamily: F.body, fontSize: '9pt', lineHeight: 1.45, whiteSpace: 'pre-wrap' }}>
          {page.message?.text}
        </div>
        {page.message?.author ? (
          <div style={{ textAlign: 'right', fontFamily: F.script, fontWeight: 700, fontSize: '12pt', color: C.coral }}>— {page.message.author}</div>
        ) : null}
      </div>
      <div style={{ position: 'absolute', left: mm(textX), bottom: mm(SAFE_INSET + 1), fontFamily: F.body, fontSize: '6.5pt', color: C.navyMuted, width: mm(textW - 26) }}>
        Lịch để bàn {year} · 12 tháng của chị đẹp tài chính
      </div>
      <div style={{ position: 'absolute', right: mm(SAFE_INSET + 1), bottom: mm(SAFE_INSET) }}>
        <Mascot variant="hello" size={20} />
      </div>
    </FinanceShell>
  );
}
