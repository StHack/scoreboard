import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { ButtonHTMLAttributes } from 'react'
import {
  border,
  BorderProps,
  color,
  ColorProps,
  flex,
  FlexProps,
  FontSizeProps,
  FontWeightProps,
  gridArea,
  GridAreaProps,
  SizeProps,
  space,
  SpaceProps,
  typography,
  variant,
} from 'styled-system'
import { cleanStyledSystem, gap, GapProps, place, PlaceProps } from 'styles'
import { Box } from './Box'
import { Icon } from './Icon'

type StyledButtonProps = SpaceProps &
  GridAreaProps &
  PlaceProps &
  ColorProps &
  BorderProps &
  FontSizeProps &
  SizeProps &
  FlexProps &
  GapProps &
  FontWeightProps & {
    variant?: 'primary' | 'secondary' | 'link' | 'danger'
    href?: string
  }

const Btn = styled('button', cleanStyledSystem)<StyledButtonProps>(
  variant({
    scale: 'buttons',
    variants: {
      primary: {},
    },
  }),
  space,
  color,
  border,
  typography,
  gridArea,
  place,
  flex,
  gap,
  css`
    display: flex;
    cursor: pointer;

    :disabled {
      cursor: default;
    }
  `,
)

export type ButtonProps = StyledButtonProps & {
  icon?: Icon
  responsiveLabel?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

export function Button ({
  icon: Icon,
  children,
  variant,
  href,
  responsiveLabel,
  size = 1,
  ...rest
}: ButtonProps) {
  const defaultPaddingFix =
    !!Icon && !children && variant !== 'link' ? { px: 2, py: 2 } : {}
  const asLink = href ? { as: 'a', href, target: '_blank' } : ({} as any)

  return (
    <Btn variant={variant} gap="2" {...asLink} {...rest} {...defaultPaddingFix}>
      {Icon && <Icon size={size} color="currentColor" />}
      <Box
        as="span"
        display={
          !children ? 'none' : responsiveLabel ? ['none', 'inline'] : undefined
        }
      >
        {children}
      </Box>
    </Btn>
  )
}

Button.defaultProps = {
  variant: 'primary',
  px: 3,
  py: 2,
  fontWeight: 1,
  fontSize: 1,
  borderWidth: 'thick',
  borderRadius: 4,
  placeItems: 'center',
  placeContent: 'center',
}
