import {
  BoxPanel,
  ChallengeDetailCardPanel,
  ChallengeSolverCardPanel,
  ChartAchievementsOverTime,
  ChartAttemptsOverTime,
  ChartSurveys,
  IconAchievement,
  IconAttempt,
  IconChallenge,
} from '@sthack/scoreboard-ui/components'
import { PageLoader } from 'components/PageLoader'
import { useChallengeData } from 'hooks/useChallengeData'
import { useParams } from 'react-router-dom'

export function ChallengeDetail() {
  const { challengeId } = useParams()
  const {
    attempts,
    challScore,
    loading,
    error,
    minDate,
    maxDate,
    gameScore,
    surveys,
  } = useChallengeData(challengeId)

  const { challenge } = challScore

  return (
    <PageLoader
      title={`Challenge ${challenge.name}`}
      icon={IconChallenge}
      showLoader={loading}
      error={error}
    >
      <ChallengeDetailCardPanel
        challenge={challenge}
        challScore={challScore}
        gameConfig={gameScore.config}
        disableLink
      />

      <ChallengeSolverCardPanel challScore={challScore} />

      {challScore.achievements.length > 0 && (
        <BoxPanel title="Achievements Over time" titleIcon={IconAchievement}>
          <ChartAchievementsOverTime
            achievements={challScore.achievements}
            defaultGroup="team"
            minDate={minDate}
            maxDate={maxDate}
          />
        </BoxPanel>
      )}

      {attempts.length > 0 && (
        <BoxPanel title="Failed Attempts Over time" titleIcon={IconAttempt}>
          <ChartAttemptsOverTime
            attempts={attempts}
            defaultGroup="team"
            minDate={minDate}
            maxDate={maxDate}
          />
        </BoxPanel>
      )}

      {surveys.length > 0 && (
        <BoxPanel title="Survey results from solvers">
          <ChartSurveys surveys={surveys} />
        </BoxPanel>
      )}
    </PageLoader>
  )
}
