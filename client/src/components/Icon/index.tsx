import { css } from '@emotion/react'
import styled, { StyledComponent } from '@emotion/styled'
import { FunctionComponent, SVGProps } from 'react'
import {
  color,
  ColorProps,
  compose,
  size,
  SizeProps,
  space,
  SpaceProps,
} from 'styled-system'
import { clean, cleanStyledSystem, place, PlaceProps } from 'styles'
import LogoImg from './images/logo.png'
import BannerImg from './images/banner.png'
// import { ReactComponent as Add } from './add.svg'

type StyledIconProps = SpaceProps &
  SizeProps &
  PlaceProps &
  ColorProps & { title?: string }

export type Icon = StyledComponent<
  FunctionComponent<SVGProps<SVGSVGElement>>,
  StyledIconProps,
  any
>

const BaseSvg = (
  svg: FunctionComponent<SVGProps<SVGSVGElement>>,
): Icon => styled(svg, clean('color', 'fill'))<StyledIconProps>`
  ${compose(space, size, color, place)}
  fill: currentColor;
`

const BaseImg = styled('img', cleanStyledSystem)<StyledIconProps>(
  space,
  size,
  color,
  place,
  css`
    object-fit: contain;
  `,
)

const BImg = (s: string, title?: string) => (p: StyledIconProps) =>
  <BaseImg {...(p as any)} alt={title} title={title} src={s} />

export const Logo = BImg(LogoImg, 'logo')
export const Banner = BImg(BannerImg, 'banner')

// export const AddIcon = BaseSvg(Add)
