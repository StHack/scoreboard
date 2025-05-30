import {
  Box,
  BoxPanel,
  ChartAchievementsOverTime,
  ChartActivityStats,
  ChartAttemptsOverTime,
  ChartAttemptsPanel,
  IconAchievement,
  IconAttempt,
  IconGame,
} from '@sthack/scoreboard-ui/components'
import { PageLoader } from 'components/PageLoader'
import { useStatisticsData } from 'hooks/useStatisticsData'

export function Statistics() {
  const { stats, achievements, attempts, loading, error, minDate, maxDate } =
    useStatisticsData()

  return (
    <PageLoader
      title="Statistics"
      icon={IconGame}
      showLoader={loading}
      error={error}
    >
      <BoxPanel title="Server activity Over time" titleIcon={IconGame}>
        {stats.length > 0 && <ChartActivityStats activityStats={stats} />}
        {stats.length === 0 && (
          <Box as="p">No data are available for this year</Box>
        )}
      </BoxPanel>

      {achievements.length > 0 && (
        <BoxPanel title="Achievements Over time" titleIcon={IconAchievement}>
          <ChartAchievementsOverTime
            achievements={achievements}
            minDate={minDate}
            maxDate={maxDate}
          />
        </BoxPanel>
      )}

      {attempts.length > 0 && (
        <BoxPanel title="Attempts Over time" titleIcon={IconAttempt}>
          <ChartAttemptsOverTime
            attempts={attempts}
            minDate={minDate}
            maxDate={maxDate}
          />
        </BoxPanel>
      )}

      {attempts.length > 0 && (
        <BoxPanel title="Attempts" titleIcon={IconAttempt}>
          <ChartAttemptsPanel attempts={attempts} />
        </BoxPanel>
      )}
    </PageLoader>
  )
}
