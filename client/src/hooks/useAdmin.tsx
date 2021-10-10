import { BaseChallenge, Challenge } from 'models/Challenge'
import { ServerError } from 'models/ServerError'
import { User } from 'models/User'
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useSocket } from './useSocket'

export type AdminContext = {
  users: User[]
  createChallenge: (chall: BaseChallenge) => Promise<Challenge>
  updateChallenge: (chall: BaseChallenge) => Promise<Challenge>
  brokeChallenge: (chall: Challenge) => void
  repairChallenge: (chall: Challenge) => void
  openRegistration: () => void
  closeRegistration: () => void
  changeTeam: (user: User, team: string) => void
  changePassword: (user: User, password: string) => void
  toggleIsAdmin: (user: User) => void
  deleteUser: (user: User) => void
  sendMessage: (message: string) => void
}

const adminContext = createContext<AdminContext>({
  users: [],
  createChallenge: () => Promise.resolve<Challenge>(undefined as any),
  updateChallenge: () => Promise.resolve<Challenge>(undefined as any),
  brokeChallenge: () => {},
  repairChallenge: () => {},
  openRegistration: () => {},
  closeRegistration: () => {},
  changeTeam: () => {},
  changePassword: () => {},
  toggleIsAdmin: () => {},
  deleteUser: () => {},
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
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    if (!socket) return

    socket.emit('users:list', (users: User[]) => {
      setUsers([...users])
    })
  }, [socket])

  const updateUsers = (user: User) =>
    setUsers(users.map(u => (u.username === user.username ? user : u)))

  return {
    users,
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
    openRegistration: () => {
      if (!socket) throw new Error('connection is not available')

      socket.emit('game:openRegistration')
    },
    closeRegistration: () => {
      if (!socket) throw new Error('connection is not available')

      socket.emit('game:closeRegistration')
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
    sendMessage: message => {
      if (!socket) throw new Error('connection is not available')

      socket.emit('game:sendMessage', message)
    },
  }
}
