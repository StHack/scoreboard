import { useAuth } from 'hooks/useAuthentication'
import { Navigate, Outlet } from 'react-router-dom'

export function AuthLayout() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
