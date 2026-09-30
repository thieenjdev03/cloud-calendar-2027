'use client';

import { useEffect, useState } from 'react';
import { getPhoto } from './photo-store';

export type PhotoVariant = 'preview' | 'original';

/**
 * Đọc blob từ IndexedDB và trả về object URL.
 * URL luôn được revoke khi đổi ảnh hoặc unmount để tránh leak bộ nhớ.
 */
export function usePhotoUrl(photoId: string | undefined, variant: PhotoVariant = 'preview'): string | undefined {
  const [state, setState] = useState<{ key: string; url: string } | undefined>();
  const key = photoId ? `${photoId}:${variant}` : '';

  useEffect(() => {
    if (!photoId) return;
    let url: string | undefined;
    let cancelled = false;
    getPhoto(photoId).then((photo) => {
      if (cancelled || !photo) return;
      url = URL.createObjectURL(variant === 'original' ? photo.original : photo.preview);
      setState({ key: `${photoId}:${variant}`, url });
    });
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [photoId, variant]);

  return state && state.key === key ? state.url : undefined;
}
