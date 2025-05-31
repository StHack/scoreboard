import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import {
  formatTimeLong,
  formatTimeShort,
  TimestampedServerActivityStatistics,
} from '@sthack/scoreboard-common'
import { useMemo, useState } from 'react'
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
import { Box } from '../Box'
import { LabelInput } from '../LabelInput'
import { SelectInput } from '../SelectInput'
import { ChartTooltip } from './ChartTooltip'

const AGG_OPTIONS = [
  { label: 'No aggregation', value: -1 },
  { label: '5 minutes', value: 5 },
  { label: '15 minutes', value: 15 },
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 },
] as const
type AllowedAggregation = (typeof AGG_OPTIONS)[number]['value']

export type ChartActivityStatsProps = {
  activityStats: TimestampedServerActivityStatistics[]
  defaultTime?: AllowedAggregation
  hideSelectorTime?: boolean
  minDate?: Date
  maxDate?: Date
}

export function ChartActivityStats({
  activityStats,
  defaultTime = -1,
  hideSelectorTime,
  minDate,
  maxDate,
}: ChartActivityStatsProps) {
  const theme = useTheme()
  const [agg, setAgg] = useState(defaultTime)
  const [active, setActive] = useState<string[]>([])

  const toggleActive = (value: string) => {
    setActive(prev =>
      prev.includes(value) ? prev.filter(el => el !== value) : [...prev, value],
    )
  }

  // Aggregate and filter data
  const data = useMemo(() => {
    if (activityStats.length === 0) return []

    if (agg === -1) return activityStats

    // 1. Find min and max time
    const times = activityStats.map(a => a.timestamp.getTime())
    const minTime = minDate?.getTime() ?? Math.min(...times)
    const maxTime = maxDate?.getTime() ?? Math.max(...times)

    // 2. Generate all bucket start times
    const bucketMs = agg * 60 * 1000
    const buckets: Record<number, TimestampedServerActivityStatistics> = {}

    for (
      let t = Math.floor(minTime / bucketMs) * bucketMs;
      t <= maxTime;
      t += bucketMs
    ) {
      buckets[t] = {
        admins: [],
        teamCount: 0,
        teams: {},
        timestamp: new Date(t),
        userCount: 0,
        sockets: {
          admin: 0,
          game: 0,
          player: 0,
        },
      }
    }

    // 3. Fill buckets with stats counts
    for (const activityStat of activityStats) {
      const key =
        Math.floor(activityStat.timestamp.getTime() / bucketMs) * bucketMs
      buckets[key] = { ...activityStat, timestamp: new Date(key) }
    }

    // 4. Fill missing group keys with 0
    return Object.values(buckets)
  }, [activityStats, agg, maxDate, minDate])

  return (
    <>
      <Filters display="flex" flexDirection="row" alignItems="center" gap="3">
        {!hideSelectorTime && (
          <LabelInput
            label="Time range"
            flexDirection="row"
            alignItems="center"
          >
            <SelectInput
              value={agg}
              predefinedValues={AGG_OPTIONS}
              onChange={e =>
                setAgg(Number(e.target.value) as AllowedAggregation)
              }
            />
          </LabelInput>
        )}
      </Filters>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={data}>
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
    </>
  )
}

const lines = {
  teamCount: 'Teams',
  userCount: 'Users',
  'sockets.game': 'Socket - Game NS',
  'sockets.player': 'Socket - Player NS',
  'sockets.admin': 'Socket - Admin NS',
}

const Filters = styled(Box)`
  &:empty {
    display: none;
  }
`
