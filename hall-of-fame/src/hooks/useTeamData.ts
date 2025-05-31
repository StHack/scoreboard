import {
  computeGameScore,
  DummyChallenge,
  GameConfig,
  GameScore,
  TeamScore,
} from '@sthack/scoreboard-common'
import { getEditionConfig, NoDataError } from '@sthack/scoreboard-ui/components'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { BackupDataType, useBackupData } from './useBackupData'

export function useTeamData(team?: string) {
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
    () => (team ? ach.filter(a => a.teamname === team) : ach),
    [ach, team],
  )

  const attempts = useMemo(
    () => (team ? att.filter(a => a.teamname === team) : att),
    [att, team],
  )

  const rewards = useMemo(
    () => (team ? rew.filter(r => r.teamname === team) : rew),
    [rew, team],
  )

  const users = useMemo(
    () => (team ? usr.filter(u => u.team === team) : usr),
    [usr, team],
  )

  const teamScore = gameScore.teamsScore.find(ts => ts.team === team)

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
      (team && !teamScore
        ? new NoDataError(
            `${team} seems to not have participated into edition ${year}`,
          )
        : undefined),
    achievements,
    attempts,
    challenges: cha,
    rewards,
    users,
    gameScore,
    teamScore: teamScore ?? dummyScore,
    minDate,
    maxDate,
  }
}

const dummyScore: TeamScore = {
  team: '',
  breakthroughs: [],
  rank: -1,
  rewards: [],
  score: -1,
  solved: [],
}
