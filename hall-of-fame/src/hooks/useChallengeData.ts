import {
  computeGameScore,
  DummyAchievement,
  DummyChallenge,
  dummyChallengeScore,
  DummyTeam,
  GameConfig,
  GameScore,
} from '@sthack/scoreboard-common'
import { getEditionConfig, NoDataError } from '@sthack/scoreboard-ui/components'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { BackupDataType, useBackupData } from './useBackupData'

export function useChallengeData(challengeId?: string) {
  const { year } = useParams()
  const yearNumber = parseInt(year || '', 10)

  const achievementsData = useBackupData(
    yearNumber,
    BackupDataType.achievements,
  )
  const attemptsData = useBackupData(yearNumber, BackupDataType.attempts)
  const challengesData = useBackupData(yearNumber, BackupDataType.challenges)
  const rewardsData = useBackupData(yearNumber, BackupDataType.rewards)
  const surveysData = useBackupData(yearNumber, BackupDataType.surveys)
  const teamsData = useBackupData(yearNumber, BackupDataType.teams)

  const { data: rawAch = [] } = achievementsData
  const { data: rawAtt = [] } = attemptsData
  const { data: cha = [] } = challengesData
  const { data: rew = [] } = rewardsData
  const { data: rawSur = [] } = surveysData
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

  const sur = useMemo(
    () =>
      rawSur.map(s => ({
        ...s,
        achievement:
          ach.find(a => a._id === s.achievementId) ?? DummyAchievement,
        challenge: cha.find(c => c._id === s.challengeId) ?? DummyChallenge,
        team: tm.find(t => t._id === s.teamId) ?? DummyTeam,
      })),
    [ach, cha, rawSur, tm],
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

  const gameScore = useMemo<GameScore>(() => {
    const config: GameConfig = {
      ...getEditionConfig(yearNumber),
      gameOpened: false,
      registrationOpened: false,
      teamCount: tm.length,
    }

    return computeGameScore(ach, rew, cha, tm, config)
  }, [ach, cha, rew, tm, yearNumber])

  const minDate = useMemo(
    () =>
      new Date(
        Math.min(
          ...att.map(a => a.createdAt.getTime()),
          ...ach.map(a => a.createdAt.getTime()),
        ),
      ),
    [ach, att],
  )

  const maxDate = useMemo(
    () =>
      new Date(
        Math.max(
          ...att.map(a => a.createdAt.getTime()),
          ...ach.map(a => a.createdAt.getTime()),
        ),
      ),
    [ach, att],
  )

  const achievements = useMemo(
    () => (challengeId ? ach.filter(a => a.challengeId === challengeId) : ach),
    [ach, challengeId],
  )

  const attempts = useMemo(
    () => (challengeId ? att.filter(a => a.challengeId === challengeId) : att),
    [att, challengeId],
  )

  const surveys = useMemo(
    () => (challengeId ? sur.filter(s => s.challengeId === challengeId) : sur),
    [sur, challengeId],
  )

  const challScore = challengeId
    ? gameScore.challsScore[challengeId]
    : undefined

  return {
    loading:
      achievementsData.loading &&
      attemptsData.loading &&
      challengesData.loading &&
      rewardsData.loading &&
      teamsData.loading,
    error:
      achievementsData.error ||
      attemptsData.error ||
      challengesData.error ||
      rewardsData.error ||
      teamsData.error ||
      (challengeId && !challScore
        ? new NoDataError(`This challenge doesn't exist`)
        : undefined),
    achievements,
    attempts,
    challenges: cha,
    surveys,
    gameScore,
    challScore: challScore ?? dummyChallengeScore,
    minDate,
    maxDate,
  }
}
