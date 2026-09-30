import { createStore, del, get, keys, set, type UseStore } from 'idb-keyval';
import type { StoredPhoto } from '@/types/calendar';

let store: UseStore | null = null;
function photoDb(): UseStore {
  if (!store) store = createStore('cloud-calendar-photos', 'photos');
  return store;
}

export async function putPhoto(photo: StoredPhoto): Promise<void> {
  await set(photo.id, photo, photoDb());
}

export async function getPhoto(id: string): Promise<StoredPhoto | undefined> {
  return get<StoredPhoto>(id, photoDb());
}

export async function deletePhoto(id: string): Promise<void> {
  await del(id, photoDb());
}

export async function listPhotoIds(): Promise<string[]> {
  return (await keys(photoDb())) as string[];
}
