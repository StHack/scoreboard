import {
  Box,
  IconToken,
  IconUsers,
  Link,
} from '@sthack/scoreboard-ui/components'
import { useAuth } from 'hooks/useAuthentication'
import { ProvidePlayer } from 'hooks/usePlayer'
import { PropsWithChildren } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export function AccountLayout() {
  const { isAuthenticated, hasReadRules } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  if (!hasReadRules) {
    return <Navigate to="/rules" replace />
  }

  return (
    <ProvidePlayer>
      <Player>
        <Outlet />
      </Player>
    </ProvidePlayer>
  )
}

export function Player({ children }: PropsWithChildren) {
  return (
    <Box
      display="flex"
      flexDirection={['column-reverse', 'column']}
      // maxWidth="maximalCentered"
      overflow="hidden"
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
        backgroundColor="background"
        borderY="solid"
        borderColor="secondary"
        borderWidth="medium"
        px="1"
      >
        {/* <Link to="/account" end>
          <IconPromote color="currentColor" size="1.5em" />
          General
        </Link> */}
        <Link to="/account/team">
          <IconUsers color="currentColor" size="1.5em" />
          Team
        </Link>
        <Link to="/account/tokens">
          <IconToken color="currentColor" size="1.5em" />
          Tokens
        </Link>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        maxWidth="maximalCentered"
        p="2"
        gap="3"
        margin="0 auto"
        width="100%"
        overflowY="auto"
        flex="1"
      >
        {children}
      </Box>
    </Box>
  )
}
