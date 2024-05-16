import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { PropsWithChildren } from 'react'
import { NavLink, NavLinkProps } from 'react-router-dom'
import {
  color,
  ColorProps,
  display,
  DisplayProps,
  flexbox,
  FlexboxProps,
  fontSize,
  FontSizeProps,
  space,
  SpaceProps,
} from 'styled-system'
import { cleanStyledSystem, gap, GapProps } from 'styles'

type LinkProps = ColorProps &
  SpaceProps &
  FontSizeProps &
  DisplayProps &
  FlexboxProps &
  GapProps

export const Link = ({
  display = 'flex',
  flexDirection = ['column', 'row'],
  alignItems = 'center',
  fontSize = [0, 2, 3],
  px = [1, 2, 3],
  py = 2,
  gap = [1, 2],
  ...p
}: PropsWithChildren<LinkProps & NavLinkProps>) => (
  <StyledLink
    display={display}
    flexDirection={flexDirection}
    alignItems={alignItems}
    fontSize={fontSize}
    px={px}
    py={py}
    gap={gap}
    {...p}
  />
)

const StyledLink = styled(NavLink, cleanStyledSystem)<LinkProps>(
  color,
  space,
  fontSize,
  display,
  flexbox,
  gap,
  css`
    color: inherit;
    text-decoration: none;

    &.active {
      text-decoration: underline;
    }
  `,
)
