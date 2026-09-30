import type { CSSProperties } from 'react';
import type { CropArea } from '@/types/calendar';
import type { Theme } from '@/themes/cloud-pastel';
import { mm, type Frame } from './layout';

interface Props {
  frame: Frame;
  src?: string;
  area?: CropArea;
  theme: Theme;
  radius?: number; // mm
  placeholder?: string;
  style?: CSSProperties;
}

/**
 * Hiển thị ảnh theo vùng crop (% ảnh gốc) mà không cắt ảnh thật:
 * phóng ảnh sao cho vùng crop phủ đúng khung.
 */
export function PhotoFrame({ frame, src, area, theme, radius = 0, placeholder = 'Chưa có ảnh', style }: Props) {
  const box: CSSProperties = {
    position: 'absolute',
    left: mm(frame.x),
    top: mm(frame.y),
    width: mm(frame.w),
    height: mm(frame.h),
    overflow: 'hidden',
    borderRadius: radius ? mm(radius) : undefined,
    background: `linear-gradient(160deg, ${theme.colors.backgroundTop}, ${theme.colors.cloudShade})`,
    ...style,
  };

  if (!src) {
    return (
      <div style={{ ...box, display: 'flex', alignItems: 'center', justifyContent: 'center' }} data-photo-empty>
        <span className="screen-only" style={{ color: theme.colors.textMuted, fontSize: '9pt', fontFamily: theme.fonts.body }}>
          {placeholder}
        </span>
      </div>
    );
  }

  const imgStyle: CSSProperties = area
    ? {
        position: 'absolute',
        width: `${(100 / area.width) * 100}%`,
        height: `${(100 / area.height) * 100}%`,
        left: `${(-area.x / area.width) * 100}%`,
        top: `${(-area.y / area.height) * 100}%`,
        maxWidth: 'none',
      }
    : { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' };

  return (
    <div style={box}>
      {/* eslint-disable-next-line @next/next/no-img-element -- blob URL, không qua next/image */}
      <img src={src} alt="" style={imgStyle} draggable={false} data-print-img />
    </div>
  );
}
