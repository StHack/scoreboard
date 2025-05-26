import { ThemeProvider } from '@emotion/react'
import { useThemeMode } from '@sthack/scoreboard-ui/hooks'
import {
  darkTheme,
  DefaultStyles,
  lightTheme,
  ProvideTheme,
} from '@sthack/scoreboard-ui/styles'
import { ProvideAuth, useAuth } from 'hooks/useAuthentication'
import { ProvideGame } from 'hooks/useGame'
import { PropsWithChildren, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(document.getElementById('root')!)
root.render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>,
)

function AppWrapper() {
  const { currentTheme } = useThemeMode()

  return (
    <ThemeProvider theme={currentTheme === 'light' ? lightTheme : darkTheme}>
      <DefaultStyles />
      <ProvideAuth>
        <ProvideThemeWrapper>
          <ProvideGame>
            <App />
          </ProvideGame>
        </ProvideThemeWrapper>
      </ProvideAuth>
    </ThemeProvider>
  )
}

const ProvideThemeWrapper = ({ children }: PropsWithChildren) => {
  const { roles } = useAuth()
  return <ProvideTheme roles={roles}>{children}</ProvideTheme>
}
