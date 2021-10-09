import { Challenge } from 'models/Challenge'
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useSocket } from './useSocket'

export type GameContext = {
  challenges: Challenge[]
}

const gameContext = createContext<GameContext>({
  challenges: [],
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

  useEffect(() => {
    if (!socket) return

    socket.emit('challenge:list', (response: Challenge[]) => {
      setChallenges([...response])
    })

    socket.on('challenge:added', chall =>
      setChallenges(challs => [...challs, chall]),
    )

    socket.on('challenge:updated', challUpdated =>
      setChallenges(challs =>
        challs.map(c => (c.name === challUpdated.name ? challUpdated : c)),
      ),
    )

    return () => {
      socket.off('challenge:added')
      socket.off('challenge:updated')
    }
  }, [socket])

  return {
    challenges,
  }
}
