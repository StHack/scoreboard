import {
  BaseSurvey,
  BaseToken,
  CreateTeam,
  DummyChallenge,
  DummyTeam,
  dummyTeamScore,
  FullTeam,
  isPlayer,
  JoinTeam,
  Message,
  ServerError,
  TeamScore,
  Token,
} from '@sthack/scoreboard-common'
import { useStorage } from '@sthack/scoreboard-ui/hooks'
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useAuth } from './useAuthentication'
import { useGame } from './useGame'
import { useSocket } from './useSocket'

export type PlayerContext = {
  loadingState: PlayerContextLoadingState
  myTeam?: FullTeam
  myTokens: Token[]
  myScore: number
  myTeamScore: TeamScore
  isBeforeLastScorer: boolean
  readMessages: string[]
  isLoaded: (state: PlayerContextLoadingState) => boolean
  attemptChall: (challengeId: string, flag: string) => Promise<true | string>
  sendSurvey: (challengeId: string, survey: BaseSurvey) => Promise<void>
  createTeam: (payload: CreateTeam) => Promise<void>
  joinTeam: (payload: JoinTeam) => Promise<void>
  markMessageAsRead: (message: Message) => void
}

export enum PlayerContextLoadingState {
  none = 0,
  // eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member
  team = 1 << 0,
  // eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member
  tokens = 1 << 1,
}

const PlayerContext = createContext<PlayerContext>({
  loadingState: PlayerContextLoadingState.none,
  myScore: 0,
  myTeamScore: {
    team: DummyTeam,
    rank: 0,
    score: 0,
    breakthroughs: [],
    solved: [],
    rewards: [],
  },
  myTokens: [],
  isBeforeLastScorer: false,
  readMessages: [],
  isLoaded: () => false,
  attemptChall: () => Promise.resolve('Uninitialized'),
  sendSurvey: () => Promise.resolve(),
  createTeam: () => Promise.resolve(),
  joinTeam: () => Promise.resolve(),
  markMessageAsRead: () => {},
})

export function ProvidePlayer({ children }: PropsWithChildren<object>) {
  const player = useProvidePlayer()
  return <PlayerContext value={player}>{children}</PlayerContext>
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}

function useProvidePlayer(): PlayerContext {
  const { socket } = useSocket('/api/player')
  const { user, reload } = useAuth()
  if (!user) {
    throw new Error()
  }
  const {
    score: { teamsScore, challsScore },
    challenges,
  } = useGame()

  const [loadingState, setLoadingState] = useState<PlayerContextLoadingState>(
    PlayerContextLoadingState.none,
  )
  const [myTeam, setMyTeam] = useState<FullTeam>()
  const [rawTokens, setRawTokens] = useState<Token[]>(() => [])
  const tokens = useMemo<Token[]>(
    () =>
      rawTokens.map<Token>(t => ({
        ...t,
        challenge:
          challenges.find(c => c._id === t.challengeId) ?? DummyChallenge,
        team: myTeam ?? DummyTeam,
      })),
    [rawTokens, challenges, myTeam],
  )

  const player = isPlayer(user) ? user : undefined

  const [readMessages, setReadMessages] = useStorage<string[]>(
    'readMessages',
    [],
  )

  const myScore = Object.values(challsScore)
    .filter(cs => !!cs.achievements.find(a => a.username === user.username))
    .reduce((agg, a) => agg + a.score, 0)

  const lastScorerIndex = teamsScore.findLastIndex(
    s => s.score > 0 && s.rank > 3,
  )
  const beforeLastScorer =
    lastScorerIndex > 0 ? teamsScore[lastScorerIndex - 1] : undefined

  useEffect(() => {
    if (!socket) {
      return
    }

    if (!player) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoadingState(
        state =>
          state |
          PlayerContextLoadingState.team |
          PlayerContextLoadingState.tokens,
      )

      return
    }

    socket.emit('team:get', (fullTeam: FullTeam) => {
      setMyTeam(fullTeam)
      setLoadingState(state => state | PlayerContextLoadingState.team)
    })

    socket.emit('team:tokens:list', (tokens: Token[]) => {
      setRawTokens(tokens)
      setLoadingState(state => state | PlayerContextLoadingState.tokens)
    })

    socket.on('team:updated', (fullTeam: FullTeam) => {
      setMyTeam(fullTeam)
    })

    socket.on('team:tokens:added', (token: Token) => {
      setRawTokens(tokens => [...tokens, token])
    })
    socket.on(
      'team:tokens:removed',
      ({ challengeId, teamId }: Partial<BaseToken>) => {
        setRawTokens(tokens =>
          tokens.filter(t =>
            challengeId
              ? t.challengeId !== challengeId
              : teamId
                ? t.teamId !== teamId
                : true,
          ),
        )
      },
    )

    return () => {
      socket.off('team:updated')
      socket.off('team:tokens:added')
      socket.off('team:tokens:removed')
    }
  }, [player, socket])

  return {
    loadingState,
    myTeam,
    myTokens: tokens,
    myScore,
    myTeamScore:
      (player && teamsScore.find(x => x.team._id === player.teamId)) ||
      dummyTeamScore,
    isBeforeLastScorer: beforeLastScorer?.team === player?.teamId,
    readMessages,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    isLoaded: state => (loadingState & state) === state,
    attemptChall: (challengeId, flag) => {
      if (!socket) return Promise.resolve('You are not connected at the moment')

      return new Promise(resolve => {
        socket.emit(
          'challenge:actions:solve',
          challengeId,
          flag,
          ({ isValid, error }: { isValid?: boolean; error?: string }) =>
            error
              ? resolve(error)
              : isValid
                ? resolve(true)
                : resolve("Nope that's not the flag !"),
        )
      })
    },
    sendSurvey: (challengeId, survey) => {
      if (!socket)
        return Promise.reject(new Error('You are not connected at the moment'))

      return new Promise((resolve, reject) => {
        socket.emit(
          'challenge:actions:survey',
          challengeId,
          survey,
          ({ error }: { error?: string } = {}) =>
            error ? reject(new Error(error)) : resolve(),
        )
      })
    },
    createTeam: (payload: CreateTeam) => {
      if (!socket)
        return Promise.reject(new Error('You are not connected at the moment'))

      return new Promise((resolve, reject) => {
        socket.emit(
          'team:actions:create',
          payload,
          async (resp: ServerError | FullTeam) => {
            if ('error' in resp) {
              reject(new Error(resp.error))
              return
            }

            setMyTeam(resp)
            await reload()
            resolve()
          },
        )
      })
    },
    joinTeam: (payload: JoinTeam) => {
      if (!socket)
        return Promise.reject(new Error('You are not connected at the moment'))

      return new Promise((resolve, reject) => {
        socket.emit(
          'team:actions:join',
          payload,
          async (resp: ServerError | FullTeam) => {
            if ('error' in resp) {
              reject(new Error(resp.error))
              return
            }

            setMyTeam(resp)
            await reload()
            resolve()
          },
        )
      })
    },
    markMessageAsRead: message => {
      const updated = [...readMessages, message._id]
      localStorage.setItem('readMessages', JSON.stringify(updated))
      setReadMessages(updated)
    },
  }
}
