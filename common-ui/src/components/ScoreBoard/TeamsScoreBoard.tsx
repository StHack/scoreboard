import { GameConfig, GameScore, TeamScore } from '@sthack/scoreboard-common'
import { Box } from '@sthack/scoreboard-ui/components'
import { ScoreCard } from './ScoreCard'

export type TeamsScoreBoardProps = {
  gameScore: GameScore
  hrefPattern?: (teamScore: TeamScore) => string
}
export function TeamsScoreBoard({
  gameScore: { teamsScore, challsScore, beforeLastScorer, config },
  hrefPattern,
}: TeamsScoreBoardProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="2"
      alignItems="center"
      padding="2"
    >
      {teamsScore.map(ts => (
        <ScoreCard
          key={ts.team}
          teamScore={ts}
          challsScore={challsScore}
          isBeforeLastScorer={ts === beforeLastScorer}
          gameConfig={config}
          href={hrefPattern && hrefPattern(ts)}
        />
      ))}
    </Box>
  )
}
