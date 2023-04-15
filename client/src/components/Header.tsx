import styled from '@emotion/styled'
import { useAuth } from 'hooks/useAuthentication'
import { NavLink } from 'react-router-dom'
import { Flex, Group, Header as MantineHeader, Text } from '@mantine/core'
import { ReactComponent as LogoSvg } from './Icon/images/Logo.svg'

export function Header () {
  const { user, isAuthenticated, isAuthorized, logOut } = useAuth()

  return (
    <MantineHeader
      height={{ base: 50, md: 70 }}
      bg={isAuthorized ? 'customPink.0' : 'customBlack.0'}
      px={'md'}
      py={'xs'}
    >
      <Flex align={'center'} h={'100%'} justify={'space-between'}>
        <NavLink to="/">
          <Logo />
        </NavLink>

        {user && (
          <Text color={'white'}>
            {user.username} / {user.team}
          </Text>
        )}

        <Group color={'white'}>
          <GameLink to="/scoreboard" label="Scoreboard" />
          <GameLink to="/rules" label="Rules" />
          <GameLink to="/admin" label="Admin" showIf={isAuthorized} />
          <GameLink to="/register" label="Register" showIf={!isAuthenticated} />
          <GameLink to="/login" label="Login" showIf={!isAuthenticated} />
          {isAuthenticated && (
            <NavButton onClick={logOut} style={{ cursor: 'pointer' }}>
              <Text variant={'link'} color={'white'}>
                Logout
              </Text>
            </NavButton>
          )}
        </Group>
      </Flex>
    </MantineHeader>
  )
}

const Logo = styled(LogoSvg)`
  width: 40px;
  fill: #ffffff;
`

const NavLinkStyled = styled(NavLink)<{ isActive?: boolean }>`
  color: white;
  text-decoration: ${p => (p.isActive ? 'underline' : 'none')};
`

const NavButton = styled.div`
  color: white;
  cursor: pointer;
`

type GameLinkProps = {
  to: string
  label: string
  showIf?: boolean
}

function GameLink ({ to, label, showIf = true }: GameLinkProps) {
  if (!showIf) return null

  return <NavLinkStyled to={to}>{label}</NavLinkStyled>
}
