import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { FunctionComponent } from 'react'
import {
  color,
  ColorProps,
  gridArea,
  GridAreaProps,
  LayoutProps,
  size,
  SizeProps,
  space,
  SpaceProps,
} from 'styled-system'
import { cleanStyledSystem, place, PlaceProps } from '../../styles/styled'
import AchievementSvg from './images/achievement.svg?react'
import AISvg from './images/ai.svg?react'
import AttemptSvg from './images/attempt.svg?react'
import BannerSvg from './images/Banner.svg?react'
import BreakSvg from './images/break.svg?react'
import BreakthroughSvg from './images/breakthrough.svg?react'
import ChallengeSvg from './images/challenge.svg?react'
import ClueSvg from './images/clue.svg?react'
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
import LogoutSvg from './images/logout.svg?react'
import PasswordSvg from './images/password.svg?react'
import PreviewSvg from './images/preview.svg?react'
import PromoteSvg from './images/promote.svg?react'
import RepairSvg from './images/repair.svg?react'
import SatisfactionSvg from './images/satisfaction.svg?react'
import SurveySvg from './images/survey.svg?react'
import TeamsSvg from './images/teams.svg?react'
import TwitterSvg from './images/twitter.svg?react'
import UsersSvg from './images/users.svg?react'
import ValidateSvg from './images/validate.svg?react'

export type StyledIconProps = SpaceProps &
  PlaceProps &
  ColorProps &
  LayoutProps &
  SizeProps &
  GridAreaProps

export type Icon = FunctionComponent<StyledIconProps>

export const BaseSvg = styled('svg', cleanStyledSystem)(
  space,
  size,
  color,
  place,
  gridArea,
  css`
    fill: currentColor;
  `,
)

export const BaseImgIcon = styled('img', cleanStyledSystem)(
  space,
  size,
  color,
  place,
  gridArea,
  css`
    object-fit: contain;
    width: 100%;
  `,
)

export const Logo: Icon = BaseSvg.withComponent(LogoSvg)
export const Banner: Icon = BaseSvg.withComponent(BannerSvg)
export const IconAchievement: Icon = BaseSvg.withComponent(AchievementSvg)
export const IconAI: Icon = BaseSvg.withComponent(AISvg)
export const IconAttempt: Icon = BaseSvg.withComponent(AttemptSvg)
export const IconBreak: Icon = BaseSvg.withComponent(BreakSvg)
export const IconChallenge: Icon = BaseSvg.withComponent(ChallengeSvg)
export const IconClue: Icon = BaseSvg.withComponent(ClueSvg)
export const IconCreate: Icon = BaseSvg.withComponent(CreateSvg)
export const IconDelete: Icon = BaseSvg.withComponent(DeleteSvg)
export const IconDemote: Icon = BaseSvg.withComponent(DemoteSvg)
export const IconDiscord: Icon = BaseSvg.withComponent(DiscordSvg)
export const IconEdit: Icon = BaseSvg.withComponent(EditSvg)
export const IconFlag: Icon = BaseSvg.withComponent(FlagSvg)
export const IconFlagEdit: Icon = BaseSvg.withComponent(FlagEditSvg)
export const IconGame: Icon = BaseSvg.withComponent(GameSvg)
export const IconJson: Icon = BaseSvg.withComponent(JsonSvg)
export const IconBreakthrough: Icon = BaseSvg.withComponent(BreakthroughSvg)
export const IconLogout: Icon = BaseSvg.withComponent(LogoutSvg)
export const IconPassword: Icon = BaseSvg.withComponent(PasswordSvg)
export const IconPreview: Icon = BaseSvg.withComponent(PreviewSvg)
export const IconPromote: Icon = BaseSvg.withComponent(PromoteSvg)
export const IconRepair: Icon = BaseSvg.withComponent(RepairSvg)
export const IconSatisfaction: Icon = BaseSvg.withComponent(SatisfactionSvg)
export const IconSurvey: Icon = BaseSvg.withComponent(SurveySvg)
export const IconTeams: Icon = BaseSvg.withComponent(TeamsSvg)
export const IconTwitter: Icon = BaseSvg.withComponent(TwitterSvg)
export const IconUsers: Icon = BaseSvg.withComponent(UsersSvg)
export const IconValidate: Icon = BaseSvg.withComponent(ValidateSvg)
