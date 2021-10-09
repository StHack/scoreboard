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
import { ReactComponent as BannerSvg } from './images/Banner.svg'
import { ReactComponent as LogoSvg } from './images/Logo.svg'

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

const BaseImg = styled('img', cleanStyledSystem)<StyledIconProps>(
  space,
  place,
  color,
  layout,
  css`
    object-fit: contain;
  `,
)

const BImg = (s: string, title?: string) => (p: StyledIconProps) =>
  <BaseImg {...(p as any)} alt={title} title={title} src={s} />

// export const Logo = BImg(LogoImg, 'logo')

export const Logo = BaseSvg(LogoSvg)
export const Banner = BaseSvg(BannerSvg)
