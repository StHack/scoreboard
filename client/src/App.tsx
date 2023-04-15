import { ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import { Header } from 'components/Header'
import { ProvideAdmin } from 'hooks/useAdmin'
import { useAuth } from 'hooks/useAuthentication'
import { ProvideGame } from 'hooks/useGame'
import { ProvidePlayer } from 'hooks/usePlayer'
import { Admin } from 'pages/Admin'
import { Game } from 'pages/Game'
import { Login } from 'pages/Login'
import { Register } from 'pages/Register'
import { Rules } from 'pages/Rules'
import { ScoreBoard } from 'pages/ScoreBoard'
import { ReactElement, ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@mantine/core'

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
    <BrowserRouter>
      <AppShell header={<Header />}>
        <div></div>
      </AppShell>
    </BrowserRouter>
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
