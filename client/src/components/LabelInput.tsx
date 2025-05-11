import styled from '@emotion/styled'
import { PropsWithChildren } from 'react'
import { GridAreaProps, SpaceProps } from 'styled-system'
import { Box } from './Box'

type LabelInputProps = {
  label: string
  required?: boolean
}
export function LabelInput({
  label,
  children,
  required,
  my = 2,
  ...rest
}: PropsWithChildren<LabelInputProps & SpaceProps & GridAreaProps>) {
  return (
    <Box
      as="label"
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
