import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '../../lib/api-client.ts';
import { addFavorite, getFavorites, removeFavorite } from './favoritesService.ts';

const FAVORITES_QUERY_KEY = ['favorites'];

export function useFavorites() {
  const queryClient = useQueryClient();
  const favoritesQuery = useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: getFavorites,
    refetchInterval: 600_000, // 10 minutes - refetch while on favorites page
    refetchOnWindowFocus: true,
  });

  const addFavoriteMutation = useMutation({
    mutationFn: addFavorite,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: removeFavorite,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
  });

  const favorites = favoritesQuery.data ?? [];
  const errorMessage =
    favoritesQuery.error instanceof ApiError
      ? favoritesQuery.error.message
      : 'Unable to load favorites from the backend.';

  const mutationError = addFavoriteMutation.error ?? removeFavoriteMutation.error;
  const actionErrorMessage =
    mutationError instanceof ApiError
      ? mutationError.message
      : mutationError
        ? 'Unable to update favorites.'
        : null;

  return {
    favorites,
    createFavorite: addFavoriteMutation.mutateAsync,
    removeFavorite: removeFavoriteMutation.mutateAsync,
    isLoading: favoritesQuery.isLoading,
    isError: favoritesQuery.isError,
    errorMessage,
    actionErrorMessage,
    isCreating: addFavoriteMutation.isPending,
    isRemoving: removeFavoriteMutation.isPending,
    activeRoomName: removeFavoriteMutation.variables ?? null,
  };
}