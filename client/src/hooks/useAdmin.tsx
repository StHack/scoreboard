import {
  Achievement,
  Attempt,
  BaseChallenge,
  BaseReward,
  Challenge,
  DummyChallenge,
  Reward,
  ServerActivityStatistics,
  ServerError,
  TimestampedServerActivityStatistics,
  User,
  UserRole,
} from '@sthack/scoreboard-common'
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useSocket } from './useSocket'

export type AdminContext = {
  loadingState: AdminContextLoadingState
  challenges: Challenge[]
  users: User[]
  attempts: Attempt[]
  activityStatistics: ServerActivityStatistics
  activityStats: TimestampedServerActivityStatistics[]
  isLoaded: (state: AdminContextLoadingState) => boolean
  createChallenge: (chall: BaseChallenge) => Promise<Challenge>
  createReward: (reward: BaseReward) => Promise<Reward>
  updateChallenge: (
    challengeId: string,
    chall: BaseChallenge,
  ) => Promise<Challenge>
  brokeChallenge: (chall: Challenge) => void
  deleteChallenge: (chall: Challenge) => void
  repairChallenge: (chall: Challenge) => void
  openGame: () => void
  closeGame: () => void
  openRegistration: () => void
  closeRegistration: () => void
  setTeamSize: (teamSize: number) => void
  changeTeam: (user: User, team: string) => void
  changePassword: (user: User, password: string) => void
  changeRoles: (user: User, roles: UserRole[]) => void
  deleteUser: (user: User) => void
  logoutUser: (user: User) => void
  deleteAchievement: (achievement: Achievement) => void
  deleteReward: (reward: Reward) => void
  sendMessage: (message: string, challengeId?: string) => void
  uploadFile: (file: File) => Promise<string>
}

export enum AdminContextLoadingState {
  none = 0,
  // eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member
  challenges = 1 << 0,
  // eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member
  users = 1 << 1,
  // eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member
  attempts = 1 << 2,
  // eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member
  activityStats = 1 << 3,
}

const defaultStatistics: ServerActivityStatistics = {
  admins: [],
  teamCount: 0,
  teams: {},
  userCount: 0,
  sockets: {
    admin: 0,
    game: 0,
    player: 0,
  },
}

const AdminContext = createContext<AdminContext>({
  loadingState: AdminContextLoadingState.none,
  challenges: [],
  users: [],
  attempts: [],
  activityStatistics: defaultStatistics,
  activityStats: [],
  isLoaded: () => false,
  createChallenge: () => Promise.resolve<Challenge>(DummyChallenge),
  createReward: () => Promise.resolve<Reward>({} as Reward),
  updateChallenge: () => Promise.resolve<Challenge>(DummyChallenge),
  brokeChallenge: () => {},
  deleteChallenge: () => {},
  repairChallenge: () => {},
  openGame: () => {},
  closeGame: () => {},
  openRegistration: () => {},
  closeRegistration: () => {},
  setTeamSize: () => {},
  changeTeam: () => {},
  changePassword: () => {},
  changeRoles: () => {},
  deleteUser: () => {},
  logoutUser: () => {},
  deleteAchievement: () => {},
  deleteReward: () => {},
  sendMessage: () => {},
  uploadFile: () => Promise.resolve<string>(''),
})

export function ProvideAdmin({ children }: PropsWithChildren<object>) {
  const admin = useProvideAdmin()
  return <AdminContext value={admin}>{children}</AdminContext>
}

export const useAdmin = () => {
  return useContext(AdminContext)
}

function useProvideAdmin(): AdminContext {
  const { socket } = useSocket('/api/admin')
  const [loadingState, setLoadingState] = useState<AdminContextLoadingState>(
    AdminContextLoadingState.none,
  )
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [rawAttempts, setRawAttempts] = useState<Attempt[]>([])
  const [statistics, setActivityStatistics] =
    useState<ServerActivityStatistics>(defaultStatistics)
  const [activityStats, setActivityStats] = useState<
    TimestampedServerActivityStatistics[]
  >([])

  const attempts = rawAttempts.map(a => ({
    ...a,
    challenge: challenges.find(c => c._id === a.challengeId) ?? DummyChallenge,
  }))

  useEffect(() => {
    if (!socket) return

    socket.emit('challenge:list', (response: Challenge[]) => {
      setChallenges([...response])
      setLoadingState(state => state | AdminContextLoadingState.challenges)
    })

    socket.emit('users:list', (users: User[]) => {
      setUsers([...users])
      setLoadingState(state => state | AdminContextLoadingState.users)
    })

    socket.emit('attempt:list', (attempts: Attempt[]) => {
      setRawAttempts(
        attempts.map(a => ({ ...a, createdAt: new Date(a.createdAt) })),
      )
      setLoadingState(state => state | AdminContextLoadingState.attempts)
    })

    socket.emit('game:activity', (activity: ServerActivityStatistics) => {
      setActivityStatistics(activity)
      setLoadingState(state => state | AdminContextLoadingState.activityStats)
    })

    socket.emit(
      'game:activity:list',
      (activityStats: TimestampedServerActivityStatistics[]) =>
        setActivityStats(
          activityStats.map(s => ({
            ...s,
            timestamp: new Date(s.timestamp),
          })),
        ),
    )

    socket.on('game:activity:updated', setActivityStatistics)

    socket.on(
      'game:activity:list:updated',
      (stat: TimestampedServerActivityStatistics) =>
        setActivityStats(stats => [...stats, stat]),
    )

    socket.on('challenge:added', (chall: Challenge) =>
      setChallenges(challs => [...challs, chall]),
    )

    socket.on('challenge:updated', (challUpdated: Challenge) =>
      setChallenges(challs =>
        challs.map(c => (c._id === challUpdated._id ? challUpdated : c)),
      ),
    )

    socket.on('challenge:deleted', (challId: string) =>
      setChallenges(challs => challs.filter(c => c._id !== challId)),
    )

    socket.on('attempt:added', (attempt: Attempt) =>
      setRawAttempts(attempts => [
        { ...attempt, createdAt: new Date(attempt.createdAt) },
        ...attempts,
      ]),
    )

    return () => {
      socket.off('game:activity:updated')
      socket.off('game:activity:list:updated')
      socket.off('challenge:added')
      socket.off('challenge:updated')
      socket.off('challenge:deleted')
      socket.off('attempt:added')
    }
  }, [socket])

  const updateUsers = (user: User) =>
    setUsers(users.map(u => (u.username === user.username ? user : u)))

  return {
    loadingState,
    users,
    challenges,
    attempts,
    activityStatistics: statistics,
    activityStats,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    isLoaded: state => (loadingState & state) === state,
    createChallenge: chall =>
      new Promise<Challenge>((resolve, reject) => {
        if (!socket) throw new Error('connection is not available')

        socket.emit(
          'challenge:actions:create',
          chall,
          (response: Challenge | ServerError) => {
            if ('error' in response) {
              reject(new Error(response.error))
            } else {
              resolve(response)
            }
          },
        )
      }),
    createReward: reward =>
      new Promise<Reward>((resolve, reject) => {
        if (!socket) throw new Error('connection is not available')

        socket.emit(
          'reward:actions:create',
          reward,
          (response: Reward | ServerError) => {
            if ('error' in response) {
              reject(new Error(response.error))
            } else {
              resolve(response)
            }
          },
        )
      }),
    updateChallenge: (challengeId, chall) =>
      new Promise<Challenge>((resolve, reject) => {
        if (!socket) throw new Error('connection is not available')

        socket.emit(
          'challenge:actions:update',
          challengeId,
          chall,
          (response: Challenge | ServerError) => {
            if ('error' in response) {
              reject(new Error(response.error))
            } else {
              resolve(response)
            }
          },
        )
      }),
    brokeChallenge: chall => {
      if (!socket) throw new Error('connection is not available')

      socket.emit('challenge:actions:broke', chall._id)
    },
    deleteChallenge: chall =>
      new Promise<void>((resolve, reject) => {
        if (!socket) throw new Error('connection is not available')

        socket.emit(
          'challenge:actions:delete',
          chall._id,
          (response: ServerError | undefined) => {
            if (response) {
              reject(new Error(response.error))
            } else {
              setChallenges(challs => challs.filter(c => c._id !== chall._id))
              resolve()
            }
          },
        )
      }),
    repairChallenge: chall => {
      if (!socket) throw new Error('connection is not available')

      socket.emit('challenge:actions:repair', chall._id)
    },
    openGame: () => {
      if (!socket) throw new Error('connection is not available')

      socket.emit('game:actions:open')
    },
    closeGame: () => {
      if (!socket) throw new Error('connection is not available')

      socket.emit('game:actions:end')
    },
    openRegistration: () => {
      if (!socket) throw new Error('connection is not available')

      socket.emit('game:actions:openRegistration')
    },
    closeRegistration: () => {
      if (!socket) throw new Error('connection is not available')

      socket.emit('game:actions:closeRegistration')
    },
    setTeamSize: teamSize => {
      if (!socket) throw new Error('connection is not available')

      socket.emit('game:actions:setTeamSize', teamSize)
    },
    changeTeam: (user, team) => {
      if (!socket) throw new Error('connection is not available')

      socket.emit('users:actions:changeTeam', user.username, team, updateUsers)
    },
    changePassword: (user, password) => {
      if (!socket) throw new Error('connection is not available')

      socket.emit(
        'users:actions:changePassword',
        user.username,
        password,
        updateUsers,
      )
    },
    changeRoles: (user, roles) => {
      if (!socket) throw new Error('connection is not available')

      socket.emit(
        'users:actions:changeRoles',
        user.username,
        roles,
        updateUsers,
      )
    },
    deleteUser: user => {
      if (!socket) throw new Error('connection is not available')

      socket.emit('users:actions:delete', user.username, () =>
        setUsers(users.filter(u => u.username !== user.username)),
      )
    },
    logoutUser: user => {
      if (!socket) throw new Error('connection is not available')

      socket.emit('users:actions:logout', user.username)
    },
    deleteAchievement: achievement => {
      if (!socket) throw new Error('connection is not available')

      socket.emit(
        'achievement:actions:delete',
        achievement.teamname,
        achievement.challengeId,
      )
    },
    deleteReward: reward => {
      if (!socket) throw new Error('connection is not available')

      socket.emit('reward:actions:delete', reward._id)
    },
    sendMessage: (message, challengeId) => {
      if (!socket) throw new Error('connection is not available')

      socket.emit('game:annoucement:actions:sendMessage', message, challengeId)
    },
    uploadFile: file =>
      new Promise<string>(resolve => {
        if (!socket) throw new Error('connection is not available')

        socket.emit(
          'challenge:actions:file:upload',
          {
            name: file.name,
            contentType: file.type || 'application/octet-stream',
            content: file,
          },
          (response: string) => {
            resolve(response)
          },
        )
      }),
  }
}
