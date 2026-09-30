import { canChiYear } from '@/features/calendar-engine';
import type { CalendarPage } from '@/types/calendar';
import type { Theme } from '@/themes/cloud-pastel';
import { Cloud } from './Decor';
import { PageShell } from './PageShell';
import { PhotoFrame } from './PhotoFrame';
import { PHOTO_FRAMES, SAFE_INSET, TOP_INSET, mm } from './layout';

interface Props {
  page: CalendarPage;
  year: number;
  recipientName: string;
  theme: Theme;
  photoSrc?: string;
  showGuides?: boolean;
}

export function CoverPage({ page, year, recipientName, theme, photoSrc, showGuides }: Props) {
  return (
    <PageShell theme={theme} showGuides={showGuides} label="Bìa">
      <PhotoFrame frame={PHOTO_FRAMES.cover} src={photoSrc} area={page.crop?.area} theme={theme} placeholder="Ảnh bìa" />
      {/* lớp mây mờ phía dưới để chữ dễ đọc */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: mm(70),
          background: `linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(244,248,253,0.88) 55%, ${theme.colors.background} 100%)`,
        }}
      />
      <Cloud cell={{ x: 6, y: TOP_INSET - 4, w: 34, variant: 1, opacity: 0.9 }} theme={theme} />
      <Cloud cell={{ x: 172, y: TOP_INSET + 4, w: 30, variant: 3, opacity: 0.85 }} theme={theme} />

      <div
        style={{
          position: 'absolute',
          left: mm(SAFE_INSET + 4),
          right: mm(SAFE_INSET + 4),
          bottom: mm(SAFE_INSET + 3),
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: mm(6),
        }}
      >
        <div>
          <div
            style={{
              fontFamily: theme.fonts.title,
              fontWeight: 800,
              fontSize: '54pt',
              lineHeight: 0.9,
              color: theme.monthAccents[1].accent,
              letterSpacing: '-0.5pt',
            }}
          >
            {year}
          </div>
          <div style={{ fontFamily: theme.fonts.title, fontWeight: 600, fontSize: '11pt', color: theme.colors.textMuted }}>
            Năm {canChiYear(year)}
          </div>
        </div>
        <div style={{ textAlign: 'right', maxWidth: mm(110) }}>
          <div style={{ fontFamily: theme.fonts.hand, fontSize: '18pt', lineHeight: 1.15, color: theme.colors.text }}>
            Gửi chị {recipientName}
          </div>
          {page.caption ? (
            <div
              data-overflow-check="caption"
              style={{
                fontFamily: theme.fonts.hand,
                fontSize: '10.5pt',
                lineHeight: 1.2,
                maxHeight: mm(14),
                overflow: 'hidden',
                color: theme.colors.textMuted,
                marginTop: mm(1),
              }}
            >
              {page.caption}
            </div>
          ) : null}
        </div>
      </div>
    </PageShell>
  );
}
