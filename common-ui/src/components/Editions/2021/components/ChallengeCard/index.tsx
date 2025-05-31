import styled from '@emotion/styled'
import { space } from 'styled-system'
import { BounceIn } from '../../../../../styles'
import { Box } from '../../../../Box'
import { CategoryImg } from '../../../../CategoryImg'
import { ChallengeCardProps } from '../../../types'
import BrokenImg from './img/broken.png'
import DelayedImg from './img/delayed.png'

export function ChallengeCard2021({
  challenge,
  currentTeam,
  score: { score, achievements },
  onClick,
  ...props
}: ChallengeCardProps) {
  const { name, img, category, isBroken } = challenge

  return (
    <Card
      openState={isBroken ? 'broken' : 'open'}
      score={score}
      isSolved={achievements.some(a => a.teamname === currentTeam)}
      m="2"
      {...props}
      onClick={() => onClick()}
    >
      {img && <Image src={img} alt={name} title={name} />}
      {!img && <CategoryImg category={category} />}
      <h3>{name}</h3>
    </Card>
  )
}

type ChallState = 'broken' | 'delayed' | 'open'

const Image = styled.img`
  object-fit: contain;
  width: 100%;
`

type CardProps = {
  openState: ChallState
  score: number
  isSolved: boolean
  delayed?: string
}

const Card = styled(Box)<CardProps>`
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
  text-decoration: none;

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
    background:
      url(${p => openStateToImg(p.openState)}) center center / contain no-repeat,
      ${p => p.theme.colors.popupBackground}AA;
  }
`

function openStateToImg(openState: ChallState) {
  return openState === 'broken'
    ? BrokenImg
    : openState === 'delayed'
      ? DelayedImg
      : ''
}
