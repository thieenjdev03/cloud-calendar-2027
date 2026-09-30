import { CLOUD_PATHS, HEART_PATH, type CloudCell, type Theme } from '@/themes/cloud-pastel';
import { mm } from './layout';

export function Cloud({ cell, theme }: { cell: CloudCell; theme: Theme }) {
  return (
    <svg
      viewBox="0 0 100 60"
      aria-hidden
      style={{ position: 'absolute', left: mm(cell.x), top: mm(cell.y), width: mm(cell.w), opacity: cell.opacity }}
    >
      <path d={CLOUD_PATHS[cell.variant]} fill={theme.colors.cloudShade} transform="translate(2 3)" />
      <path d={CLOUD_PATHS[cell.variant]} fill={theme.colors.cloud} />
    </svg>
  );
}

export function EventIcon({ icon, color, size = 2.2 }: { icon?: string; color: string; size?: number }) {
  if (!icon || icon === 'none') return null;
  const style = { width: mm(size), height: mm(size), display: 'block' } as const;
  if (icon === 'heart') {
    return (
      <svg viewBox="0 0 100 100" style={style} aria-hidden>
        <path d={HEART_PATH} fill={color} />
      </svg>
    );
  }
  if (icon === 'star') {
    return (
      <svg viewBox="0 0 100 100" style={style} aria-hidden>
        <path d="M50 6l13 29 31 3-24 21 7 31-27-16-27 16 7-31L6 38l31-3z" fill={color} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 60" style={{ ...style, height: mm(size * 0.6) }} aria-hidden>
      <path d={CLOUD_PATHS[0]} fill={color} />
    </svg>
  );
}
