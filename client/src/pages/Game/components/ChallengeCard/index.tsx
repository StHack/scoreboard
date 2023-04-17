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
import {
  Box,
  Card, CardProps,
  createPolymorphicComponent,
  Flex,
  Image,
  Text,
  Title,
} from '@mantine/core'

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
    <StyledCard
      openState={openState}
      delayed={delayedTimer}
      score={score}
      isSolved={achievements.some(a => a.teamname === currentTeam)}
      shadow="sm"
      padding="xs"
      radius="md"
      maw="12rem"
      mah="14rem"
      withBorder
    >
      <Card.Section>
        {img && <Image src={img} alt={name} title={name} fit="contain" />}
        {!img && <CategoryImg category={category} />}
      </Card.Section>
      <Title order={4} ta="center" mb="xs" color="customPink.0">
        {name}
      </Title>
    </StyledCard>
  )
}

interface StyledCardProps {
  openState: ChallState
  score: number
  isSolved: boolean
  delayed?: string
}

const StyledCard = createPolymorphicComponent<'div', CardProps & StyledCardProps>(styled(Card as any)`
  position: relative;
  cursor: pointer;

  ::before {
    content: '${p => (p.isSolved ? `✔ ${p.score}` : p.score)}';
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.2rem 0.6rem;
    border-bottom-left-radius: 1rem;
    background: ${p =>
      p.isSolved ? p.theme.colors.customBlack[0] : p.theme.colors.customPink};
    color: ${p => p.theme.white};
    text-align: center;
    box-shadow: 4px 4px 15px rgba(26, 35, 126, 0.2);
    z-index: 100;
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
    z-index: 200;
    background: url(${p =>
          p.openState === 'broken'
            ? BrokenImg
            : p.openState === 'closed'
            ? ClosedImg
            : p.openState === 'delayed'
            ? DelayedImg
            : ''})
        center center / contain no-repeat,
      ${p => p.theme.colors.customBlack[0]}AA;
  }
`)
