import { Box } from 'components/Box'
import { useGame } from 'hooks/useGame'
import { ChallsScoreBoard } from './components/ChallsScoreBoard'
import { TeamsScoreBoard } from './components/TeamsScoreBoard'

export function ScoreBoard() {
  const {
    score: { challsScore, teamsScore },
    challenges,
  } = useGame()

  const challsUnsolved =
    challenges.length -
    Object.values(challsScore).filter(cs => cs.achievements.length).length

  const teamScored = teamsScore.filter(ts => ts.score > 0).length

  return (
    <Box
      display={['flex', 'grid']}
      alignItems={['stretch', 'start']}
      flexDirection="column"
      gridTemplateColumns="3fr 1fr"
      gap="4"
      p="2"
    >
      <Box
        as="h2"
        fontSize="4"
        gridArea="1/1"
        placeSelf="center"
        textAlign="center"
        pt="3"
      >
        Team scoreboard
        <Box as="h3" fontSize="3">
          {teamScored} scorers - {teamsScore.length} teams
        </Box>
      </Box>
      <TeamsScoreBoard teamsScore={teamsScore} challsScore={challsScore} />

      <Box
        as="h2"
        fontSize="4"
        gridArea="1/2"
        placeSelf="center"
        textAlign="center"
        pt="3"
      >
        Challenges
        <Box as="h3" fontSize="3">
          {challsUnsolved} remaining from {challenges.length}
        </Box>
      </Box>
      <ChallsScoreBoard challsScore={challsScore} challenges={challenges} />
    </Box>
  )
}
