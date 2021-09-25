import styled from '@emotion/styled'
import { User } from 'models/User'
import { space, SpaceProps } from 'styled-system'
import { Box } from './Box'
import { Button } from './Button'

type HeaderProps = {
  user?: User
  logout: () => void
  admin: () => void
}
export function Header ({ user, logout, admin }: HeaderProps) {
  return (
    <HeaderBlock px="large" py="small">
      <span>StHack 2021</span>
      {user && (
        <span>
          {user.username} / {user.team}
        </span>
      )}
      <Box display="flex" flexDirection="row">
        {user?.isAdmin && <Button onClick={admin}>Admin</Button>}
        {user && <Button onClick={logout}>Logout</Button>}
      </Box>
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
