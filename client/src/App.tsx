import { ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import { Footer } from 'components/Footer'
import { Header } from 'components/Header'
import { ProvideAdmin } from 'hooks/useAdmin'
import { useAuth } from 'hooks/useAuthentication'
import { useGame } from 'hooks/useGame'
import { ProvidePlayer } from 'hooks/usePlayer'
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
  grid-template-rows: auto 1fr auto;
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
  const {
    gameConfig: { registrationOpened },
  } = useGame()

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
                    <ProvidePlayer>
                      <Game />
                    </ProvidePlayer>
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
                  <ProtectedRoute
                    condition={!isAuthenticated && registrationOpened}
                    fallbackTo="/"
                  >
                    <Register />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute
                    condition={isAuthenticated && isAuthorized}
                    fallbackTo="/"
                  >
                    <ProvideAdmin>
                      <Admin />
                    </ProvideAdmin>
                  </ProtectedRoute>
                }
              />

              <Route path="/scoreboard" element={<ScoreBoard />} />

              <Route path="/rules" element={<Rules />} />
            </Routes>
          </Container>

          <Footer />
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
