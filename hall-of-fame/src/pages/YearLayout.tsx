import {
  Box,
  getEditionTheme,
  IconChallenge,
  IconGame,
  IconUsers,
  Link,
} from '@sthack/scoreboard-ui/components'
import { ProvideTheme } from '@sthack/scoreboard-ui/styles'
import { Outlet, useParams } from 'react-router-dom'

export function YearLayout() {
  const { year } = useParams()
  return (
    <ProvideTheme edition={getEditionTheme(Number(year))}>
      <Box
        width="100%"
        maxWidth="maximalCentered"
        justifySelf="center"
        display="flex"
        flexDirection="column"
        alignItems="stretch"
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
          <Link to="statistics">
            <IconGame color="currentColor" size="1.5em" />
            Statistics
          </Link>
        </Box>

        <Outlet />
      </Box>
    </ProvideTheme>
  )
}
