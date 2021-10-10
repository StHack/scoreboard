import styled from '@emotion/styled'
import { LabelInput } from 'components/LabelInput'
import Popup from 'components/Popup'
import { TextInput } from 'components/TextInput'
import { useAdmin } from 'hooks/useAdmin'
import { useField } from 'hooks/useField'
import { User } from 'models/User'
import { useRef } from 'react'

export type UserEditMode = 'password' | 'team'

export type UserFormProps = {
  user: User
  editMode: UserEditMode
  onClose: () => void
}

export function UserForm ({ user, editMode, onClose }: UserFormProps) {
  const { changePassword, changeTeam } = useAdmin()
  const ref = useRef<HTMLFormElement>(null)
  const { inputProp } = useField<string>({
    defaultValue: '',
    disabled: false,
    name: editMode,
    required: true,
  })

  return (
    <Popup
      title={`Update user ${user.username} ${editMode}`}
      onCancel={onClose}
      onValidate={() => ref.current?.requestSubmit()}
    >
      <Form
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
          <TextInput
            type={editMode === 'password' ? 'password' : 'text'}
            minLength={5}
            {...inputProp}
          />
        </LabelInput>
      </Form>
    </Popup>
  )
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
`
