import { Achievement, BaseAchievement } from 'models/Achievement'
import {
  getChallengeAchievement,
  getTeamAchievement,
  getUserAchievement,
  registerAchievement,
  removeAllTeamAchievement,
} from './AchievementDb'
import { init } from './main'

const chall1 = 'Chall #1'
const chall2 = 'Chall #2'

const user1 = 'toto'
const user2 = 'lala'
const user3 = 'luffy'

const team1 = 'h4ck3rs'
const team2 = 'p0wn3rs'

async function bulkCreate(
  achievements: [challenge: string, teamname: string, username: string][],
) {
  for (const [challenge, teamname, username] of achievements) {
    await registerAchievement({
      challenge,
      teamname,
      username,
    })
  }
}

describe('Achievement DB integration tests', () => {
  beforeAll(async () => {
    await init()
  })

  beforeEach(async () => {
    await removeAllTeamAchievement(team1)
    await removeAllTeamAchievement(team2)
  })

  afterAll(async () => {
    await removeAllTeamAchievement(team1)
    await removeAllTeamAchievement(team2)
  })

  it('should create an achievement', async () => {
    const achievement = await registerAchievement({
      challenge: chall1,
      teamname: team1,
      username: user1,
    })

    expect(achievement).toEqual(
      expect.objectContaining({
        challenge: chall1,
        teamname: team1,
        username: user1,
        createdAt: expect.any(Date),
      }),
    )
  })

  it('should not create an achievement if team already have it', async () => {
    const achievement1: BaseAchievement = {
      challenge: chall1,
      teamname: team1,
      username: user1,
    }
    const achievement2: BaseAchievement = {
      challenge: chall1,
      teamname: team1,
      username: user2,
    }

    const firstAchievement = await registerAchievement(achievement1)
    const secondAchievement = await registerAchievement(achievement2)

    expect(secondAchievement).toEqual(firstAchievement)
    expect(secondAchievement.username).not.toEqual(achievement2.username)
  })

  it('should return only specified team achievement', async () => {
    await bulkCreate([
      [chall1, team1, user1],
      [chall2, team1, user2],
      [chall1, team2, user3],
    ])

    const achievements = await getTeamAchievement(team1)
    expect(achievements).toHaveLength(2)

    const team1Only = (a: Achievement) => a.teamname === team1
    expect(achievements).toSatisfyAll(team1Only)
  })

  it('should return only specified challenge achievement', async () => {
    await bulkCreate([
      [chall1, team1, user1],
      [chall2, team1, user2],
      [chall1, team2, user3],
    ])

    const achievements = await getChallengeAchievement(chall1)
    expect(achievements).toHaveLength(2)

    const chall1Only = (a: Achievement) => a.challenge === chall1
    expect(achievements).toSatisfyAll(chall1Only)
  })

  it('should return only specified user achievement', async () => {
    await bulkCreate([
      [chall1, team1, user1],
      [chall1, team2, user3],
      [chall2, team1, user1],
    ])

    const achievements = await getUserAchievement(user1)
    expect(achievements).toHaveLength(2)

    const user1Only = (a: Achievement) => a.username === user1
    expect(achievements).toSatisfyAll(user1Only)
  })
})
