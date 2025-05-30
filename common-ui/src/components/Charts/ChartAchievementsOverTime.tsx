import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import {
  Achievement,
  formatTimeLong,
  formatTimeShort,
} from '@sthack/scoreboard-common'
import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Brush,
  CartesianGrid,
  Legend,
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
] as const
type AllowedAggregation = (typeof AGG_OPTIONS)[number]['value']

const GROUP_OPTIONS = [
  { label: 'Team', value: 'team' },
  { label: 'Challenge', value: 'challenge' },
] as const
type AllowedGroup = (typeof GROUP_OPTIONS)[number]['value']

function formatBucket(ts: Date, minutes: number) {
  const d = new Date(ts)
  d.setSeconds(0, 0)
  d.setMinutes(Math.floor(d.getMinutes() / minutes) * minutes)
  return d.getTime()
}

export type ChartAchievementsOverTimeProps = {
  achievements: Achievement[]
  defaultTime?: AllowedAggregation
  defaultGroup?: AllowedGroup
  hideSelectorTime?: boolean
  hideSelectorGroup?: boolean
  forcedActive?: string
}
export function ChartAchievementsOverTime({
  achievements,
  defaultTime = 30,
  defaultGroup = 'team',
  hideSelectorTime,
  hideSelectorGroup,
  forcedActive,
}: ChartAchievementsOverTimeProps) {
  const theme = useTheme()
  const [agg, setAgg] = useState(defaultTime)
  const [groupBy, setGroupBy] = useState<AllowedGroup>(defaultGroup)
  const [active, setActive] = useState<string[]>(
    forcedActive
      ? [
          defaultGroup === 'challenge'
            ? `c/${forcedActive}`
            : `t/${forcedActive}`,
        ]
      : [],
  )

  const groups = useMemo(
    () => [
      ...new Set(
        achievements.map(a =>
          groupBy === 'team' ? `t/${a.teamname}` : `c/${a.challenge.name}`,
        ),
      ),
    ],
    [achievements, groupBy],
  )

  const data = useMemo(() => {
    const buckets: Record<string, Record<string, number>> = {}
    for (const ach of achievements) {
      const time = formatBucket(ach.createdAt, agg)
      const key =
        groupBy === 'team' ? `t/${ach.teamname}` : `c/${ach.challenge.name}`
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
        return { time: new Date(Number(time)), ...filled }
      })
  }, [achievements, agg, groupBy, groups])

  const handleLegendClick = (data: Payload) => {
    if (!data.id) return
    const value = data.value as string
    setActive(prev =>
      prev.includes(value) ? prev.filter(el => el !== value) : [...prev, value],
    )
  }

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
        {!hideSelectorGroup && (
          <LabelInput label="Group by" flexDirection="row" alignItems="center">
            <SelectInput
              value={groupBy}
              predefinedValues={GROUP_OPTIONS}
              onChange={e => {
                setActive([])
                setGroupBy(e.target.value as AllowedGroup)
              }}
            />
          </LabelInput>
        )}
      </Filters>
      <ResponsiveContainer width="100%" height={500}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tickFormatter={formatTimeShort} />
          <YAxis allowDecimals={false} />
          <Tooltip content={<ChartTooltip />} labelFormatter={formatTimeLong} />
          {!forcedActive && (
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
          )}
          {groups.map((group, i) => (
            <Area
              key={group}
              type="monotone"
              hide={active.length > 0 && !active.includes(group)}
              dataKey={group}
              stroke={theme.colors.charts[i % theme.colors.charts.length]}
              fill={theme.colors.charts[i % theme.colors.charts.length]}
              fillOpacity={0.3}
              dot={false}
            />
          ))}
          <Brush
            dataKey="time"
            height={30}
            stroke={theme.colors.secondary}
            tickFormatter={formatTimeShort}
          >
            <AreaChart>
              <CartesianGrid strokeDasharray="3 3" />
              {groups.map((group, i) => (
                <Area
                  key={group}
                  type="monotone"
                  hide={active.length > 0 && !active.includes(group)}
                  dataKey={group}
                  stroke={theme.colors.charts[i % theme.colors.charts.length]}
                  fill={theme.colors.charts[i % theme.colors.charts.length]}
                  fillOpacity={0.3}
                  dot={false}
                />
              ))}
            </AreaChart>
          </Brush>
        </AreaChart>
      </ResponsiveContainer>
    </>
  )
}

const Filters = styled(Box)`
  &:empty {
    display: none;
  }
`
