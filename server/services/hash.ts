import { Algorithm, hash, Options, verify } from '@node-rs/argon2'

const options: Options = {
  // recommendation from owasp: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id
  algorithm: Algorithm.Argon2id,
  parallelism: 1,
  timeCost: 3,
  memoryCost: 12288,
}

export const hashPassword = async ({
  password,
  salt,
}: {
  password: string | undefined
  salt: string
}) =>
  password
    ? await hash(password, { ...options, salt: Buffer.from(salt, 'utf-8') })
    : undefined

export const verifyPassword = async ({
  password,
  hash,
  salt,
}: {
  password: string
  hash: string
  salt: string
}): Promise<boolean> =>
  password
    ? await verify(hash, password, {
        ...options,
        salt: Buffer.from(salt, 'utf-8'),
      })
    : false
