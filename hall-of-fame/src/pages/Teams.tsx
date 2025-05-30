import { IconUsers, TeamsScoreBoard } from '@sthack/scoreboard-ui/components'
import { PageLoader } from 'components/PageLoader'
import { useTeamData } from 'hooks/useTeamData'
import { useHref } from 'react-router-dom'

export function Teams() {
  const { loading, error, gameScore } = useTeamData()
  const href = useHref('team/:team')

  const hrefPattern = (teamScore: { team: string }) =>
    href.replace(':team', teamScore.team)

  return (
    <PageLoader
      title="Teams Scoreboard"
      icon={IconUsers}
      showLoader={loading}
      error={error}
    >
      <TeamsScoreBoard gameScore={gameScore} hrefPattern={hrefPattern} />
    </PageLoader>
  )
}
