import {
  Box,
  BoxPanel,
  ChartAchievementsOverTime,
  ChartAttemptsOverTime,
  ChartAttemptsPanel,
} from '@sthack/scoreboard-ui/components'
import { useAdmin } from 'hooks/useAdmin'
import { useGame } from 'hooks/useGame'
import { ActivityStatisticsPanel } from './ActivityStatisticsPanel'
import { AnnouncementForm } from './AnnouncementForm'
import { GameStateForm } from './GameStateForm'
import { TeamSizeForm } from './TeamSizeForm'

export function GeneralPanel() {
  const { attempts } = useAdmin()
  const { achievements } = useGame()

  return (
    <Box
      display={['flex', 'grid']}
      flexDirection="column"
      maxWidth="maximalCentered"
      px="2"
      gap="3"
      margin="0 auto"
      width="100%"
      gridTemplateColumns="min-content 3fr"
      gridTemplateAreas={`
        "msg    sstats"
        "gstate sstats"
        "tsize  sstats"
        ".      sstats"
        ".      attempts"
        ".      achievements"
      `}
    >
      <AnnouncementForm gridArea="msg" />

      <TeamSizeForm gridArea="tsize" />

      <GameStateForm gridArea="gstate" />

      <ActivityStatisticsPanel gridArea="sstats" />

      <BoxPanel
        gridArea="attempts"
        title={`Attempts by challs and teams (last ${attempts.length})`}
        display="grid"
        placeItems="center"
        gap="2"
      >
        <ChartAttemptsPanel attempts={attempts} />

        <ChartAttemptsOverTime attempts={attempts} />
      </BoxPanel>

      <BoxPanel
        gridArea="achievements"
        title="Achievements over time"
        display="grid"
        placeItems="center"
        gap="2"
      >
        <ChartAchievementsOverTime achievements={achievements} />
      </BoxPanel>
    </Box>
  )
}
