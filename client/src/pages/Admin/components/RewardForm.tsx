import { Box } from 'components/Box'
import { LabelInput } from 'components/LabelInput'
import Popup from 'components/Popup'
import { SelectInput } from 'components/SelectInput'
import { TextInput } from 'components/TextInput'
import { useAdmin } from 'hooks/useAdmin'
import { useField } from 'hooks/useField'
import { ChangeEvent, RefObject, useRef } from 'react'

export type RewardEditMode = 'password' | 'team'

export type RewardFormProps = {
  onClose: () => void
}

export function RewardForm({ onClose }: RewardFormProps) {
  const { createReward, users } = useAdmin()
  const existingTeams = [...new Set(users.map(u => u.team))].sort()
  const ref = useRef<HTMLFormElement>(null)
  const { inputProp: teamProps } = useField<string>({
    defaultValue: existingTeams[0] ?? '',
    disabled: false,
    name: 'team',
    required: true,
  })

  const { inputProp: labelProps } = useField<string>({
    defaultValue: '',
    disabled: false,
    name: 'label',
    required: true,
  })

  const { inputProp: valueProps } = useField<number>({
    defaultValue: 100,
    disabled: false,
    name: 'value',
    required: true,
    valueRetriever: e =>
      (e as ChangeEvent<HTMLInputElement>).currentTarget.valueAsNumber,
  })

  return (
    <Popup
      title="Create reward"
      onCancel={onClose}
      onValidate={() => ref.current?.requestSubmit()}
    >
      <Box
        as="form"
        display="flex"
        ref={ref as unknown as RefObject<HTMLDivElement>}
        flexDirection="column"
        onSubmit={async e => {
          e.preventDefault()
          try {
            await createReward({
              label: labelProps.value,
              teamname: teamProps.value,
              value: valueProps.value,
            })
            onClose()
          } catch (error) {
            alert(JSON.stringify(error))
          }
        }}
      >
        <LabelInput label="Team" required>
          <SelectInput predefinedValues={existingTeams} {...teamProps} />
        </LabelInput>

        <LabelInput label="Label" required>
          <TextInput type="text" {...labelProps} />
        </LabelInput>

        <LabelInput label="Points value" required>
          <TextInput type="number" {...valueProps} />
        </LabelInput>
      </Box>
    </Popup>
  )
}
