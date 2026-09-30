'use client';

import { useMemo } from 'react';
import { useProjectStore } from '@/store/project-store';
import { runPreflight } from './preflight';

export function ExportDialog({ onClose }: { onClose: () => void }) {
  const project = useProjectStore((s) => s.project);
  const selectPage = useProjectStore((s) => s.selectPage);
  const issues = useMemo(() => runPreflight(project), [project]);
  const errors = issues.filter((i) => i.level === 'error');
  const warnings = issues.filter((i) => i.level === 'warning');

  const open = (draft: boolean) => {
    window.open(`/print?auto=1${draft ? '&draft=1' : ''}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" role="dialog" aria-modal>
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="border-b px-5 py-3">
          <h2 className="font-display text-lg font-bold">Kiểm tra trước khi xuất PDF</h2>
          <p className="text-sm text-slate-500">
            {errors.length === 0 && warnings.length === 0
              ? 'Ổn hết rồi — sẵn sàng xuất.'
              : `${errors.length} lỗi chặn · ${warnings.length} cảnh báo`}
          </p>
        </div>
        <ul className="flex-1 divide-y overflow-y-auto text-sm">
          {issues.map((i, idx) => (
            <li key={idx} className="flex items-center gap-3 px-5 py-2">
              <span className={`h-2 w-2 shrink-0 rounded-full ${i.level === 'error' ? 'bg-rose-500' : 'bg-amber-400'}`} />
              <span className="w-24 shrink-0 font-semibold">{i.page}</span>
              <span className="flex-1 text-slate-600">{i.message}</span>
              <button
                type="button"
                className="text-sky-600 hover:underline"
                onClick={() => {
                  selectPage(i.pageId);
                  onClose();
                }}
              >
                Sửa
              </button>
            </li>
          ))}
        </ul>
        <div className="space-y-3 border-t bg-sky-50/60 px-5 py-3 text-xs text-slate-600">
          <p>
            <b>Cách lưu PDF:</b> dùng <b>Chrome</b> → Destination chọn <b>“Save as PDF / Lưu dưới dạng PDF”</b> → More settings: tắt{' '}
            <b>Headers and footers</b>, bật <b>Background graphics</b>, Margins <b>None</b>, Scale <b>100%</b>.
          </p>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm hover:bg-white">
              Đóng
            </button>
            <button type="button" onClick={() => open(true)} className="rounded-lg border bg-white px-4 py-2 text-sm hover:bg-slate-50">
              Xuất bản nháp
            </button>
            <button
              type="button"
              disabled={errors.length > 0}
              onClick={() => open(false)}
              className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
              title={errors.length > 0 ? 'Còn lỗi chặn — sửa hết hoặc xuất bản nháp' : undefined}
            >
              Xuất PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
