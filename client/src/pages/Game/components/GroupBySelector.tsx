import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { Challenge } from 'models/Challenge'
import { Difficulty } from 'models/Difficulty'
import { DifficultyValue } from 'services/score'
import { GridAreaProps } from 'styled-system'

const GroupBy = ['Category', 'Difficulty', 'Author'] as const
export type GroupByType = (typeof GroupBy)[number]

type GroupBySelectorProps = {
  value: GroupByType
  onChange: (value: GroupByType) => void
}
export function GroupBySelector ({
  value,
  onChange,
  gridArea,
}: GroupBySelectorProps & GridAreaProps) {
  return (
    <Box
      display="flex"
      overflowX="auto"
      width="100%"
      alignItems="baseline"
      my="2"
      mx="1"
      gridArea={gridArea}
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

export function getGroupSort (
  groupBy: GroupByType,
): (g1: string, g2: string) => number {
  switch (groupBy) {
    case 'Difficulty':
      return (g1, g2) =>
        DifficultyValue[g2 as Difficulty] - DifficultyValue[g1 as Difficulty]
    case 'Author':
    case 'Category':
    default:
      return (g1, g2) => g1.localeCompare(g2)
  }
}
