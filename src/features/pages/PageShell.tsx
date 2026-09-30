import type { ReactNode } from 'react';
import type { Theme } from '@/themes/cloud-pastel';
import { BLEED, BINDING_TOP, PAGE_H, PAGE_W, SAFE_INSET, TOP_INSET, mm } from './layout';

interface Props {
  theme: Theme;
  showGuides?: boolean;
  children: ReactNode;
  label?: string;
}

/** Một trang in cố định 216×156mm. Bleed/safe zone chỉ vẽ khi `showGuides`. */
export function PageShell({ theme, showGuides, children, label }: Props) {
  return (
    <div
      className="print-page"
      data-page-label={label}
      style={{
        position: 'relative',
        width: mm(PAGE_W),
        height: mm(PAGE_H),
        overflow: 'hidden',
        background: `linear-gradient(180deg, ${theme.colors.backgroundTop} 0%, ${theme.colors.background} 55%)`,
        color: theme.colors.text,
        fontFamily: theme.fonts.body,
      }}
    >
      {children}
      {showGuides && (
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {/* mép cắt */}
          <div
            style={{
              position: 'absolute',
              inset: mm(BLEED),
              outline: `${mm(BLEED)} solid rgba(255, 60, 60, 0.18)`,
              border: '0.3mm dashed rgba(220, 40, 40, 0.9)',
            }}
          />
          {/* safe zone */}
          <div
            style={{
              position: 'absolute',
              left: mm(SAFE_INSET),
              right: mm(SAFE_INSET),
              top: mm(TOP_INSET),
              bottom: mm(SAFE_INSET),
              border: '0.3mm dashed rgba(40, 120, 220, 0.9)',
            }}
          />
          {/* vùng lò xo */}
          <div
            style={{
              position: 'absolute',
              left: mm(BLEED),
              right: mm(BLEED),
              top: mm(BLEED),
              height: mm(BINDING_TOP),
              background: 'repeating-linear-gradient(90deg, rgba(120,120,140,0.25) 0 3mm, transparent 3mm 7mm)',
            }}
          />
        </div>
      )}
    </div>
  );
}
