import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './auth-context.tsx'

export function RequireAdmin() {
  const { isAdmin, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="glass-panel rounded-[2rem] p-8 text-sm text-stone-600 shadow-[0_24px_70px_rgba(146,64,14,0.12)]">
        Checking admin access...
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}