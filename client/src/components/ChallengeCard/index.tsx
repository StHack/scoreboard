import styled from '@emotion/styled'
import { CategoryImg } from 'components/CategoryImg'
import {
  ChallState,
  useChallengeSolveDelay,
} from 'hooks/useChallengeSolveDelay'
import { Challenge } from 'models/Challenge'
import { ChallengeScore } from 'models/GameScore'
import { space, SpaceProps } from 'styled-system'
import { BounceIn } from 'styles/animation'
import BrokenImg from './broken.png'
import ClosedImg from './closed.png'
import DelayedImg from './delayed.png'

type ChallengeCardProps = {
  challenge: Challenge
  score: ChallengeScore
  currentTeam?: string
  onClick: () => void
}
export function ChallengeCard ({
  challenge,
  currentTeam,
  score: { score, achievements },
  onClick,
}: ChallengeCardProps) {
  const { name, img, category } = challenge
  const { openState, delayedTimer } = useChallengeSolveDelay(
    challenge,
    achievements,
  )

  return (
    <Card
      openState={openState}
      score={score}
      isSolved={achievements.some(a => a.teamname === currentTeam)}
      delayed={delayedTimer}
      m="2"
      onClick={() => onClick()}
    >
      {img && <Image src={img} alt={name} title={name} />}
      {!img && <CategoryImg category={category} />}
      <h3>{name}</h3>
    </Card>
  )
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
  cursor: pointer;
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
