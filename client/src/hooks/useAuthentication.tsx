import { User } from 'models/User'
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
  isAuthenticated: boolean
  isAuthorized: boolean
  logOut: () => Promise<void>
  logIn: (
    username: string,
    password: string,
  ) => Promise<{
    ok: boolean
    error?: string
  }>
}

const authContext = createContext<AuthContext>({
  user: undefined,
  isAuthenticated: false,
  isAuthorized: false,
  logOut: () => Promise.resolve(),
  logIn: () => Promise.resolve({ ok: false, error: 'oups' }),
})

export function ProvideAuth ({ children }: PropsWithChildren<{}>) {
  const auth = useProvideAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
  return useContext(authContext)
}

function useProvideAuth (): AuthContext {
  const [user, setUser] = useState<User>()

  useEffect(() => {
    const init = async () => {
      const { ok, user } = await me()
      if (ok) {
        setUser(user)
      }
    }

    init()
  }, [])

  return {
    user,
    isAuthenticated: user !== undefined,
    isAuthorized: !!user?.isAdmin,
    logOut: async () => {
      await logout()
      setUser(undefined)
    },
    logIn: async (username: string, password: string) => {
      const { ok, error, user } = await login({
        username,
        password,
      })

      if (ok) {
        setUser(user!)
      }

      return { ok, error }
    },
  }
}
