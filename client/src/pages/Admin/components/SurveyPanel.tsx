import { Survey, UserRole } from '@sthack/scoreboard-common'
import {
  Box,
  ColumnDefinition,
  ExportJsonButton,
  IconDelete,
  SearchInput,
  Table,
} from '@sthack/scoreboard-ui/components'
import { RoleBasedButton } from 'components/RoleBasedButton'
import { useAdmin } from 'hooks/useAdmin'
import { useState } from 'react'

const columns: ColumnDefinition<Survey>[] = [
  { header: 'Challenge', rowValue: row => row.challenge.name },
  { header: 'Team', rowValue: row => row.teamname },
  { header: 'User', rowValue: row => row.username },
  { header: 'Satis.', rowValue: row => row.satisfaction.toString() },
  { header: 'AI Usage', rowValue: row => row.aiUsage.toString() },
  {
    header: 'Perc. Dif.',
    rowValue: row => row.perceivedDifficulty.toString(),
  },
  { header: 'Feedback', rowValue: row => row.feedback ?? '' },
  { header: 'Date', rowValue: row => row.createdAt.toLocaleTimeString() },
]

export function SurveyPanel() {
  const [search, setSearch] = useState<string>('')
  const { surveys } = useAdmin()

  return (
    <Box display="flex" flexDirection="column" overflowY="hidden" gap="2">
      <Box display="flex" flexDirection="row" gap="2">
        <ExportJsonButton data={surveys} filename="surveys" />
        <SearchInput
          search={search}
          onChange={setSearch}
          placeholder="Search by team, player, chall name or feedback proposal"
        />
      </Box>
      <Table
        tableLayout="auto"
        data={surveys.filter(
          a =>
            a.challenge.name.toLowerCase().includes(search) ||
            a.teamname.toLowerCase().includes(search) ||
            a.username.toLowerCase().includes(search) ||
            a.feedback?.toLowerCase().includes(search),
        )}
        rowKey={row => row._id}
        columns={columns}
        actions={SurveyActions}
      />
    </Box>
  )
}

type SurveyActionsProps = {
  row: Survey
}
function SurveyActions({ row }: SurveyActionsProps) {
  const { deleteSurvey } = useAdmin()
  return (
    <RoleBasedButton
      roleRequired={UserRole.Moderator}
      variant="danger"
      icon={IconDelete}
      responsiveLabel
      title="Delete"
      onClick={() => {
        if (
          confirm(
            `Are you sure to delete Survey:\n\n${row.challenge.name}\n${
              row.teamname
            }\n${row.username}\n${row.createdAt.toISOString()}`,
          )
        ) {
          deleteSurvey(row)
        }
      }}
    >
      Delete
    </RoleBasedButton>
  )
}
