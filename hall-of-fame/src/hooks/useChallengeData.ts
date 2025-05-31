import {
  ChallengeScore,
  computeGameScore,
  DummyChallenge,
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
  const usersData = useBackupData(yearNumber, BackupDataType.users)

  const { data: rawAch = [] } = achievementsData
  const { data: rawAtt = [] } = attemptsData
  const { data: cha = [] } = challengesData
  const { data: rew = [] } = rewardsData
  const { data: usr = [] } = usersData

  const ach = useMemo(
    () =>
      rawAch.map(a => ({
        ...a,
        challenge: cha.find(c => c._id === a.challengeId) ?? DummyChallenge,
      })),
    [cha, rawAch],
  )

  const att = useMemo(
    () =>
      rawAtt.map(a => ({
        ...a,
        challenge: cha.find(c => c._id === a.challengeId) ?? DummyChallenge,
      })),
    [cha, rawAtt],
  )

  const gameScore = useMemo<GameScore>(() => {
    const teams = [
      ...new Set(
        usr
          .map(u => u.team)
          .filter(t => (yearNumber > 2022 ? t !== 'admin' : true)),
      ),
    ]

    const config: GameConfig = {
      ...getEditionConfig(yearNumber),
      gameOpened: false,
      registrationOpened: false,
      teamCount: teams.length,
    }

    return computeGameScore(ach, rew, cha, teams, config)
  }, [ach, cha, rew, usr, yearNumber])

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

  const challScore = challengeId
    ? gameScore.challsScore[challengeId]
    : undefined

  return {
    loading:
      achievementsData.loading &&
      attemptsData.loading &&
      challengesData.loading &&
      rewardsData.loading &&
      usersData.loading,
    error:
      achievementsData.error ||
      attemptsData.error ||
      challengesData.error ||
      rewardsData.error ||
      usersData.error ||
      (challengeId && !challScore
        ? new NoDataError(`This challenge doesn't exist`)
        : undefined),
    achievements,
    attempts,
    challenges: cha,
    gameScore,
    challScore: challScore ?? dummyScore,
    minDate,
    maxDate,
  }
}

const dummyScore: ChallengeScore = {
  achievements: [],
  challenge: DummyChallenge,
  score: -1,
}
