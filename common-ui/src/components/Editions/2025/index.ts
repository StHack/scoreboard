import { BaseGameConfig } from '@sthack/scoreboard-common'
import { BaseSvg, Icon } from '../../Icon'
import { EditionTheme } from '../types'
import { ChallengeCard2025 } from './components/ChallengeCard'
import Background from './images/background.svg'
import LogoSvg from './images/logo.svg?react'

export const Edition2025Logo: Icon = BaseSvg.withComponent(LogoSvg)

export const Edition2025Theme: EditionTheme = {
  background: Background,
  backgroundCredit: {
    href: 'https://www.freepik.com/free-vector/conveyor-belt-assembly-machine-factory-plant-warehouse-cartoon-interior-workshop-production-line-with-automated-machinery-engineering-equipment-manufactory_10798243.htm',
    author: 'upklyak',
    label:
      'Conveyor belt and assembly machine at factory, plant or warehouse. cartoon interior of workshop production line with automated machinery. Engineering equipment on manufactory',
  },
  logo: Edition2025Logo,
  card: ChallengeCard2025,
}

export const Edition2025Config: BaseGameConfig = {
  baseChallScore: 50,
  teamSize: 5,
  isRewardProportional: true,
  isDifficultyIncluded: false,
}
