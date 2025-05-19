import styled from '@emotion/styled'
import { UserRole } from '@sthack/scoreboard-common'
import { useAuth } from 'hooks/useAuthentication'
import { NavLink } from 'react-router-dom'
import { space, SpaceProps } from 'styled-system'
import { Box } from './Box'
import { Button } from './Button'
import { IconLogout, Logo } from './Icon'

export function Header() {
  const { user, isAuthenticated, roles, logOut } = useAuth()

  return (
    <Box
      as="header"
      display="flex"
      flexDirection="row"
      justifyContent={isAuthenticated ? 'space-between' : 'center'}
      placeItems="center"
      backgroundColor="secondary"
      color="secondaryText"
      px="large"
      py="small"
    >
      <NavLink to="/" title="Homepage">
        <Logo size={2} color="secondaryText" />
      </NavLink>

      {user && (
        <GameLink to="/game" label={`${user.username} / ${user.team}`} />
      )}

      <nav>
        <Box display="flex" flexDirection="row" alignItems="center" as="ul">
          <GameLink to="/scoreboard" label="Scoreboard" />
          <GameLink to="/rules" label="Rules" />
          {roles.includes(UserRole.Admin) && (
            <GameLink to="/admin" label="Admin" />
          )}
          {!isAuthenticated && (
            <GameLink to="/auth/register" label="Register" />
          )}
          {!isAuthenticated && <GameLink to="/auth/login" label="Login" />}

          {isAuthenticated && (
            <Box as="li" display="flex">
              <Button
                variant="link"
                onClick={logOut}
                type="button"
                icon={IconLogout}
                responsiveLabel
                color="secondaryText"
                fontWeight="normal"
                fontSize="0"
              >
                Logout
              </Button>
            </Box>
          )}
        </Box>
      </nav>
    </Box>
  )
}

const NavLinkStyled = styled(NavLink)<SpaceProps>`
  color: inherit;
  text-decoration: none;
  ${space}

  &.active {
    text-decoration: underline;
  }
`

type GameLinkProps = { to: string; label: string; hideOnMobile?: boolean }
function GameLink({ to, label }: GameLinkProps) {
  return (
    <Box as="li" display={['none', 'flex']}>
      <NavLinkStyled to={to} p="2">
        {label}
      </NavLinkStyled>
    </Box>
  )
}
