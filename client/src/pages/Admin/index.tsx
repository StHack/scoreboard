import { UserRole } from '@sthack/scoreboard-common'
import { Box } from 'components/Box'
import {
  IconAchievement,
  IconAttempt,
  IconChallenge,
  IconGame,
  IconUsers,
} from 'components/Icon'
import { Link } from 'components/Link'
import { ProvideAdmin } from 'hooks/useAdmin'
import { useAuth } from 'hooks/useAuthentication'
import { PropsWithChildren } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export function AdminLayout() {
  const { isAuthenticated, roles } = useAuth()

  if (!isAuthenticated || !roles.includes(UserRole.Admin)) {
    return <Navigate to="/" replace />
  }

  return (
    <ProvideAdmin>
      <Admin>
        <Outlet />
      </Admin>
    </ProvideAdmin>
  )
}

export function Admin({ children }: PropsWithChildren) {
  return (
    <Box
      display="flex"
      flexDirection={['column-reverse', 'column']}
      // maxWidth="maximalCentered"
      overflow="hidden"
      px="2"
      margin="0 auto"
      width="100%"
      height="100%"
    >
      <Box
        as="nav"
        display="flex"
        flexDirection="row"
        justifyContent={['space-around', 'center']}
        gap={[1, 2]}
        overflowX="auto"
        px="1"
      >
        <Link to="/admin" end>
          <IconGame color="currentColor" size="1.5em" />
          General
        </Link>
        <Link to="/admin/challenges">
          <IconChallenge color="currentColor" size="1.5em" />
          Challenges
        </Link>
        <Link to="/admin/users">
          <IconUsers color="currentColor" size="1.5em" />
          Users
        </Link>
        <Link to="/admin/achievements">
          <IconAchievement color="currentColor" size="1.5em" />
          Achievements
        </Link>
        <Link to="/admin/attempts">
          <IconAttempt color="currentColor" size="1.5em" />
          Attempts
        </Link>
      </Box>

      <Box display="grid" flex="1" pt="2" overflowY="auto">
        {children}
      </Box>
    </Box>
  )
}
