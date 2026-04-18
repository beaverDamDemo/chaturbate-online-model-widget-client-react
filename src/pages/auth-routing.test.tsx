// Mock window.matchMedia for theme detection
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { ThemeProvider } from '../app/theme-context'
import { AuthProvider } from '../features/auth/auth-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

describe('Auth routing', () => {
  it('redirects to login if not authenticated on home', async () => {
    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/"]}>
          <ThemeProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </ThemeProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
    // Check for the Login nav link, which only appears for unauthenticated users
    expect(await screen.findByRole('link', { name: /login/i })).toBeInTheDocument()
    // Ensure user-specific content is not present
    expect(screen.queryByText(/account/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/admin panel/i)).not.toBeInTheDocument()
  })
})
