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
import { Redirect, Route, Switch } from 'react-router'
import { BrowserRouter } from 'react-router-dom'

const AppBlock = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100vh;
  min-width: ${p => p.theme.sizes.minimalRequired};
  position: relative;
`

export default function App () {
  const { isAuthenticated, isAuthorized } = useAuth()

  return (
    <BrowserRouter>
      <AppBlock>
        <Header />

        <Container>
          <Switch>
            <Route exact path="/">
              {isAuthenticated ? <Game></Game> : <Redirect to="/login" />}
            </Route>

            <Route path="/login">
              {isAuthenticated ? <Redirect to="/" /> : <Login />}
            </Route>

            <Route path="/register">
              {isAuthenticated ? <Redirect to="/" /> : <Register />}
            </Route>

            <Route path="/admin">
              {isAuthenticated && isAuthorized
                ? (
                <ProvideGame>
                  <ProvideAdmin>
                    <Admin />
                  </ProvideAdmin>
                </ProvideGame>
                  )
                : (
                <Redirect to="/" />
                  )}
            </Route>

            <Route path="/scoreboard">
              <ScoreBoard />
            </Route>

            <Route path="/rules">
              <Rules />
            </Route>
          </Switch>
        </Container>
      </AppBlock>
    </BrowserRouter>
  )
}

const Container = styled.div`
  overflow: auto;
`
