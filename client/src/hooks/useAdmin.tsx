import { BaseChallenge, Challenge } from 'models/Challenge'
import { ServerError } from 'models/ServerError'
import { createContext, PropsWithChildren, useContext } from 'react'
import { useSocket } from './useSocket'

export type AdminContext = {
  createChallenge: (chall: BaseChallenge) => Promise<Challenge>
  updateChallenge: (chall: BaseChallenge) => Promise<Challenge>
  brokeChallenge: (chall: Challenge) => void
  repairChallenge: (chall: Challenge) => void
}

const adminContext = createContext<AdminContext>({
  createChallenge: () => Promise.resolve<Challenge>(undefined as any),
  updateChallenge: () => Promise.resolve<Challenge>(undefined as any),
  brokeChallenge: () => {},
  repairChallenge: () => {},
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

  return {
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
  }
}
