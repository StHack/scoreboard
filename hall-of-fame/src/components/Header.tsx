import { Box, Link, Logo } from '@sthack/scoreboard-ui/components'
import { EditionLinks } from './EditionLink'

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
      <Link to="/" title="Homepage">
        <Logo size={2} color="secondaryText" />
      </Link>

      <Box display="flex" flexDirection="row" alignItems="center" as="nav">
        <EditionLinks size={2} />
      </Box>
    </Box>
  )
}
