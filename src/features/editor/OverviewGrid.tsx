'use client';

import { useProjectStore } from '@/store/project-store';
import { pageTitle } from '@/features/pages/PageRenderer';
import { ScaledPage } from './ScaledPage';
import { useEventIndex, useProjectMeta } from './hooks';

/** "Xem cả bộ": 14 trang nhỏ để so tone màu giữa các trang. Bấm để mở trang đó. */
export function OverviewGrid({ onOpen }: { onOpen: () => void }) {
  const pages = useProjectStore((s) => s.project.pages);
  const selectPage = useProjectStore((s) => s.selectPage);
  const eventIndex = useEventIndex();
  const meta = useProjectMeta();

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 overflow-y-auto p-6">
      {pages.map((page) => (
        <button
          key={page.id}
          type="button"
          onClick={() => {
            selectPage(page.id);
            onOpen();
          }}
          className="group text-left"
        >
          <div className="overflow-hidden rounded-md shadow-md transition group-hover:shadow-lg">
            <ScaledPage page={page} project={meta} eventIndex={eventIndex} width={300} />
          </div>
          <div className="mt-1.5 text-sm font-semibold">{pageTitle(page)}</div>
        </button>
      ))}
    </div>
  );
}
