import { Message } from '@sthack/scoreboard-common'
import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { useAuth } from './useAuthentication'
import { useGame } from './useGame'
import { useSocket } from './useSocket'

export type PlayerContext = {
  myScore: number
  myTeamScore: number
  myTeamName: string
  myTeamRank: number
  isBeforeLastScorer: boolean
  readMessages: string[]
  attemptChall: (challengeId: string, flag: string) => Promise<true | string>
  markMessageAsRead: (message: Message) => void
}

const PlayerContext = createContext<PlayerContext>({
  myScore: 0,
  myTeamScore: 0,
  myTeamName: '',
  myTeamRank: 0,
  isBeforeLastScorer: false,
  readMessages: [],
  attemptChall: () => Promise.resolve('Uninitialized'),
  markMessageAsRead: () => {},
})

export function ProvidePlayer({ children }: PropsWithChildren<object>) {
  const player = useProvidePlayer()
  return (
    <PlayerContext value={player}>{children}</PlayerContext>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}

function useProvidePlayer(): PlayerContext {
  const { socket } = useSocket('/api/player')
  const { user } = useAuth()
  if (!user) {
    throw new Error()
  }
  const {
    score: { teamsScore, challsScore },
  } = useGame()
  const [readMessages, setReadMessages] = useState<string[]>(
    () => JSON.parse(localStorage.getItem('readMessages') ?? '[]') as string[],
  )
  const ts = teamsScore.find(x => x.team === user.team)
  const myScore = Object.values(challsScore)
    .filter(cs => !!cs.achievements.find(a => a.username === user.username))
    .reduce((agg, a) => agg + a.score, 0)

  const lastScorerIndex = teamsScore.findLastIndex(
    s => s.score > 0 && s.rank > 3,
  )
  const beforeLastScorer =
    lastScorerIndex > 0 ? teamsScore[lastScorerIndex - 1] : undefined

  return {
    myScore,
    myTeamScore: ts?.score ?? 0,
    myTeamName: user.team,
    myTeamRank: teamsScore.find(ts => ts.team === user.team)?.rank ?? 0,
    isBeforeLastScorer: beforeLastScorer?.team === user.team,
    readMessages,
    attemptChall: (challengeId, flag) => {
      if (!socket) return Promise.resolve('You are not connected at the moment')

      return new Promise(resolve => {
        socket.emit(
          'challenge:solve',
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
    markMessageAsRead: message => {
      const updated = [...readMessages, message._id]
      localStorage.setItem('readMessages', JSON.stringify(updated))
      setReadMessages(updated)
    },
  }
}
