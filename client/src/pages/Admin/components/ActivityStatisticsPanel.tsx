import styled from '@emotion/styled'
import { Box } from 'components/Box'
import { BoxPanel } from 'components/BoxPanel'
import { ChartActivityStats } from 'components/Charts/ChartActivityStats'
import { useAdmin } from 'hooks/useAdmin'
import { GridAreaProps } from 'styled-system'

export function ActivityStatisticsPanel({ gridArea }: GridAreaProps) {
  const { activityStatistics } = useAdmin()
  return (
    <BoxPanel
      gridArea={gridArea}
      title="Server Statistics"
      display="grid"
      gridTemplateColumns="repeat(6, 1fr)"
      placeItems="center"
    >
      <Box as="h3" fontSize="2" gridColumn="span 6">
        Socket Statistics
      </Box>

      <Box as="span" gridColumn="span 2">
        Game socket: {activityStatistics.sockets.game}
      </Box>
      <Box as="span" gridColumn="span 2">
        Player socket: {activityStatistics.sockets.player}
      </Box>
      <Box as="span" gridColumn="span 2">
        Admin socket: {activityStatistics.sockets.admin}
      </Box>

      <Box as="h3" fontSize="2" mt="2" gridColumn="span 6">
        Game Statistics
      </Box>

      <Box as="span" gridColumn="span 3">
        Teams connected: {activityStatistics.teamCount}
      </Box>
      <Box as="span" gridColumn="span 3">
        Users connected: {activityStatistics.userCount}
      </Box>

      <Ul
        as="ul"
        gridColumn="span 6"
        placeSelf="stretch"
        display="grid"
        gridTemplateColumns={['1fr', '1fr 1fr', '1fr 1fr 1fr']}
        alignItems="start"
        gap="2"
      >
        {Object.entries(activityStatistics.teams).map(([team, stats]) => (
          <li key={team}>
            {team} ({stats.count} players)
            <Ul as="ul">
              {Object.entries(stats.users).map(([user, s]) => (
                <li key={user}>
                  {user} ({s.sockets} sockets)
                </li>
              ))}
            </Ul>
          </li>
        ))}
      </Ul>

      {activityStatistics.admins.length > 0 && (
        <>
          <Box as="h3" fontSize="2" mt="2" gridColumn="span 6">
            Admins connected
          </Box>
          <Ul
            as="ul"
            gridColumn="span 6"
            placeSelf="stretch"
            display="grid"
            gridTemplateColumns={['1fr', '1fr 1fr', '1fr 1fr 1fr']}
            alignItems="start"
            gap="2"
          >
            {activityStatistics.admins.map(admin => (
              <li key={admin}>{admin}</li>
            ))}
          </Ul>
        </>
      )}

      <Box gridColumn="span 6" width="100%">
        <ChartActivityStats />
      </Box>
    </BoxPanel>
  )
}

const Ul = styled(Box)`
  padding-inline-start: ${p => p.theme.space[3]};
`
