import { Achievement } from 'models/Achievement'
import { Challenge } from 'models/Challenge'
import { GameConfig } from 'models/GameConfig'
import { GameScore } from 'models/GameScore'
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { computeGameScore } from 'services/score'
import { useAuth } from './useAuthentication'
import { useSocket } from './useSocket'

export type GameContext = {
  challenges: Challenge[]
  score: GameScore
  gameConfig: GameConfig
}

const gameContext = createContext<GameContext>({
  challenges: [],
  score: {
    myScore: 0,
    teamScore: 0,
    challScore: {},
  },
  gameConfig: { baseChallScore: 0, solveDelay: 0, teamCount: 0 },
})

export function ProvideGame ({ children }: PropsWithChildren<{}>) {
  const game = useProvideGame()
  return <gameContext.Provider value={game}>{children}</gameContext.Provider>
}

export const useGame = () => {
  return useContext(gameContext)
}

function useProvideGame (): GameContext {
  const { socket } = useSocket('/api/game')
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [gameConfig, setGameConfig] = useState<GameConfig>({
    solveDelay: 10,
    teamCount: 0,
    baseChallScore: 0,
  })
  const { user } = useAuth()

  useEffect(() => {
    if (!socket) return

    socket.emit('game:config', (config: GameConfig) => {
      setGameConfig(config)
    })

    socket.emit('challenge:list', (response: Challenge[]) => {
      setChallenges([...response])
    })

    socket.emit('achievement:list', (response: Achievement[]) => {
      setAchievements([...response])
    })

    socket.on('challenge:added', chall =>
      setChallenges(challs => [...challs, chall]),
    )

    socket.on('challenge:updated', challUpdated =>
      setChallenges(challs =>
        challs.map(c => (c.name === challUpdated.name ? challUpdated : c)),
      ),
    )

    socket.on('achievement:added', (achievement: Achievement) => {
      setAchievements(a => [...a, achievement])
    })

    return () => {
      socket.off('challenge:added')
      socket.off('challenge:updated')
      socket.off('achievement:added')
    }
  }, [socket])

  return {
    challenges,
    score: computeGameScore(achievements, challenges, gameConfig, user!),
    gameConfig,
  }
}
