'use client';

import { useProjectStore } from '@/store/project-store';
import type { ThemeId } from '@/types/calendar';

const OPTIONS: { id: ThemeId; label: string; hint: string }[] = [
  { id: 'cloud-pastel', label: 'Theme cũ', hint: 'Mây pastel' },
  { id: 'chi-dep-tai-chinh', label: 'Theme mới', hint: '12 Tháng Chị Đẹp Tài Chính' },
];

/** Chuyển theme nhanh; chỉ đổi cách render, ảnh/ngày/lời nhắn giữ nguyên. Lựa chọn lưu cùng project. */
export function ThemeSwitch() {
  const themeId = useProjectStore((s) => s.project.themeId);
  const setTheme = useProjectStore((s) => s.setTheme);
  return (
    <div className="flex items-center rounded-lg bg-rose-50 p-0.5 text-sm" role="radiogroup" aria-label="Theme">
      {OPTIONS.map((o) => {
        const active = themeId === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={active}
            title={o.hint}
            onClick={() => setTheme(o.id)}
            className={`rounded-md px-3 py-1 ${active ? 'bg-white font-semibold text-rose-600 shadow-sm' : 'text-slate-500'}`}
          >
            {o.label}
            <span className="ml-1 hidden text-xs font-normal text-slate-400 2xl:inline">· {o.hint}</span>
          </button>
        );
      })}
    </div>
  );
}
