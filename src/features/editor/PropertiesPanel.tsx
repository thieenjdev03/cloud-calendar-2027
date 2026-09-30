'use client';

import { useRef, useState } from 'react';
import { usePage, useProjectStore } from '@/store/project-store';
import { pageTitle } from '@/features/pages/PageRenderer';
import { PHOTO_FRAMES } from '@/features/pages/layout';
import { CropModal } from '@/features/photos/CropModal';
import { DPI_GOOD, DPI_MIN, dpiLevel } from '@/features/photos/dpi';
import { pageStatus } from './preflight';
import { FINANCE_MONTHS } from '@/features/pages/finance/theme';

const CAPTION_MAX = 90;
const MESSAGE_MAX = 220;

const dpiBox = {
  good: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warn: 'border-amber-200 bg-amber-50 text-amber-700',
  bad: 'border-rose-200 bg-rose-50 text-rose-700',
};

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline justify-between text-xs font-semibold text-slate-600">
        {label}
        {hint && <span className="font-normal text-slate-400">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100';

export function PropertiesPanel() {
  const selected = useProjectStore((s) => s.selectedPageId);
  const page = usePage(selected);
  const updatePage = useProjectStore((s) => s.updatePage);
  const setPhoto = useProjectStore((s) => s.setPhoto);
  const removePhoto = useProjectStore((s) => s.removePhoto);
  const setCrop = useProjectStore((s) => s.setCrop);
  const themeId = useProjectStore((s) => s.project.themeId);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cropping, setCropping] = useState(false);

  if (!page) return null;
  const st = pageStatus(page);
  const frame = PHOTO_FRAMES[page.kind];

  async function onFile(file: File | undefined) {
    if (!file || !page) return;
    setBusy(true);
    setError(null);
    try {
      await setPhoto(page.id, file);
      setCropping(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không đọc được ảnh.');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div className="flex flex-col gap-5 p-4">
      <h2 className="font-display text-xl font-bold">{pageTitle(page)}</h2>

      <section className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-slate-600">
          Ảnh <span className="font-normal text-slate-400">· khung {frame.w}×{frame.h}mm</span>
        </span>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,.heic,.heif"
          className="hidden"
          aria-label="Chọn ảnh"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => fileRef.current?.click()}
            className="rounded-lg bg-sky-500 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-60"
          >
            {busy ? 'Đang xử lý…' : st.hasPhoto ? 'Đổi ảnh' : 'Tải ảnh lên'}
          </button>
          {st.hasPhoto && (
            <>
              <button type="button" onClick={() => setCropping(true)} className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50">
                Crop
              </button>
              <button
                type="button"
                onClick={() => removePhoto(page.id)}
                className="rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
              >
                Xoá ảnh
              </button>
            </>
          )}
        </div>
        {error && <p className="rounded-lg bg-rose-50 p-2 text-xs text-rose-700">{error}</p>}
        {st.dpi !== null && (
          <p className={`rounded-lg border p-2 text-xs ${dpiBox[dpiLevel(st.dpi)]}`}>
            <b>{st.dpi} dpi</b> khi in ·{' '}
            {st.dpi >= DPI_GOOD
              ? 'nét'
              : st.dpi >= DPI_MIN
                ? `tạm được, nên ≥ ${DPI_GOOD}dpi — thử zoom ít lại hoặc xin ảnh gốc`
                : 'sẽ vỡ hạt — cần ảnh gốc độ phân giải cao hơn (không dùng ảnh Zalo/chụp màn hình)'}
            {page.photoSize && (
              <span className="block opacity-70">
                Ảnh gốc {page.photoSize.width}×{page.photoSize.height}px
              </span>
            )}
          </p>
        )}
      </section>

      <Field label={page.kind === 'back' ? 'Dòng phụ dưới tiêu đề' : 'Caption'} hint={`${page.caption?.length ?? 0}/${CAPTION_MAX}`}>
        <textarea
          aria-label="Caption"
          rows={2}
          maxLength={CAPTION_MAX}
          value={page.caption ?? ''}
          onChange={(e) => updatePage(page.id, { caption: e.target.value })}
          className={inputCls}
          placeholder={page.kind === 'cover' ? 'Một năm nhiều mây trắng và nắng đẹp…' : 'Chuyến đi Đà Lạt, tháng 3/2026'}
        />
      </Field>

      {themeId === 'chi-dep-tai-chinh' && page.kind === 'month' && page.month && (
        <div className="flex flex-col gap-3 rounded-xl border border-rose-100 bg-rose-50/50 p-3">
          <p className="text-xs font-semibold text-rose-600">
            Chị Đẹp Tài Chính · {FINANCE_MONTHS[page.month].concept}
            <span className="block font-normal text-slate-500">Để trống = dùng câu mặc định. Có inside joke thật thì thay vào.</span>
          </p>
          <Field label="Câu nhỏ cạnh tên tháng">
            <input
              aria-label="Câu nhỏ cạnh tên tháng"
              maxLength={50}
              value={page.tagline ?? ''}
              onChange={(e) => updatePage(page.id, { tagline: e.target.value })}
              className={inputCls}
              placeholder={FINANCE_MONTHS[page.month].tagline}
            />
          </Field>
          <Field label="Quote dưới lịch">
            <textarea
              aria-label="Quote dưới lịch"
              rows={2}
              maxLength={90}
              value={page.quote ?? ''}
              onChange={(e) => updatePage(page.id, { quote: e.target.value })}
              className={inputCls}
              placeholder={FINANCE_MONTHS[page.month].quote}
            />
          </Field>
        </div>
      )}

      {page.kind !== 'cover' && (
        <>
          <Field label="Lời nhắn" hint={`${page.message?.text.length ?? 0}/${MESSAGE_MAX}`}>
            <textarea
              aria-label="Lời nhắn"
              rows={4}
              maxLength={MESSAGE_MAX}
              value={page.message?.text ?? ''}
              onChange={(e) => updatePage(page.id, { message: { author: page.message?.author ?? '', text: e.target.value } })}
              className={`${inputCls} font-script text-base`}
              placeholder="Chúc chị tháng này…"
            />
          </Field>
          <Field label="Người viết">
            <input
              aria-label="Người viết"
              value={page.message?.author ?? ''}
              onChange={(e) => updatePage(page.id, { message: { text: page.message?.text ?? '', author: e.target.value } })}
              className={inputCls}
              placeholder="Thiện"
            />
          </Field>
        </>
      )}

      {cropping && page.photoId && (
        <CropModal page={page} onSave={(c) => setCrop(page.id, c)} onClose={() => setCropping(false)} />
      )}
    </div>
  );
}
