import { Achievement, Challenge, User } from '@sthack/scoreboard-common'
import {
  Box,
  BoxPanel,
  Button,
  ChartAchievementsOverTime,
  ChartAttemptsOverTime,
  ColumnDefinition,
  IconAchievement,
  IconLogo2023Icon,
  IconUsers,
  ScoreCard,
  Table,
} from '@sthack/scoreboard-ui/components'
import { PageLoader } from 'components/PageLoader'
import { useTeamData } from 'hooks/useTeamData'
import { useMemo } from 'react'
import { useHref, useParams } from 'react-router-dom'

type PlayerStats = {
  player: User
  contributedScore: number
  breakthroughs: Achievement[]
  solved: Achievement[]
}

const playerStatsColumn: ColumnDefinition<PlayerStats>[] = [
  { header: 'User', rowValue: row => row.player.username },
  {
    header: 'Individual Score',
    rowValue: row => row.contributedScore.toLocaleString(),
  },
]

export function TeamDetail() {
  const { team } = useParams()
  const {
    attempts,
    users,
    gameScore,
    teamScore: score,
    loading,
    error,
    minDate,
    maxDate,
  } = useTeamData(team)

  const playerStats = useMemo(() => {
    const players = users.filter(u => u.team === team)

    return players
      .map<PlayerStats>(player => {
        const solved =
          score?.solved.filter(a => a.username === player.username) ?? []
        const breakthroughs =
          score?.breakthroughs.filter(a => a.username === player.username) ?? []
        const contributedScore = solved.reduce(
          (sum, a) => sum + (gameScore.challsScore[a.challengeId]?.score ?? 0),
          0,
        )

        return {
          player,
          contributedScore,
          breakthroughs,
          solved,
        }
      })
      .sort((a, b) => b.contributedScore - a.contributedScore)
  }, [users, team, gameScore, score])

  return (
    <PageLoader
      title={`Team ${team} results`}
      icon={IconUsers}
      showLoader={loading}
      error={error}
    >
      <Box display="grid" placeContent="stretch" placeItems="center">
        <ScoreCard
          challsScore={gameScore.challsScore}
          teamScore={score}
          isBeforeLastScorer={score === gameScore.beforeLastScorer}
          showDetail
        />
      </Box>

      <BoxPanel title="Players details" titleIcon={IconUsers}>
        <Table
          data={playerStats}
          columns={playerStatsColumn}
          rowKey={row => row.player.username}
          actions={PlayerStatsActions}
        />
      </BoxPanel>

      {score.solved.length > 0 && (
        <BoxPanel title="Achievements Over time" titleIcon={IconAchievement}>
          <ChartAchievementsOverTime
            achievements={score.solved}
            defaultGroup="user"
            minDate={minDate}
            maxDate={maxDate}
          />
        </BoxPanel>
      )}

      {attempts.length > 0 && (
        <BoxPanel title="Failed Attempts Over time" titleIcon={IconAchievement}>
          <ChartAttemptsOverTime
            attempts={attempts}
            defaultGroup="user"
            minDate={minDate}
            maxDate={maxDate}
          />
        </BoxPanel>
      )}
    </PageLoader>
  )
}

type PlayerStatsActionsProps = {
  row: PlayerStats
}
function PlayerStatsActions({
  row: { breakthroughs, solved },
}: PlayerStatsActionsProps) {
  const { year } = useParams()
  const href = useHref(`/year/${year}/challenge/:challengeId`)

  const hrefPattern = (challenge: Challenge) =>
    href.replace(':challengeId', challenge._id)

  return (
    <Box as="nav" display="flex" flexWrap="wrap" justifyContent="center">
      {breakthroughs
        .sort((a, b) => a.challenge.name.localeCompare(b.challenge.name))
        .map((b, i) => (
          <Button
            key={i}
            size="2"
            icon={IconLogo2023Icon}
            title={b.challenge.name}
            href={hrefPattern(b.challenge)}
            variant="link"
          />
        ))}
      {solved
        .sort((a, b) => a.challenge.name.localeCompare(b.challenge.name))
        .map((s, i) => (
          <Button
            key={i}
            size="2"
            icon={IconAchievement}
            title={s.challenge.name}
            href={hrefPattern(s.challenge)}
            variant="link"
          />
        ))}
    </Box>
  )
}
