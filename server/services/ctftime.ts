import { listAchievement } from 'db/AchievementDb'
import { listAttemptAfter } from 'db/AttemptDb'
import { listChallenge } from 'db/ChallengeDb'
import { listReward } from 'db/RewardDb'
import { listTeam } from 'db/UsersDb'
import { IRouter } from 'express'
import { computeGameScore } from './score'
import { ServerConfig } from './serverconfig'

export function registerCtfTime(app: IRouter, serverConfig: ServerConfig) {
  app.get('/api/ctftime/team', async (req, res) => {
    const [achievements, rewards, challenges, teams, config] =
      await Promise.all([
        listAchievement(),
        listReward(),
        listChallenge(),
        listTeam(),
        serverConfig.getGameConfig(),
      ])

    const gameScore = computeGameScore(
      achievements,
      rewards,
      challenges,
      teams,
      config,
    )

    res.send({
      tasks: challenges.map(c => c.name),
      standings: gameScore.teamsScore.map(ts => ({
        pos: ts.rank,
        team: ts.team,
        score: ts.score,
        taskStats: ts.solved.reduce(
          (acc, cur) => ({
            ...acc,
            [challenges.find(c => c._id == cur.challengeId)?.name ??
            cur.challengeId]: {
              points: gameScore.challsScore[cur.challengeId].score,
              time: cur.createdAt.getTime(),
            },
          }),
          {},
        ),
        lastAccept: Math.max(...ts.solved.map(s => s.createdAt.getTime())),
      })),
    })
  })

  app.get<{ lastId?: number }>('/api/ctftime/capture', async (req, res) => {
    const since = req.query.lastId
      ? new Date(parseInt(req.query.lastId.toString()))
      : new Date(0)

    const [achievements, attempts, challenges] = await Promise.all([
      listAchievement(),
      listAttemptAfter(since),
      listChallenge(),
    ])

    res.send(
      attempts.map(att => ({
        id: att.createdAt.getTime(),
        time: att.createdAt.getTime(),
        type: achievements.find(
          ach =>
            att.challengeId === ach.challengeId &&
            att.teamname === ach.teamname &&
            att.username === ach.username &&
            att.createdAt.getTime() >= ach.createdAt.getTime() - 100 &&
            att.createdAt.getTime() <= ach.createdAt.getTime(),
        )
          ? 'taskCorrect'
          : 'taskWrong',
        team: att.teamname,
        task: challenges.find(c => c._id === att.challengeId)?.name,
      })),
    )
  })
}
