'use client';

import { memo } from 'react';
import type { CalendarEvent, CalendarPage, ThemeId } from '@/types/calendar';
import { PageRenderer } from '@/features/pages/PageRenderer';
import { PAGE_H, PAGE_W } from '@/features/pages/layout';
import { usePhotoUrl, type PhotoVariant } from '@/features/photos/use-photo-url';

export const PX_PER_MM = 96 / 25.4;
export const PAGE_PX_W = PAGE_W * PX_PER_MM;
export const PAGE_PX_H = PAGE_H * PX_PER_MM;

interface Props {
  page: CalendarPage;
  project: { year: number; recipientName: string; themeId?: ThemeId };
  eventIndex: Map<string, CalendarEvent[]>;
  width: number; // px hiển thị
  showGuides?: boolean;
  variant?: PhotoVariant;
}

/** Render chính component in rồi co bằng transform: scale() — editor và bản in dùng chung một code. */
export const ScaledPage = memo(function ScaledPage({ page, project, eventIndex, width, showGuides, variant = 'preview' }: Props) {
  const scale = width / PAGE_PX_W;
  const src = usePhotoUrl(page.photoId, variant);
  return (
    <div style={{ width, height: PAGE_PX_H * scale, overflow: 'hidden', position: 'relative' }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 }}>
        <PageRenderer page={page} project={project} eventIndex={eventIndex} photoSrc={src} showGuides={showGuides} />
      </div>
    </div>
  );
});
