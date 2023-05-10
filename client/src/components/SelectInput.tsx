import styled from '@emotion/styled'
import { InputHTMLAttributes } from 'react'
import {
  FlexProps,
  LayoutProps,
  SpaceProps,
  flex,
  layout,
  space,
} from 'styled-system'

export type SelectInputProps = InputHTMLAttributes<HTMLSelectElement> & {
  predefinedValues: string[] | readonly string[]
}

export function SelectInput ({
  predefinedValues,
  placeholder,
  ...props
}: SelectInputProps & SpaceProps & FlexProps & LayoutProps) {
  return (
    <Select {...props}>
      {placeholder && (
        <option value="" disabled selected hidden>
          {placeholder}
        </option>
      )}
      {predefinedValues.map(value => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </Select>
  )
}

const Select = styled.select`
  padding: ${p => p.theme.space[1]};
  font-size: ${p => p.theme.fontSizes[1]};
  border-bottom: solid;
  border-color: ${p => p.theme.colors.greys[0]};
  border-width: ${p => p.theme.borderWidths.medium};
  border-radius: ${p => p.theme.radii.small};
  transition: border-color 250ms;
  color: ${p => p.theme.colors.text};
  ${flex}
  ${layout}
  ${space}

  :focus {
    border-color: ${p => p.theme.colors.greys[2]};
  }

  ::-webkit-search-decoration,
  ::-webkit-search-cancel-button,
  ::-webkit-search-results-button,
  ::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }
`
