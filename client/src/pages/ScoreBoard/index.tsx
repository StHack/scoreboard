import { Box } from 'components/Box'
import { useGame } from 'hooks/useGame'
import { ChallsScoreBoard } from './components/ChallsScoreBoard'
import { TeamsScoreBoard } from './components/TeamsScoreBoard'

export function ScoreBoard () {
  const {
    score: { challsScore, teamsScore },
    challenges,
  } = useGame()

  return (
    <Box
      display={['flex', 'grid']}
      alignItems={['stretch', 'start']}
      flexDirection="column"
      gridTemplateColumns="3fr 1fr"
      gap="4"
      p="2"
    >
      <Box as="h2" fontSize="4" gridArea="1/1" placeSelf="center" pt="3">
        Team scoreboard
      </Box>
      <TeamsScoreBoard teamsScore={teamsScore} challsScore={challsScore} />

      <Box as="h2" fontSize="4" gridArea="1/2" placeSelf="center" pt="3">
        Challenges
      </Box>
      <ChallsScoreBoard challsScore={challsScore} challenges={challenges} />
    </Box>
  )
}
