import { useTheme } from '@emotion/react'
import { TeamScore } from '@sthack/scoreboard-common'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { ChartTooltip } from './ChartTooltip'

type ChartPlayerScorerProps = {
  teamScore: TeamScore
}
export function ChartPlayerScorer({
  teamScore: { solved },
}: ChartPlayerScorerProps) {
  const theme = useTheme()

  if (!solved.length) {
    return null
  }

  const chartPlayerScorer = Object.entries(
    solved.reduce<Record<string, number>>(
      (agg, cur) => ({
        ...agg,
        [cur.username]: (agg[cur.username] ?? 0) + 1,
      }),
      {},
    ),
  ).map(([user, count]) => ({ user, count }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartPlayerScorer}
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="count"
          nameKey="user"
          animationDuration={300}
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          label={p => `${p.name} / ${p.value}`}
          // name="user"
        >
          {chartPlayerScorer.map((p, i) => (
            <Cell
              key={p.user}
              fill={theme.colors.charts[i % theme.colors.charts.length]}
              name={p.user}
            />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  )
}
