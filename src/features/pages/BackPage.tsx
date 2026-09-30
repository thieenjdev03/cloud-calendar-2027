import type { CalendarPage } from '@/types/calendar';
import type { Theme } from '@/themes/cloud-pastel';
import { Cloud } from './Decor';
import { PageShell } from './PageShell';
import { PhotoFrame } from './PhotoFrame';
import { PAGE_H, PAGE_W, PHOTO_FRAMES, SAFE_INSET, TOP_INSET, mm } from './layout';

interface Props {
  page: CalendarPage;
  year: number;
  recipientName: string;
  theme: Theme;
  photoSrc?: string;
  showGuides?: boolean;
}

export function BackPage({ page, year, recipientName, theme, photoSrc, showGuides }: Props) {
  const frame = PHOTO_FRAMES.back;
  const textX = frame.x + frame.w + 10;
  const textW = PAGE_W - SAFE_INSET - textX;
  const accent = theme.monthAccents[12];
  return (
    <PageShell theme={theme} showGuides={showGuides} label="Trang cuối">
      <Cloud cell={{ x: 176, y: 5, w: 30, variant: 0, opacity: 0.9 }} theme={theme} />
      <Cloud cell={{ x: 6, y: 132, w: 20, variant: 2, opacity: 0.8 }} theme={theme} />
      <PhotoFrame
        frame={frame}
        src={photoSrc}
        area={page.crop?.area}
        theme={theme}
        radius={6}
        placeholder="Ảnh cả team"
        style={{ boxShadow: `0 0 0 1.2mm ${theme.colors.paper}` }}
      />
      <div
        style={{
          position: 'absolute',
          left: mm(textX),
          top: mm(TOP_INSET + 6),
          width: mm(textW),
          height: mm(PAGE_H - TOP_INSET - 6 - SAFE_INSET - 6),
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ fontFamily: theme.fonts.title, fontWeight: 800, fontSize: '20pt', lineHeight: 1.05, color: accent.accent }}>
          Cảm ơn chị {recipientName}
        </div>
        {page.caption ? (
          <div style={{ fontFamily: theme.fonts.title, fontWeight: 600, fontSize: '10pt', color: theme.colors.textMuted, marginTop: mm(1.5) }}>
            {page.caption}
          </div>
        ) : null}
        <div
          data-overflow-check="message"
          style={{
            flex: 1,
            overflow: 'hidden',
            marginTop: mm(5),
            fontFamily: theme.fonts.hand,
            fontSize: '11pt',
            lineHeight: 1.4,
            whiteSpace: 'pre-wrap',
          }}
        >
          {page.message?.text}
        </div>
        {page.message?.author ? (
          <div style={{ textAlign: 'right', fontFamily: theme.fonts.hand, fontSize: '11pt', color: accent.accent }}>
            — {page.message.author}
          </div>
        ) : null}
        <div style={{ fontFamily: theme.fonts.body, fontSize: '7pt', color: theme.colors.textMuted, marginTop: mm(3) }}>
          Lịch để bàn {year}
        </div>
      </div>
    </PageShell>
  );
}
