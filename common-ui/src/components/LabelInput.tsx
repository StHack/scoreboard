import styled from '@emotion/styled'
import { PropsWithChildren } from 'react'
import { FlexboxProps, GridAreaProps, SpaceProps } from 'styled-system'
import { GapProps } from '../styles'
import { Box } from './Box'

type LabelInputProps = {
  label: string
  required?: boolean
  as?: React.ElementType | undefined
}
export function LabelInput({
  as = 'label',
  label,
  children,
  required,
  my = 2,
  ...rest
}: PropsWithChildren<
  LabelInputProps & SpaceProps & GridAreaProps & GapProps & FlexboxProps
>) {
  return (
    <Box
      as={as}
      display="flex"
      flexDirection="column"
      placeItems="stretch"
      gap="1"
      my={my}
      {...rest}
    >
      <Span required={required}>{label}</Span>
      {children}
    </Box>
  )
}

const Span = styled.span<{ required?: boolean }>`
  :after {
    content: ${p => (p.required ? "'*'" : '')};
    color: ${p => p.theme.colors.red};
  }
`
