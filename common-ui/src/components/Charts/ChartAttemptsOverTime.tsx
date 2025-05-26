import { useTheme } from '@emotion/react'
import {
  Attempt,
  formatTimeLong,
  formatTimeShort,
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
import { Payload } from 'recharts/types/component/DefaultLegendContent'
import { Box } from '../Box'
import { IconChallenge, IconUsers } from '../Icon'
import { LabelInput } from '../LabelInput'
import { SelectInput } from '../SelectInput'
import { ChartTooltip } from './ChartTooltip'

const AGG_OPTIONS = [
  { label: '5 minutes', value: 5 },
  { label: '15 minutes', value: 15 },
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 },
]

const GROUP_OPTIONS = [
  { label: 'Team', value: 'team' },
  { label: 'Challenge', value: 'challenge' },
]

function formatBucket(ts: Date, minutes: number) {
  const d = new Date(ts)
  d.setSeconds(0, 0)
  d.setMinutes(Math.floor(d.getMinutes() / minutes) * minutes)
  return d.toISOString().slice(0, 16) // up to minute
}

export type ChartAttemptsOverTimeProps = {
  attempts: Attempt[]
}

export function ChartAttemptsOverTime({
  attempts,
}: ChartAttemptsOverTimeProps) {
  const theme = useTheme()
  const [agg, setAgg] = useState(15)
  const [groupBy, setGroupBy] = useState<'team' | 'challenge'>('team')
  const [active, setActive] = useState<string[]>([])

  const groups = useMemo(
    () => [
      ...new Set(
        attempts.map(a =>
          groupBy === 'team' ? `t/${a.teamname}` : `c/${a.challenge}`,
        ),
      ),
    ],
    [attempts, groupBy],
  )

  const data = useMemo(() => {
    const buckets: Record<string, Record<string, number>> = {}
    for (const ach of attempts) {
      const time = formatBucket(ach.createdAt, agg)
      const key =
        groupBy === 'team' ? `t/${ach.teamname}` : `c/${ach.challenge}`
      if (!buckets[time]) buckets[time] = {}
      buckets[time][key] = (buckets[time][key] ?? 0) + 1
    }
    // Fill missing group keys with 0
    return Object.entries(buckets)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([time, groupsObj]) => {
        const filled: Record<string, number> = {}
        for (const group of groups) {
          filled[group] = groupsObj[group] ?? 0
        }
        return { time: new Date(time), ...filled }
      })
  }, [attempts, agg, groupBy, groups])

  const handleLegendClick = (data: Payload) => {
    if (!data.id) return
    const value = data.value as string
    setActive(prev =>
      prev.includes(value) ? prev.filter(el => el !== value) : [...prev, value],
    )
  }

  return (
    <>
      <Box display="flex" flexDirection="row" alignItems="center" gap="3">
        <LabelInput label="Time range" flexDirection="row" alignItems="center">
          <SelectInput
            value={agg}
            predefinedValues={AGG_OPTIONS}
            onChange={e => setAgg(Number(e.target.value))}
          />
        </LabelInput>
        <LabelInput label="Group by" flexDirection="row" alignItems="center">
          <SelectInput
            value={groupBy}
            predefinedValues={GROUP_OPTIONS}
            onChange={e => {
              setActive([])
              setGroupBy(e.target.value as 'team' | 'challenge')
            }}
          />
        </LabelInput>
      </Box>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tickFormatter={formatTimeShort} />
          <YAxis allowDecimals={false} />
          <Tooltip content={<ChartTooltip />} labelFormatter={formatTimeLong} />
          <Legend
            payload={groups
              .sort((a, b) => a.localeCompare(b))
              .map((group, i) => ({
                value: group,
                id: group,
                dataKey: group,
                legendIcon: group.startsWith('c/') ? (
                  <IconChallenge />
                ) : (
                  <IconUsers />
                ),
                inactive: active.length > 0 && !active.includes(group),
                color: theme.colors.charts[i % theme.colors.charts.length],
              }))}
            onClick={data => handleLegendClick(data)}
          />
          {groups.map((group, i) => (
            <Line
              key={group}
              type="monotone"
              hide={active.length > 0 && !active.includes(group)}
              dataKey={group}
              stroke={theme.colors.charts[i % theme.colors.charts.length]}
              dot={false}
            />
          ))}
          <Brush
            dataKey="time"
            height={30}
            stroke={theme.colors.secondary}
            tickFormatter={formatTimeShort}
          >
            <LineChart>
              <CartesianGrid strokeDasharray="3 3" />
              {groups.map((group, i) => (
                <Line
                  key={group}
                  type="monotone"
                  hide={active.length > 0 && !active.includes(group)}
                  dataKey={group}
                  stroke={theme.colors.charts[i % theme.colors.charts.length]}
                  dot={false}
                />
              ))}
            </LineChart>
          </Brush>
        </LineChart>
      </ResponsiveContainer>
    </>
  )
}
