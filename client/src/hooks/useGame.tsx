import { Achievement } from 'models/Achievement'
import { Challenge } from 'models/Challenge'
import { GameConfig } from 'models/GameConfig'
import { GameScore } from 'models/GameScore'
import { Message } from 'models/Message'
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { computeGameScore } from 'services/score'
import { useSocket } from './useSocket'

export type GameContext = {
  challenges: Challenge[]
  messages: Message[]
  score: GameScore
  gameConfig: GameConfig
}

const gameContext = createContext<GameContext>({
  challenges: [],
  messages: [],
  score: {
    challsScore: {},
    teamsScore: [],
  },
  gameConfig: { baseChallScore: 0, solveDelay: 0, teamCount: 0, teamSize: 0 },
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
  const [messages, setMessages] = useState<Message[]>([])
  const [teams, setTeams] = useState<string[]>([])
  const [gameConfig, setGameConfig] = useState<GameConfig>({
    solveDelay: 10,
    teamCount: 0,
    baseChallScore: 0,
    teamSize: 0,
  })

  useEffect(() => {
    if (!socket) return

    socket.emit('game:config', (config: GameConfig) => {
      setGameConfig(config)
    })

    socket.emit('challenge:list', (response: Challenge[]) => {
      setChallenges([...response])
    })

    socket.emit('achievement:list', (response: Achievement[]) => {
      setAchievements(
        response.map(a => ({ ...a, createdAt: new Date(a.createdAt) })),
      )
    })

    socket.emit('game:messages', (response: Message[]) => {
      setMessages(
        response.map(a => ({ ...a, createdAt: new Date(a.createdAt) })),
      )
    })

    socket.emit('game:teams', (response: string[]) => {
      setTeams([...response])
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
      setAchievements(a => [
        ...a,
        { ...achievement, createdAt: new Date(achievement.createdAt) },
      ])
    })

    socket.on('game:newMessage', (message: Message) => {
      setMessages(m => [
        ...m,
        { ...message, createdAt: new Date(message.createdAt) },
      ])
    })

    socket.on('game:ended', () => {
      setChallenges(challs => challs.map(c => ({ ...c, isOpen: false })))
    })

    socket.on('game:config:updated', (config: GameConfig) => {
      setGameConfig(config)
    })

    return () => {
      socket.off('challenge:added')
      socket.off('challenge:updated')
      socket.off('achievement:added')
      socket.off('game:newMessage')
    }
  }, [socket])

  return {
    challenges,
    messages,
    score: computeGameScore(achievements, challenges, teams, gameConfig),
    gameConfig,
  }
}
