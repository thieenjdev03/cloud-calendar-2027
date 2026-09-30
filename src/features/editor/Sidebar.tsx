'use client';

import { useProjectStore } from '@/store/project-store';
import { pageTitle } from '@/features/pages/PageRenderer';
import { dpiLevel } from '@/features/photos/dpi';
import { pageStatus } from './preflight';
import { ScaledPage } from './ScaledPage';
import { useEventIndex, useProjectMeta } from './hooks';

const dpiClass = { good: 'bg-emerald-100 text-emerald-700', warn: 'bg-amber-100 text-amber-700', bad: 'bg-rose-100 text-rose-700' };

export function Sidebar() {
  const pages = useProjectStore((s) => s.project.pages);
  const selected = useProjectStore((s) => s.selectedPageId);
  const selectPage = useProjectStore((s) => s.selectPage);
  const eventIndex = useEventIndex();
  const meta = useProjectMeta();

  return (
    <nav aria-label="Danh sách trang" className="flex flex-col gap-2 overflow-y-auto p-3">
      {pages.map((page) => {
        const st = pageStatus(page);
        const active = page.id === selected;
        return (
          <button
            key={page.id}
            type="button"
            onClick={() => selectPage(page.id)}
            data-testid={`thumb-${page.id}`}
            data-complete={st.complete}
            className={`rounded-xl border-2 bg-white p-1.5 text-left transition ${
              active ? 'border-sky-400 shadow-md' : 'border-transparent hover:border-sky-200'
            }`}
          >
            <div className="pointer-events-none overflow-hidden rounded-md">
              <ScaledPage page={page} project={meta} eventIndex={eventIndex} width={168} />
            </div>
            <div className="mt-1.5 flex items-center justify-between gap-1 px-0.5">
              <span className="text-xs font-semibold">{pageTitle(page)}</span>
              <span className="flex items-center gap-1 text-[10px]">
                <span title={st.hasPhoto ? 'Có ảnh' : 'Thiếu ảnh'} className={st.hasPhoto ? 'text-emerald-600' : 'text-rose-500'}>
                  {st.hasPhoto ? '● ảnh' : '○ ảnh'}
                </span>
                {page.kind === 'month' && (
                  <span title={st.hasCaption ? 'Có caption' : 'Thiếu caption'} className={st.hasCaption ? 'text-emerald-600' : 'text-rose-500'}>
                    {st.hasCaption ? '● cap' : '○ cap'}
                  </span>
                )}
                {st.dpi !== null && (
                  <span className={`rounded px-1 font-semibold ${dpiClass[dpiLevel(st.dpi)]}`}>{st.dpi}</span>
                )}
              </span>
            </div>
          </button>
        );
      })}
    </nav>
  );
}
