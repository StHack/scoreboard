import styled from '@emotion/styled'
import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { CategoryImg } from 'components/CategoryImg'
import { useAdmin } from 'hooks/useAdmin'
import { useGame } from 'hooks/useGame'
import { Challenge } from 'models/Challenge'
import { User } from 'models/User'
import { useState } from 'react'
import {
  color,
  ColorProps,
  size,
  SizeProps,
  space,
  SpaceProps,
} from 'styled-system'
import { cleanStyledSystem } from 'styles'
import { ChallengeForm } from './components/ChallengeForm'
import { UserEditMode, UserForm } from './components/UserForm'

export function Admin () {
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const { challenges } = useGame()
  const {
    brokeChallenge,
    repairChallenge,
    openRegistration,
    closeRegistration,
    users,
    toggleIsAdmin,
    deleteUser,
  } = useAdmin()
  const [challToEdit, setChallToEdit] = useState<Challenge>()
  const [userToEdit, setUserToEdit] = useState<User>()
  const [userEditMode, setUserEditMode] = useState<UserEditMode>()

  return (
    <Box
      display="flex"
      flexDirection="column"
      maxWidth="maximalCentered"
      px="2"
      margin="0 auto"
      width="100%"
    >
      <Box display="flex" flexDirection="row">
        <Button onClick={() => setOpenEdit(true)}>Create challenge</Button>
        <Button onClick={openRegistration}>Open Registration</Button>
        <Button onClick={closeRegistration}>Close Registration</Button>
      </Box>
      <Table m="2">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Category</th>
            <th scope="col">Name</th>
            <th scope="col">Author</th>
            <th scope="col">Difficulty</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {challenges.map(c => (
            <Tr key={c.name} color={c.isBroken ? 'red' : ''}>
              <td>
                {c.img && <Image src={c.img} size={[2, 3]} />}
                {!c.img && <CategoryImg category={c.category} size={[2, 3]} />}
              </td>
              <td>{c.category}</td>
              <td>{c.name}</td>
              <td>{c.author}</td>
              <td>{c.difficulty}</td>
              <ActionPanel m="2">
                {!c.isBroken && (
                  <Button onClick={() => brokeChallenge(c)}>Broke it</Button>
                )}
                {c.isBroken && (
                  <Button onClick={() => repairChallenge(c)}>Repair it</Button>
                )}
                <Button
                  onClick={() => {
                    setChallToEdit(c)
                    setOpenEdit(true)
                  }}
                >
                  Edit it
                </Button>
              </ActionPanel>
            </Tr>
          ))}
        </tbody>
      </Table>

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
      </Table>
      {openEdit && (
        <ChallengeForm
          chall={challToEdit}
          onClose={() => {
            setOpenEdit(false)
            setChallToEdit(undefined)
          }}
        />
      )}
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
    </Box>
  )
}

const Image = styled.img<SizeProps>`
  object-fit: contain;
  ${size}
`

const ActionPanel = styled.td<SpaceProps>`
  display: flex;

  > * {
    ${space}
  }
`

const Table = styled.table<SpaceProps>`
  border-collapse: collapse;
  border: 2px solid rgb(200, 200, 200);
  ${space}

  td,
  th {
    border: 1px solid rgb(190, 190, 190);
  }

  th {
    background-color: rgb(235, 235, 235);
  }

  td {
    text-align: center;
  }

  tr:nth-child(even) {
    background-color: rgb(250, 250, 250);
  }

  tr:nth-child(odd) {
    background-color: rgb(245, 245, 245);
  }
`

const Tr = styled('tr', cleanStyledSystem)<ColorProps>`
  ${color}
`
