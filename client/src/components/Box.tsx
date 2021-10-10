import styled from '@emotion/styled'
import {
  background,
  BackgroundColorProps,
  BackgroundProps,
  border,
  BorderProps,
  color,
  flexbox,
  FlexboxProps,
  grid,
  GridProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
  shadow,
  ShadowProps,
  space,
  SpaceProps,
  typography,
  TypographyProps,
} from 'styled-system'
import { cleanStyledSystem, place, PlaceProps } from 'styles'

export type BoxProps = SpaceProps &
  LayoutProps &
  ShadowProps &
  BackgroundProps &
  BackgroundColorProps &
  GridProps &
  PositionProps &
  FlexboxProps &
  BorderProps &
  PlaceProps &
  TypographyProps

export const Box = styled('div', cleanStyledSystem)<BoxProps>(
  border,
  layout,
  shadow,
  background,
  color,
  space,
  grid,
  position,
  flexbox,
  place,
  typography,
)
