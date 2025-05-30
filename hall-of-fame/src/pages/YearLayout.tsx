import {
  Box,
  IconAchievement,
  IconChallenge,
  IconGame,
  IconUsers,
  Link,
} from '@sthack/scoreboard-ui/components'
import { Outlet } from 'react-router-dom'

export function YearLayout() {
  return (
    <Box
      width="100%"
      maxWidth="maximalCentered"
      justifySelf="center"
      display="grid"
      gridAutoFlow="row"
      alignItems="center"
      p="4"
      gap="4"
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
        <Link to="" end>
          <IconUsers color="currentColor" size="1.5em" />
          Teams
        </Link>
        <Link to="challenges">
          <IconChallenge color="currentColor" size="1.5em" />
          Challenges
        </Link>
        <Link to="stats">
          <IconGame color="currentColor" size="1.5em" />
          Statistics
        </Link>
      </Box>

      <Outlet />
    </Box>
  )
}
