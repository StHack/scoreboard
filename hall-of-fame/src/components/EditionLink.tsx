import styled from '@emotion/styled'
import {
  Box,
  Icon,
  IconLogo2023,
  IconLogo2024,
  IconLogo2025,
  Link,
  Logo,
} from '@sthack/scoreboard-ui/components'
import { useLocation } from 'react-router-dom'
import { SizeProps } from 'styled-system'

export type EditionLinkProps = {
  year: number
  logo: Icon
}

export function EditionLink({
  year,
  logo: Icon,
  size = '13',
}: EditionLinkProps & SizeProps) {
  const location = useLocation()

  const route = location.pathname.startsWith('/year/')
    ? location.pathname.replace(/^\/year\/\d*/, `/year/${year}`)
    : `/year/${year}`

  return (
    <SLink to={route} flexDirection="column">
      <Icon size={size} />
      <Box as="span">{`${year}`}</Box>
    </SLink>
  )
}

const SLink = styled(Link)`
  svg {
    filter: drop-shadow(-1px 6px 3px hsl(0deg 0% 0% / 80%));
  }
`

export function EditionLinks(props: SizeProps) {
  return (
    <>
      <EditionLink {...props} year={2025} logo={IconLogo2025} />
      <EditionLink {...props} year={2024} logo={IconLogo2024} />
      <EditionLink {...props} year={2023} logo={IconLogo2023} />
      <EditionLink {...props} year={2022} logo={Logo} />
      <EditionLink {...props} year={2021} logo={Logo} />
    </>
  )
}
