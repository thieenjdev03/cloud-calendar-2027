'use client';

import { useState } from 'react';
import { useProjectStore } from '@/store/project-store';
import { lunarHolidaysForYear, solarHolidaysForYear } from '@/features/calendar-engine';
import type { MarkedDate } from '@/types/calendar';

const PRESET_COLORS = ['#E0607E', '#C9699F', '#7A74C9', '#3E8FC7', '#3F8F6B', '#D19A1E'];
const ICONS: { value: MarkedDate['icon']; label: string }[] = [
  { value: 'heart', label: 'Tim' },
  { value: 'cloud', label: 'Mây' },
  { value: 'star', label: 'Sao' },
  { value: 'none', label: 'Không' },
];

const inputCls = 'rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-sky-400';

export function MarkedDatesPanel() {
  const year = useProjectStore((s) => s.project.year);
  const marked = useProjectStore((s) => s.project.markedDates);
  const add = useProjectStore((s) => s.addMarkedDate);
  const remove = useProjectStore((s) => s.removeMarkedDate);
  const [date, setDate] = useState(`${year}-01-01`);
  const [label, setLabel] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [icon, setIcon] = useState<MarkedDate['icon']>('heart');
  const [isBirthday, setIsBirthday] = useState(false);

  const holidays = [
    ...solarHolidaysForYear(year).map((h) => ({ ...h, cal: 'dương' })),
    ...lunarHolidaysForYear(year).map((h) => ({ ...h, cal: 'âm' })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="mx-auto grid max-w-5xl gap-8 overflow-y-auto p-6 md:grid-cols-2">
      <section>
        <h2 className="font-display text-xl font-bold">Ngày đánh dấu</h2>
        <p className="mb-4 text-sm text-slate-500">Sinh nhật chị Vân, ngày kỷ niệm team, deadline cố định của phòng…</p>
        <form
          className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            if (!label.trim() || !date.startsWith(`${year}-`)) return;
            add({ date, label: label.trim(), color, icon, ...(isBirthday ? { isBirthday: true } : {}) });
            setLabel('');
            setIsBirthday(false);
          }}
        >
          <div className="flex gap-2">
            <input type="date" aria-label="Ngày" value={date} min={`${year}-01-01`} max={`${year}-12-31`} onChange={(e) => setDate(e.target.value)} className={inputCls} />
            <input aria-label="Tên ngày" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Sinh nhật chị Vân" className={`${inputCls} flex-1`} />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="flex gap-1.5">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Màu ${c}`}
                  onClick={() => setColor(c)}
                  className={`h-6 w-6 rounded-full ring-offset-2 ${color === c ? 'ring-2 ring-slate-400' : ''}`}
                  style={{ background: c }}
                />
              ))}
            </span>
            <select aria-label="Icon" value={icon} onChange={(e) => setIcon(e.target.value as MarkedDate['icon'])} className={inputCls}>
              {ICONS.map((i) => (
                <option key={i.value} value={i.value}>
                  {i.label}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-1.5 text-slate-600">
              <input type="checkbox" checked={isBirthday} onChange={(e) => setIsBirthday(e.target.checked)} className="accent-rose-500" />
              Sinh nhật chị
            </label>
            <button type="submit" className="ml-auto rounded-lg bg-sky-500 px-4 py-2 font-semibold text-white hover:bg-sky-600">
              Thêm
            </button>
          </div>
        </form>
        <ul className="mt-4 flex flex-col gap-2">
          {marked.length === 0 && <li className="text-sm text-slate-400">Chưa có ngày nào.</li>}
          {marked.map((m) => (
            <li key={m.id} className="flex items-center gap-3 rounded-lg bg-white px-3 py-2 text-sm shadow-sm">
              <span className="h-3 w-3 rounded-full" style={{ background: m.color }} />
              <span className="w-24 tabular-nums text-slate-500">{m.date.split('-').reverse().join('/')}</span>
              <span className="flex-1 font-medium">
                {m.label}
                {m.isBirthday && <span className="ml-2 rounded bg-rose-100 px-1.5 text-xs text-rose-600">sinh nhật</span>}
              </span>
              <button type="button" onClick={() => remove(m.id)} className="text-rose-500 hover:underline">
                Xoá
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="mb-3 font-display text-lg font-bold">Ngày lễ tự động {year}</h3>
        <ul className="divide-y rounded-xl bg-white text-sm shadow-sm">
          {holidays.map((h) => (
            <li key={h.date + h.label} className="flex gap-3 px-3 py-1.5">
              <span className="w-24 tabular-nums text-slate-500">{h.date.split('-').reverse().join('/')}</span>
              <span className="flex-1">{h.label}</span>
              <span className="text-xs text-slate-400">{h.cal}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
