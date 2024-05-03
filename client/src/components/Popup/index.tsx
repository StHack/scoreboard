import { Button } from 'components/Button'
import { ReactNode } from 'react'
import { SpaceProps } from 'styled-system'
import {
  PopupActionPanel,
  PopupBackground,
  PopupContainer,
  PopupPanel,
  PopupTitle,
} from './styled'

type PopupProps = {
  title?: string
  onClose?: () => void
  onCancel?: () => void
  onValidate?: () => void
  minHeightRequired?: boolean
  children?: ReactNode
  customAction?: ReactNode
}

export default function Popup({
  title,
  onClose,
  onCancel,
  onValidate,
  children,
  customAction,
  minHeightRequired,
  px = [2, 3, 5],
  py = [3, 3, 5],
  ...rest
}: PopupProps & SpaceProps) {
  return (
    <PopupBackground
      px={px}
      py={py}
      {...rest}
      onClick={event =>
        event.currentTarget === event.target &&
        (onCancel ? onCancel() : onClose?.())
      }
    >
      <PopupContainer padding="2">
        {title && <PopupTitle>{title}</PopupTitle>}
        {title && <hr />}

        <PopupPanel autosize={!minHeightRequired}>{children}</PopupPanel>

        <hr />

        <PopupActionPanel>
          {onClose && (
            <Button variant="primary" onClick={onClose} title="Close">
              Close
            </Button>
          )}

          {onCancel && (
            <Button variant="secondary" onClick={onCancel} title="Cancel">
              Cancel
            </Button>
          )}

          {customAction}

          {onValidate && (
            <Button variant="primary" onClick={onValidate} title="Confirm">
              Confirm
            </Button>
          )}
        </PopupActionPanel>
      </PopupContainer>
    </PopupBackground>
  )
}
