import type { CalendarPage, CalendarProject } from '@/types/calendar';
import { DPI_GOOD, DPI_MIN, pageDpi } from '@/features/photos/dpi';
import { pageTitle } from '@/features/pages/PageRenderer';

export type IssueLevel = 'error' | 'warning';

export interface PreflightIssue {
  pageId: string;
  page: string;
  level: IssueLevel;
  message: string;
}

export interface PageStatus {
  hasPhoto: boolean;
  hasCaption: boolean;
  hasMessage: boolean;
  dpi: number | null;
  complete: boolean;
}

export function pageStatus(page: CalendarPage): PageStatus {
  const hasPhoto = !!page.photoId;
  const hasCaption = !!page.caption?.trim();
  const hasMessage = page.kind === 'cover' || !!page.message?.text.trim();
  const dpi = pageDpi(page);
  const needsCaption = page.kind === 'month';
  return {
    hasPhoto,
    hasCaption,
    hasMessage,
    dpi,
    complete: hasPhoto && (!needsCaption || hasCaption) && (dpi === null || dpi >= DPI_MIN),
  };
}

/** Kiểm tra dữ liệu trước khi xuất PDF. `error` = chặn, `warning` = hỏi lại. */
export function runPreflight(project: CalendarProject): PreflightIssue[] {
  const issues: PreflightIssue[] = [];
  for (const page of project.pages) {
    const s = pageStatus(page);
    const base = { pageId: page.id, page: pageTitle(page) };
    if (!s.hasPhoto) issues.push({ ...base, level: 'error', message: 'Chưa có ảnh' });
    if (page.kind === 'month' && !s.hasCaption) issues.push({ ...base, level: 'warning', message: 'Chưa có caption' });
    if (page.kind !== 'cover' && !s.hasMessage) issues.push({ ...base, level: 'warning', message: 'Chưa có lời nhắn' });
    if (s.dpi !== null && s.dpi < DPI_MIN) {
      issues.push({ ...base, level: 'error', message: `Ảnh chỉ ${s.dpi}dpi (< ${DPI_MIN}), in sẽ vỡ hạt` });
    } else if (s.dpi !== null && s.dpi < DPI_GOOD) {
      issues.push({ ...base, level: 'warning', message: `Ảnh ${s.dpi}dpi (nên ≥ ${DPI_GOOD})` });
    }
  }
  return issues;
}

/** Đo caption/lời nhắn bị tràn khung trong DOM đã render (dùng ở trang /print). */
export function findOverflows(root: ParentNode): { page: string; field: string }[] {
  const out: { page: string; field: string }[] = [];
  root.querySelectorAll<HTMLElement>('[data-overflow-check]').forEach((el) => {
    if (el.scrollHeight > el.clientHeight + 1) {
      const page = el.closest<HTMLElement>('[data-page-label]')?.dataset.pageLabel ?? '?';
      const labels: Record<string, string> = { caption: 'Caption', message: 'Lời nhắn', tagline: 'Câu nhỏ cạnh tên tháng', quote: 'Quote' };
      out.push({ page, field: labels[el.dataset.overflowCheck ?? ''] ?? 'Chữ' });
    }
  });
  return out;
}
