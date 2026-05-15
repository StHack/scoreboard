import { Achievement, ChallengeScore } from '@sthack/scoreboard-common'
import {
  Box,
  BoxPanel,
  ColumnDefinition,
  IconUsers,
  Table,
} from '@sthack/scoreboard-ui/components'

type ChallengeSolverCardPanelProps = {
  title?: string
  challScore: ChallengeScore
}
export function ChallengeSolverCardPanel({
  challScore,
  title = 'Challenge solvers',
}: ChallengeSolverCardPanelProps) {
  return (
    <BoxPanel title={title} titleIcon={IconUsers}>
      {challScore.achievements.length > 0 && (
        <Table
          data={challScore.achievements}
          columns={columns}
          rowKey={row => row.teamId + row.username}
        />
      )}
      {challScore.achievements.length === 0 && (
        <Box as="p" fontSize="1" p="3">
          Nobody has managed to solved that challenge
        </Box>
      )}
    </BoxPanel>
  )
}

export const columns: ColumnDefinition<Achievement>[] = [
  { header: 'Time', rowValue: row => row.createdAt.toLocaleTimeString() },
  { header: 'Player', rowValue: row => row.username },
  { header: 'Team', rowValue: row => row.team.name },
]
