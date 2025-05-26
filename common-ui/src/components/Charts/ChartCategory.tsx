import { useTheme } from '@emotion/react'
import { TeamScore } from '@sthack/scoreboard-common'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from 'recharts'
import { Box } from '../Box'

type CategoryChartData = {
  challenge: string
  users: Record<string, number>
}

type ChartCategoryProps = {
  teamScore: TeamScore
}
export function ChartCategory({ teamScore: { solved } }: ChartCategoryProps) {
  const theme = useTheme()

  if (!solved.length) {
    return null
  }

  const chartCategory = Object.entries(
    solved.reduce<Record<string, Record<string, number>>>(
      (agg, cur) => ({
        ...agg,
        [cur.challenge.category]: {
          ...(agg[cur.challenge.category] ?? {}),
          [`u/${cur.username}`]:
            (agg[cur.challenge.category]?.[`u/${cur.username}`] ?? 0) + 1,
          total: (agg[cur.challenge.category]?.total ?? 0) + 1,
        },
      }),
      {},
    ),
  ).map<CategoryChartData>(([challenge, users]) => ({ challenge, users }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart outerRadius="70%" data={chartCategory}>
        <PolarGrid stroke={theme.colors.primary} />
        <PolarAngleAxis dataKey="challenge" stroke="inherit" />
        <PolarRadiusAxis angle={90} fill="blue" stroke="inherit" />
        <Radar
          name="total"
          dataKey={`users.total`}
          stroke={theme.colors.pink}
          fill={theme.colors.pink}
          fillOpacity={0.6}
          animationDuration={300}
        />
        <Tooltip content={<ChartCategoryTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  )
}

export function ChartCategoryTooltip({
  active,
  payload,
  label,
}: TooltipProps<string, string>) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <Box
      backgroundColor="primary"
      borderColor="primaryText"
      borderWidth="thin"
      borderStyle="solid"
      borderRadius="small"
      p="1"
      fontSize="0"
    >
      <Box
        as="h4"
        fontWeight="bold"
        mb="1"
      >{`${label}: ${payload[0].value}`}</Box>
      <Box as="ul" pl="1">
        {Object.entries((payload[0].payload as CategoryChartData).users)
          .filter(([name]) => name != 'total')
          .map(([name, count]) => (
            <Box
              key={name}
              as="li"
              color={payload[0].color}
            >{`${name.substring(2)}: ${count}`}</Box>
          ))}
      </Box>
    </Box>
  )
}
