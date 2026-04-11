import { apiRequest } from '../../lib/api-client.ts'

export type FavoriteModel = {
  id: string
  name: string
  category: string
  status: string
  tags: string[]
  notes: string
  isFavorite: boolean
}

export async function fetchFavoriteModels() {
  return apiRequest<FavoriteModel[]>('/favorites')
}

export async function updateFavorite(modelId: string, favorite: boolean) {
  await apiRequest<null>(`/favorites/${modelId}`, {
    method: 'PUT',
    body: JSON.stringify({ favorite }),
  })
}