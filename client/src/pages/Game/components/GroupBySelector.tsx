import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { Challenge } from 'models/Challenge'
import { Difficulty } from 'models/Difficulty'
import { DifficultyValue } from 'services/score'
import { AlignSelfProps, GridAreaProps, JustifySelfProps } from 'styled-system'

const GroupBy = ['Default', 'Category', 'Difficulty', 'Author'] as const
export type GroupByType = (typeof GroupBy)[number]

type GroupBySelectorProps = {
  value: GroupByType
  onChange: (value: GroupByType) => void
}
export function GroupBySelector({
  value,
  onChange,
  ...props
}: GroupBySelectorProps & GridAreaProps & AlignSelfProps & JustifySelfProps) {
  return (
    <Box
      display="flex"
      flexWrap="wrap"
      width="100%"
      alignItems="baseline"
      gap="2"
      {...props}
    >
      <Box as="p" width="100%" fontSize="1">
        Group By
      </Box>
      {GroupBy.map(g => (
        <Button key={g} onClick={() => onChange(g)} disabled={value === g}>
          {g}
        </Button>
      ))}
    </Box>
  )
}

export function getGroup(chall: Challenge, groupBy: GroupByType) {
  switch (groupBy) {
    case 'Author':
      return chall.author
    case 'Category':
      return chall.category
    case 'Difficulty':
      return chall.difficulty
    case 'Default':
      return ''
    default:
      return 'unknown'
  }
}

export function getGroupSort(
  groupBy: GroupByType,
): (g1: string, g2: string) => number {
  switch (groupBy) {
    case 'Difficulty':
      return (g1, g2) =>
        DifficultyValue[g2 as Difficulty] - DifficultyValue[g1 as Difficulty]
    case 'Default':
    case 'Author':
    case 'Category':
    default:
      return (g1, g2) => g1.localeCompare(g2)
  }
}
