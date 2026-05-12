import {
  BoxPanel,
  ChallengeCardPanel,
  ChallengeSolverCardPanel,
  ChartAchievementsOverTime,
  ChartAttemptsOverTime,
  IconAchievement,
  IconAttempt,
  IconChallenge,
} from '@sthack/scoreboard-ui/components'
import { PageLoader } from 'components/PageLoader'
import { useChallengeData } from 'hooks/useChallengeData'
import { useParams } from 'react-router-dom'

export function ChallengeDetail() {
  const { challengeId } = useParams()
  const { attempts, challScore, loading, error, minDate, maxDate, gameScore } =
    useChallengeData(challengeId)

  const { challenge } = challScore

  return (
    <PageLoader
      title={`Challenge ${challenge.name}`}
      icon={IconChallenge}
      showLoader={loading}
      error={error}
    >
      <ChallengeCardPanel
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
    </PageLoader>
  )
}
