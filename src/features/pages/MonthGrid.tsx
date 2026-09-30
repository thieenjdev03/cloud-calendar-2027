import type { DayCell, MonthGrid as Grid } from '@/features/calendar-engine';
import { WEEKDAY_LABELS_MON_FIRST } from '@/features/calendar-engine';
import type { CalendarEvent } from '@/types/calendar';
import type { MonthAccent, Theme } from '@/themes/cloud-pastel';
import { EventIcon } from './Decor';
import { mm } from './layout';

interface Props {
  grid: Grid;
  theme: Theme;
  accent: MonthAccent;
  x: number;
  y: number;
  width: number;
  headerH: number;
  rowH: number;
}

function eventColor(e: CalendarEvent, theme: Theme): string {
  if (e.color) return e.color;
  switch (e.type) {
    case 'public':
      return theme.colors.holidayPublic;
    case 'lunar':
      return theme.colors.holidayLunar;
    case 'special':
      return theme.colors.holidaySpecial;
    default:
      return theme.colors.holidaySpecial;
  }
}

function dayColor(cell: DayCell, theme: Theme): string {
  if (!cell.isCurrentMonth) return theme.colors.outsideMonth;
  const pub = cell.events.find((e) => e.type === 'public');
  if (pub || cell.isSunday) return theme.colors.sunday;
  return theme.colors.text;
}

export function MonthGrid({ grid, theme, accent, x, y, width, headerH, rowH }: Props) {
  const colW = width / 7;
  return (
    <div style={{ position: 'absolute', left: mm(x), top: mm(y), width: mm(width) }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(7, ${mm(colW)})`, height: mm(headerH) }}>
        {WEEKDAY_LABELS_MON_FIRST.map((l, i) => (
          <div
            key={l}
            style={{
              textAlign: 'center',
              fontFamily: theme.fonts.title,
              fontWeight: 700,
              fontSize: '8pt',
              lineHeight: mm(headerH),
              color: i === 6 ? theme.colors.sunday : accent.accent,
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
          borderTop: `0.25mm solid ${theme.colors.cellBorder}`,
        }}
      >
        {grid.flat().map((cell) => {
          const main = cell.events.find((e) => e.type !== 'lunar') ?? cell.events[0];
          const iconEvent = cell.events.find((e) => e.icon && e.icon !== 'none');
          const highlight = cell.isCurrentMonth && cell.events.some((e) => e.type === 'custom');
          return (
            <div
              key={cell.date}
              data-date={cell.date}
              title={cell.events.map((e) => e.label).join(', ') || undefined}
              style={{
                position: 'relative',
                borderBottom: `0.25mm solid ${theme.colors.cellBorder}`,
                background: highlight ? accent.accentSoft : undefined,
                borderRadius: highlight ? mm(1.2) : undefined,
                padding: `${mm(0.8)} ${mm(0.6)} 0`,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: theme.fonts.title,
                  fontWeight: 700,
                  fontSize: '12.5pt',
                  lineHeight: 1.05,
                  color: dayColor(cell, theme),
                }}
              >
                {cell.day}
              </div>
              <div
                style={{
                  fontFamily: theme.fonts.body,
                  fontSize: '6.5pt',
                  lineHeight: 1.1,
                  color: cell.isCurrentMonth
                    ? cell.lunar.day === 1 || cell.lunar.day === 15
                      ? theme.colors.holidayLunar
                      : theme.colors.lunar
                    : theme.colors.outsideMonth,
                }}
              >
                {cell.lunarLabel}
              </div>
              {cell.isCurrentMonth && main && (
                <div
                  style={{
                    fontFamily: theme.fonts.body,
                    fontSize: '5.5pt',
                    lineHeight: 1.05,
                    marginTop: mm(0.3),
                    color: eventColor(main, theme),
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {main.label}
                </div>
              )}
              {cell.isCurrentMonth && iconEvent && (
                <div style={{ position: 'absolute', top: mm(0.6), right: mm(0.5) }}>
                  <EventIcon icon={iconEvent.icon} color={eventColor(iconEvent, theme)} size={2.4} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
