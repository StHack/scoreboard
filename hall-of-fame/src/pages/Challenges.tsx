import {
  Challenge,
  computeGameScore,
  GameConfig,
  GameScore,
} from '@sthack/scoreboard-common'
import {
  BoxPanel,
  ChallsScoreBoard,
  ConditionalLoader,
  IconChallenge,
} from '@sthack/scoreboard-ui/components'
import { BackupDataType, useBackupData } from 'hooks/useBackupData'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

export function Challenges() {
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

  const { data: users = [], error: usersError } = useBackupData(
    yearNumber,
    BackupDataType.users,
  )
  const { data: rewards = [], error: rewardsError } = useBackupData(
    yearNumber,
    BackupDataType.rewards,
  )

  const { challsScore } = useMemo<GameScore>(() => {
    const a = achievements.map(a => ({
      ...a,
      challenge: challenges.find(c => c._id === a.challengeId) as Challenge,
    }))

    const teams = [...new Set(users.map(u => u.team))]

    const config: GameConfig = {
      baseChallScore: 50,
      gameOpened: false,
      registrationOpened: false,
      teamSize: 5,
      teamCount: teams.length,
    }

    return computeGameScore(a, rewards, challenges, teams, config)
  }, [achievements, challenges, rewards, users])

  return (
    <ConditionalLoader
      showLoader={loading}
      error={challengeError ?? achievementError ?? usersError ?? rewardsError}
      size="10"
    >
      <BoxPanel
        title={
          <>
            <IconChallenge size="2" /> Challenges board
          </>
        }
        titleProps={{
          display: 'flex',
          alignItems: 'center',
          gap: '2',
        }}
      ></BoxPanel>
      <ChallsScoreBoard challsScore={challsScore} challenges={challenges} />
    </ConditionalLoader>
  )
}
