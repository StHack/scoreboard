import styled from '@emotion/styled'
import { PropsWithChildren } from 'react'
import { space, SpaceProps } from 'styled-system'

const Label = styled.label<SpaceProps>`
  display: flex;
  flex-direction: column;
  ${space}
`

const Span = styled.span<{ required?: boolean }>`
  :after {
    content: ${p => (p.required ? "'*'" : '')};
    color: ${p => p.theme.colors.red};
  }
`

type LabelInputProps = SpaceProps & {
  label: string
  required?: boolean
}
export function LabelInput({
  label,
  children,
  required,
  my = 2,
  ...rest
}: PropsWithChildren<LabelInputProps>) {
  return (
    <Label my={my} {...rest}>
      <Span required={required}>{label}</Span>
      {children}
    </Label>
  )
}
