import { useMemo } from 'react';
import { buildMonthGrid } from '@/features/calendar-engine';
import type { CalendarEvent, CalendarPage } from '@/types/calendar';
import type { Theme } from '@/themes/cloud-pastel';
import { Cloud } from './Decor';
import { MonthGrid } from './MonthGrid';
import { PageShell } from './PageShell';
import { PhotoFrame } from './PhotoFrame';
import { MONTH_PANEL, PAGE_H, PHOTO_FRAMES, SAFE_INSET, mm } from './layout';

const EN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

interface Props {
  page: CalendarPage;
  year: number;
  theme: Theme;
  eventIndex: Map<string, CalendarEvent[]>;
  photoSrc?: string;
  showGuides?: boolean;
}

export function MonthPage({ page, year, theme, eventIndex, photoSrc, showGuides }: Props) {
  const month = page.month ?? 1;
  const grid = useMemo(() => buildMonthGrid(year, month, { eventIndex }), [year, month, eventIndex]);
  const accent = theme.monthAccents[month];
  const clouds = theme.cloudLayouts[(month - 1) % theme.cloudLayouts.length];
  const frame = PHOTO_FRAMES.month;
  const panelW = MONTH_PANEL.right - MONTH_PANEL.x;
  const gridBottom = MONTH_PANEL.gridY + MONTH_PANEL.headerH + MONTH_PANEL.rowH * grid.length;
  const msgTop = gridBottom + 4;
  const msgH = PAGE_H - SAFE_INSET - msgTop;

  return (
    <PageShell theme={theme} showGuides={showGuides} label={`Tháng ${month}`}>
      <PhotoFrame frame={frame} src={photoSrc} area={page.crop?.area} theme={theme} />

      {clouds.map((c, i) => (
        <Cloud key={i} cell={c} theme={theme} />
      ))}

      {/* Tiêu đề tháng */}
      <div style={{ position: 'absolute', left: mm(MONTH_PANEL.x), top: mm(MONTH_PANEL.titleY), width: mm(panelW) }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: mm(2.5) }}>
          <span
            style={{
              fontFamily: theme.fonts.title,
              fontWeight: 800,
              fontSize: '24pt',
              lineHeight: 1,
              color: accent.accent,
            }}
          >
            Tháng {month}
          </span>
          <span style={{ fontFamily: theme.fonts.hand, fontSize: '11pt', color: theme.colors.textMuted }}>
            {EN_MONTHS[month - 1]} · {year}
          </span>
        </div>
      </div>

      <MonthGrid
        grid={grid}
        theme={theme}
        accent={accent}
        x={MONTH_PANEL.x}
        y={MONTH_PANEL.gridY}
        width={panelW}
        headerH={MONTH_PANEL.headerH}
        rowH={MONTH_PANEL.rowH}
      />

      {/* Lời nhắn team trong đám mây */}
      {page.message?.text ? (
        <div
          style={{
            position: 'absolute',
            left: mm(MONTH_PANEL.x),
            top: mm(msgTop),
            width: mm(panelW),
            height: mm(msgH),
            background: theme.colors.paper,
            borderRadius: mm(8),
            boxShadow: `0 0 0 0.4mm ${accent.accentSoft}`,
            padding: `${mm(3)} ${mm(4)}`,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            data-overflow-check="message"
            style={{
              flex: 1,
              overflow: 'hidden',
              fontFamily: theme.fonts.hand,
              fontSize: '10pt',
              lineHeight: 1.35,
              color: theme.colors.text,
              whiteSpace: 'pre-wrap',
            }}
          >
            {page.message.text}
          </div>
          {page.message.author && (
            <div
              style={{
                textAlign: 'right',
                fontFamily: theme.fonts.hand,
                fontSize: '10pt',
                color: accent.accent,
              }}
            >
              — {page.message.author}
            </div>
          )}
        </div>
      ) : null}

      {/* Caption đè góc ảnh */}
      {page.caption ? (
        <div
          style={{
            position: 'absolute',
            left: mm(SAFE_INSET),
            bottom: mm(SAFE_INSET),
            maxWidth: mm(frame.w - SAFE_INSET - 6),
            maxHeight: mm(22),
            background: 'rgba(255,255,255,0.86)',
            borderRadius: mm(4),
            padding: `${mm(1.6)} ${mm(3)}`,
          }}
        >
          <div
            data-overflow-check="caption"
            style={{
              maxHeight: mm(18.8),
              overflow: 'hidden',
              fontFamily: theme.fonts.hand,
              fontSize: '10pt',
              lineHeight: 1.3,
              color: theme.colors.text,
            }}
          >
            {page.caption}
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}
