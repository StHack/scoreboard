import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import {
  ratingAIUsage,
  ratingPerceivedDifficulty,
  ratingSatisfaction,
  Survey,
} from '@sthack/scoreboard-common'
import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
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

const GROUP_OPTIONS = [
  { label: 'Question', value: 'question' },
  { label: 'Challenge', value: 'challenge' },
  { label: 'Team', value: 'team' },
  { label: 'User', value: 'user' },
] as const
type AllowedGroup = (typeof GROUP_OPTIONS)[number]['value']

const QUESTION_OPTIONS = [
  { label: 'Satisfaction', value: 'satisfaction' },
  { label: 'Perceived Difficulty', value: 'perceivedDifficulty' },
  { label: 'AI Usage', value: 'aiUsage' },
] as const
type AllowedQuestion = (typeof QUESTION_OPTIONS)[number]['value']

function groupKey(
  groupBy: AllowedGroup,
  { challenge, teamname, username }: Survey,
): string {
  return groupBy === 'team'
    ? `t/${teamname}`
    : groupBy === 'challenge'
      ? `c/${challenge.name}`
      : `u/${username}`
}

export type ChartSurveysProps = {
  surveys: Survey[]
  defaultGroup?: AllowedGroup
  defaultQuestion?: AllowedQuestion
  hideGroupSelector?: boolean
  hideQuestionSelector?: boolean
  forcedActive?: string
}

export function ChartSurveys({
  surveys,
  defaultGroup = 'question',
  defaultQuestion = 'satisfaction',
  hideGroupSelector,
  hideQuestionSelector,
  forcedActive,
}: ChartSurveysProps) {
  const theme = useTheme()
  const [groupBy, setGroupBy] = useState<AllowedGroup>(defaultGroup)
  const [question, setQuestion] = useState<AllowedQuestion>(defaultQuestion)
  const [active, setActive] = useState<string[]>(
    forcedActive ? [`${defaultGroup[0]}/${forcedActive}`] : [],
  )

  const groups = useMemo(
    () =>
      groupBy === 'question'
        ? QUESTION_OPTIONS.map(o => o.value)
        : [...new Set(surveys.map(s => groupKey(groupBy, s)))],
    [surveys, groupBy],
  )

  const data = useMemo(() => {
    if (surveys.length === 0) return []

    // Initialize data structure: { [value]: { [group]: count } }
    const answerCounts: Record<number, Record<string, number>> = {}
    for (let i = 1; i <= 5; i++) {
      answerCounts[i] = {}
      for (const group of groups) {
        answerCounts[i][group] = 0
      }
    }

    // Count responses by answer value and group
    if (groupBy === 'question') {
      for (const survey of surveys) {
        for (const { value: group } of QUESTION_OPTIONS) {
          const answerValue = survey[group]

          if (answerValue >= 1 && answerValue <= 5) {
            answerCounts[answerValue][group] =
              (answerCounts[answerValue][group] ?? 0) + 1
          }
        }
      }
    } else {
      for (const survey of surveys) {
        const answerValue = survey[question]
        const group = groupKey(groupBy, survey)

        if (answerValue >= 1 && answerValue <= 5) {
          answerCounts[answerValue][group] =
            (answerCounts[answerValue][group] ?? 0) + 1
        }
      }
    }

    // Convert to array format for recharts
    return Object.entries(answerCounts)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([value, groupsObj]) => ({
        value: Number(value),
        ...groupsObj,
      }))
  }, [surveys, groupBy, question, groups])

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
        {!hideGroupSelector && (
          <LabelInput label="Group by" flexDirection="row" alignItems="center">
            <SelectInput
              value={groupBy}
              predefinedValues={GROUP_OPTIONS}
              onChange={e => setGroupBy(e.target.value as AllowedGroup)}
            />
          </LabelInput>
        )}
        {!hideQuestionSelector && groupBy !== 'question' && (
          <LabelInput label="Question" flexDirection="row" alignItems="center">
            <SelectInput
              value={question}
              predefinedValues={QUESTION_OPTIONS}
              onChange={e => {
                setActive([])
                setQuestion(e.target.value as AllowedQuestion)
              }}
            />
          </LabelInput>
        )}
      </Filters>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="value" />
          <YAxis allowDecimals={false} />
          <Tooltip
            content={<ChartTooltip />}
            labelFormatter={
              groupBy !== 'question' ? labelFormatter[question] : undefined
            }
          />
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
            <Bar
              key={group}
              hide={active.length > 0 && !active.includes(group)}
              dataKey={group}
              stackId={groupBy !== 'question' ? 'a' : undefined}
              fill={theme.colors.charts[i % theme.colors.charts.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </>
  )
}

const Filters = styled(Box)`
  &:empty {
    display: none;
  }
`

const labelFormatter: Record<AllowedQuestion, (value: number) => string> = {
  aiUsage: v => ratingAIUsage[v],
  perceivedDifficulty: v => ratingPerceivedDifficulty[v],
  satisfaction: v => ratingSatisfaction[v],
}
