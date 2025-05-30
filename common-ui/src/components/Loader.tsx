import styled from '@emotion/styled'
import { PropsWithChildren } from 'react'
import { Flip } from '../styles'
import { BoxPanel } from './BoxPanel'
import { Logo, StyledIconProps } from './Icon'

export const Loader = styled(Logo)`
  backface-visibility: visible !important;
  animation: ${Flip} 2s ease infinite;
`

export type ConditionalLoaderProps = {
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
}: PropsWithChildren<ConditionalLoaderProps & StyledIconProps>) {
  if (showLoader) {
    return <Loader size={size} placeSelf={placeSelf} {...props} />
  }

  if (error) {
    return (
      <BoxPanel
        title={
          error instanceof NoDataError
            ? 'No data found'
            : 'An error has occurred'
        }
        placeSelf="center"
      >
        {error.message}
      </BoxPanel>
    )
  }

  return <>{children}</>
}
export class NoDataError extends Error {
  constructor(message = 'No data available') {
    super(message)
    this.name = 'NoDataError'
  }
}
