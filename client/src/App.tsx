import styled from '@emotion/styled'
import { Footer } from 'components/Footer'
import { Header } from 'components/Header'
import { Loader } from 'components/Loader'
import { ProvideAdmin } from 'hooks/useAdmin'
import { useAuth } from 'hooks/useAuthentication'
import { ProvidePlayer } from 'hooks/usePlayer'
import { Game } from 'pages/Game'
import { Login } from 'pages/Login'
import { Register } from 'pages/Register'
import { Rules } from 'pages/Rules'
import { lazy, ReactElement, ReactNode, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

const Admin = lazy(() =>
  import('pages/Admin').then(module => ({ default: module.Admin })),
)

const ScoreBoard = lazy(() =>
  import('pages/ScoreBoard').then(module => ({ default: module.ScoreBoard })),
)

const AppBlock = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
  min-width: ${p => p.theme.sizes.minimalRequired};
  position: relative;
`

const Container = styled.main`
  overflow: auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
`

export default function App() {
  const { isAuthenticated, isAuthorized, hasReadRules } = useAuth()

  return (
    <BrowserRouter>
      <AppBlock>
        <Header />
        <Suspense fallback={<Loader size="10" placeSelf="center" />}>
          <Container>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute
                    condition={isAuthenticated && hasReadRules}
                    fallbackTo={isAuthenticated ? '/rules' : '/login'}
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
                  <ProtectedRoute condition={!isAuthenticated} fallbackTo="/">
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
        </Suspense>
        <Footer />
      </AppBlock>
    </BrowserRouter>
  )
}

type ProtectedRouteProps = {
  children: ReactNode
  condition: boolean
  fallbackTo: string
}

function ProtectedRoute({
  children,
  condition,
  fallbackTo: redirectTo,
}: ProtectedRouteProps): ReactElement {
  if (!condition) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}
