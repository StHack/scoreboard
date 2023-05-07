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
      gap="2"
      p="2"
    >
      <TeamsScoreBoard teamsScore={teamsScore} challsScore={challsScore} />
      <ChallsScoreBoard score={challsScore} challenges={challenges} />
    </Box>
  )
}
