import { Box } from 'components/Box'
import { useGame } from 'hooks/useGame'
import { ChallengeCard } from './components/ChallengeCard'

export function Game () {
  const {
    challenges,
    score: { challScore },
  } = useGame()

  return (
    <Box display="flex" flexWrap="wrap">
      {challenges.map(c => (
        <ChallengeCard
          key={c.name}
          challenge={c}
          score={challScore[c.name]}
          onClick={() => alert(c.name)}
        />
      ))}
    </Box>
  )
}
