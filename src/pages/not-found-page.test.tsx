
import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { NotFoundPage } from './not-found-page'
import { ThemeProvider } from '../app/theme-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContext } from '../features/auth/auth-context'




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

describe('404 NotFoundPage', () => {
  it('renders the custom 404 page for unknown routes (authenticated)', async () => {
    const queryClient = new QueryClient()
    // Create a simple memory router that renders the NotFoundPage
    const testRouter = createMemoryRouter([
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ], {
      initialEntries: ['/not-a-real-route-404-test'],
    })
    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthContext.Provider value={{
            isAuthenticated: true,
            isAdmin: false,
            isLoading: false,
            user: { name: 'Test User', email: 'test@example.com', id: '1' },
            signIn: vi.fn(),
            signUp: vi.fn(),
            signOut: vi.fn(),
            deleteAccount: vi.fn(),
          }}>
            <RouterProvider router={testRouter} />
          </AuthContext.Provider>
        </ThemeProvider>
      </QueryClientProvider>
    )
    // Check for the 404 heading
    expect(await screen.findByRole('heading', { name: '404', level: 1 })).toBeInTheDocument()
    // Check for the Page Not Found subheading
    expect(screen.getByRole('heading', { name: /page not found/i, level: 2 })).toBeInTheDocument()
    // Check for the Go Home link
    expect(screen.getByRole('link', { name: /go home/i })).toBeInTheDocument()
  })
})
