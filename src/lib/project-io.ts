import { THEME_IDS, type CalendarPage, type CalendarProject, type StoredPhoto, type ThemeId } from '@/types/calendar';

export const PAGE_COUNT = 14;

export function createDefaultProject(year = 2027, recipientName = 'Vân'): CalendarProject {
  const pages: CalendarPage[] = [
    { id: 'cover', kind: 'cover', caption: '' },
    ...Array.from({ length: 12 }, (_, i) => ({
      id: `m${i + 1}`,
      kind: 'month' as const,
      month: i + 1,
      caption: '',
      message: { author: '', text: '' },
    })),
    { id: 'back', kind: 'back', caption: '', message: { author: '', text: '' } },
  ];
  return { version: 1, year, themeId: 'cloud-pastel', recipientName, pages, markedDates: [] };
}

export interface ExportedPhoto {
  id: string;
  width: number;
  height: number;
  name?: string;
  original: string; // data URL
  preview: string; // data URL
}

export interface ProjectFile {
  app: 'cloud-calendar';
  exportedAt: string;
  project: CalendarProject;
  photos?: ExportedPhoto[];
}

export class ProjectImportError extends Error {}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

/** Kiểm tra cấu trúc file project; ném lỗi tiếng Việt dễ hiểu thay vì để app crash. */
export function parseProjectFile(input: unknown): ProjectFile {
  let data = input;
  if (typeof input === 'string') {
    try {
      data = JSON.parse(input);
    } catch {
      throw new ProjectImportError('File không phải JSON hợp lệ.');
    }
  }
  if (!isObj(data)) throw new ProjectImportError('File rỗng hoặc sai định dạng.');
  // chấp nhận cả file chỉ chứa project trần
  const project = (isObj(data.project) ? data.project : data) as Record<string, unknown>;

  if (project.version !== 1) {
    throw new ProjectImportError(`Phiên bản project "${String(project.version)}" không được hỗ trợ (cần version 1).`);
  }
  if (typeof project.year !== 'number') throw new ProjectImportError('Thiếu năm (year).');
  if (!Array.isArray(project.pages) || project.pages.length !== PAGE_COUNT) {
    throw new ProjectImportError(`Project phải có đúng ${PAGE_COUNT} trang.`);
  }
  project.pages.forEach((p, i) => {
    if (!isObj(p) || typeof p.id !== 'string' || !['cover', 'month', 'back'].includes(p.kind as string)) {
      throw new ProjectImportError(`Trang thứ ${i + 1} sai cấu trúc.`);
    }
    if (p.kind === 'month' && (typeof p.month !== 'number' || p.month < 1 || p.month > 12)) {
      throw new ProjectImportError(`Trang thứ ${i + 1} thiếu số tháng hợp lệ.`);
    }
  });
  const marked = Array.isArray(project.markedDates) ? project.markedDates : [];
  for (const m of marked) {
    if (!isObj(m) || typeof m.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(m.date)) {
      throw new ProjectImportError('Có ngày đánh dấu sai định dạng (cần YYYY-MM-DD).');
    }
  }

  const photos = isObj(data) && Array.isArray(data.photos) ? (data.photos as ExportedPhoto[]) : undefined;
  return {
    app: 'cloud-calendar',
    exportedAt: typeof data.exportedAt === 'string' ? data.exportedAt : new Date().toISOString(),
    project: {
      version: 1,
      year: project.year as number,
      themeId: THEME_IDS.includes(project.themeId as ThemeId) ? (project.themeId as ThemeId) : 'cloud-pastel',
      recipientName: typeof project.recipientName === 'string' ? project.recipientName : 'Vân',
      pages: project.pages as CalendarPage[],
      markedDates: (marked as CalendarProject['markedDates']).map((m, i) => ({ ...m, id: m.id ?? `md_${i}` })),
    },
    photos,
  };
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}

export async function photoToExport(p: StoredPhoto): Promise<ExportedPhoto> {
  return {
    id: p.id,
    width: p.width,
    height: p.height,
    name: p.name,
    original: await blobToDataUrl(p.original),
    preview: await blobToDataUrl(p.preview),
  };
}

export async function photoFromExport(p: ExportedPhoto): Promise<StoredPhoto> {
  return {
    id: p.id,
    width: p.width,
    height: p.height,
    name: p.name,
    original: await dataUrlToBlob(p.original),
    preview: await dataUrlToBlob(p.preview),
  };
}
