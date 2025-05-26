import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { FunctionComponent } from 'react'
import {
  color,
  ColorProps,
  LayoutProps,
  size,
  SizeProps,
  space,
  SpaceProps,
} from 'styled-system'
import { cleanStyledSystem, place, PlaceProps } from '../../styles'
import AchievementSvg from './images/achievement.svg?react'
import AttemptSvg from './images/attempt.svg?react'
import BannerSvg from './images/Banner.svg?react'
import BreakSvg from './images/break.svg?react'
import ChallengeSvg from './images/challenge.svg?react'
import CreateSvg from './images/create.svg?react'
import DeleteSvg from './images/delete.svg?react'
import DemoteSvg from './images/demote.svg?react'
import DiscordSvg from './images/discord.svg?react'
import EditSvg from './images/edit.svg?react'
import FlagSvg from './images/flag.svg?react'
import FlagEditSvg from './images/flag-edit.svg?react'
import GameSvg from './images/game.svg?react'
import JsonSvg from './images/json.svg?react'
import LogoSvg from './images/Logo.svg?react'
import Logo2023Svg from './images/logo-2023.svg?react'
import Logo2023IconSvg from './images/logo-2023-icon.svg?react'
import Logo2024Svg from './images/logo-2024.svg?react'
import Logo2025Svg from './images/logo-2025.svg?react'
import LogoDogSvg from './images/logo-dog.svg?react'
import LogoPigeonSvg from './images/logo-pigeon.svg?react'
import LogoutSvg from './images/logout.svg?react'
import PasswordSvg from './images/password.svg?react'
import PreviewSvg from './images/preview.svg?react'
import PromoteSvg from './images/promote.svg?react'
import RepairSvg from './images/repair.svg?react'
import TeamsSvg from './images/teams.svg?react'
import TwitterSvg from './images/twitter.svg?react'
import UsersSvg from './images/users.svg?react'
import ValidateSvg from './images/validate.svg?react'

export type StyledIconProps = SpaceProps &
  PlaceProps &
  ColorProps &
  LayoutProps &
  SizeProps

export type Icon = FunctionComponent<StyledIconProps>

const BaseSvg = styled('svg', cleanStyledSystem)(
  space,
  size,
  color,
  place,
  css`
    fill: currentColor;
  `,
)

export const Logo: Icon = BaseSvg.withComponent(LogoSvg)
export const Banner: Icon = BaseSvg.withComponent(BannerSvg)
export const IconAchievement: Icon = BaseSvg.withComponent(AchievementSvg)
export const IconAttempt: Icon = BaseSvg.withComponent(AttemptSvg)
export const IconBreak: Icon = BaseSvg.withComponent(BreakSvg)
export const IconChallenge: Icon = BaseSvg.withComponent(ChallengeSvg)
export const IconCreate: Icon = BaseSvg.withComponent(CreateSvg)
export const IconDelete: Icon = BaseSvg.withComponent(DeleteSvg)
export const IconDemote: Icon = BaseSvg.withComponent(DemoteSvg)
export const IconDiscord: Icon = BaseSvg.withComponent(DiscordSvg)
export const IconEdit: Icon = BaseSvg.withComponent(EditSvg)
export const IconFlag: Icon = BaseSvg.withComponent(FlagSvg)
export const IconFlagEdit: Icon = BaseSvg.withComponent(FlagEditSvg)
export const IconGame: Icon = BaseSvg.withComponent(GameSvg)
export const IconJson: Icon = BaseSvg.withComponent(JsonSvg)
export const IconLogo2023: Icon = BaseSvg.withComponent(Logo2023Svg)
export const IconLogo2023Icon: Icon = BaseSvg.withComponent(Logo2023IconSvg)
export const IconLogo2024: Icon = BaseSvg.withComponent(Logo2024Svg)
export const IconLogo2025: Icon = BaseSvg.withComponent(Logo2025Svg)
export const IconLogoDog: Icon = BaseSvg.withComponent(LogoDogSvg)
export const IconLogoPigeon: Icon = BaseSvg.withComponent(LogoPigeonSvg)
export const IconLogout: Icon = BaseSvg.withComponent(LogoutSvg)
export const IconPassword: Icon = BaseSvg.withComponent(PasswordSvg)
export const IconPreview: Icon = BaseSvg.withComponent(PreviewSvg)
export const IconPromote: Icon = BaseSvg.withComponent(PromoteSvg)
export const IconRepair: Icon = BaseSvg.withComponent(RepairSvg)
export const IconTeams: Icon = BaseSvg.withComponent(TeamsSvg)
export const IconTwitter: Icon = BaseSvg.withComponent(TwitterSvg)
export const IconUsers: Icon = BaseSvg.withComponent(UsersSvg)
export const IconValidate: Icon = BaseSvg.withComponent(ValidateSvg)
