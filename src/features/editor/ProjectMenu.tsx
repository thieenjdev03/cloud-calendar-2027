'use client';

import { useRef, useState } from 'react';
import { useProjectStore } from '@/store/project-store';

function download(filename: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ProjectMenu() {
  const exportProject = useProjectStore((s) => s.exportProject);
  const importProject = useProjectStore((s) => s.importProject);
  const resetProject = useProjectStore((s) => s.resetProject);
  const fileRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  async function save(withPhotos: boolean) {
    setOpen(false);
    setStatus({ kind: 'ok', text: 'Đang đóng gói…' });
    const file = await exportProject(withPhotos);
    const stamp = new Date().toISOString().slice(0, 10);
    download(`lich-2027-${withPhotos ? 'kem-anh' : 'metadata'}-${stamp}.json`, JSON.stringify(file));
    setStatus({ kind: 'ok', text: withPhotos ? 'Đã tải project kèm ảnh.' : 'Đã tải project (không kèm ảnh).' });
  }

  async function load(file: File | undefined) {
    if (!file) return;
    try {
      await importProject(await file.text());
      setStatus({ kind: 'ok', text: `Đã mở ${file.name}.` });
    } catch (e) {
      setStatus({ kind: 'error', text: e instanceof Error ? e.message : 'Không mở được file.' });
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div className="relative flex items-center gap-2">
      {status && (
        <span className={`max-w-64 truncate text-xs ${status.kind === 'error' ? 'text-rose-600' : 'text-slate-500'}`} title={status.text}>
          {status.text}
        </span>
      )}
      <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" aria-label="Mở project" onChange={(e) => load(e.target.files?.[0])} />
      <button type="button" onClick={() => setOpen((v) => !v)} className="rounded-lg border bg-white px-3 py-1.5 text-sm hover:bg-slate-50">
        Project ▾
      </button>
      {open && (
        <div className="absolute right-0 top-full z-40 mt-1 w-60 overflow-hidden rounded-xl border bg-white text-sm shadow-lg">
          <button type="button" className="block w-full px-4 py-2 text-left hover:bg-slate-50" onClick={() => save(false)}>
            Tải project (nhẹ, để backup)
          </button>
          <button type="button" className="block w-full px-4 py-2 text-left hover:bg-slate-50" onClick={() => save(true)}>
            Tải project kèm ảnh (chuyển máy)
          </button>
          <button
            type="button"
            className="block w-full px-4 py-2 text-left hover:bg-slate-50"
            onClick={() => {
              setOpen(false);
              fileRef.current?.click();
            }}
          >
            Mở project…
          </button>
          <button
            type="button"
            className="block w-full border-t px-4 py-2 text-left text-rose-600 hover:bg-rose-50"
            onClick={async () => {
              setOpen(false);
              if (window.confirm('Xoá toàn bộ nội dung và ảnh để làm lại từ đầu?')) await resetProject();
            }}
          >
            Làm lại từ đầu
          </button>
        </div>
      )}
    </div>
  );
}
