import { User, UserRole } from '@sthack/scoreboard-common'
import {
  Box,
  ExportJsonButton,
  IconDelete,
  IconDemote,
  IconLogout,
  IconPassword,
  IconPromote,
  IconTeams,
  SearchInput,
} from '@sthack/scoreboard-ui/components'
import { RoleBasedButton } from 'components/RoleBasedButton'
import { useAdmin } from 'hooks/useAdmin'
import { useGame } from 'hooks/useGame'
import { useState } from 'react'
import { AlignSelfProps, GridAreaProps, JustifySelfProps } from 'styled-system'
import { UserEditMode, UserForm } from './UserForm'
import { UserRoleForm } from './UserRoleForm'

export function UserPanel() {
  const { users } = useAdmin()
  const [search, setSearch] = useState<string>('')

  const teams = users
    .filter(
      u =>
        u.username.toLowerCase().includes(search) ||
        u.team.toLowerCase().includes(search),
    )
    .reduce(
      (acc, cur) =>
        acc.has(cur.team)
          ? acc.set(cur.team, [...(acc.get(cur.team) as User[]), cur])
          : acc.set(cur.team, [cur]),
      new Map<string, User[]>(),
    )

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
        {teams.has('admin') && (
          <TeamCard
            team="admin"
            members={teams.get('admin') as User[]}
            gridArea={[null, 'auto/1/auto/3', `1/auto/${teams.size}/auto`]}
            alignSelf={[null, 'start']}
          />
        )}

        {[...teams]
          .filter(([t]) => t !== 'admin')
          .sort(([t1], [t2]) => t1.localeCompare(t2))
          .map(([team, users]) => (
            <TeamCard key={team} team={team} members={users} />
          ))}
      </Box>
    </Box>
  )
}

type TeamCardProps = {
  team: string
  members: User[]
}
function TeamCard({
  team,
  members,
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
        color={members.length > gameConfig.teamSize ? 'secondary' : undefined}
      >
        {team} ({members.length} players)
      </Box>
      <Box as="ul" pl="2" display="flex" flexDirection="column" gap="2" p="2">
        {members.map(u => (
          <UserRow key={u.username} user={u} />
        ))}
      </Box>
    </Box>
  )
}

type UserRowProps = {
  user: User
}
function UserRow({ user }: UserRowProps) {
  const [userEditMode, setUserEditMode] = useState<UserEditMode>()
  const [editRole, setEditRole] = useState<boolean>(false)
  const { deleteUser, logoutUser } = useAdmin()

  return (
    <Box
      color={user.roles.includes(UserRole.Admin) ? 'secondary' : undefined}
      display="flex"
      alignItems="center"
      gap="2"
      justifyContent="end"
    >
      <Box as="span" fontSize="1.2em" justifySelf="start">
        {user.roles.includes(UserRole.RoleManager) && <IconPromote size="1" />}
        {` ${user.username}`}
      </Box>
      <RoleBasedButton
        onClick={() => setUserEditMode('password')}
        icon={IconPassword}
        title="Change Password"
        roleRequired={UserRole.Moderator}
      />
      <RoleBasedButton
        onClick={() => setUserEditMode('team')}
        icon={IconTeams}
        title="Change Team"
        roleRequired={UserRole.Moderator}
      />
      <RoleBasedButton
        onClick={() =>
          confirm(`Are you sure to disconnect user "${user.username}" ?`) &&
          logoutUser(user)
        }
        icon={IconLogout}
        title="Disconnect"
        roleRequired={UserRole.Moderator}
      />
      <RoleBasedButton
        onClick={() => setEditRole(true)}
        icon={user.roles.includes(UserRole.Admin) ? IconDemote : IconPromote}
        variant="secondary"
        title="Change Roles"
        roleRequired={UserRole.RoleManager}
      />
      <RoleBasedButton
        onClick={() =>
          confirm(
            `Are you sure to delete User:\n\n${user.username}\n${user.team}`,
          ) && deleteUser(user)
        }
        variant="danger"
        icon={IconDelete}
        title="Delete"
        roleRequired={UserRole.Moderator}
      />

      {userEditMode && (
        <UserForm
          user={user}
          editMode={userEditMode}
          onClose={() => setUserEditMode(undefined)}
        />
      )}

      {editRole && (
        <UserRoleForm user={user} onClose={() => setEditRole(false)} />
      )}
    </Box>
  )
}
