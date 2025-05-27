import styled from '@emotion/styled'
import { Box, Icon, Link } from '@sthack/scoreboard-ui/components'
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
  return (
    <SLink to={`/year/${year}`} flexDirection="column">
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
