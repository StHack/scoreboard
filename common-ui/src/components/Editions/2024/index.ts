import { BaseGameConfig } from '@sthack/scoreboard-common'
import { BaseSvg, Icon } from '../../Icon'
import { EditionTheme } from '../types'
import { ChallengeCard2024 } from './components/ChallengeCard'
import Background from './images/background.svg'
import LogoSvg from './images/logo.svg?react'

export const Edition2024Logo: Icon = BaseSvg.withComponent(LogoSvg)

export const Edition2024Theme: EditionTheme = {
  background: Background,
  backgroundCredit: {
    href: 'https://www.freepik.com/free-vector/desert-landscape-video-conferencing_9702292.htm',
    author: 'Freepik',
    label: 'Desert landscape for video conferencing',
  },
  logo: Edition2024Logo,
  card: ChallengeCard2024,
}

export const Edition2024Config: BaseGameConfig = {
  baseChallScore: 50,
  teamSize: 5,
  isRewardProportional: true,
  isDifficultyIncluded: false,
}
