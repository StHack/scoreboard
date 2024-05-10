import { initMongo } from 'db/main.js'
import { registerUser, updateUser } from 'db/UsersDb.js'
import { config } from 'dotenv'
import { exit } from 'process'
import { parseArgs } from 'util'

if (process.env.NODE_ENV !== 'production') {
  config()
}

await initMongo()

const c = {
  /** reset */
  _: '\x1b[0m',
  /** bright */
  b: '\x1b[1m',
  /** fg gray */
  g: '\x1b[90m',
  /** fg red */
  r: '\x1b[31m',
}

const {
  values: { user, password },
} = parseArgs({
  strict: true,
  allowPositionals: false,
  options: {
    user: {
      type: 'string',
      short: 'u',
      multiple: false,
    },
    password: {
      type: 'string',
      short: 'p',
      multiple: false,
    },
  },
})

if (!user || !password) {
  console.error(`${c.r}You must specify a user and a password${c._}`)
  exit(-1)
}

try {
  await registerUser(
    {
      username: user,
      password: password,
      team: 'admin',
    },
    50,
  )

  console.log(
    `User created:\nusername:${c.b + c.g} ${user} ${c._}\npassword:${c.b + c.g} ${password} ${c._}`,
  )

  await updateUser(user, { isAdmin: true })
  console.log(`User ${c.b + c.g} ${user} ${c._} has been promoted to admin`)

  exit(0)
} catch (error) {
  console.error(`${c.r}${(error as Error).message}${c._}`)
  exit(-1)
}
