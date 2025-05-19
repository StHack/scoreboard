import { UserRole } from '@sthack/scoreboard-common'
import { useAuth } from 'hooks/useAuthentication'
import { useGame } from 'hooks/useGame'
import { Box } from './Box'
import {
  IconAchievement,
  IconAttempt,
  IconChallenge,
  IconCreate,
  IconGame,
  IconPromote,
} from './Icon'
import { Link } from './Link'

export function Footer() {
  const { isAuthenticated, roles } = useAuth()
  const {
    gameConfig: { registrationOpened },
  } = useGame()

  return (
    <Box
      as="footer"
      display={['flex', 'none']}
      flexDirection="column"
      alignItems="stretch"
      backgroundColor="secondary"
      color="secondaryText"
      px="large"
      py="small"
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
        <Link to="/rules">
          <IconChallenge color="currentColor" size="1.5em" />
          Rules
        </Link>

        {isAuthenticated && (
          <Link to="/game" end>
            <IconGame color="currentColor" size="1.5em" />
            Game
          </Link>
        )}

        <Link to="/scoreboard">
          <IconAchievement color="currentColor" size="1.5em" />
          Scoreboard
        </Link>

        {roles.includes(UserRole.Admin) && (
          <Link to="/admin">
            <IconPromote color="currentColor" size="1.5em" />
            Admin
          </Link>
        )}

        {!isAuthenticated && registrationOpened && (
          <Link to="/auth/register">
            <IconCreate color="currentColor" size="1.5em" />
            Register
          </Link>
        )}
        {!isAuthenticated && (
          <Link to="/auth/login">
            <IconAttempt color="currentColor" size="1.5em" />
            Login
          </Link>
        )}
      </Box>
    </Box>
  )
}
