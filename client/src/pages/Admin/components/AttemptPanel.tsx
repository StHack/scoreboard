import { Attempt } from '@sthack/scoreboard-common'
import { Box } from 'components/Box'
import { ExportJsonButton } from 'components/ExportJsonButton'
import { SearchInput } from 'components/SearchInput'
import { ColumnDefinition, Table } from 'components/Table'
import { useAdmin } from 'hooks/useAdmin'
import { useState } from 'react'

const columns: ColumnDefinition<Attempt>[] = [
  { header: 'Challenge', rowValue: row => row.challenge },
  { header: 'Team', rowValue: row => row.teamname },
  { header: 'User', rowValue: row => row.username },
  { header: 'Attempt', rowValue: row => row.proposal },
  { header: 'Date', rowValue: row => row.createdAt.toLocaleTimeString() },
]

export function AttemptPanel() {
  const [search, setSearch] = useState<string>('')
  const { attempts } = useAdmin()

  return (
    <Box display="flex" flexDirection="column" overflowY="hidden" gap="2">
      <Box display="flex" flexDirection="row" gap="2">
        <ExportJsonButton data={attempts} filename="attempts" />
        <SearchInput
          search={search}
          onChange={setSearch}
          placeholder="Search by team, player, chall name or attempt proposal"
        />
      </Box>
      <Table
        data={attempts.filter(
          a =>
            a.challenge.toLowerCase().includes(search) ||
            a.teamname.toLowerCase().includes(search) ||
            a.username.toLowerCase().includes(search) ||
            a.proposal.toLowerCase().includes(search),
        )}
        rowKey={row => row._id}
        columns={columns}
      />
    </Box>
  )
}
