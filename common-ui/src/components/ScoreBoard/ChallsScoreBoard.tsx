import { useTheme } from '@emotion/react'
import { Challenge, ChallengeScore } from '@sthack/scoreboard-common'
import { Box } from '@sthack/scoreboard-ui/components'

export type ChallsScoreBoardProps = {
  challsScore: Record<string, ChallengeScore>
  challenges: Challenge[]
  hrefPattern?: (challenge: Challenge) => string
  onChallengeClick?: (challenge: Challenge) => void
}
export function ChallsScoreBoard({
  challsScore,
  challenges,
  hrefPattern,
  onChallengeClick,
}: ChallsScoreBoardProps) {
  const {
    edition: { card: ChallengeCard },
  } = useTheme()

  return (
    <Box display="flex" flexWrap="wrap" justifyContent="space-evenly" gap="2">
      {[...challenges]
        .sort((c1, c2) => challsScore[c2._id].score - challsScore[c1._id].score)
        .map(c => (
          <ChallengeCard
            key={c._id}
            challenge={c}
            score={challsScore[c._id]}
            currentTeam={challsScore[c._id].achievements[0]?.teamname}
            onClick={() => onChallengeClick?.(c)}
            size="12"
            // @ts-expect-error not a real one
            as={hrefPattern && 'a'}
            href={hrefPattern && hrefPattern(c)}
            placeItems="center"
            placeContent="center"
          />
        ))}
    </Box>
  )
}
