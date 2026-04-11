import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './auth-context.tsx'

export function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="glass-panel rounded-[2rem] p-8 text-sm text-stone-600 shadow-[0_24px_70px_rgba(146,64,14,0.12)]">
        Checking your session with the Spring Boot backend...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}