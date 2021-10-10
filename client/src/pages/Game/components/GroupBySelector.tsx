import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { Challenge } from 'models/Challenge'

const GroupBy = ['Category', 'Difficulty', 'Author'] as const
export type GroupByType = typeof GroupBy[number]

type GroupBySelectorProps = {
  value: GroupByType
  onChange: (value: GroupByType) => void
}
export function GroupBySelector ({ value, onChange }: GroupBySelectorProps) {
  return (
    <Box
      display="flex"
      overflowX="auto"
      width="100%"
      alignItems="baseline"
      my="2"
      mx="1"
    >
      <p>Group By</p>
      {GroupBy.map(g => (
        <Button
          key={g}
          onClick={() => onChange(g)}
          disabled={value === g}
          m="2"
        >
          {g}
        </Button>
      ))}
    </Box>
  )
}

export function getGroup (chall: Challenge, groupBy: GroupByType) {
  switch (groupBy) {
    case 'Author':
      return chall.author
    case 'Category':
      return chall.category
    case 'Difficulty':
      return chall.difficulty
    default:
      return 'unknown'
  }
}
