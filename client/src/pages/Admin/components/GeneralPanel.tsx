import { Box } from 'components/Box'
import { BoxPanel } from 'components/BoxPanel'
import { ChartAchievementsOverTime } from 'components/Charts/ChartAchievementsOverTime'
import { ChartAttemptsPanel } from 'components/Charts/ChartAttempts'
import { ChartAttemptsOverTime } from 'components/Charts/ChartAttemptsOverTime'
import { useAdmin } from 'hooks/useAdmin'
import { ActivityStatisticsPanel } from './ActivityStatisticsPanel'
import { AnnouncementForm } from './AnnouncementForm'
import { GameStateForm } from './GameStateForm'
import { TeamSizeForm } from './TeamSizeForm'

export function GeneralPanel() {
  const { attempts } = useAdmin()

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
        <ChartAttemptsPanel />

        <ChartAttemptsOverTime />
      </BoxPanel>

      <BoxPanel
        gridArea="achievements"
        title="Achievements over time"
        display="grid"
        placeItems="center"
        gap="2"
      >
        <ChartAchievementsOverTime />
      </BoxPanel>
    </Box>
  )
}
