'use client';

import { useMemo } from 'react';
import { eventsForYear, indexEvents } from '@/features/calendar-engine';
import { useProjectStore } from '@/store/project-store';

export function useEventIndex() {
  const year = useProjectStore((s) => s.project.year);
  const marked = useProjectStore((s) => s.project.markedDates);
  return useMemo(() => indexEvents(eventsForYear(year, marked)), [year, marked]);
}

export function useProjectMeta() {
  const year = useProjectStore((s) => s.project.year);
  const recipientName = useProjectStore((s) => s.project.recipientName);
  const themeId = useProjectStore((s) => s.project.themeId);
  return useMemo(() => ({ year, recipientName, themeId }), [year, recipientName, themeId]);
}
