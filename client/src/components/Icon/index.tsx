import { css } from '@emotion/react'
import styled, { StyledComponent } from '@emotion/styled'
import { FunctionComponent, SVGProps } from 'react'
import {
  color,
  ColorProps,
  layout,
  LayoutProps,
  space,
  SpaceProps,
} from 'styled-system'
import { cleanStyledSystem, place, PlaceProps } from 'styles'
import AchievementSvg from './images/achievement.svg?react'
import AttemptSvg from './images/attempt.svg?react'
import BannerSvg from './images/Banner.svg?react'
import BreakSvg from './images/break.svg?react'
import ChallengeSvg from './images/challenge.svg?react'
import CreateSvg from './images/create.svg?react'
import DeleteSvg from './images/delete.svg?react'
import DemoteSvg from './images/demote.svg?react'
import EditSvg from './images/edit.svg?react'
import GameSvg from './images/game.svg?react'
import JsonSvg from './images/json.svg?react'
import LogoSvg from './images/Logo.svg?react'
import Logo2023Svg from './images/logo-2023.svg?react'
import Logo2023IconSvg from './images/logo-2023-icon.svg?react'
import Logo2024Svg from './images/logo-2024.svg?react'
import LogoDogSvg from './images/logo-dog.svg?react'
import LogoPigeonSvg from './images/logo-pigeon.svg?react'
import LogoutSvg from './images/logout.svg?react'
import PasswordSvg from './images/password.svg?react'
import PromoteSvg from './images/promote.svg?react'
import RepairSvg from './images/repair.svg?react'
import TeamsSvg from './images/teams.svg?react'
import UsersSvg from './images/users.svg?react'
import ValidateSvg from './images/validate.svg?react'

type StyledIconProps = SpaceProps & PlaceProps & ColorProps & LayoutProps

export type Icon = StyledComponent<
  FunctionComponent<SVGProps<SVGSVGElement>>,
  StyledIconProps,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
export const IconCreate = BaseSvg(CreateSvg)
export const IconDelete = BaseSvg(DeleteSvg)
export const IconDemote = BaseSvg(DemoteSvg)
export const IconEdit = BaseSvg(EditSvg)
export const IconGame = BaseSvg(GameSvg)
export const IconJson = BaseSvg(JsonSvg)
export const IconLogo2023 = BaseSvg(Logo2023Svg)
export const IconLogo2023Icon = BaseSvg(Logo2023IconSvg)
export const IconLogo2024 = BaseSvg(Logo2024Svg)
export const IconLogoDog = BaseSvg(LogoDogSvg)
export const IconLogoPigeon = BaseSvg(LogoPigeonSvg)
export const IconLogout = BaseSvg(LogoutSvg)
export const IconPassword = BaseSvg(PasswordSvg)
export const IconPromote = BaseSvg(PromoteSvg)
export const IconRepair = BaseSvg(RepairSvg)
export const IconTeams = BaseSvg(TeamsSvg)
export const IconUsers = BaseSvg(UsersSvg)
export const IconValidate = BaseSvg(ValidateSvg)
