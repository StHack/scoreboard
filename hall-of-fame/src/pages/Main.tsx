import { Achievement, Challenge } from '@sthack/scoreboard-common'
import {
  Box,
  BoxPanel,
  ChartAchievementsOverTime,
  ConditionalLoader,
  IconAchievement,
} from '@sthack/scoreboard-ui/components'
import { BackupDataType, useBackupData } from 'hooks/useBackupData'
import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'

export function Main() {
  const { year } = useParams()
  const yearNumber = parseInt(year || '', 10)

  const { data: challenges = [], error: challengeError } = useBackupData(
    yearNumber,
    BackupDataType.challenges,
  )

  const {
    loading,
    data: achievements = [],
    error: achievementError,
  } = useBackupData(yearNumber, BackupDataType.achievements)

  const realAchievements = useMemo<Achievement[]>(
    () =>
      achievements.map(a => ({
        ...a,
        challenge: challenges.find(c => c._id === a.challengeId) as Challenge,
      })),
    [achievements, challenges],
  )

  const achievementEmptyError =
    realAchievements.length === 0
      ? new Error('No achievements found for this year')
      : undefined

  return (
    <ConditionalLoader
      showLoader={loading}
      error={challengeError ?? achievementError ?? achievementEmptyError}
      size="10"
    >
      <BoxPanel
        title={
          <>
            <IconAchievement size="2" /> Achievements over time
          </>
        }
        titleProps={{
          display: 'flex',
          alignItems: 'center',
          gap: '2',
        }}
      >
        <ChartAchievementsOverTime achievements={realAchievements} />
      </BoxPanel>
    </ConditionalLoader>
  )
}
