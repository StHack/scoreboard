import {
  Box,
  IconAchievement,
  IconChallenge,
  Link,
} from '@sthack/scoreboard-ui/components'

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
        <Link to="/rules">
          <IconChallenge color="currentColor" size="1.5em" />
          Rules
        </Link>

        <Link to="/scoreboard">
          <IconAchievement color="currentColor" size="1.5em" />
          Scoreboard
        </Link>
      </Box>
    </Box>
  )
}
