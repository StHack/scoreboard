import styled from '@emotion/styled'
import { useGame } from 'hooks/useGame'
import { Challenge } from 'models/Challenge'
import { ChallengeScore } from 'models/GameScore'
import { space, SpaceProps } from 'styled-system'
import { BounceIn } from 'styles/animation'
import BrokenImg from './broken.png'

type ChallengeCardProps = {
  challenge: Challenge
  score: ChallengeScore
  onClick: () => void
}
export function ChallengeCard ({
  challenge: { name, img, isBroken, isOpen },
  score: { lastSolved },
  onClick,
}: ChallengeCardProps) {
  const {
    gameConfig: { solveDelay },
  } = useGame()

  const disabled =
    isBroken ||
    !isOpen ||
    (!!lastSolved && lastSolved.getTime() + solveDelay > new Date().getTime())

  return (
    <Card disabled={disabled} onClick={() => !disabled && onClick()}>
      <Image src={img} alt={name} title={name} />
      <h3>{name}</h3>
    </Card>
  )
}

const Image = styled.img`
  object-fit: contain;
  width: 100%;
`

const Card = styled.div<SpaceProps & { disabled: boolean }>`
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
  cursor: ${p => (p.disabled ? 'initial' : 'pointer')};
  position: relative;

  ::after {
    ${p => p.disabled && "content: ''"};
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: url(${BrokenImg}) center center / contain no-repeat,
      ${p => p.theme.colors.greys[2]}AA;
  }
`
