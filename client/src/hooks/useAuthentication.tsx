import { User, UserRole } from '@sthack/scoreboard-common'
import { useStorage } from '@sthack/scoreboard-ui/hooks'
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { login, logout, me } from 'services/authenticate'

export type AuthContext = {
  user?: User
  isLoading: boolean
  isAuthenticated: boolean
  roles: UserRole[]
  hasReadRules: boolean
  readRules: () => void
  logOut: () => Promise<void>
  logIn: (
    username: string,
    password: string,
  ) => Promise<{
    ok: boolean
    error?: string
  }>
}

const AuthContext = createContext<AuthContext>({
  user: undefined,
  isLoading: true,
  isAuthenticated: false,
  roles: [UserRole.User],
  hasReadRules: false,
  readRules: () => {},
  logOut: () => Promise.resolve(),
  logIn: () => Promise.resolve({ ok: false, error: 'oups' }),
})

export function ProvideAuth({ children }: PropsWithChildren<object>) {
  const auth = useProvideAuth()
  return <AuthContext value={auth}>{children}</AuthContext>
}

export const useAuth = () => {
  return useContext(AuthContext)
}

function useProvideAuth(): AuthContext {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [user, setUser] = useState<User>()
  const [hasReadRules, setHasReadRules] = useStorage<boolean>(
    `hasReadRules-${new Date().getFullYear()}`,
    false,
  )

  useEffect(() => {
    const init = async () => {
      const { ok, user } = await me()
      if (ok) {
        setUser(user)
      }

      setIsLoading(false)
    }

    void init()
  }, [])

  return {
    user,
    isLoading,
    isAuthenticated: !isLoading && user !== undefined,
    roles: user?.roles ?? [UserRole.User],
    hasReadRules,
    readRules: () => setHasReadRules(true),
    logOut: async () => {
      if (!user) return
      await logout()
      setUser(undefined)
    },
    logIn: async (username: string, password: string) => {
      const { ok, error, user } = await login({
        username,
        password,
      })

      if (ok) {
        setUser(user)
      }

      return { ok, error }
    },
  }
}
