import { Challenge } from '@sthack/scoreboard-common'
import { Box } from 'components/Box'
import { LabelInput } from 'components/LabelInput'
import Popup from 'components/Popup'
import { TextInput } from 'components/TextInput'
import { useChallengeForm } from 'hooks/useChallengeForm'
import { FormEventHandler, useRef } from 'react'

type FlagEditFormProps = {
  chall: Challenge
  onClose: () => void
}
export function FlagEditForm({ chall, onClose }: FlagEditFormProps) {
  const { formProps, flagsProps, error } = useChallengeForm(chall, onClose)
  const ref = useRef<HTMLDivElement>(null)

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
        p="2"
      >
        <LabelInput label="Specify the new flag" gridArea="flag" required>
          <TextInput type="text" {...flagsProps} required minLength={1} />
        </LabelInput>

        {error && (
          <Box gridArea="err" backgroundColor="red" color="white" role="alert">
            {error}
          </Box>
        )}
      </Box>
    </Popup>
  )
}
