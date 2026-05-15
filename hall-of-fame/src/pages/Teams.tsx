import { Team } from '@sthack/scoreboard-common'
import { IconUsers, TeamsScoreBoard } from '@sthack/scoreboard-ui/components'
import { PageLoader } from 'components/PageLoader'
import { useTeamData } from 'hooks/useTeamData'
import { useHref } from 'react-router-dom'

export function Teams() {
  const { loading, error, gameScore } = useTeamData()
  const href = useHref('../team/:teamname')

  const hrefPattern = (teamScore: { team: Team }) =>
    href.replace(':teamname', teamScore.team.name)

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
