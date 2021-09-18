import { BaseChallenge } from 'models/Challenge'
import {
  checkChallenge,
  createChallenge,
  listChallenge,
  removeChallenge,
} from './ChallengeDb'
import { initMongo } from './main'

const challenge1: BaseChallenge = {
  name: 'Chall #1',
  author: 'nagarian',
  category: 'programmation',
  description: 'This is a challenge description',
  link: 'https://github.com/nagarian/optc-box-manager',
  difficulty: 'easy',
  flags: ['iam a flag'],
  img: 'this is a base64 encoded img',
}

const challenge2: BaseChallenge = {
  name: 'Chall #2',
  author: 'shoxx',
  category: 'forensic',
  description: 'This is a challenge description',
  difficulty: 'hard',
  flags: ['iam a r431 flag'],
  img: 'this is a base64 encoded img',
}

describe('Challenge DB integration tests', () => {
  beforeAll(async () => {
    await initMongo()
  })

  beforeEach(async () => {
    await removeChallenge(challenge1.name)
    await removeChallenge(challenge2.name)
  })

  // afterAll(async () => {
  //   await removeChallenge(challenge1.name)
  //   await removeChallenge(challenge2.name)
  // })

  it('should be able to create challenge', async () => {
    await expect(createChallenge(challenge1)).resolves.not.toThrow()
  })

  it('should return all challenges', async () => {
    await createChallenge(challenge1)
    await createChallenge(challenge2)

    const challs = await listChallenge()

    expect(challs).toHaveLength(2)

    expect(challs).toEqual([
      expect.objectContaining({ name: challenge1.name }),
      expect.objectContaining({ name: challenge2.name }),
    ])
  })

  it('should hash submitted flags', async () => {
    await createChallenge(challenge1)

    const challs = await listChallenge()

    expect(challs[0].flags).not.toEqual(challenge1.flags)
    expect(challs[0].flags[0]).not.toEqual(challenge1.flags[0])
  })

  it('should be able to create multiple challenge', async () => {
    await createChallenge(challenge1)

    await expect(createChallenge(challenge2)).resolves.not.toThrow()
  })

  it('should check if flag is valid', async () => {
    await createChallenge(challenge1)
    await createChallenge(challenge2)

    const result = await checkChallenge(challenge2.name, challenge2.flags[0])
    expect(result).toBe(true)
  })

  it('should check if flag is invalid', async () => {
    await createChallenge(challenge1)
    await createChallenge(challenge2)

    const result = await checkChallenge(
      challenge2.name,
      'Im not the right flag',
    )

    expect(result).toBe(false)
  })

  it('should throw an error for inexisting challenge', async () => {
    await createChallenge(challenge1)

    await expect(checkChallenge(
      'invalid chall name',
      challenge1.flags[0],
    )).rejects.toThrowError()
  })
})
