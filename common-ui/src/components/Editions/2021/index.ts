import { BaseGameConfig } from '@sthack/scoreboard-common'
import { BaseSvg, Icon } from '../../Icon'
import { EditionTheme } from '../types'
import { ChallengeCard2021 } from './components/ChallengeCard'
import LogoSvg from './images/logo.svg?react'

export const Edition2021Logo: Icon = BaseSvg.withComponent(LogoSvg)

export const Edition2021Theme: EditionTheme = {
  logo: Edition2021Logo,
  card: ChallengeCard2021,
}

export const Edition2021Config: BaseGameConfig = {
  baseChallScore: 50,
  teamSize: 5,
  isRewardProportional: false,
  isDifficultyIncluded: true,
  isNoCompetition: false,
}
