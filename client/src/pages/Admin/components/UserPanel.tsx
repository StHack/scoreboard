/* eslint-disable no-restricted-globals */
import { User } from '@sthack/scoreboard-common'
import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { ExportJsonButton } from 'components/ExportJsonButton'
import {
  IconDelete,
  IconDemote,
  IconLogout,
  IconPassword,
  IconPromote,
  IconTeams,
} from 'components/Icon'
import { SearchInput } from 'components/SearchInput'
import { useAdmin } from 'hooks/useAdmin'
import { useGame } from 'hooks/useGame'
import { useState } from 'react'
import { AlignSelfProps, GridAreaProps, JustifySelfProps } from 'styled-system'
import { UserEditMode, UserForm } from './UserForm'

export function UserPanel() {
  const { users, toggleIsAdmin, deleteUser, logoutUser } = useAdmin()
  const [userToEdit, setUserToEdit] = useState<User>()
  const [userEditMode, setUserEditMode] = useState<UserEditMode>()
  const [search, setSearch] = useState<string>('')

  const teams = users
    .filter(
      u =>
        u.username.toLowerCase().includes(search) ||
        u.team.toLowerCase().includes(search),
    )
    .reduce<Record<string, User[]>>(
      (acc, cur) => ({
        ...acc,
        [cur.team]: [...(acc[cur.team] ?? []), cur],
      }),
      {},
    )

  const updatePassword = (u: User) => {
    setUserToEdit(u)
    setUserEditMode('password')
  }
  const changeTeam = (u: User) => {
    setUserToEdit(u)
    setUserEditMode('team')
  }
  const updateAdminStatus = (u: User) => {
    if (u.isAdmin) {
      toggleIsAdmin(u)
    } else if (
      confirm(`Are you sure to grant user "${u.username}" admin privilege ?`)
    ) {
      toggleIsAdmin(u)
    }
  }
  const logout = (u: User) => {
    if (confirm(`Are you sure to disconnect user "${u.username}" ?`)) {
      logoutUser(u)
    }
  }
  const remove = (u: User) => {
    if (confirm(`Are you sure to delete User:\n\n${u.username}\n${u.team}`)) {
      deleteUser(u)
    }
  }

  return (
    <Box display="flex" flexDirection="column" overflowY="hidden" gap="2">
      <Box display="flex" flexDirection="row" gap="2">
        <ExportJsonButton data={users} filename="users" />
        <SearchInput
          search={search}
          onChange={setSearch}
          placeholder="Search by team or user name"
        />
      </Box>

      <Box
        display={['flex', 'grid']}
        flexDirection="column"
        gridTemplateColumns="repeat(auto-fit, minmax(40rem, 1fr))"
        overflowY="auto"
        gap="2"
      >
        {teams.admin && (
          <TeamCard
            team="admin"
            teams={teams.admin}
            updatePassword={updatePassword}
            changeTeam={changeTeam}
            updateAdminStatus={updateAdminStatus}
            logout={logout}
            remove={remove}
            gridArea={[
              null,
              'auto/1/auto/3',
              `1/auto/${Object.keys(teams).length}/auto`,
            ]}
            alignSelf={[null, 'start']}
          />
        )}

        {Object.entries(teams)
          .filter(([t]) => t !== 'admin')
          .sort(([t1], [t2]) => t1.localeCompare(t2))
          .map(([team, teams]) => (
            <TeamCard
              key={team}
              team={team}
              teams={teams}
              updatePassword={updatePassword}
              changeTeam={changeTeam}
              updateAdminStatus={updateAdminStatus}
              logout={logout}
              remove={remove}
            />
          ))}
      </Box>

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

type TeamCardProps = {
  team: string
  teams: User[]
  updatePassword: (user: User) => void
  changeTeam: (user: User) => void
  updateAdminStatus: (user: User) => void
  logout: (user: User) => void
  remove: (user: User) => void
}
function TeamCard({
  team,
  teams,
  updatePassword,
  changeTeam,
  updateAdminStatus,
  logout,
  remove,
  ...props
}: TeamCardProps & GridAreaProps & AlignSelfProps & JustifySelfProps) {
  const { gameConfig } = useGame()
  return (
    <Box
      bg="background"
      borderColor="secondary"
      borderWidth="medium"
      borderStyle="solid"
      borderRadius="small"
      boxShadow="normal"
      p="1"
      gap="2"
      display="flex"
      flexDirection="column"
      {...props}
    >
      <Box
        as="h3"
        fontSize="2"
        color={teams.length > gameConfig.teamSize ? 'secondary' : undefined}
      >
        {team} ({teams.length} players)
      </Box>
      <Box as="ul" pl="2" display="flex" flexDirection="column" gap="2" p="2">
        {teams.map(u => (
          <Box
            key={u.username}
            color={u.isAdmin ? 'secondary' : undefined}
            display="flex"
            alignItems="center"
            gap="2"
            justifyContent="end"
          >
            <Box as="span" fontSize="1.2em" justifySelf="start">
              {u.isAdmin && <IconPromote size="1" />} {u.username}
            </Box>
            <Button
              onClick={() => updatePassword(u)}
              icon={IconPassword}
              title="Change Password"
            />
            <Button
              onClick={() => changeTeam(u)}
              icon={IconTeams}
              title="Change Team"
            />
            {(u.team === 'admin' || u.isAdmin) && (
              <Button
                onClick={() => updateAdminStatus(u)}
                icon={u.isAdmin ? IconDemote : IconPromote}
                title={u.isAdmin ? 'Revoke admin right' : 'Promote to admin'}
              />
            )}
            <Button
              onClick={() => logout(u)}
              icon={IconLogout}
              title="Disconnect"
            />
            <Button
              onClick={() => remove(u)}
              variant="danger"
              icon={IconDelete}
              title="Delete"
            />
          </Box>
        ))}
      </Box>
    </Box>
  )
}
