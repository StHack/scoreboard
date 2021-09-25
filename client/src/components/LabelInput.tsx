import styled from '@emotion/styled'
import { PropsWithChildren } from 'react'
import { space, SpaceProps } from 'styled-system'

const Label = styled.label`
  display: flex;
  flex-direction: column;
  ${space}
`

type LabelInputProps = SpaceProps & {
  label: string
}
export function LabelInput ({
  label,
  children,
  ...rest
}: PropsWithChildren<LabelInputProps>) {
  return (
    <Label {...rest}>
      <span>{label}</span>
      {children}
    </Label>
  )
}

LabelInput.defaultProps = {
  my: 2,
}
