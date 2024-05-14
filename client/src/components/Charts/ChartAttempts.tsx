import { useTheme } from '@emotion/react'
import { IconChallenge, IconUsers } from 'components/Icon'
import { useAdmin } from 'hooks/useAdmin'
import { useState } from 'react'
import {
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  DefaultLegendContent,
  Legend,
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
          [cur.teamname]: (agg[cur.challenge]?.[cur.teamname] ?? 0) + 1,
        },
      }),
      {},
    ),
  ).map(([challenge, teams]) => ({ teams, challenge }))

  const teams = [...new Set(attempts.map(u => u.teamname))]

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
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
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
        <YAxis />
        <Tooltip content={<ChartTooltip />} />
        <Legend
          payload={chartData
            .map<Payload>(cd => ({
              value: cd.challenge,
              dataKey: cd.challenge,
              id: `challenge-${cd.challenge}`,
              legendIcon: <IconChallenge />,
              inactive: inactiveChalls.includes(cd.challenge),
              color: theme.colors.secondary,
            }))
            .concat(
              teams.map((t, i) => ({
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
          />
        ))}
        <Brush dataKey="name" height={30} stroke={theme.colors.secondary} />
      </BarChart>
    </ResponsiveContainer>
  )
}
