'use client';

import { useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import type { CalendarPage, PageCrop } from '@/types/calendar';
import { PHOTO_FRAMES } from '@/features/pages/layout';
import { usePhotoUrl } from './use-photo-url';
import { dpiLevel, effectiveDpi } from './dpi';

interface Props {
  page: CalendarPage;
  onSave: (crop: PageCrop) => void;
  onClose: () => void;
}

const levelText = { good: 'text-emerald-600', warn: 'text-amber-600', bad: 'text-rose-600' };

/** Crop khoá đúng tỷ lệ khung ảnh của layout; chỉ lưu toạ độ, không cắt ảnh thật. */
export function CropModal({ page, onSave, onClose }: Props) {
  const src = usePhotoUrl(page.photoId, 'preview');
  const frame = PHOTO_FRAMES[page.kind];
  const [crop, setCrop] = useState({ x: page.crop?.x ?? 0, y: page.crop?.y ?? 0 });
  const [zoom, setZoom] = useState(page.crop?.zoom ?? 1);
  const [area, setArea] = useState<Area | undefined>(page.crop?.area);

  const dpi = page.photoSize ? effectiveDpi(page.photoSize, frame, area) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" role="dialog" aria-modal>
      <div className="flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h2 className="font-display text-lg font-bold">Crop ảnh</h2>
          {dpi !== null && (
            <span className={`text-sm font-semibold ${levelText[dpiLevel(dpi)]}`}>{dpi} dpi khi in</span>
          )}
        </div>
        <div className="relative h-[60vh] bg-slate-800">
          {src && (
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              maxZoom={5}
              aspect={frame.w / frame.h}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(pct) => setArea(pct)}
              objectFit="cover"
            />
          )}
        </div>
        <div className="flex items-center gap-4 px-5 py-3">
          <label className="flex flex-1 items-center gap-3 text-sm">
            Zoom
            <input
              type="range"
              min={1}
              max={5}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-sky-500"
            />
          </label>
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm hover:bg-slate-100">
            Huỷ
          </button>
          <button
            type="button"
            onClick={() => {
              onSave({ x: crop.x, y: crop.y, zoom, area });
              onClose();
            }}
            className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600"
          >
            Xong
          </button>
        </div>
      </div>
    </div>
  );
}
