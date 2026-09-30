import type { CalendarEvent, HolidayType, MarkedDate } from '@/types/calendar';
import { lunarMonthLength, lunarToSolar } from './lunar';

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

interface SolarHoliday {
  day: number;
  month: number;
  label: string;
  type: HolidayType;
}

/** Lễ dương cố định. `public` = nghỉ lễ; `special` = ngày kỷ niệm (tô màu nhẹ + icon). */
export const SOLAR_HOLIDAYS: SolarHoliday[] = [
  { day: 1, month: 1, label: 'Tết Dương lịch', type: 'public' },
  { day: 14, month: 2, label: 'Valentine', type: 'special' },
  { day: 8, month: 3, label: 'Quốc tế Phụ nữ', type: 'special' },
  { day: 30, month: 4, label: 'Giải phóng miền Nam', type: 'public' },
  { day: 1, month: 5, label: 'Quốc tế Lao động', type: 'public' },
  { day: 1, month: 6, label: 'Quốc tế Thiếu nhi', type: 'special' },
  { day: 2, month: 9, label: 'Quốc khánh', type: 'public' },
  { day: 20, month: 10, label: 'Phụ nữ Việt Nam', type: 'special' },
  { day: 24, month: 12, label: 'Giáng sinh', type: 'special' },
];

interface LunarHoliday {
  day: number | 'last';
  month: number;
  label: string;
}

export const LUNAR_HOLIDAYS: LunarHoliday[] = [
  { day: 1, month: 1, label: 'Mùng 1 Tết' },
  { day: 2, month: 1, label: 'Mùng 2 Tết' },
  { day: 3, month: 1, label: 'Mùng 3 Tết' },
  { day: 15, month: 1, label: 'Rằm tháng Giêng' },
  { day: 10, month: 3, label: 'Giỗ Tổ Hùng Vương' },
  { day: 15, month: 8, label: 'Trung thu' },
  { day: 23, month: 12, label: 'Ông Công Ông Táo' },
  { day: 'last', month: 12, label: 'Giao thừa' },
];

/** Lễ âm lịch nằm trong năm dương `year` (lấy cả năm âm year-1 và year). */
export function lunarHolidaysForYear(year: number): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  for (const lunarYear of [year - 1, year]) {
    for (const h of LUNAR_HOLIDAYS) {
      const day = h.day === 'last' ? lunarMonthLength(h.month, lunarYear) : h.day;
      const solar = lunarToSolar(day, h.month, lunarYear);
      if (!solar || solar.getFullYear() !== year) continue;
      // Giỗ Tổ và Tết là ngày nghỉ lễ chính thức
      const isPublic = h.month === 1 && typeof h.day === 'number' && h.day <= 3;
      const type: HolidayType = isPublic || h.label === 'Giỗ Tổ Hùng Vương' || h.label === 'Giao thừa' ? 'public' : 'lunar';
      events.push({ date: toISODate(solar), label: h.label, type });
    }
  }
  return events;
}

export function solarHolidaysForYear(year: number): CalendarEvent[] {
  return SOLAR_HOLIDAYS.map((h) => ({
    date: toISODate(new Date(year, h.month - 1, h.day)),
    label: h.label,
    type: h.type,
    icon: h.type === 'special' && (h.month === 3 || h.month === 10) ? ('heart' as const) : undefined,
  }));
}

/** Toàn bộ sự kiện của năm, gồm lễ + ngày đánh dấu của project, sắp theo ngày. */
export function eventsForYear(year: number, markedDates: MarkedDate[] = []): CalendarEvent[] {
  const custom: CalendarEvent[] = markedDates
    .filter((m) => m.date.startsWith(`${year}-`))
    .map((m) => ({ date: m.date, label: m.label, type: 'custom', color: m.color, icon: m.icon, isBirthday: m.isBirthday }));
  return [...solarHolidaysForYear(year), ...lunarHolidaysForYear(year), ...custom].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
}

/** Gom sự kiện theo ngày để tra O(1) khi dựng lưới. */
export function indexEvents(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const map = new Map<string, CalendarEvent[]>();
  for (const e of events) {
    const list = map.get(e.date) ?? [];
    list.push(e);
    map.set(e.date, list);
  }
  return map;
}
