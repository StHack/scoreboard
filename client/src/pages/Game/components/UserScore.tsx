import { useTheme } from '@emotion/react'
import { Box } from '@sthack/scoreboard-ui/components'
import { useGame } from 'hooks/useGame'
import { usePlayer } from 'hooks/usePlayer'

export function UserScore() {
  const { myScore, myTeamScore, myTeamRank, isBeforeLastScorer } = usePlayer()
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
        myTeamRank === 1 && myTeamScore > 0
          ? 'gold'
          : myTeamRank === 2 && myTeamScore > 0
            ? 'silver'
            : myTeamRank === 3 && myTeamScore > 0
              ? 'copper'
              : isBeforeLastScorer
                ? undefined
                : 'background'
      }
      background={
        myTeamRank > 3 && myTeamScore > 0 && isBeforeLastScorer
          ? beforeLastOne
          : undefined
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
      <span>{myTeamRank}</span>
      <span>Team score</span>
      <span>{myTeamScore}</span>
    </Box>
  )
}
