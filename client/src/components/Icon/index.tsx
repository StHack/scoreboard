import { css } from '@emotion/react'
import styled, { StyledComponent } from '@emotion/styled'
import { FunctionComponent, SVGProps } from 'react'
import {
  ColorProps,
  LayoutProps,
  SpaceProps,
  color,
  layout,
  space,
} from 'styled-system'
import { PlaceProps, cleanStyledSystem, place } from 'styles'
import { ReactComponent as BannerSvg } from './images/Banner.svg'
import { ReactComponent as LogoSvg } from './images/Logo.svg'
import { ReactComponent as AchievementSvg } from './images/achievement.svg'
import { ReactComponent as AttemptSvg } from './images/attempt.svg'
import { ReactComponent as BreakSvg } from './images/break.svg'
import { ReactComponent as ChallengeSvg } from './images/challenge.svg'
import { ReactComponent as EditSvg } from './images/edit.svg'
import { ReactComponent as GameSvg } from './images/game.svg'
import { ReactComponent as Logo2023Svg } from './images/logo-2023.svg'
import { ReactComponent as Logo2023IconSvg } from './images/logo-2023-icon.svg'
import { ReactComponent as LogoPigeonSvg } from './images/logo-pigeon.svg'
import { ReactComponent as RepairSvg } from './images/repair.svg'
import { ReactComponent as UsersSvg } from './images/users.svg'

type StyledIconProps = SpaceProps & PlaceProps & ColorProps & LayoutProps

export type Icon = StyledComponent<
  FunctionComponent<SVGProps<SVGSVGElement>>,
  StyledIconProps,
  any
>

const BaseSvg = (svg: FunctionComponent<SVGProps<SVGSVGElement>>) =>
  styled(svg, cleanStyledSystem)<StyledIconProps>(
    space,
    place,
    color,
    layout,
    css`
      fill: currentColor;
    `,
  )

// const BaseImg = styled('img', cleanStyledSystem)<StyledIconProps>(
//   space,
//   place,
//   color,
//   layout,
//   css`
//     object-fit: contain;
//   `,
// )

// const BImg = (s: string, title?: string) => (p: StyledIconProps) =>
//   <BaseImg {...(p as any)} alt={title} title={title} src={s} />

// export const Logo = BImg(LogoImg, 'logo')

export const Logo = BaseSvg(LogoSvg)
export const Banner = BaseSvg(BannerSvg)
export const IconAchievement = BaseSvg(AchievementSvg)
export const IconAttempt = BaseSvg(AttemptSvg)
export const IconBreak = BaseSvg(BreakSvg)
export const IconChallenge = BaseSvg(ChallengeSvg)
export const IconEdit = BaseSvg(EditSvg)
export const IconGame = BaseSvg(GameSvg)
export const IconLogo2023 = BaseSvg(Logo2023Svg)
export const IconLogo2023Icon = BaseSvg(Logo2023IconSvg)
export const IconLogoPigeon = BaseSvg(LogoPigeonSvg)
export const IconRepair = BaseSvg(RepairSvg)
export const IconUsers = BaseSvg(UsersSvg)
