import { ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import { Header } from 'components/Header'
import { ProvideAdmin } from 'hooks/useAdmin'
import { useAuth } from 'hooks/useAuthentication'
import { ProvideGame } from 'hooks/useGame'
import { Admin } from 'pages/Admin'
import { Game } from 'pages/Game'
import { Login } from 'pages/Login'
import { Register } from 'pages/Register'
import { Rules } from 'pages/Rules'
import { ScoreBoard } from 'pages/ScoreBoard'
import { ReactElement, ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

const AppBlock = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100vh;
  min-width: ${p => p.theme.sizes.minimalRequired};
  position: relative;
`

const Container = styled.div`
  overflow: auto;
  display: grid;
`

export default function App () {
  const { isAuthenticated, isAuthorized } = useAuth()

  return (
    <ThemeProvider
      theme={theme =>
        isAuthorized
          ? {
              ...theme,
              colors: {
                ...theme.colors,
                secondary: theme.colors.pink,
                secondaryText: theme.colors.white,
              },
            }
          : theme
      }
    >
      <BrowserRouter>
        <AppBlock>
          <Header />

          <Container>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute
                    condition={isAuthenticated}
                    fallbackTo="/login"
                  >
                    <ProvideGame>
                      <Game />
                    </ProvideGame>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/login"
                element={
                  <ProtectedRoute condition={!isAuthenticated} fallbackTo="/">
                    <Login />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/register"
                element={
                  <ProtectedRoute condition={!isAuthenticated} fallbackTo="/">
                    <Register />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute
                    condition={isAuthenticated && isAuthorized}
                    fallbackTo="/"
                  >
                    <ProvideGame>
                      <ProvideAdmin>
                        <Admin />
                      </ProvideAdmin>
                    </ProvideGame>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/scoreboard"
                element={
                  <ProtectedRoute
                    condition={isAuthenticated}
                    fallbackTo="/login"
                  >
                    <ProvideGame>
                      <ScoreBoard />
                    </ProvideGame>
                  </ProtectedRoute>
                }
              />

              <Route path="/rules" element={<Rules />} />
            </Routes>
          </Container>
        </AppBlock>
      </BrowserRouter>
    </ThemeProvider>
  )
}

type ProtectedRouteProps = {
  children: ReactNode
  condition: boolean
  fallbackTo: string
}

function ProtectedRoute ({
  children,
  condition,
  fallbackTo: redirectTo,
}: ProtectedRouteProps): ReactElement {
  if (!condition) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}
