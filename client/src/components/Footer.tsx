import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { useAuth } from 'hooks/useAuthentication'
import { useGame } from 'hooks/useGame'
import { NavLink } from 'react-router-dom'
import {
  display,
  DisplayProps,
  flexbox,
  FlexboxProps,
  fontSize,
  FontSizeProps,
  space,
  SpaceProps,
} from 'styled-system'
import { cleanStyledSystem, gap, GapProps } from 'styles'
import { Box } from './Box'
import {
  IconAchievement,
  IconAttempt,
  IconChallenge,
  IconCreate,
  IconGame,
  IconPromote,
} from './Icon'

export function Footer() {
  const { isAuthenticated, isAuthorized } = useAuth()
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
      <nav>
        <Box
          as="ul"
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
            <Link to="/" end>
              <IconGame color="currentColor" size="1.5em" />
              Game
            </Link>
          )}

          <Link to="/scoreboard">
            <IconAchievement color="currentColor" size="1.5em" />
            Scoreboard
          </Link>

          {isAuthorized && (
            <Link to="/admin">
              <IconPromote color="currentColor" size="1.5em" />
              Admin
            </Link>
          )}

          {!isAuthenticated && registrationOpened && (
            <Link to="/register">
              <IconCreate color="currentColor" size="1.5em" />
              Register
            </Link>
          )}
          {!isAuthenticated && (
            <Link to="/login">
              <IconAttempt color="currentColor" size="1.5em" />
              Login
            </Link>
          )}
        </Box>
      </nav>
    </Box>
  )
}

const Link = styled(NavLink, cleanStyledSystem)<
  SpaceProps & FontSizeProps & DisplayProps & FlexboxProps & GapProps
>(
  space,
  fontSize,
  display,
  flexbox,
  gap,
  css`
    color: inherit;
    text-decoration: none;

    &.active {
      text-decoration: underline;
    }
  `,
)
Link.defaultProps = {
  display: 'flex',
  flexDirection: ['column', 'row'],
  alignItems: 'center',
  fontSize: [0, 2, 3],
  px: [1, 2, 3],
  py: 2,
  gap: [1, 2],
}
