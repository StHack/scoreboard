import { Loader } from '@sthack/scoreboard-ui/components'
import { useAuth } from 'hooks/useAuthentication'
import { PropsWithChildren } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export function AuthLayout() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export function AuthLoader({ children }: PropsWithChildren) {
  const { isLoading } = useAuth()

  if (isLoading) {
    return <Loader size="10" placeSelf="center" />
  }

  return children
}
