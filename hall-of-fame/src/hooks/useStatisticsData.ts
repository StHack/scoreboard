import { DummyChallenge, DummyTeam } from '@sthack/scoreboard-common'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { BackupDataType, useBackupData } from './useBackupData'

export function useStatisticsData() {
  const { year } = useParams()
  const yearNumber = parseInt(year || '', 10)

  const statsData = useBackupData(
    yearNumber,
    BackupDataType.serveractivitystatistics,
  )

  const achievementsData = useBackupData(
    yearNumber,
    BackupDataType.achievements,
  )
  const attemptsData = useBackupData(yearNumber, BackupDataType.attempts)
  const challengesData = useBackupData(yearNumber, BackupDataType.challenges)
  const teamsData = useBackupData(yearNumber, BackupDataType.teams)

  const { data: stats = [] } = statsData
  const { data: rawAch = [] } = achievementsData
  const { data: rawAtt = [] } = attemptsData
  const { data: cha = [] } = challengesData
  const { data: tm = [] } = teamsData

  const ach = useMemo(
    () =>
      rawAch.map(a => ({
        ...a,
        challenge: cha.find(c => c._id === a.challengeId) ?? DummyChallenge,
        team: tm.find(t => t._id === a.teamId) ?? DummyTeam,
      })),
    [cha, rawAch, tm],
  )

  const att = useMemo(
    () =>
      rawAtt.map(a => ({
        ...a,
        challenge: cha.find(c => c._id === a.challengeId) ?? DummyChallenge,
        team: tm.find(t => t._id === a.teamId) ?? DummyTeam,
      })),
    [cha, rawAtt, tm],
  )

  const minDate = useMemo(
    () =>
      new Date(
        Math.min(
          ...att.map(a => a.createdAt.getTime()),
          ...ach.map(a => a.createdAt.getTime()),
          ...stats.map(s => s.timestamp.getTime()),
        ),
      ),
    [ach, att, stats],
  )

  const maxDate = useMemo(
    () =>
      new Date(
        Math.max(
          ...att.map(a => a.createdAt.getTime()),
          ...ach.map(a => a.createdAt.getTime()),
          ...stats.map(s => s.timestamp.getTime()),
        ),
      ),
    [ach, att, stats],
  )

  return {
    loading:
      statsData.loading &&
      achievementsData.loading &&
      attemptsData.loading &&
      challengesData.loading &&
      teamsData.loading,
    error:
      statsData.error ||
      achievementsData.error ||
      attemptsData.error ||
      challengesData.error ||
      teamsData.error,
    achievements: ach,
    attempts: att,
    minDate,
    maxDate,
    stats,
  }
}
