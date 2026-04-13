
import React from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

/**
 * Async utility to render with all providers, using dynamic import for AuthProvider.
 * Usage: await renderWithProviders(<Component />)
 */


import { AuthProvider } from './features/auth/auth-context';

export function renderWithProviders(ui, options) {
  const queryClient = createTestQueryClient();
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {ui}
        </AuthProvider>
      </QueryClientProvider>
    </MemoryRouter>,
    options
  );
}

export * from '@testing-library/react';
