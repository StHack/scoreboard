import styled from '@emotion/styled'
import { User } from '@sthack/scoreboard-common'
import {
  Box,
  LabelInput,
  Popup,
  SelectInput,
  TextInput,
} from '@sthack/scoreboard-ui/components'
import { useField } from '@sthack/scoreboard-ui/hooks'
import { useAdmin } from 'hooks/useAdmin'
import { useRef } from 'react'

export type UserEditMode = 'password' | 'team'

export type UserFormProps = {
  user: User
  editMode: UserEditMode
  onClose: () => void
}

export function UserForm({ user, editMode, onClose }: UserFormProps) {
  const { changePassword, changeTeam, users } = useAdmin()
  const ref = useRef<HTMLFormElement>(null)
  const { inputProp } = useField<string>({
    defaultValue: editMode === 'team' ? user.team : '',
    disabled: false,
    name: editMode,
    required: true,
  })

  const existingTeams = [
    ...new Set(users.map(u => u.team).filter(u => u !== 'admin')),
  ].sort()

  return (
    <Popup
      title={`Update user "${user.username}" ${editMode}`}
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
          if (editMode === 'password') {
            changePassword(user, inputProp.value)
            onClose()
          }

          if (editMode === 'team') {
            changeTeam(user, inputProp.value)
            onClose()
          }
        }}
      >
        <LabelInput label={editMode} required>
          {editMode === 'password' && (
            <TextInput type="password" minLength={5} {...inputProp} />
          )}
          {editMode === 'team' && (
            <SelectInput predefinedValues={existingTeams} {...inputProp} />
          )}
        </LabelInput>
      </Box>
    </Popup>
  )
}
