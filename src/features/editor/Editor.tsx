'use client';

import { useState } from 'react';
import { useProjectStore } from '@/store/project-store';
import { Canvas } from './Canvas';
import { ExportDialog } from './ExportDialog';
import { MarkedDatesPanel } from './MarkedDatesPanel';
import { OverviewGrid } from './OverviewGrid';
import { ProjectMenu } from './ProjectMenu';
import { PropertiesPanel } from './PropertiesPanel';
import { Sidebar } from './Sidebar';
import { pageStatus } from './preflight';
import { ThemeSwitch } from './ThemeSwitch';

type Tab = 'edit' | 'overview' | 'dates';

const TABS: { id: Tab; label: string }[] = [
  { id: 'edit', label: 'Chỉnh trang' },
  { id: 'overview', label: 'Xem cả bộ' },
  { id: 'dates', label: 'Ngày đánh dấu' },
];

export function Editor() {
  const hydrated = useProjectStore((s) => s.hydrated);
  const recipientName = useProjectStore((s) => s.project.recipientName);
  const setRecipientName = useProjectStore((s) => s.setRecipientName);
  const doneCount = useProjectStore((s) => s.project.pages.filter((p) => pageStatus(p).complete).length);
  const [tab, setTab] = useState<Tab>('edit');
  const [guides, setGuides] = useState(false);
  const [exporting, setExporting] = useState(false);

  if (!hydrated) {
    return <div className="flex h-screen items-center justify-center text-slate-400">Đang mở project…</div>;
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex flex-wrap items-center gap-3 border-b bg-white/80 px-4 py-2 backdrop-blur">
        <h1 className="font-display text-lg font-extrabold text-sky-600">☁ Lịch 2027</h1>
        <label className="flex items-center gap-1.5 text-sm text-slate-500">
          Gửi chị
          <input
            aria-label="Tên người nhận"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            className="w-24 rounded-md border border-slate-200 px-2 py-1 text-sm text-slate-800"
          />
        </label>
        <nav className="ml-2 flex rounded-lg bg-slate-100 p-0.5 text-sm" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-md px-3 py-1 ${tab === t.id ? 'bg-white font-semibold shadow-sm' : 'text-slate-500'}`}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <ThemeSwitch />
        <span className="text-xs text-slate-500">{doneCount}/14 trang đủ</span>
        <div className="ml-auto flex items-center gap-2">
          {tab === 'edit' && (
            <label className="flex items-center gap-1.5 text-sm text-slate-600">
              <input type="checkbox" checked={guides} onChange={(e) => setGuides(e.target.checked)} className="accent-sky-500" />
              Bleed / safe zone
            </label>
          )}
          <ProjectMenu />
          <button
            type="button"
            onClick={() => setExporting(true)}
            className="rounded-lg bg-sky-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-sky-600"
          >
            Xuất PDF
          </button>
        </div>
      </header>

      {tab === 'edit' && (
        <main className="grid min-h-0 flex-1 grid-cols-[200px_1fr_320px]">
          <aside className="min-h-0 overflow-y-auto border-r bg-slate-50">
            <Sidebar />
          </aside>
          <section className="min-h-0">
            <Canvas showGuides={guides} />
          </section>
          <aside className="min-h-0 overflow-y-auto border-l bg-white">
            <PropertiesPanel />
          </aside>
        </main>
      )}
      {tab === 'overview' && (
        <main className="min-h-0 flex-1 overflow-y-auto">
          <OverviewGrid onOpen={() => setTab('edit')} />
        </main>
      )}
      {tab === 'dates' && (
        <main className="min-h-0 flex-1 overflow-y-auto">
          <MarkedDatesPanel />
        </main>
      )}

      {exporting && <ExportDialog onClose={() => setExporting(false)} />}
    </div>
  );
}
