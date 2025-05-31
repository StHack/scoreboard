import styled from '@emotion/styled'
import { Loader } from '@sthack/scoreboard-ui/components'
import { Footer } from 'components/Footer'
import { Header } from 'components/Header'
import { ChallengeDetail } from 'pages/ChallengeDetail'
import { Challenges } from 'pages/Challenges'
import { Home } from 'pages/Home'
import { Statistics } from 'pages/Statistics'
import { TeamDetail } from 'pages/TeamDetail'
import { Teams } from 'pages/Teams'
import { Year } from 'pages/Year'
import { YearLayout } from 'pages/YearLayout'
import { Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'

// const ScoreBoard = lazy(() =>
//   import('pages/ScoreBoard').then(module => ({ default: module.ScoreBoard })),
// )

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

export function App() {
  return (
    <HashRouter>
      <AppBlock>
        <Header />
        <Suspense fallback={<Loader size="10" placeSelf="center" />}>
          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/year/:year" element={<YearLayout />}>
                <Route index element={<Year />} />
                <Route path="teams" element={<Teams />} />
                <Route path="team/:team" element={<TeamDetail />} />
                <Route path="challenges" element={<Challenges />} />
                <Route
                  path="challenge/:challengeId"
                  element={<ChallengeDetail />}
                />
                <Route path="statistics" element={<Statistics />} />
              </Route>
            </Routes>
          </Container>
        </Suspense>
        <Footer />
      </AppBlock>
    </HashRouter>
  )
}
