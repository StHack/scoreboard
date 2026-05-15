import {
  isPlayer,
  Player,
  Team,
  User,
  UserRole,
} from '@sthack/scoreboard-common'
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
import { UserPasswordForm } from './UserPasswordForm'
import { UserRoleForm } from './UserRoleForm'
import { UserTeamForm } from './UserTeamForm'

export function UserPanel() {
  const { users } = useAdmin()
  const [search, setSearch] = useState<string>('')

  const teams = users
    .filter(isPlayer)
    .filter(
      u =>
        u.username.toLowerCase().includes(search) ||
        u.team.name.toLowerCase().includes(search),
    )
    .reduce(
      (acc, cur) =>
        acc.has(cur.team)
          ? acc.set(cur.team, [...(acc.get(cur.team) as Player[]), cur])
          : acc.set(cur.team, [cur]),
      new Map<Team, Player[]>(),
    )

  const nonPlayer = users
    .filter(u => !isPlayer(u))
    .filter(u => u.username.toLowerCase().includes(search))

  const admins = nonPlayer.filter(u => u.roles.includes(UserRole.Admin))
  const unafiliated = nonPlayer.filter(u => !u.roles.includes(UserRole.Admin))

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
        {(admins.length > 0 || unafiliated.length > 0) && (
          <Box
            gridArea={[null, 'auto/1/auto/3', `1/auto/${teams.size}/auto`]}
            alignSelf={[null, 'start']}
            gap="2"
            display="grid"
          >
            {admins.length > 0 && <UsersCard title="Admins" members={admins} />}

            {unafiliated.length > 0 && (
              <UsersCard title="Un-Affiliated" members={unafiliated} />
            )}
          </Box>
        )}

        {[...teams]
          .sort(([t1], [t2]) => t1.name.localeCompare(t2.name))
          .map(([team, users]) => (
            <UsersCard
              key={team._id}
              title={`${team.name} (${users.length} players)`}
              members={users}
            />
          ))}
      </Box>
    </Box>
  )
}

type UsersCardProps = {
  title: string
  members: User[]
}
function UsersCard({
  title,
  members,
  ...props
}: UsersCardProps & GridAreaProps & AlignSelfProps & JustifySelfProps) {
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
        {title}
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
  const [userEditMode, setUserEditMode] = useState<
    'password' | 'team' | 'role'
  >()
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
        onClick={() => setUserEditMode('role')}
        icon={user.roles.includes(UserRole.Admin) ? IconDemote : IconPromote}
        variant="secondary"
        title="Change Roles"
        roleRequired={UserRole.RoleManager}
      />
      <RoleBasedButton
        onClick={() =>
          confirm(`Are you sure to delete user "${user.username}" ?`) &&
          deleteUser(user)
        }
        variant="danger"
        icon={IconDelete}
        title="Delete"
        roleRequired={UserRole.Moderator}
      />

      {userEditMode === 'password' && (
        <UserPasswordForm
          user={user}
          onClose={() => setUserEditMode(undefined)}
        />
      )}

      {userEditMode === 'team' && (
        <UserTeamForm user={user} onClose={() => setUserEditMode(undefined)} />
      )}

      {userEditMode === 'role' && (
        <UserRoleForm user={user} onClose={() => setUserEditMode(undefined)} />
      )}
    </Box>
  )
}
