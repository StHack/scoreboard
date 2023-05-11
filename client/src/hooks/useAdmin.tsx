import { Achievement } from 'models/Achievement'
import { Attempt } from 'models/Attempt'
import { BaseChallenge, Challenge } from 'models/Challenge'
import { BaseReward, Reward } from 'models/Reward'
import { ServerActivityStatistics } from 'models/ServerActivityStatistics'
import { ServerError } from 'models/ServerError'
import { User } from 'models/User'
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useSocket } from './useSocket'

export type AdminContext = {
  challenges: Challenge[]
  users: User[]
  attempts: Attempt[]
  activityStatistics: ServerActivityStatistics
  createChallenge: (chall: BaseChallenge) => Promise<Challenge>
  createReward: (chall: BaseReward) => Promise<Reward>
  updateChallenge: (chall: BaseChallenge) => Promise<Challenge>
  brokeChallenge: (chall: Challenge) => void
  repairChallenge: (chall: Challenge) => void
  openGame: () => void
  closeGame: () => void
  openRegistration: () => void
  closeRegistration: () => void
  setTeamSize: (teamSize: number) => void
  changeTeam: (user: User, team: string) => void
  changePassword: (user: User, password: string) => void
  toggleIsAdmin: (user: User) => void
  deleteUser: (user: User) => void
  logoutUser: (user: User) => void
  deleteAchievement: (achievement: Achievement) => void
  deleteReward: (reward: Reward) => void
  sendMessage: (message: string, challenge?: string) => void
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

const adminContext = createContext<AdminContext>({
  challenges: [],
  users: [],
  attempts: [],
  activityStatistics: defaultStatistics,
  createChallenge: () => Promise.resolve<Challenge>(undefined as any),
  createReward: () => Promise.resolve<Reward>(undefined as any),
  updateChallenge: () => Promise.resolve<Challenge>(undefined as any),
  brokeChallenge: () => {},
  repairChallenge: () => {},
  openGame: () => {},
  closeGame: () => {},
  openRegistration: () => {},
  closeRegistration: () => {},
  setTeamSize: () => {},
  changeTeam: () => {},
  changePassword: () => {},
  toggleIsAdmin: () => {},
  deleteUser: () => {},
  logoutUser: () => {},
  deleteAchievement: () => {},
  deleteReward: () => {},
  sendMessage: () => {},
})

export function ProvideAdmin ({ children }: PropsWithChildren<{}>) {
  const admin = useProvideAdmin()
  return <adminContext.Provider value={admin}>{children}</adminContext.Provider>
}

export const useAdmin = () => {
  return useContext(adminContext)
}

function useProvideAdmin (): AdminContext {
  const { socket } = useSocket('/api/admin')
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [statistics, setActivityStatistics] =
    useState<ServerActivityStatistics>(defaultStatistics)

  useEffect(() => {
    if (!socket) return

    socket.emit('challenge:list', (response: Challenge[]) => {
      setChallenges([...response])
    })

    socket.emit('users:list', (users: User[]) => {
      setUsers([...users])
    })

    socket.emit('attempt:list', (attempts: Attempt[]) => {
      setAttempts(
        attempts.map(a => ({ ...a, createdAt: new Date(a.createdAt) })),
      )
    })

    socket.emit('game:activity', setActivityStatistics)

    socket.on('game:activity:updated', setActivityStatistics)

    socket.on('challenge:added', (chall: Challenge) =>
      setChallenges(challs => [...challs, chall]),
    )

    socket.on('challenge:updated', (challUpdated: Challenge) =>
      setChallenges(challs =>
        challs.map(c => (c.name === challUpdated.name ? challUpdated : c)),
      ),
    )

    socket.on('attempt:added', (attempt: Attempt) =>
      setAttempts(attempts => [
        { ...attempt, createdAt: new Date(attempt.createdAt) },
        ...attempts,
      ]),
    )

    return () => {
      socket.off('game:activity:updated')
      socket.off('challenge:added')
      socket.off('challenge:updated')
      socket.off('attempt:added')
    }
  }, [socket])

  const updateUsers = (user: User) =>
    setUsers(users.map(u => (u.username === user.username ? user : u)))

  return {
    users,
    challenges,
    attempts,
    activityStatistics: statistics,
    createChallenge: chall =>
      new Promise<Challenge>((resolve, reject) => {
        if (!socket) throw new Error('connection is not available')

        socket.emit(
          'challenge:create',
          chall,
          (response: Challenge | ServerError) => {
            if ('error' in response) {
              reject(response.error)
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
          'reward:create',
          reward,
          (response: Reward | ServerError) => {
            if ('error' in response) {
              reject(response.error)
            } else {
              resolve(response)
            }
          },
        )
      }),
    updateChallenge: chall =>
      new Promise<Challenge>((resolve, reject) => {
        if (!socket) throw new Error('connection is not available')

        socket.emit(
          'challenge:update',
          chall.name,
          chall,
          (response: Challenge | ServerError) => {
            if ('error' in response) {
              reject(response.error)
            } else {
              resolve(response)
            }
          },
        )
      }),
    brokeChallenge: chall => {
      if (!socket) throw new Error('connection is not available')

      socket.emit('challenge:broke', chall.name)
    },
    repairChallenge: chall => {
      if (!socket) throw new Error('connection is not available')

      socket.emit('challenge:repair', chall.name)
    },
    openGame: () => {
      if (!socket) throw new Error('connection is not available')

      socket.emit('game:open')
    },
    closeGame: () => {
      if (!socket) throw new Error('connection is not available')

      socket.emit('game:end')
    },
    openRegistration: () => {
      if (!socket) throw new Error('connection is not available')

      socket.emit('game:openRegistration')
    },
    closeRegistration: () => {
      if (!socket) throw new Error('connection is not available')

      socket.emit('game:closeRegistration')
    },
    setTeamSize: teamSize => {
      if (!socket) throw new Error('connection is not available')

      socket.emit('game:setTeamSize', teamSize)
    },
    changeTeam: (user, team) => {
      if (!socket) throw new Error('connection is not available')

      socket.emit('users:changeTeam', user.username, team, updateUsers)
    },
    changePassword: (user, password) => {
      if (!socket) throw new Error('connection is not available')

      socket.emit('users:changePassword', user.username, password, updateUsers)
    },
    toggleIsAdmin: user => {
      if (!socket) throw new Error('connection is not available')

      socket.emit(
        'users:changeIsAdmin',
        user.username,
        !user.isAdmin,
        updateUsers,
      )
    },
    deleteUser: user => {
      if (!socket) throw new Error('connection is not available')

      socket.emit('users:delete', user.username, () =>
        setUsers(users.filter(u => u.username !== user.username)),
      )
    },
    logoutUser: user => {
      if (!socket) throw new Error('connection is not available')

      socket.emit('users:logout', user.username)
    },
    deleteAchievement: achievement => {
      if (!socket) throw new Error('connection is not available')

      socket.emit(
        'achievement:delete',
        achievement.teamname,
        achievement.challenge,
      )
    },
    deleteReward: reward => {
      if (!socket) throw new Error('connection is not available')

      socket.emit('reward:delete', reward._id)
    },
    sendMessage: (message, challenge) => {
      if (!socket) throw new Error('connection is not available')

      socket.emit('game:sendMessage', message, challenge)
    },
  }
}
