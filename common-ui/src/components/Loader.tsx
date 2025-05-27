import styled from '@emotion/styled'
import { PropsWithChildren } from 'react'
import { Flip } from '../styles'
import { BoxPanel } from './BoxPanel'
import { Logo, StyledIconProps } from './Icon'

export const Loader = styled(Logo)`
  backface-visibility: visible !important;
  animation: ${Flip} 2s ease infinite;
`

type ConditionalLoaderProps = StyledIconProps & {
  showLoader: boolean
  error?: Error
}

export function ConditionalLoader({
  showLoader,
  error,
  size = 2,
  placeSelf = 'center',
  children,
  ...props
}: PropsWithChildren<ConditionalLoaderProps>) {
  if (showLoader) {
    return <Loader size={size} placeSelf={placeSelf} {...props} />
  }

  if (error) {
    return (
      <BoxPanel title="An error has occurred" placeSelf="center">
        {error.message}
      </BoxPanel>
    )
  }

  return <>{children}</>
}
