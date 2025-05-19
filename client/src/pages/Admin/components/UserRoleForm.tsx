import styled from '@emotion/styled'
import { User, UserRole, UserRoleDescriptions } from '@sthack/scoreboard-common'
import { Box } from 'components/Box'
import { LabelInput } from 'components/LabelInput'
import Popup from 'components/Popup'
import { TextInput } from 'components/TextInput'
import { useAdmin } from 'hooks/useAdmin'
import { useRef, useState } from 'react'

export type UserRoleFormProps = {
  user: User
  onClose: () => void
}

export function UserRoleForm({ user, onClose }: UserRoleFormProps) {
  const { changeRoles } = useAdmin()
  const ref = useRef<HTMLFormElement>(null)

  const [values, setValues] = useState<UserRole[]>(user.roles)

  const onChange = (roles: UserRole[]) => {
    console.log('onChange', roles)
    if (roles.includes(UserRole.Admin) && values.includes(UserRole.Player)) {
      setValues(roles.filter(role => role !== UserRole.Player))
    } else if (roles.includes(UserRole.Player)) {
      setValues([UserRole.User, UserRole.Player])
    } else {
      setValues(roles)
    }
  }

  return (
    <Popup
      title={`Update user "${user.username}" roles`}
      onCancel={onClose}
      onValidate={() => ref.current?.requestSubmit()}
    >
      <Box
        as="form"
        display="flex"
        flexDirection="column"
        p="2"
        ref={ref}
        onSubmit={e => {
          e.preventDefault()
          changeRoles(user, values)
          onClose()
        }}
      >
        <LabelInput label="Roles" as="fieldset" gap="2" required>
          <CheckboxInput
            role={UserRole.User}
            description={UserRoleDescriptions[UserRole.User]}
            values={values}
            onChange={onChange}
            disabled
          />
          {Object.entries(UserRoleDescriptions)
            .filter(([role]) => (role as UserRole) !== UserRole.User)
            .map(([role, description]) => (
              <CheckboxInput
                key={role}
                role={role as UserRole}
                description={description}
                values={values}
                onChange={onChange}
              />
            ))}
        </LabelInput>
      </Box>
    </Popup>
  )
}

type CheckboxInputProps = {
  role: UserRole
  values: UserRole[]
  description: string
  disabled?: boolean
  onChange: (e: UserRole[]) => void
}
function CheckboxInput({
  role,
  values,
  description,
  disabled,
  onChange,
}: CheckboxInputProps) {
  return (
    <Box
      as="label"
      display="grid"
      gridTemplateColumns="auto 1fr"
      gridTemplateRows="auto auto"
      gap="2"
      rowGap="1"
    >
      <TextInput
        type="checkbox"
        name="roles"
        checked={values.includes(role)}
        onChange={e =>
          e.target.checked
            ? onChange([...values, role])
            : onChange(values.filter(v => v !== role))
        }
        value={role}
        disabled={disabled}
      />
      <Span>{role}</Span>
      <Box as="span" fontStyle="italic" color="gray" gridArea="2/2">
        {description}
      </Box>
    </Box>
  )
}

const Span = styled.span`
  &:first-letter {
    text-transform: uppercase;
  }
`
