import { Achievement } from 'models/Achievement'
import { Challenge } from 'models/Challenge'
import { useEffect, useState } from 'react'
import { useGame } from './useGame'

export function useChallengeSolveDelay (
  { isOpen, isBroken }: Challenge,
  achievements: Achievement[],
) {
  const {
    gameConfig: { solveDelay },
  } = useGame()

  const lastSolved = achievements[achievements.length - 1]
  const openState = computeState(isBroken, isOpen, lastSolved, solveDelay)

  const [delayedTimer, setDelayedTimer] = useState<string>()

  useEffect(() => {
    if (!lastSolved) return
    if (openState !== 'delayed') return

    const ticcks = setInterval(() => {
      const remainingSeconds = Math.trunc(
        (solveDelay - (new Date().getTime() - lastSolved.createdAt.getTime())) /
          1000,
      )
      const minutes = Math.trunc(remainingSeconds / 60)
        .toString()
        .padStart(2, '0')
      const seconds = (remainingSeconds % 60).toString().padStart(2, '0')
      setDelayedTimer(`${minutes}:${seconds}`)
    }, 1000)
    return () => clearInterval(ticcks)
  }, [lastSolved, openState, solveDelay])

  return {
    delayedTimer,
    openState,
  }
}

export type ChallState = 'broken' | 'closed' | 'delayed' | 'open'

function computeState (
  isBroken: boolean,
  isOpen: boolean,
  lastSolved: Achievement | undefined,
  solveDelay: number,
): ChallState {
  if (!isOpen) return 'closed'

  if (isBroken) return 'broken'

  if (
    !!lastSolved &&
    lastSolved.createdAt.getTime() + solveDelay > new Date().getTime()
  ) {
    return 'delayed'
  }

  return 'open'
}
