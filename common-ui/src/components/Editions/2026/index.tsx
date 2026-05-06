import { BaseGameConfig } from '@sthack/scoreboard-common'
import { BaseImgIcon, BaseSvg, Icon } from '../../Icon'
import { EditionTheme } from '../types'
import { ChallengeCard2026 } from './components/ChallengeCard'
import Background from './images/background.png'
import Logo from './images/logo.webp'

export const Edition2026Logo: Icon = p => <BaseImgIcon {...p} src={Logo} />

export const Edition2026Theme: EditionTheme = {
  background: Background,
  logo: Edition2026Logo,
  card: ChallengeCard2026,
}

export const Edition2026Config: BaseGameConfig = {
  baseChallScore: 50,
  teamSize: 5,
  isRewardProportional: true,
  isDifficultyIncluded: false,
  isNoCompetition: true,
}
