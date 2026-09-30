'use client';

import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { createStore, del, get, set } from 'idb-keyval';
import type { CalendarPage, CalendarProject, MarkedDate, PageCrop, ThemeId } from '@/types/calendar';
import { createDefaultProject, parseProjectFile, photoFromExport, photoToExport, type ProjectFile } from '@/lib/project-io';
import { deletePhoto, getPhoto, putPhoto } from '@/features/photos/photo-store';
import { processImage } from '@/features/photos/process-image';
import { newId } from '@/lib/id';

/** Adapter để Zustand persist ghi vào IndexedDB (localStorage không chứa nổi dữ liệu lớn). */
const idbStorage: StateStorage = (() => {
  let db: ReturnType<typeof createStore> | null = null;
  const store = () => (db ??= createStore('cloud-calendar-project', 'state'));
  const hasIdb = () => typeof indexedDB !== 'undefined';
  return {
    getItem: async (name) => (hasIdb() ? ((await get<string>(name, store())) ?? null) : null),
    setItem: async (name, value) => {
      if (hasIdb()) await set(name, value, store());
    },
    removeItem: async (name) => {
      if (hasIdb()) await del(name, store());
    },
  };
})();

export interface ProjectState {
  project: CalendarProject;
  selectedPageId: string;
  hydrated: boolean;

  selectPage: (id: string) => void;
  updatePage: (id: string, patch: Partial<CalendarPage>) => void;
  setCrop: (id: string, crop: PageCrop) => void;
  setPhoto: (pageId: string, file: File) => Promise<void>;
  removePhoto: (pageId: string) => Promise<void>;
  setRecipientName: (name: string) => void;
  setTheme: (themeId: ThemeId) => void;
  addMarkedDate: (m: Omit<MarkedDate, 'id'>) => void;
  updateMarkedDate: (id: string, patch: Partial<MarkedDate>) => void;
  removeMarkedDate: (id: string) => void;
  importProject: (json: unknown) => Promise<void>;
  exportProject: (withPhotos?: boolean) => Promise<ProjectFile>;
  resetProject: () => Promise<void>;
}

function mapPage(project: CalendarProject, id: string, fn: (p: CalendarPage) => CalendarPage): CalendarProject {
  return { ...project, pages: project.pages.map((p) => (p.id === id ? fn(p) : p)) };
}

/** Xoá blob ảnh nếu không còn trang nào tham chiếu. */
async function gcPhoto(project: CalendarProject, photoId: string | undefined) {
  if (photoId && !project.pages.some((p) => p.photoId === photoId)) await deletePhoto(photoId);
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (setState, getState) => ({
      project: createDefaultProject(),
      selectedPageId: 'cover',
      hydrated: false,

      selectPage: (id) => setState({ selectedPageId: id }),

      updatePage: (id, patch) => setState((s) => ({ project: mapPage(s.project, id, (p) => ({ ...p, ...patch })) })),

      setCrop: (id, crop) => setState((s) => ({ project: mapPage(s.project, id, (p) => ({ ...p, crop })) })),

      setPhoto: async (pageId, file) => {
        const photo = await processImage(file);
        await putPhoto(photo);
        const old = getState().project.pages.find((p) => p.id === pageId)?.photoId;
        setState((s) => ({
          project: mapPage(s.project, pageId, (p) => ({
            ...p,
            photoId: photo.id,
            photoSize: { width: photo.width, height: photo.height },
            crop: undefined,
          })),
        }));
        await gcPhoto(getState().project, old);
      },

      removePhoto: async (pageId) => {
        const old = getState().project.pages.find((p) => p.id === pageId)?.photoId;
        setState((s) => ({
          project: mapPage(s.project, pageId, (p) => ({ ...p, photoId: undefined, photoSize: undefined, crop: undefined })),
        }));
        await gcPhoto(getState().project, old);
      },

      setRecipientName: (name) => setState((s) => ({ project: { ...s.project, recipientName: name } })),

      /** Theme lưu cùng project (IndexedDB) nên reload vẫn giữ lựa chọn. Chỉ đổi cách render, không đụng dữ liệu. */
      setTheme: (themeId) => setState((s) => ({ project: { ...s.project, themeId } })),

      addMarkedDate: (m) =>
        setState((s) => ({
          project: {
            ...s.project,
            markedDates: [...s.project.markedDates, { ...m, id: newId('md') }].sort((a, b) => a.date.localeCompare(b.date)),
          },
        })),

      updateMarkedDate: (id, patch) =>
        setState((s) => ({
          project: {
            ...s.project,
            markedDates: s.project.markedDates.map((m) => (m.id === id ? { ...m, ...patch } : m)),
          },
        })),

      removeMarkedDate: (id) =>
        setState((s) => ({
          project: { ...s.project, markedDates: s.project.markedDates.filter((m) => m.id !== id) },
        })),

      importProject: async (json) => {
        const file = parseProjectFile(json);
        if (file.photos) {
          for (const p of file.photos) await putPhoto(await photoFromExport(p));
        }
        setState({ project: file.project, selectedPageId: file.project.pages[0].id });
      },

      exportProject: async (withPhotos = false) => {
        const { project } = getState();
        const file: ProjectFile = { app: 'cloud-calendar', exportedAt: new Date().toISOString(), project };
        if (withPhotos) {
          const ids = [...new Set(project.pages.map((p) => p.photoId).filter(Boolean) as string[])];
          const photos = await Promise.all(ids.map((id) => getPhoto(id)));
          file.photos = await Promise.all(photos.filter((p) => !!p).map((p) => photoToExport(p!)));
        }
        return file;
      },

      resetProject: async () => {
        const ids = getState().project.pages.map((p) => p.photoId).filter(Boolean) as string[];
        setState({ project: createDefaultProject(), selectedPageId: 'cover' });
        await Promise.all(ids.map((id) => deletePhoto(id)));
      },
    }),
    {
      name: 'cloud-calendar-2027',
      version: 1,
      storage: createJSONStorage(() => idbStorage),
      partialize: (s) => ({ project: s.project, selectedPageId: s.selectedPageId }),
      onRehydrateStorage: () => () => {
        useProjectStore.setState({ hydrated: true });
      },
    },
  ),
);

/** Selector theo trang — sửa một trang không re-render 13 trang còn lại. */
export function usePage(id: string): CalendarPage | undefined {
  return useProjectStore((s) => s.project.pages.find((p) => p.id === id));
}
