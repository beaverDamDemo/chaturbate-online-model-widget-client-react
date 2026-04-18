import { Navigate, createBrowserRouter } from 'react-router-dom'
import App from '../App.tsx'
import { RequireAdmin } from '../features/auth/require-admin.tsx'
import { RequireAuth } from '../features/auth/require-auth.tsx'
import { ApiTestPage } from '../pages/api-test-page.tsx'
import { AdminPanelPage } from '../pages/admin-panel-page.tsx'
import { AccountPage } from '../pages/account-page.tsx'
import { FavoritesPage } from '../pages/favorites-page.tsx'
import { LoginPage } from '../pages/login-page.tsx'
import { RegisterPage } from '../pages/register-page.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <FavoritesPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'api-test',
        element: <ApiTestPage />,
      },
      {
        element: <RequireAuth />,
        children: [
          {
            // path: 'dashboard',
            // element: <StatusDashboardPage />,
          },
          // Removed /favorites route; now handled as index route
          {
            path: 'account',
            element: <AccountPage />,
          },
          {
            element: <RequireAdmin />,
            children: [
              {
                path: 'admin',
                element: <AdminPanelPage />,
              },
            ],
          },
        ],
      },
    ],
  },
])