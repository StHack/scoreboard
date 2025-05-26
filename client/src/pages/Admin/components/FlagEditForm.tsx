import { Challenge } from '@sthack/scoreboard-common'
import { Box, Popup } from '@sthack/scoreboard-ui/components'
import { useChallengeForm } from 'hooks/useChallengeForm'
import { FormEventHandler, useRef } from 'react'
import { FlagInput } from './FlagInput'

type FlagEditFormProps = {
  chall: Challenge
  onClose: () => void
}
export function FlagEditForm({ chall, onClose }: FlagEditFormProps) {
  const { formProps, flagsProps, flagPatternProps, error } = useChallengeForm(
    chall,
    onClose,
  )
  const ref = useRef<HTMLFormElement>(null)

  return (
    <Popup
      title={`Modification of "${chall.name}" flag`}
      onCancel={onClose}
      onValidate={() =>
        ref.current &&
        (ref.current as unknown as HTMLFormElement).reportValidity() &&
        ref.current?.dispatchEvent(new Event('submit', { cancelable: true }))
      }
    >
      <Box
        as="form"
        ref={ref}
        onSubmitCapture={formProps.onSubmitCapture as FormEventHandler}
        px="3"
        pb="2"
        display="flex"
        flexDirection="column"
      >
        <FlagInput
          flagsProps={flagsProps}
          flagPatternProps={flagPatternProps}
        />

        {error && (
          <Box gridArea="err" backgroundColor="red" color="white" role="alert">
            {error}
          </Box>
        )}
      </Box>
    </Popup>
  )
}
