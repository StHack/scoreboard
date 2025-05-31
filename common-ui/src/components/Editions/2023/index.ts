import { BaseSvg, Icon } from '../../Icon'
import { EditionTheme } from '../types'
import { ChallengeCard2023 } from './component/ChallengeCard'
import Background from './images/background.svg'
import LogoSvg from './images/logo.svg?react'

export const Edition2023Logo: Icon = BaseSvg.withComponent(LogoSvg)

export const Edition2023Theme: EditionTheme = {
  background: Background,
  backgroundCredit: {
    href: 'https://www.freepik.com/free-vector/hand-drawn-flat-design-mountain-landscape_20008383.htm',
    author: 'Freepik',
    label: 'Hand drawn flat design mountain landscape',
  },
  logo: Edition2023Logo,
  card: ChallengeCard2023,
}
