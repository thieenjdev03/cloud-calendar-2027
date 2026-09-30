import type { CalendarProject } from '@/types/calendar';
import { createDefaultProject } from '@/lib/project-io';

/** Dữ liệu giả cho /print?demo=1 — kiểm layout khi chưa có ảnh thật. */
export function createDemoProject(): CalendarProject {
  const p = createDefaultProject();
  p.markedDates = [
    { id: 'd1', date: '2027-05-12', label: 'Sinh nhật chị Vân', color: '#E0607E', icon: 'heart' },
    { id: 'd2', date: '2027-08-15', label: 'Kỷ niệm team', color: '#7A74C9', icon: 'star' },
  ];
  p.pages = p.pages.map((page, i) => ({
    ...page,
    photoId: `demo-${i}`,
    caption: page.kind === 'cover' ? 'Một năm nhiều mây trắng và nắng đẹp' : `Kỷ niệm tháng ${page.month ?? ''} của cả team`,
    message:
      page.kind === 'cover'
        ? undefined
        : { author: 'Cả team', text: 'Chúc chị Vân một tháng thật nhẹ nhàng, nhiều niềm vui và ít deadline nha chị!' },
  }));
  return p;
}

const HUES = [205, 340, 350, 320, 110, 30, 200, 185, 250, 45, 325, 25, 150, 210];

export function demoPhoto(index: number): string {
  const h = HUES[index % HUES.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="hsl(${h},70%,82%)"/><stop offset="1" stop-color="hsl(${h + 30},60%,62%)"/></linearGradient></defs>
<rect width="400" height="300" fill="url(#g)"/>
<circle cx="300" cy="80" r="36" fill="hsl(${h + 40},90%,92%)"/>
<path d="M0 230 Q100 170 200 220 T400 200 V300 H0z" fill="hsl(${h + 60},40%,52%)"/>
<path d="M0 260 Q120 220 240 255 T400 240 V300 H0z" fill="hsl(${h + 80},35%,42%)"/>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
