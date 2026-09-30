'use client';

import { useEffect, useRef, useState } from 'react';
import { usePage, useProjectStore } from '@/store/project-store';
import { ScaledPage, PAGE_PX_H, PAGE_PX_W } from './ScaledPage';
import { useEventIndex, useProjectMeta } from './hooks';

export function Canvas({ showGuides }: { showGuides: boolean }) {
  const selected = useProjectStore((s) => s.selectedPageId);
  const page = usePage(selected);
  const eventIndex = useEventIndex();
  const meta = useProjectMeta();
  const hostRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(720);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect;
      const fit = Math.min(w - 48, ((h - 48) * PAGE_PX_W) / PAGE_PX_H);
      setWidth(Math.max(280, Math.floor(fit)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={hostRef} className="flex h-full min-h-0 items-center justify-center overflow-auto">
      {page && (
        <div className="rounded-sm shadow-[0_10px_40px_-10px_rgba(52,64,90,0.35)]" data-testid="canvas">
          <ScaledPage page={page} project={meta} eventIndex={eventIndex} width={width} showGuides={showGuides} />
        </div>
      )}
    </div>
  );
}
