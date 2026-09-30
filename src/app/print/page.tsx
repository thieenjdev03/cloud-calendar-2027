'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { eventsForYear, indexEvents } from '@/features/calendar-engine';
import { PageRenderer } from '@/features/pages/PageRenderer';
import { createDemoProject, demoPhoto } from '@/features/pages/demo';
import { findOverflows } from '@/features/editor/preflight';
import { usePhotoUrl } from '@/features/photos/use-photo-url';
import { useProjectStore } from '@/store/project-store';
import type { CalendarEvent, CalendarPage, CalendarProject } from '@/types/calendar';

function PrintPage({
  page,
  index,
  project,
  eventIndex,
  demo,
}: {
  page: CalendarPage;
  index: number;
  project: CalendarProject;
  eventIndex: Map<string, CalendarEvent[]>;
  demo: boolean;
}) {
  // Bản in luôn dùng ảnh original, không dùng preview
  const url = usePhotoUrl(demo ? undefined : page.photoId, 'original');
  const src = demo ? demoPhoto(index) : url;
  return <PageRenderer page={page} project={project} eventIndex={eventIndex} photoSrc={src} />;
}

type Phase = 'loading' | 'ready' | 'blocked';

function PrintView() {
  const params = useSearchParams();
  const demo = params.get('demo') === '1';
  const auto = params.get('auto') === '1';
  const hydrated = useProjectStore((s) => s.hydrated);
  const stored = useProjectStore((s) => s.project);
  const themeParam = params.get('theme');
  const project = useMemo(
    () => (demo ? { ...createDemoProject(), themeId: themeParam === 'chi-dep-tai-chinh' || themeParam === 'cloud-pastel' ? themeParam : stored.themeId } : stored),
    [demo, stored, themeParam],
  );
  const eventIndex = useMemo(() => indexEvents(eventsForYear(project.year, project.markedDates)), [project]);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>('loading');
  const [overflows, setOverflows] = useState<{ page: string; field: string }[]>([]);
  const printed = useRef(false);

  const expectedImages = project.pages.filter((p) => demo || p.photoId).length;

  // Đợi đủ ảnh + font rồi mới cho in
  useEffect(() => {
    if (!hydrated && !demo) return;
    let cancelled = false;
    const tick = async () => {
      const sheet = sheetRef.current;
      if (!sheet) return;
      const imgs = Array.from(sheet.querySelectorAll<HTMLImageElement>('img[data-print-img]'));
      if (imgs.length < expectedImages) {
        setTimeout(tick, 150);
        return;
      }
      await document.fonts.ready;
      await Promise.all(imgs.map((img) => img.decode().catch(() => undefined)));
      if (cancelled) return;
      const found = findOverflows(sheet);
      setOverflows(found);
      setPhase(found.length > 0 ? 'blocked' : 'ready');
      document.body.dataset.printReady = 'true';
    };
    tick();
    return () => {
      cancelled = true;
    };
  }, [hydrated, demo, expectedImages, project]);

  useEffect(() => {
    if (auto && phase === 'ready' && !printed.current) {
      printed.current = true;
      setTimeout(() => window.print(), 300);
    }
  }, [auto, phase]);

  if (!hydrated && !demo) return <p className="p-8 text-slate-400">Đang tải project…</p>;

  return (
    <>
      <div className="screen-only sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b bg-white/90 px-6 py-3 text-sm backdrop-blur">
        <b className="font-display text-base">Bản in · 14 trang · 216×156mm</b>
        {demo && <span className="rounded bg-amber-100 px-2 py-0.5 text-amber-800">Dữ liệu giả</span>}
        {params.get('draft') === '1' && <span className="rounded bg-slate-100 px-2 py-0.5">Bản nháp</span>}
        <span className="text-slate-500">
          {phase === 'loading'
            ? 'Đang tải ảnh gốc và font…'
            : 'Chrome → Lưu dưới dạng PDF · tắt Headers and footers · bật Background graphics · Margins: None'}
        </span>
        <button
          type="button"
          disabled={phase === 'loading'}
          onClick={() => window.print()}
          className="ml-auto rounded-lg bg-sky-500 px-4 py-1.5 font-semibold text-white disabled:opacity-50"
        >
          {phase === 'blocked' ? 'Vẫn in' : 'In / Lưu PDF'}
        </button>
      </div>
      {overflows.length > 0 && (
        <div className="screen-only mx-6 mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <b>Chữ bị tràn khung</b> — rút ngắn trước khi in:{' '}
          {overflows.map((o) => `${o.page} (${o.field})`).join(', ')}
        </div>
      )}
      <div ref={sheetRef} className="print-sheet flex flex-col items-center gap-8 bg-slate-200 py-8">
        {project.pages.map((page, i) => (
          <div key={page.id} className="print-page-wrap shadow-lg">
            <PrintPage page={page} index={i} project={project} eventIndex={eventIndex} demo={demo} />
          </div>
        ))}
      </div>
    </>
  );
}

export default function PrintRoute() {
  return (
    <Suspense fallback={null}>
      <PrintView />
    </Suspense>
  );
}
