import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FavoritesPage } from './favorites-page';


// Mock useFavorites to control the data for the test
vi.mock('../features/favorites/use-favorites', () => ({
  useFavorites: () => ({
    favorites: [
      {
        id: 1,
        roomName: 'test_room',
        online: true,
        statusCheckedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    ],
    createFavorite: vi.fn(),
    removeFavorite: vi.fn(),
    isLoading: false,
    isError: false,
    errorMessage: '',
    actionErrorMessage: '',
    isCreating: false,
    isRemoving: false,
    activeRoomName: null,
  }),
}));

describe('FavoritesPage', () => {
  it('renders the favorites table and shows a favorite room', () => {
    render(<FavoritesPage />);
    expect(screen.getByText('Favorites')).toBeInTheDocument();
    expect(screen.getByText('test_room')).toBeInTheDocument();
    expect(screen.getByText('online')).toBeInTheDocument();
  });
});
