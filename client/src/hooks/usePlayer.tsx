import { createContext, PropsWithChildren, useContext } from 'react'
import { useAuth } from './useAuthentication'
import { useGame } from './useGame'
import { useSocket } from './useSocket'

export type PlayerContext = {
  myScore: number
  myTeamScore: number
  myTeamName: string
  attemptChall: (
    challName: string,
    flag: string,
    callback: (isValid: boolean, error: string | undefined) => void,
  ) => Promise<void>
}

const playerContext = createContext<PlayerContext>({
  myScore: 0,
  myTeamScore: 0,
  myTeamName: '',
  attemptChall: () => Promise.resolve(undefined),
})

export function ProvidePlayer ({ children }: PropsWithChildren<{}>) {
  const player = useProvidePlayer()
  return (
    <playerContext.Provider value={player}>{children}</playerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(playerContext)
}

function useProvidePlayer (): PlayerContext {
  const { socket } = useSocket('/api/player')
  const { user } = useAuth()
  const {
    score: { teamsScore, challsScore },
  } = useGame()

  const ts = teamsScore.find(x => x.team === user?.team)
  const myScore = Object.values(challsScore)
    .filter(cs => !!cs.achievements.find(a => a.username === user?.username))
    .reduce((agg, a) => agg + a.score, 0)

  return {
    myScore,
    myTeamScore: ts?.score ?? 0,
    myTeamName: user?.team ?? '',
    attemptChall: async (challName, flag, callback) => {
      if (!socket) return
      socket.emit(
        'challenge:solve',
        challName,
        flag,
        ({ isValid, error }: { isValid?: boolean; error?: string }) =>
          callback(isValid ?? false, error),
      )
    },
  }
}
