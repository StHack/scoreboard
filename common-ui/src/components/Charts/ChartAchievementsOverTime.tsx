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
  { label: 'User', value: 'user' },
  { label: 'Team', value: 'team' },
  { label: 'Challenge', value: 'challenge' },
] as const
type AllowedGroup = (typeof GROUP_OPTIONS)[number]['value']

function groupKey(
  groupBy: AllowedGroup,
  { challenge, teamname, username }: Achievement,
): string {
  return groupBy === 'team'
    ? `t/${teamname}`
    : groupBy === 'challenge'
      ? `c/${challenge.name}`
      : `u/${username}`
}

export type ChartAchievementsOverTimeProps = {
  achievements: Achievement[]
  defaultTime?: AllowedAggregation
  defaultGroup?: AllowedGroup
  hideSelectorTime?: boolean
  hideSelectorGroup?: boolean
  forcedActive?: string
  minDate?: Date
  maxDate?: Date
}
export function ChartAchievementsOverTime({
  achievements,
  defaultTime = 30,
  defaultGroup = 'team',
  hideSelectorTime,
  hideSelectorGroup,
  forcedActive,
  minDate,
  maxDate,
}: ChartAchievementsOverTimeProps) {
  const theme = useTheme()
  const [agg, setAgg] = useState(defaultTime)
  const [groupBy, setGroupBy] = useState<AllowedGroup>(defaultGroup)
  const [active, setActive] = useState<string[]>(
    forcedActive ? [`${defaultGroup[0]}/${forcedActive}`] : [],
  )

  const groups = useMemo(
    () => [...new Set(achievements.map(a => groupKey(groupBy, a)))],
    [achievements, groupBy],
  )

  const data = useMemo(() => {
    if (achievements.length === 0) return []

    // 1. Find min and max time
    const times = achievements.map(a => a.createdAt.getTime())
    const minTime = minDate?.getTime() ?? Math.min(...times)
    const maxTime = maxDate?.getTime() ?? Math.max(...times)

    // 2. Generate all bucket start times
    const bucketMs = agg * 60 * 1000
    const buckets: Record<number, Record<string, number>> = {}

    for (
      let t = Math.floor(minTime / bucketMs) * bucketMs;
      t <= maxTime;
      t += bucketMs
    ) {
      buckets[t] = {}
    }

    // 3. Fill buckets with achievement counts
    for (const ach of achievements) {
      const time = Math.floor(ach.createdAt.getTime() / bucketMs) * bucketMs
      const key = groupKey(groupBy, ach)
      if (!buckets[time]) buckets[time] = {}
      buckets[time][key] = (buckets[time][key] ?? 0) + 1
    }

    // 4. Fill missing group keys with 0
    return Object.entries(buckets)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([time, groupsObj]) => {
        const filled: Record<string, number> = {}
        for (const group of groups) {
          filled[group] = groupsObj[group] ?? 0
        }
        return { time: new Date(Number(time)), ...filled }
      })
  }, [achievements, agg, groupBy, groups, maxDate, minDate])

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
