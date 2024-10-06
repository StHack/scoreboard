import styled from '@emotion/styled'
import { PropsWithChildren } from 'react'
import { Flip } from 'styles/animation'
import { Logo, StyledIconProps } from './Icon'

export const Loader = styled(Logo)`
  backface-visibility: visible !important;
  animation: ${Flip} 2s ease infinite;
`

type ConditionalLoaderProps = StyledIconProps & {
  showLoader: boolean
}

export function ConditionalLoader({
  showLoader,
  size = 2,
  placeSelf = 'center',
  children,
  ...props
}: PropsWithChildren<ConditionalLoaderProps>) {
  return showLoader ? (
    <Loader size={size} placeSelf={placeSelf} {...props} />
  ) : (
    <>{children}</>
  )
}
