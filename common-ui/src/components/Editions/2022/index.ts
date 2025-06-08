import { BaseGameConfig } from '@sthack/scoreboard-common'
import { BaseSvg, Icon } from '../../Icon'
import { ChallengeCard2021 } from '../2021/components/ChallengeCard'
import { EditionTheme } from '../types'
import LogoSvg from './images/logo.svg?react'

export const Edition2022Logo: Icon = BaseSvg.withComponent(LogoSvg)

export const Edition2022Theme: EditionTheme = {
  logo: Edition2022Logo,
  card: ChallengeCard2021,
}

export const Edition2022Config: BaseGameConfig = {
  baseChallScore: 50,
  teamSize: 5,
  isRewardProportional: false,
  isDifficultyIncluded: true,
}
