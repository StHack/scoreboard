import { User } from '@sthack/scoreboard-common'
import {
  Box,
  LabelInput,
  Popup,
  TextInput,
} from '@sthack/scoreboard-ui/components'
import { useField } from '@sthack/scoreboard-ui/hooks'
import { useAdmin } from 'hooks/useAdmin'
import { useRef } from 'react'

export type UserPasswordFormProps = {
  user: User
  onClose: () => void
}

export function UserPasswordForm({ user, onClose }: UserPasswordFormProps) {
  const { changePassword } = useAdmin()
  const ref = useRef<HTMLFormElement>(null)
  const { inputProp } = useField<string>({
    defaultValue: '',
    disabled: false,
    name: 'password',
    required: true,
  })

  return (
    <Popup
      title={`Update user "${user.username}"`}
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
          changePassword(user, inputProp.value)
          onClose()
        }}
      >
        <LabelInput label="Password" required>
          <TextInput type="password" minLength={5} {...inputProp} />
        </LabelInput>
      </Box>
    </Popup>
  )
}
