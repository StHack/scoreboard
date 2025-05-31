import { Challenge, ChallengeScore } from '@sthack/scoreboard-common'
import { JSX } from 'react'
import { BoxProps } from '../Box'
import { Icon } from '../Icon'

export type ChallengeCardProps = {
  challenge: Challenge
  score: ChallengeScore
  currentTeam?: string
  onClick: () => void
} & BoxProps

export type EditionThemeCredit = {
  href: string
  author: string
  label: string
}

export type EditionTheme = {
  background?: string
  backgroundCredit?: EditionThemeCredit
  logo: Icon
  card: (props: ChallengeCardProps) => JSX.Element
}
