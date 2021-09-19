import { css } from '@emotion/react'
import styled, { StyledComponent } from '@emotion/styled'
import { FunctionComponent, SVGProps } from 'react'
import {
  color,
  compose,
  size,
  SizeProps,
  space,
  SpaceProps,
} from 'styled-system'
import { clean, place, PlaceProps } from 'styles'
// import { ReactComponent as Add } from './add.svg'

type StyledIconProps = SpaceProps & SizeProps & PlaceProps & { title?: string }

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

const BaseBaseImg = styled.img<StyledIconProps>(
  space,
  size,
  css`
    object-fit: contain;
  `,
)

const BaseImg = (src: string, title?: string): Icon => {
  const icon = styled(BaseBaseImg)()
  icon.defaultProps = {
    src,
    title,
  }
  return icon
}

// export const AddIcon = BaseSvg(Add)
