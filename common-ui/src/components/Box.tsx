import styled from '@emotion/styled'
import { motion, MotionProps } from 'framer-motion'
import {
  background,
  BackgroundProps,
  border,
  BorderProps,
  color,
  ColorProps,
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
import {
  cleanStyledSystem,
  gap,
  GapProps,
  place,
  PlaceProps,
} from '../styles/styled'

type ConflictingHTMLProps = 'color'

export type BoxProps = BackgroundProps &
  BorderProps &
  ColorProps &
  FlexboxProps &
  GapProps &
  GridProps &
  LayoutProps &
  PlaceProps &
  PositionProps &
  ShadowProps &
  SpaceProps &
  TypographyProps

export const StyledBoxComposed = compose(
  background,
  border,
  color,
  flexbox,
  gap,
  grid,
  layout,
  place,
  position,
  shadow,
  space,
  typography,
)

const StyledBox = styled('div', cleanStyledSystem)<BoxProps>(StyledBoxComposed)

export function Box<E extends React.ElementType = 'div'>(
  props: Omit<React.ComponentPropsWithRef<E>, ConflictingHTMLProps | 'as'> &
    BoxProps & { as?: E },
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <StyledBox {...(props as any)} />
}

const MotionStyledBox = motion.create(StyledBox)
export function MotionBox<E extends React.ElementType = 'div'>(
  props: Omit<React.ComponentPropsWithRef<E>, ConflictingHTMLProps | 'as'> &
    BoxProps &
    MotionProps & { as?: E },
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <MotionStyledBox {...(props as any)} />
}
