import styled from '@emotion/styled'
import { Flip } from 'styles/animation'
import { Logo } from './Icon'

export const Loader = styled(Logo)`
  backface-visibility: visible !important;
  animation: ${Flip} 2s ease infinite;
`
