import styled from '@emotion/styled'
import { motion, MotionProps } from 'framer-motion'
import { ReactNode } from 'react'
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

type ConflictingHTMLProps = 'color' | 'width' | 'height'

export type BoxProps = SpaceProps &
  LayoutProps &
  ShadowProps &
  BackgroundProps &
  ColorProps &
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

const StyledBox = styled(
  'div',
  cleanStyledSystem,
)<BoxProps & { as?: React.ElementType }>(StyledBoxComposed) as unknown as <
  E extends React.ElementType,
>(
  props: Omit<React.ComponentPropsWithRef<E>, ConflictingHTMLProps | 'as'> &
    BoxProps & { as?: E },
) => ReactNode

export function Box<E extends React.ElementType = 'div'>(
  props: Omit<React.ComponentPropsWithRef<E>, ConflictingHTMLProps | 'as'> &
    BoxProps & { as?: E },
) {
  return <StyledBox {...props} />
}

const MotionStyledBox = motion.create(StyledBox)
export function MotionBox<E extends React.ElementType = 'div'>(
  props: Omit<React.ComponentPropsWithRef<E>, ConflictingHTMLProps | 'as'> &
    BoxProps &
    MotionProps & { as?: E },
) {
  return <MotionStyledBox {...props} />
}
