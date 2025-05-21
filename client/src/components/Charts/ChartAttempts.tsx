import { useTheme } from '@emotion/react'
import { IconChallenge, IconUsers } from 'components/Icon'
import { useAdmin } from 'hooks/useAdmin'
import { useState } from 'react'
import {
  Bar,
  Brush,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Payload } from 'recharts/types/component/DefaultLegendContent'
import { ChartTooltip } from './ChartTooltip'

export function ChartAttemptsPanel() {
  const { attempts } = useAdmin()

  const chartData = Object.entries(
    attempts.reduce<Record<string, Record<string, number>>>(
      (agg, cur) => ({
        ...agg,
        [cur.challenge]: {
          ...(agg[cur.challenge] ?? {}),
          [`t/${cur.teamname}`]:
            (agg[cur.challenge]?.[`t/${cur.teamname}`] ?? 0) + 1,
        },
      }),
      {},
    ),
  ).map(([challenge, teams]) => ({
    teams,
    avg:
      Object.values(teams).reduce((sum, cur) => sum + cur, 0) /
      Object.values(teams).length,
    challenge,
  }))

  const teams = [...new Set(attempts.map(u => `t/${u.teamname}`))]

  const theme = useTheme()

  const [inactiveChalls, setInactiveChalls] = useState<string[]>([])
  const [activeUsers, setActiveUsers] = useState<string[]>([])

  const handleLegendClick = (data: Payload) => {
    if (!data.id) {
      return
    }
    const setter = data.id.startsWith('challenge-')
      ? setInactiveChalls
      : setActiveUsers

    const value = data.value as string
    setter(prev =>
      prev.includes(value) ? prev.filter(el => el !== value) : [...prev, value],
    )
  }

  return (
    <ResponsiveContainer width="100%" height={600}>
      <ComposedChart
        data={chartData.filter(c => !inactiveChalls.includes(c.challenge))}
        onClick={nextState => {
          const active = nextState.activeLabel
          if (active) {
            setInactiveChalls(prev => [...prev, active])
          }
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="challenge" />
        <YAxis yAxisId="left" orientation="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip content={<ChartTooltip />} />
        <Legend
          payload={chartData
            .sort((a, b) => a.challenge.localeCompare(b.challenge))
            .map<Payload>(cd => ({
              value: cd.challenge,
              dataKey: cd.challenge,
              id: `challenge-${cd.challenge}`,
              legendIcon: <IconChallenge />,
              inactive: inactiveChalls.includes(cd.challenge),
              color: theme.colors.secondary,
            }))
            .concat(
              teams
                .sort((a, b) => a.localeCompare(b))
                .map((t, i) => ({
                  value: t,
                  id: `team-${t}`,
                  dataKey: `teams["${t}"]`,
                  legendIcon: <IconUsers />,
                  inactive: activeUsers.length > 0 && !activeUsers.includes(t),
                  color: theme.colors.charts[i % theme.colors.charts.length],
                })),
            )}
          onClick={data => handleLegendClick(data)}
        />
        {teams.map((t, i) => (
          <Bar
            key={t}
            dataKey={`teams["${t}"]`}
            hide={activeUsers.length > 0 && !activeUsers.includes(t)}
            name={t}
            stackId="a"
            fill={theme.colors.charts[i % theme.colors.charts.length]}
            yAxisId="left"
          />
        ))}
        <Line dataKey="avg" yAxisId="right" />
        <Brush dataKey="name" height={30} stroke={theme.colors.secondary} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
