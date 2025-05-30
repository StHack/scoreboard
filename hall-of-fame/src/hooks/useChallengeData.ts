import {
  Challenge,
  ChallengeScore,
  computeGameScore,
  GameConfig,
  GameScore,
} from '@sthack/scoreboard-common'
import { NoDataError } from '@sthack/scoreboard-ui/components'
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
        challenge: cha.find(c => c._id === a.challengeId) as Challenge,
      })),
    [cha, rawAch],
  )

  const att = useMemo(
    () =>
      rawAtt.map(a => ({
        ...a,
        challenge: cha.find(c => c._id === a.challengeId) as Challenge,
      })),
    [cha, rawAtt],
  )

  const gameScore = useMemo<GameScore>(() => {
    const teams = [...new Set(usr.map(u => u.team).filter(t => t !== 'admin'))]

    const config: GameConfig = {
      baseChallScore: 50,
      gameOpened: false,
      registrationOpened: false,
      teamSize: 5,
      teamCount: teams.length,
    }

    return computeGameScore(ach, rew, cha, teams, config)
  }, [ach, cha, rew, usr])

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
  challenge: {
    _id: '',
    author: '',
    category: '',
    description: '',
    difficulty: 'easy',
    flagPattern: '',
    img: '',
    isBroken: false,
    name: '',
  },
  score: -1,
}
