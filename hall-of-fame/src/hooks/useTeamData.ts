import {
  computeGameScore,
  DummyChallenge,
  DummyTeam,
  dummyTeamScore,
  GameConfig,
  GameScore,
  isPlayer,
  Player,
} from '@sthack/scoreboard-common'
import { getEditionConfig, NoDataError } from '@sthack/scoreboard-ui/components'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { BackupDataType, useBackupData } from './useBackupData'

export function useTeamData(teamname?: string) {
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
  const teamsData = useBackupData(yearNumber, BackupDataType.teams)

  const { data: rawAch = [] } = achievementsData
  const { data: rawAtt = [] } = attemptsData
  const { data: cha = [] } = challengesData
  const { data: rawRew = [] } = rewardsData
  const { data: rawUsr = [] } = usersData
  const { data: tm = [] } = teamsData

  const plr = useMemo(
    () =>
      rawUsr.filter(isPlayer).map<Player>(p => ({
        ...p,
        team: tm.find(t => t._id === p.teamId) ?? DummyTeam,
      })),
    [rawUsr, tm],
  )

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

  const rew = useMemo(
    () =>
      rawRew.map(a => ({
        ...a,
        team: tm.find(t => t._id === a.teamId) ?? DummyTeam,
      })),
    [rawRew, tm],
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
    () => (teamname ? ach.filter(a => a.team.name === teamname) : ach),
    [ach, teamname],
  )

  const attempts = useMemo(
    () => (teamname ? att.filter(a => a.team.name === teamname) : att),
    [att, teamname],
  )

  const rewards = useMemo(
    () => (teamname ? rew.filter(r => r.team.name === teamname) : rew),
    [rew, teamname],
  )

  const players = useMemo(
    () => (teamname ? plr.filter(u => u.team.name === teamname) : plr),
    [plr, teamname],
  )

  const teamScore = gameScore.teamsScore.find(ts => ts.team.name === teamname)

  return {
    loading:
      achievementsData.loading &&
      attemptsData.loading &&
      challengesData.loading &&
      rewardsData.loading &&
      usersData.loading &&
      teamsData.loading,
    error:
      achievementsData.error ||
      attemptsData.error ||
      challengesData.error ||
      rewardsData.error ||
      usersData.error ||
      teamsData.error ||
      (teamname && !teamScore
        ? new NoDataError(
            `${teamname} seems to not have participated into edition ${year}`,
          )
        : undefined),
    achievements,
    attempts,
    challenges: cha,
    rewards,
    players,
    gameScore,
    teamScore: teamScore ?? dummyTeamScore,
    minDate,
    maxDate,
  }
}
