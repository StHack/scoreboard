import { isPlayer, User } from '@sthack/scoreboard-common'
import {
  Box,
  LabelInput,
  Popup,
  SelectInput,
  SelectInputValue,
  TextInput,
} from '@sthack/scoreboard-ui/components'
import { useField } from '@sthack/scoreboard-ui/hooks'
import { useAdmin } from 'hooks/useAdmin'
import { useRef } from 'react'

export type UserTeamFormProps = {
  user: User
  onClose: () => void
}

export function UserTeamForm({ user, onClose }: UserTeamFormProps) {
  const { changeTeam, teams } = useAdmin()
  const ref = useRef<HTMLFormElement>(null)
  const { inputProp } = useField<string>({
    name: 'team',
    defaultValue: isPlayer(user) ? user.team._id : '',
    disabled: false,
    required: false,
  })

  const values = teams
    .map<SelectInputValue>(t => ({
      label: t.name,
      value: t._id,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))

  return (
    <Popup
      title={`Update user "${user.username}" Team`}
      onCancel={onClose}
      onValidate={() => ref.current?.requestSubmit()}
    >
      <Box
        as="form"
        display="flex"
        flexDirection="column"
        ref={ref}
        onSubmit={e => {
          e.preventDefault()
          changeTeam(user, inputProp.value)
          onClose()
        }}
      >
        <LabelInput label="Team" required>
          <SelectInput
            allowEmpty
            predefinedValues={values}
            placeholder="Select a team"
            {...inputProp}
          />
        </LabelInput>
      </Box>
    </Popup>
  )
}
