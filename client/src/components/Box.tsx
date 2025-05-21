import styled from '@emotion/styled'
import { motion, MotionProps } from 'framer-motion'
import {
  background,
  BackgroundColorProps,
  BackgroundProps,
  border,
  BorderProps,
  color,
  compose,
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
import { cleanStyledSystem, gap, GapProps, place, PlaceProps } from 'styles'

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
  TypographyProps &
  GapProps

export const StyledBoxComposed = compose(
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
  gap,
)

const StyledBox = styled('div', cleanStyledSystem)<BoxProps>(StyledBoxComposed)

export function Box<E extends React.ElementType = 'div'>(
  props: Omit<React.ComponentPropsWithRef<E>, 'as'> & BoxProps & { as?: E },
) {
  return <StyledBox {...props} />
}

const MotionStyledBox = motion(StyledBox)
export function MotionBox<E extends React.ElementType = 'div'>(
  props: Omit<React.ComponentPropsWithRef<E>, 'as'> &
    BoxProps &
    MotionProps & { as?: E },
) {
  return <MotionStyledBox {...props} />
}
