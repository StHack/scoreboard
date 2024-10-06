import {
  Achievement,
  Challenge,
  computeGameScore,
  GameConfig,
  GameScore,
  Message,
  Reward,
} from '@sthack/scoreboard-common'
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useSocket } from './useSocket'

export type GameContext = {
  loadingState: GameContextLoadingState
  challenges: Challenge[]
  achievements: Achievement[]
  messages: Message[]
  rewards: Reward[]
  score: GameScore
  gameConfig: GameConfig
  isLoaded: (state: GameContextLoadingState) => boolean
}

export enum GameContextLoadingState {
  none = 0,
  // eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member
  challenges = 1 << 0,
  // eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member
  config = 1 << 1,
  // eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member
  achievements = 1 << 2,
  // eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member
  rewards = 1 << 3,
  // eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member
  messages = 1 << 4,
  // eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member
  teams = 1 << 5,
}

const defaultGameConfig = {
  registrationOpened: false,
  gameOpened: false,
  baseChallScore: 0,
  teamCount: 0,
  teamSize: 0,
}

const gameContext = createContext<GameContext>({
  loadingState: GameContextLoadingState.none,
  challenges: [],
  achievements: [],
  messages: [],
  rewards: [],
  score: {
    challsScore: {},
    teamsScore: [],
  },
  gameConfig: defaultGameConfig,
  isLoaded: () => false,
})

export function ProvideGame({ children }: PropsWithChildren<object>) {
  const game = useProvideGame()
  return <gameContext.Provider value={game}>{children}</gameContext.Provider>
}

export const useGame = () => {
  return useContext(gameContext)
}

function useProvideGame(): GameContext {
  const { socket } = useSocket('/api/game')
  const [loadingState, setLoadingState] = useState<GameContextLoadingState>(
    GameContextLoadingState.none,
  )
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [rawAchievements, setRawAchievements] = useState<Achievement[]>([])
  const [rawMessages, setRawMessages] = useState<Message[]>([])
  const [teams, setTeams] = useState<string[]>([])
  const [rewards, setRewards] = useState<Reward[]>([])
  const [gameConfig, setGameConfig] = useState<GameConfig>(defaultGameConfig)

  const achievements = rawAchievements.map(a => ({
    ...a,
    challenge: challenges.find(c => c._id === a.challengeId) as Challenge,
  }))

  const messages = rawMessages.map(a => ({
    ...a,
    challenge: challenges.find(c => c._id === a.challengeId)?.name ?? '',
  }))

  useEffect(() => {
    if (!socket) return

    socket.emit('game:config', (config: GameConfig) => {
      setGameConfig(config)
      setLoadingState(state => state | GameContextLoadingState.config)
    })

    socket.emit('challenge:list', (response: Challenge[]) => {
      setChallenges([...response])
      setLoadingState(state => state | GameContextLoadingState.challenges)
    })

    socket.emit('achievement:list', (response: Achievement[]) => {
      setRawAchievements(
        response.map(a => ({ ...a, createdAt: new Date(a.createdAt) })),
      )
      setLoadingState(state => state | GameContextLoadingState.achievements)
    })

    socket.emit('reward:list', (response: Reward[]) => {
      setRewards(
        response.map(r => ({ ...r, createdAt: new Date(r.createdAt) })),
      )
      setLoadingState(state => state | GameContextLoadingState.rewards)
    })

    socket.emit('game:messages', (response: Message[]) => {
      setRawMessages(
        response.map(a => ({ ...a, createdAt: new Date(a.createdAt) })),
      )
      setLoadingState(state => state | GameContextLoadingState.messages)
    })

    socket.emit('game:teams', (response: string[]) => {
      setTeams([...response])
      setLoadingState(state => state | GameContextLoadingState.teams)
    })

    socket.on('challenge:added', (chall: Challenge) =>
      setChallenges(challs => [...challs, chall]),
    )

    socket.on('challenge:updated', (challUpdated: Challenge) =>
      setChallenges(challs =>
        challs.map(c => (c._id === challUpdated._id ? challUpdated : c)),
      ),
    )

    socket.on('achievement:added', (achievement: Achievement) => {
      setRawAchievements(a => [
        { ...achievement, createdAt: new Date(achievement.createdAt) },
        ...a,
      ])
    })

    socket.on('reward:added', (reward: Reward) => {
      setRewards(r => [
        { ...reward, createdAt: new Date(reward.createdAt) },
        ...r,
      ])
    })

    socket.on('achievement:deleted', (deleted: Achievement) => {
      setRawAchievements(ach =>
        ach.filter(
          a =>
            !(
              a.challengeId === deleted.challengeId &&
              a.teamname === deleted.teamname
            ),
        ),
      )
    })

    socket.on('reward:deleted', (deleted: Reward) => {
      setRewards(rewards => rewards.filter(r => !(r._id === deleted._id)))
    })

    socket.on('game:newMessage', (message: Message) => {
      setRawMessages(m => [
        { ...message, createdAt: new Date(message.createdAt) },
        ...m,
      ])
    })

    socket.on('game:config:updated', (config: GameConfig) => {
      setGameConfig(config)
    })

    return () => {
      socket.off('challenge:added')
      socket.off('challenge:updated')
      socket.off('achievement:added')
      socket.off('reward:added')
      socket.off('achievement:deleted')
      socket.off('reward:deleted')
      socket.off('game:newMessage')
      socket.off('game:config:updated')
    }
  }, [socket])

  return {
    loadingState,
    challenges,
    achievements,
    messages,
    rewards,
    score: computeGameScore(
      achievements,
      rewards,
      challenges,
      teams,
      gameConfig,
    ),
    gameConfig,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    isLoaded: state => (loadingState & state) === state,
  }
}
