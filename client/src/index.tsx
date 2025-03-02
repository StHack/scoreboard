import { ThemeProvider } from '@emotion/react'
import { ProvideAuth } from 'hooks/useAuthentication'
import { ProvideGame } from 'hooks/useGame'
import { useThemeMode } from 'hooks/useThemeMode'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import DefaultStyles, { ProvideTheme } from 'styles'
import { darkTheme, lightTheme } from 'styles/theme'
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
        <ProvideTheme>
          <ProvideGame>
            <App />
          </ProvideGame>
        </ProvideTheme>
      </ProvideAuth>
    </ThemeProvider>
  )
}
