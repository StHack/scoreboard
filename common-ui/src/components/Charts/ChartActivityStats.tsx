import { useTheme } from '@emotion/react'
import {
  formatTimeLong,
  formatTimeShort,
  TimestampedServerActivityStatistics,
} from '@sthack/scoreboard-common'
import { useState } from 'react'
import {
  Brush,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartTooltip } from './ChartTooltip'

export type ChartActivityStatsProps = {
  activityStats: TimestampedServerActivityStatistics[]
}

export function ChartActivityStats({ activityStats }: ChartActivityStatsProps) {
  const theme = useTheme()

  const [active, setActive] = useState<string[]>([])

  const toggleActive = (value: string) => {
    setActive(prev =>
      prev.includes(value) ? prev.filter(el => el !== value) : [...prev, value],
    )
  }

  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart data={activityStats}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="timestamp"
          scale="time"
          tickFormatter={formatTimeShort}
        />
        <YAxis />
        <Tooltip content={<ChartTooltip />} labelFormatter={formatTimeLong} />
        <Legend
          onClick={data => toggleActive(data.dataKey as string)}
          verticalAlign="top"
          margin={{
            bottom: -10,
          }}
        />

        {Object.entries(lines).map(([key, label], i) => (
          <Line
            key={key}
            dataKey={key}
            name={label}
            dot={false}
            type="monotone"
            stroke={theme.colors.charts[i]}
            hide={active.length > 0 && !active.includes(key)}
          />
        ))}
        <Brush
          dataKey="timestamp"
          stroke={theme.colors.secondary}
          tickFormatter={formatTimeShort}
        >
          <LineChart>
            <CartesianGrid strokeDasharray="3 3" />

            {Object.entries(lines).map(([key, label], i) => (
              <Line
                key={key}
                dataKey={key}
                name={label}
                dot={false}
                type="monotone"
                stroke={theme.colors.charts[i]}
              />
            ))}
          </LineChart>
        </Brush>
      </LineChart>
    </ResponsiveContainer>
  )
}
const lines = {
  teamCount: 'Teams',
  userCount: 'Users',
  'sockets.game': 'Socket - Game NS',
  'sockets.player': 'Socket - Player NS',
  'sockets.admin': 'Socket - Admin NS',
}
