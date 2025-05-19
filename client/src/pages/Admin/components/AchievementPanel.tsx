import { Achievement, Reward, UserRole } from '@sthack/scoreboard-common'
import { Box } from 'components/Box'
import { ExportJsonButton } from 'components/ExportJsonButton'
import { IconCreate, IconDelete } from 'components/Icon'
import { RoleBasedButton } from 'components/RoleBasedButton'
import { SearchInput } from 'components/SearchInput'
import { ColumnDefinition, Table } from 'components/Table'
import { useAdmin } from 'hooks/useAdmin'
import { useGame } from 'hooks/useGame'
import { useState } from 'react'
import { RewardForm } from './RewardForm'

const achievementsColumns: ColumnDefinition<Achievement>[] = [
  { header: 'Challenge', rowValue: row => row.challenge.name },
  { header: 'Team', rowValue: row => row.teamname },
  { header: 'User', rowValue: row => row.username },
  { header: 'Date', rowValue: row => row.createdAt.toLocaleTimeString() },
]

const rewardsColumns: ColumnDefinition<Reward>[] = [
  { header: 'Team', rowValue: row => row.teamname },
  { header: 'Label', rowValue: row => row.label },
  { header: 'Value', rowValue: row => row.value.toString() },
  { header: 'Date', rowValue: row => row.createdAt.toLocaleTimeString() },
]

export function AchievementPanel() {
  const [openCreateReward, setOpenCreateReward] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('')
  const { achievements, rewards } = useGame()

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      overflowY="hidden"
      gap="2"
    >
      <Box display="flex" flexDirection="row" gap="2">
        <RoleBasedButton
          onClick={() => setOpenCreateReward(true)}
          title="Create reward"
          icon={IconCreate}
          responsiveLabel
          roleRequired={UserRole.Rewarder}
        >
          Create reward
        </RoleBasedButton>
        <ExportJsonButton data={achievements} filename="achievements" />
        <ExportJsonButton data={rewards} filename="rewards" />
        <SearchInput
          search={search}
          onChange={setSearch}
          placeholder="Search by label, team, player or chall name"
        />
      </Box>
      {rewards.length > 0 && (
        <>
          <Box as="h3" fontSize="2">
            Rewards
          </Box>
          <Table
            flex="1 0 auto"
            data={rewards.filter(
              r =>
                r.teamname.toLowerCase().includes(search) ||
                r.label.toLowerCase().includes(search),
            )}
            rowKey={row => row._id}
            columns={rewardsColumns}
            actions={RewardActions}
            maxHeight="9"
          />
        </>
      )}
      <Box as="h3" fontSize="2">
        Achievements
      </Box>
      <Table
        flex="0 1 100%"
        data={achievements.filter(
          a =>
            a.challenge.name.toLowerCase().includes(search) ||
            a.teamname.toLowerCase().includes(search) ||
            a.username.toLowerCase().includes(search),
        )}
        rowKey={row => row.challengeId + row.teamname}
        columns={achievementsColumns}
        actions={AchievementActions}
        mb="2"
      />
      {openCreateReward && (
        <RewardForm onClose={() => setOpenCreateReward(false)} />
      )}
    </Box>
  )
}

type AchievementActionsProps = {
  row: Achievement
}
function AchievementActions({ row }: AchievementActionsProps) {
  const { deleteAchievement } = useAdmin()
  return (
    <RoleBasedButton
      roleRequired={UserRole.GameMaster}
      variant="danger"
      icon={IconDelete}
      responsiveLabel
      title="Delete"
      onClick={() => {
        if (
          confirm(
            `Are you sure to delete Achievement:\n\n${row.challenge.name}\n${
              row.teamname
            }\n${row.username}\n${row.createdAt.toISOString()}`,
          )
        ) {
          deleteAchievement(row)
        }
      }}
    >
      Delete
    </RoleBasedButton>
  )
}

type RewardActionsProps = {
  row: Reward
}
function RewardActions({ row }: RewardActionsProps) {
  const { deleteReward } = useAdmin()
  return (
    <RoleBasedButton
      roleRequired={UserRole.Rewarder}
      variant="danger"
      icon={IconDelete}
      responsiveLabel
      title="Delete"
      onClick={() => {
        if (
          confirm(
            `Are you sure to delete Reward:\n\n${row.label}\n${
              row.teamname
            }\n${row.createdAt.toISOString()}`,
          )
        ) {
          deleteReward(row)
        }
      }}
    >
      Delete
    </RoleBasedButton>
  )
}
