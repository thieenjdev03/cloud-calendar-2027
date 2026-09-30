import { addDays, startOfMonth, startOfWeek } from 'date-fns';
import type { CalendarEvent, MarkedDate } from '@/types/calendar';
import { eventsForYear, indexEvents, toISODate } from './holidays';
import { solarToLunar, type LunarDate } from './lunar';

/** Lưới luôn 6 hàng tuần để 12 trang tháng cao bằng nhau. */
export const GRID_WEEKS = 6;

export interface DayCell {
  date: string; // 'YYYY-MM-DD'
  day: number;
  weekday: number; // 0 = CN … 6 = T7
  lunar: LunarDate;
  /** Nhãn âm lịch rút gọn: '15' hoặc '1/12' (mùng 1 và ô đầu lưới). */
  lunarLabel: string;
  isCurrentMonth: boolean;
  isSunday: boolean;
  events: CalendarEvent[];
}

export type MonthGrid = DayCell[][];

export interface MonthGridOptions {
  weekStartsOn?: 0 | 1;
  markedDates?: MarkedDate[];
  /** Truyền sẵn index sự kiện khi dựng nhiều tháng để khỏi tính lại. */
  eventIndex?: Map<string, CalendarEvent[]>;
}

export function formatLunarLabel(lunar: LunarDate, forceMonth: boolean): string {
  if (lunar.day === 1 || forceMonth) {
    return `${lunar.day}/${lunar.month}${lunar.isLeapMonth ? 'N' : ''}`;
  }
  return String(lunar.day);
}

export function buildMonthGrid(year: number, month: number, options: MonthGridOptions = {}): MonthGrid {
  const weekStartsOn = options.weekStartsOn ?? 1;
  const index = options.eventIndex ?? indexEvents(eventsForYear(year, options.markedDates));
  const first = startOfMonth(new Date(year, month - 1, 1));
  let cursor = startOfWeek(first, { weekStartsOn });
  const weeks: MonthGrid = [];

  for (let w = 0; w < GRID_WEEKS; w++) {
    const week: DayCell[] = [];
    for (let d = 0; d < 7; d++) {
      const lunar = solarToLunar(cursor);
      const iso = toISODate(cursor);
      const isCurrentMonth = cursor.getMonth() === month - 1;
      const isFirstCellOfMonth = isCurrentMonth && cursor.getDate() === 1;
      week.push({
        date: iso,
        day: cursor.getDate(),
        weekday: cursor.getDay(),
        lunar,
        lunarLabel: formatLunarLabel(lunar, isFirstCellOfMonth || (w === 0 && d === 0)),
        isCurrentMonth,
        isSunday: cursor.getDay() === 0,
        events: index.get(iso) ?? [],
      });
      cursor = addDays(cursor, 1);
    }
    weeks.push(week);
  }
  return weeks;
}

export const WEEKDAY_LABELS_MON_FIRST = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

/** Debug: in 12 tháng ra console (`npm run print:year`). */
export function describeYear(year: number, markedDates: MarkedDate[] = []): string {
  const index = indexEvents(eventsForYear(year, markedDates));
  const lines: string[] = [];
  for (let m = 1; m <= 12; m++) {
    lines.push(`\n== Tháng ${m}/${year} ==`);
    lines.push(WEEKDAY_LABELS_MON_FIRST.map((l) => l.padStart(9)).join(''));
    for (const week of buildMonthGrid(year, m, { eventIndex: index })) {
      lines.push(
        week
          .map((c) => (c.isCurrentMonth ? `${c.day}(${c.lunarLabel})${c.events.length ? '*' : ''}` : '·').padStart(9))
          .join(''),
      );
    }
    for (const [date, evs] of index) {
      if (date.startsWith(`${year}-${String(m).padStart(2, '0')}`)) {
        lines.push(`  ${date}: ${evs.map((e) => `${e.label} [${e.type}]`).join(', ')}`);
      }
    }
  }
  return lines.join('\n');
}
