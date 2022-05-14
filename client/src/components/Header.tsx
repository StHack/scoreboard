import styled from '@emotion/styled'
import { useAuth } from 'hooks/useAuthentication'
import { NavLink, useLocation } from 'react-router-dom'
import { space, SpaceProps } from 'styled-system'
import { Box } from './Box'
import { Logo } from './Icon'

export function Header () {
  const { user, isAuthenticated, isAuthorized, logOut } = useAuth()
  const location = useLocation()
  return (
    <HeaderBlock px='large' py='small'>
      <NavLink to='/'>
        <Logo size={2} color='secondaryText' />
      </NavLink>

      {user && (
        <span>
          {user.username} / {user.team}
        </span>
      )}

      <nav>
        <Box display='flex' flexDirection='row' as='ul'>
          <GameLink to='/scoreboard' label='Scoreboard' isAuthorized={isAuthorized} />
          <GameLink to='/rules' label='Rules' isAuthorized={isAuthorized} />
          <GameLink to='/admin' label='Admin panel' showIf={isAuthorized} isAuthorized={isAuthorized} />
          <GameLink to='/register' label='Register' showIf={!isAuthenticated && location.pathname === '/login'}
                    isAuthorized={isAuthorized} />
          <GameLink to='/login' label='Login' showIf={!isAuthenticated && location.pathname !== '/login'}
                    isAuthorized={isAuthorized} />

          {isAuthenticated && (
            <NavItem>
              <NavButton onClick={logOut} type='button'>
                Logout
              </NavButton>
            </NavItem>
          )}
        </Box>
      </nav>
    </HeaderBlock>
  )
}

const HeaderBlock = styled.header<SpaceProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  place-items: center;
  background-color: ${p => p.theme.colors.secondary};
  color: ${p => p.theme.colors.secondaryText};
  ${space}
`

const NavItem = styled.li<SpaceProps>`
  display: flex;
`

const NavLinkStyled = styled(NavLink)<SpaceProps & { isActive?: boolean, isAuthorized: boolean }>`
  color: ${p => p.theme.colors.secondaryText};
  text-decoration: none;
  ${space};
  text-decoration: ${p => p.isActive ? 'underline' : ''};

  &:hover {
    color: ${p => p.isAuthorized ? p.theme.colors.primaryText : p.theme.colors.blue};
  }
`

const NavButton = styled.button<SpaceProps>`
  color: ${p => p.theme.colors.secondaryText};
  cursor: pointer;
  ${space};
  padding: ${p => p.theme.space.medium};

  &:hover {
    color: ${p => p.theme.colors.primaryText}
  }
`

type GameLinkProps = {
  to: string
  label: string
  showIf?: boolean
  isAuthorized: boolean
}

function GameLink ({ to, label, showIf = true, isAuthorized = false }: GameLinkProps) {
  if (!showIf) return null

  return (
    <NavItem>
      <NavLinkStyled isAuthorized={isAuthorized} to={to} p='2'>
        {label}
      </NavLinkStyled>
    </NavItem>
  )
}
