import { Challenge } from '@sthack/scoreboard-common'
import {
  ChallsScoreBoard,
  IconChallenge,
} from '@sthack/scoreboard-ui/components'
import { PageLoader } from 'components/PageLoader'
import { useChallengeData } from 'hooks/useChallengeData'
import { useHref } from 'react-router-dom'

export function Challenges() {
  const { loading, error, gameScore, challenges } = useChallengeData()
  const href = useHref('../challenge/:challengeId')

  const hrefPattern = (challenge: Challenge) =>
    href.replace(':challengeId', challenge._id)

  return (
    <PageLoader
      title="Challenges ScoreBoard"
      icon={IconChallenge}
      showLoader={loading}
      error={error}
    >
      <ChallsScoreBoard
        challsScore={gameScore.challsScore}
        challenges={challenges}
        hrefPattern={hrefPattern}
      />
    </PageLoader>
  )
}
