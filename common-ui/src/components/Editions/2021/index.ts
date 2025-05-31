import { BaseGameConfig } from '@sthack/scoreboard-common'
import { Logo } from '../../Icon'
import { EditionTheme } from '../types'
import { ChallengeCard2021 } from './components/ChallengeCard'

export const Edition2021Theme: EditionTheme = {
  logo: Logo,
  card: ChallengeCard2021,
}

export const Edition2021Config: BaseGameConfig = {
  baseChallScore: 50,
  teamSize: 5,
  isRewardProportional: false,
  isDifficultyIncluded: true,
}
