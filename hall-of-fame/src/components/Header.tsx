import styled from '@emotion/styled'
import {
  Box,
  IconLogo2023,
  IconLogo2024,
  IconLogo2025,
  Logo,
} from '@sthack/scoreboard-ui/components'
import { NavLink } from 'react-router-dom'
import { space, SpaceProps } from 'styled-system'
import { EditionLink } from './EditionLink'

export function Header() {
  return (
    <Box
      as="header"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      placeItems="center"
      backgroundColor="secondary"
      color="secondaryText"
      px="large"
      py="small"
    >
      <NavLink to="/" title="Homepage">
        <Logo size={2} color="secondaryText" />
      </NavLink>

      <nav>
        <Box display="flex" flexDirection="row" alignItems="center" as="ul">
          <EditionLink size={2} year={2025} logo={IconLogo2025} />
          <EditionLink size={2} year={2024} logo={IconLogo2024} />
          <EditionLink size={2} year={2023} logo={IconLogo2023} />
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
