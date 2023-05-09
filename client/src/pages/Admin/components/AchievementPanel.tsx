import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { ExportJsonButton } from 'components/ExportJsonButton'
import { IconDelete } from 'components/Icon'
import { SearchInput } from 'components/SearchInput'
import { ColumnDefinition, Table } from 'components/Table'
import { useAdmin } from 'hooks/useAdmin'
import { useGame } from 'hooks/useGame'
import { Achievement } from 'models/Achievement'
import { useState } from 'react'

const columns: ColumnDefinition<Achievement>[] = [
  { header: 'Challenge', rowValue: row => row.challenge },
  { header: 'Team', rowValue: row => row.teamname },
  { header: 'User', rowValue: row => row.username },
  { header: 'Date', rowValue: row => row.createdAt.toLocaleTimeString() },
]

export function AchievementPanel () {
  const [search, setSearch] = useState<string>('')
  const { achievements } = useGame()

  return (
    <Box display="flex" flexDirection="column" overflowY="hidden" gap="2">
      <Box display="flex" flexDirection="row" gap="2">
        <ExportJsonButton data={achievements} filename="achievements" />
        <SearchInput
          search={search}
          onChange={setSearch}
          placeholder="Search by team, player or chall name"
        />
      </Box>
      <Table
        data={achievements.filter(
          a =>
            a.challenge.toLowerCase().includes(search) ||
            a.teamname.toLowerCase().includes(search) ||
            a.username.toLowerCase().includes(search),
        )}
        rowKey={row => row.challenge + row.teamname}
        columns={columns}
        actions={AchievementActions}
      />
    </Box>
  )
}

type AchievementActionsProps = {
  row: Achievement
}
function AchievementActions ({ row }: AchievementActionsProps) {
  const { deleteAchievement } = useAdmin()
  return (
    <Button
      variant="danger"
      icon={IconDelete}
      responsiveLabel
      title="Delete"
      onClick={() => {
        if (
          // eslint-disable-next-line no-restricted-globals
          confirm(
            `Are you sure to delete Achievement:\n\n${row.challenge}\n${
              row.teamname
            }\n${row.username}\n${row.createdAt.toISOString()}`,
          )
        ) {
          deleteAchievement(row)
        }
      }}
    >
      Delete
    </Button>
  )
}
