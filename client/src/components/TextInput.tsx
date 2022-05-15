import styled from '@emotion/styled'
import { flex, FlexProps, space, SpaceProps } from 'styled-system'

export const TextInput = styled.input<SpaceProps & FlexProps>`
  padding: ${p => p.theme.space[1]};
  font-size: ${p => p.theme.fontSizes[1]};
  border-bottom: solid ${p => p.theme.colors.greys[0]}
    ${p => p.theme.borderWidths.medium};
  border-radius: 0;
  transition: border-color 250ms;
  color: ${p => p.theme.colors.text};
  ${flex}
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

export const TextArea = TextInput.withComponent('textarea')
