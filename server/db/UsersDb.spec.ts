import { CreateUser } from 'models/User'
import { init } from './main'
import { login, register, removeUser } from './UsersDb'

const user1: CreateUser = {
  username: 'toto33',
  password: 'azerty123',
  team: 'h4ck3rs',
}

const user2: CreateUser = {
  username: 'lala42',
  password: 'qwerty123',
  team: 'h4ck3rs',
}

describe('Users DB integration tests', () => {
  beforeAll(async () => {
    await init()
  })

  beforeEach(async () => {
    await removeUser(user1.username)
    await removeUser(user2.username)
  })

  it('should be able to register', async () => {
    await expect(register(user1)).resolves.not.toThrow()
  })

  it('should be able to login', async () => {
    await register(user1)
    const result = await login(user1.username, user1.password)

    expect(result).toBe(true)
  })

  it('should not be able to login with invalid password', async () => {
    await register(user1)
    const result = await login(user1.username, 'invalidpassword')

    expect(result).toBe(false)
  })

  it('should not be able to register twice with the same username', async () => {
    await register(user1)

    await expect(
      register({
        username: user1.username,
        password: 'anotherpassword',
        team: 'dummy',
      }),
    ).rejects.toThrow()
  })

  it('should be able to register multiple users', async () => {
    await register(user1)

    await expect(register(user2)).resolves.not.toThrow()
  })
})
