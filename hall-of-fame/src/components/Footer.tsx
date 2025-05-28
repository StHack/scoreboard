import { Box } from '@sthack/scoreboard-ui/components'
import { EditionLinks } from './EditionLink'

export function Footer() {
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
        <EditionLinks size="2" />
      </Box>
    </Box>
  )
}
