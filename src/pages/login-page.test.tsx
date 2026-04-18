

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from './login-page';
import { AuthContext } from '../features/auth/auth-context';

describe('LoginPage', () => {
  it('renders login form and header', () => {
    const queryClient = new QueryClient();
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <AuthContext.Provider value={{
            isAuthenticated: false,
            isAdmin: false,
            isLoading: false,
            user: null,
            signIn: vi.fn(),
            signUp: vi.fn(),
            signOut: vi.fn(),
            deleteAccount: vi.fn(),
          }}>
            <LoginPage />
          </AuthContext.Provider>
        </QueryClientProvider>
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/access portal/i)).toBeInTheDocument();
  });
});
