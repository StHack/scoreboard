import styled from '@emotion/styled'
import { CategoryImg } from 'components/CategoryImg'
import { useGame } from 'hooks/useGame'
import { Achievement } from 'models/Achievement'
import { Challenge } from 'models/Challenge'
import { ChallengeScore } from 'models/GameScore'
import { useEffect, useState } from 'react'
import { space, SpaceProps } from 'styled-system'
import { BounceIn } from 'styles/animation'
import BrokenImg from './broken.png'
import ClosedImg from './closed.png'
import DelayedImg from './delayed.png'

type ChallengeCardProps = {
  challenge: Challenge
  score: ChallengeScore
  onClick: () => void
}
export function ChallengeCard ({
  challenge: { name, img, isBroken, isOpen, category },
  score: { score, myTeamSolved, achievements },
  onClick,
}: ChallengeCardProps) {
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

  return (
    <Card
      openState={openState}
      score={score}
      isSolved={!!myTeamSolved}
      delayed={delayedTimer}
      m="2"
      onClick={() => openState === 'open' && onClick()}
    >
      {img && <Image src={img} alt={name} title={name} />}
      {!img && <CategoryImg category={category} />}
      <h3>{name}</h3>
    </Card>
  )
}

type ChallState = 'broken' | 'closed' | 'delayed' | 'open'

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

const Image = styled.img`
  object-fit: contain;
  width: 100%;
`

const Card = styled.div<
  SpaceProps & {
    openState: ChallState
    score: number
    isSolved: boolean
    delayed?: string
  }
>`
  background-color: ${p => p.theme.colors.background};
  width: 100%;
  height: 100%;
  max-width: ${p => p.theme.sizes[6]};
  max-height: ${p => p.theme.sizes[7]};
  margin: auto;
  ${space}
  display: flex;
  flex-direction: column;
  place-items: stretch;
  overflow: hidden;
  border-radius: 0.5rem;
  box-shadow: ${p => p.theme.shadows.normal};
  animation: 250ms ${BounceIn};
  cursor: ${p => (p.openState === 'open' ? 'pointer' : 'initial')};
  position: relative;

  ::before {
    content: '${p => (p.isSolved ? `✔ ${p.score}` : p.score)}';
    position: absolute;
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.6rem;
    border-bottom-left-radius: 1rem;
    background: ${p =>
      p.isSolved ? p.theme.colors.black : p.theme.colors.pink};
    color: ${p =>
      p.isSolved ? p.theme.colors.white : p.theme.colors.secondaryText};
    text-align: center;
    box-shadow: 4px 4px 15px rgba(26, 35, 126, 0.2);
  }

  ::after {
    ${p => (p.openState === 'open' ? '' : `content: '${p.delayed || ''}'`)};
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    font-size: ${p => p.theme.fontSizes[4]};
    color: ${p => p.theme.colors.primary};
    place-content: center;
    place-items: center;
    background: url(${p =>
          p.openState === 'broken'
            ? BrokenImg
            : p.openState === 'closed'
            ? ClosedImg
            : p.openState === 'delayed'
            ? DelayedImg
            : ''})
        center center / contain no-repeat,
      ${p => p.theme.colors.popupBackground}AA;
  }
`
