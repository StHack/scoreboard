import { CreateUser, LoginCredentials, User } from 'models/User'

type RegisterResponse = {
  ok: boolean
  error?: string
}
export async function register(user: CreateUser): Promise<RegisterResponse> {
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })

  if (response.ok) {
    return { ok: true }
  } else {
    const error = await response.text()
    return { ok: false, error }
  }
}

type MeResponse = {
  ok: boolean
  user?: User
  error?: string
}
export async function login(
  credentials: LoginCredentials,
): Promise<MeResponse> {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  if (response.ok) {
    const user = (await response.json()) as User
    return { ok: true, user }
  } else {
    const error = await response.text()
    return { ok: false, error }
  }
}

export async function logout(): Promise<void> {
  await fetch('/api/logout', { method: 'POST' })
}

export async function me(): Promise<MeResponse> {
  const response = await fetch('/api/me')

  if (response.ok) {
    const user = (await response.json()) as User
    return { ok: true, user }
  } else {
    const error = await response.text()
    return { ok: false, error }
  }
}
