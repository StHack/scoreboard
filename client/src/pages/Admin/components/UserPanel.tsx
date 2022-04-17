import { Button } from 'components/Button'
import { useAdmin } from 'hooks/useAdmin'
import { User } from 'models/User'
import { useState } from 'react'
import { UserEditMode, UserForm } from './UserForm'
import { Table, Tr, ActionPanel } from './styled'

export function UserPanel () {
  const { users, toggleIsAdmin, deleteUser } = useAdmin()
  const [userToEdit, setUserToEdit] = useState<User>()
  const [userEditMode, setUserEditMode] = useState<UserEditMode>()

  return (
    <Table m="2">
      <thead>
        <tr>
          <th scope="col">User</th>
          <th scope="col">Team</th>
          <th scope="col">Is Admin</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(u => (
          <Tr key={u.username}>
            <td>{u.username}</td>
            <td>{u.team}</td>
            <td>{u.isAdmin ? '✔' : '❌'}</td>
            <ActionPanel m="2">
              <Button
                onClick={() => {
                  setUserToEdit(u)
                  setUserEditMode('password')
                }}
              >
                Change Password
              </Button>
              <Button
                onClick={() => {
                  setUserToEdit(u)
                  setUserEditMode('team')
                }}
              >
                Change Team
              </Button>
              <Button onClick={() => toggleIsAdmin(u)}>
                {u.isAdmin ? 'Revoke admin right' : 'Promote to admin'}
              </Button>
              <Button onClick={() => deleteUser(u)} variant="danger">
                Delete User
              </Button>
            </ActionPanel>
          </Tr>
        ))}
      </tbody>

      {userEditMode && userToEdit && (
        <UserForm
          user={userToEdit}
          editMode={userEditMode}
          onClose={() => {
            setUserToEdit(undefined)
            setUserEditMode(undefined)
          }}
        />
      )}
    </Table>
  )
}
