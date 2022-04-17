import styled from '@emotion/styled'
import {
  color,
  ColorProps,
  size,
  SizeProps,
  space,
  SpaceProps,
} from 'styled-system'
import { cleanStyledSystem } from 'styles'

export const Image = styled.img<SizeProps>`
  object-fit: contain;
  ${size}
`
export const ActionPanel = styled.td<SpaceProps>`
  display: flex;

  > * {
    ${space}
  }
`
export const Table = styled.table<SpaceProps>`
  border-collapse: collapse;
  border: 2px solid rgb(200, 200, 200);
  ${space}

  td,
  th {
    border: 1px solid rgb(190, 190, 190);
  }

  th {
    background-color: rgb(235, 235, 235);
  }

  td {
    text-align: center;
  }

  tr:nth-of-type(even) {
    background-color: rgb(250, 250, 250);
  }

  tr:nth-of-type(odd) {
    background-color: rgb(245, 245, 245);
  }
`
export const Tr = styled('tr', cleanStyledSystem) <ColorProps>`
  ${color}
`
