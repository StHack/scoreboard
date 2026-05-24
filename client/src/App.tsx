import styled from '@emotion/styled'
import { UserRole } from '@sthack/scoreboard-common'
import { Loader } from '@sthack/scoreboard-ui/components'
import { Footer } from 'components/Footer'
import { Header } from 'components/Header'
import { useAuth } from 'hooks/useAuthentication'
import { GameContextLoadingState, useGame } from 'hooks/useGame'
import { AccountLayout } from 'pages/Account'
import { AccountGeneralPanel } from 'pages/Account/components/AccountGeneralPanel'
import { AccountTeamPanel } from 'pages/Account/components/AccountTeamPanel'
import { AccountTokenPanel } from 'pages/Account/components/AccountTokenPanel'
import { AdminLayout } from 'pages/Admin'
import { AchievementPanel } from 'pages/Admin/components/AchievementPanel'
import { AttemptPanel } from 'pages/Admin/components/AttemptPanel'
import { ChallengeFormLayout } from 'pages/Admin/components/ChallengeForm'
import { ChallengePanel } from 'pages/Admin/components/ChallengePanel'
import { GeneralPanel } from 'pages/Admin/components/GeneralPanel'
import { SurveyPanel } from 'pages/Admin/components/SurveyPanel'
import { UserPanel } from 'pages/Admin/components/UserPanel'
import { AuthLayout, AuthLoader } from 'pages/Auth'
import { Login } from 'pages/Auth/components/Login'
import { Register } from 'pages/Auth/components/Register'
import { GameLayout } from 'pages/Game'
import { ChallengeDetailPanel } from 'pages/Game/components/ChallengeDetailPanel'
import { ChallengeListPanel } from 'pages/Game/components/ChallengeListPanel'
import { Rules } from 'pages/Rules'
import { lazy, Suspense } from 'react'
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
  return (
    <BrowserRouter>
      <AppBlock>
        <Header />
        <AuthLoader>
          <Suspense fallback={<Loader size="10" placeSelf="center" />}>
            <Container>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/scoreboard" element={<ScoreBoard />} />
                <Route path="/rules" element={<Rules />} />

                <Route path="/auth" element={<AuthLayout />}>
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                </Route>

                <Route path="/account" element={<AccountLayout />}>
                  <Route index element={<AccountGeneralPanel />} />
                  <Route path="team" element={<AccountTeamPanel />} />
                  <Route path="tokens" element={<AccountTokenPanel />} />
                </Route>

                <Route path="/game" element={<GameLayout />}>
                  <Route index element={<ChallengeListPanel />} />
                  <Route
                    path=":challengeId"
                    element={<ChallengeDetailPanel />}
                  />
                </Route>

                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<GeneralPanel />} />
                  <Route path="challenges">
                    <Route index element={<ChallengePanel />} />
                    <Route path="create" element={<ChallengeFormLayout />} />
                    <Route
                      path=":challengeId/edit"
                      element={<ChallengeFormLayout />}
                    />
                  </Route>
                  <Route path="users" element={<UserPanel />} />
                  <Route path="achievements" element={<AchievementPanel />} />
                  <Route path="attempts" element={<AttemptPanel />} />
                  <Route path="surveys" element={<SurveyPanel />} />
                </Route>
              </Routes>
            </Container>
          </Suspense>
        </AuthLoader>
        <Footer />
      </AppBlock>
    </BrowserRouter>
  )
}

function Home() {
  const {
    gameConfig: { gameOpened },
    isLoaded,
  } = useGame()
  const { isAuthenticated, roles, hasReadRules } = useAuth()

  if (roles.includes(UserRole.Admin)) {
    return <Navigate to="/admin" replace />
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  if (!hasReadRules) {
    return <Navigate to="/rules" replace />
  }

  if (
    !isLoaded(GameContextLoadingState.config) ||
    !isLoaded(GameContextLoadingState.challenges)
  ) {
    return <Loader size="10" placeSelf="center" />
  }

  if (!gameOpened) {
    return <Navigate to="/account" replace />
  }

  if (gameOpened) {
    return <Navigate to="/game" replace />
  }

  return null
}
