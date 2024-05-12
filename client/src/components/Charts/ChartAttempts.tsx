import { useTheme } from '@emotion/react'
import { useAdmin } from 'hooks/useAdmin'
import {
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartTooltip } from './ChartTooltip'

export function ChartAttemptsPanel() {
  const { attempts } = useAdmin()

  const chartData = Object.entries(
    attempts.reduce<Record<string, Record<string, number>>>(
      (agg, cur) => ({
        ...agg,
        [cur.challenge]: {
          ...(agg[cur.challenge] ?? {}),
          [cur.teamname]: (agg[cur.challenge]?.[cur.teamname] ?? 0) + 1,
        },
      }),
      {},
    ),
  ).map(([challenge, teams]) => ({ teams, challenge }))

  const teams = [...new Set(attempts.map(u => u.teamname))]

  const theme = useTheme()

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="challenge" />
        <YAxis />
        <Tooltip content={<ChartTooltip />} />
        <Legend />
        {teams.map((t, i) => (
          <Bar
            key={t}
            dataKey={`teams["${t}"]`}
            name={t}
            stackId="a"
            fill={theme.colors.charts[i % theme.colors.charts.length]}
          />
        ))}
        <Brush dataKey="name" height={30} stroke={theme.colors.secondary} />
      </BarChart>
    </ResponsiveContainer>
  )
}
