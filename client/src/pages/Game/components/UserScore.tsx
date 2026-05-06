import { useTheme } from '@emotion/react'
import { Box } from '@sthack/scoreboard-ui/components'
import { useGame } from 'hooks/useGame'
import { usePlayer } from 'hooks/usePlayer'

export function UserScore() {
  const {
    myScore,
    myTeamScore: { rank, score },
    isBeforeLastScorer,
  } = usePlayer()
  const {
    colors: { beforeLastOne },
  } = useTheme()

  const {
    gameConfig: { isNoCompetition },
  } = useGame()

  if (isNoCompetition) {
    return undefined
  }

  return (
    <Box
      gridArea="score"
      fontSize={[2, 3]}
      mt={[2, 3]}
      py="2"
      px={[2, 4]}
      rowGap="2"
      columnGap={[0, 3]}
      placeSelf="center"
      backgroundColor={
        rank === 1 && score > 0
          ? 'gold'
          : rank === 2 && score > 0
            ? 'silver'
            : rank === 3 && score > 0
              ? 'copper'
              : isBeforeLastScorer
                ? undefined
                : 'background'
      }
      background={
        rank > 3 && score > 0 && isBeforeLastScorer ? beforeLastOne : undefined
      }
      color="primaryText"
      borderRadius="medium"
      display="grid"
      gridTemplateColumns="repeat(3, 1fr)"
      gridTemplateRows="repeat(2, 1fr)"
      gridAutoFlow="column"
      justifyItems="center"
      textAlign="center"
    >
      <span>Your score</span>
      <span>{myScore}</span>
      <span>Rank</span>
      <span>{rank}</span>
      <span>Team score</span>
      <span>{score}</span>
    </Box>
  )
}
