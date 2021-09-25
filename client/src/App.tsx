import styled from '@emotion/styled'
import { Box } from 'components/Box'
import { Header } from 'components/Header'
import { useAuth } from 'hooks/useAuthentication'
import { Login } from 'pages/Login'
import { Register } from 'pages/Register'
import { Route, Switch, Redirect } from 'react-router'
import { BrowserRouter } from 'react-router-dom'

const AppBlock = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100vh;
  min-width: ${p => p.theme.sizes.minimalRequired};
  position: relative;
`

export default function App () {
  const { user, logOut, isAuthenticated } = useAuth()

  return (
    <BrowserRouter>
      <AppBlock>
        <Header user={user} admin={() => false} logout={logOut} />

        <Switch>
          <Route exact path="/">
            {isAuthenticated ? <></> : <Redirect to="/login" />}
          </Route>

          <Route path="/login">
            {isAuthenticated ? <Redirect to="/" /> : <Login />}
          </Route>

          <Route path="/register">
            {isAuthenticated ? <Redirect to="/" /> : <Register />}
          </Route>
        </Switch>

        {user && (
          <Box display="flex" flexDirection="column">
            <span>{user.username}</span>
          </Box>
        )}
      </AppBlock>
    </BrowserRouter>
  )
}
