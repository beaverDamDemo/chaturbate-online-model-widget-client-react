import { apiRequest } from '../../lib/api-client.ts';
import type { Favorite } from './favorite.ts';

function normalizeRoomName(roomName: string) {
  const normalizedRoomName = roomName.trim();

  if (!normalizedRoomName) {
    throw new Error('Room name is required.');
  }

  return normalizedRoomName;
}

export async function getFavorites() {
  return apiRequest<Favorite[]>('/favorites');
}

export async function addFavorite(roomName: string) {
  return apiRequest<Favorite>('/favorites', {
    method: 'POST',
    body: JSON.stringify({ roomName: normalizeRoomName(roomName) }),
  });
}

export async function removeFavorite(roomName: string) {
  await apiRequest<null>(`/favorites/${encodeURIComponent(normalizeRoomName(roomName))}`, {
    method: 'DELETE',
  });
}