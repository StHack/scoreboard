import { useTheme } from '@emotion/react'
import { useAdmin } from 'hooks/useAdmin'
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

export function ChartActivityStats() {
  const { activityStats } = useAdmin()

  const theme = useTheme()

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={activityStats}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" scale="time" tickFormatter={format} />
        <YAxis />
        <Tooltip content={<ChartTooltip />} labelFormatter={formatLong} />
        <Legend />

        {Object.entries(lines).map(([key, label], i) => (
          <Line
            key={key}
            dataKey={key}
            name={label}
            type="monotone"
            stroke={theme.colors.charts[i]}
          />
        ))}
        <Brush
          dataKey="timestamp"
          stroke={theme.colors.secondary}
          tickFormatter={format}
        >
          <LineChart>
            <CartesianGrid strokeDasharray="3 3" />

            {Object.entries(lines).map(([key, label], i) => (
              <Line
                key={key}
                dataKey={key}
                name={label}
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

const format = (input: Date) => input?.toLocaleTimeString?.() ?? ''
const formatLong = (input: Date) =>
  `${input?.toLocaleDateString?.() ?? ''} - ${input?.toLocaleTimeString?.() ?? ''}`
