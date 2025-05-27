import {
  Box,
  IconAchievement,
  IconChallenge,
  IconLogo2023,
  IconLogo2024,
  IconLogo2025,
  Link,
} from '@sthack/scoreboard-ui/components'
import { EditionLink } from './EditionLink'

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
        <EditionLink size={2} year={2025} logo={IconLogo2025} />
        <EditionLink size={2} year={2024} logo={IconLogo2024} />
        <EditionLink size={2} year={2023} logo={IconLogo2023} />
      </Box>
    </Box>
  )
}
