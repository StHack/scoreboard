import { ThemeProvider } from '@emotion/react'
import { UserRole } from '@sthack/scoreboard-common'
import { useThemeMode } from '@sthack/scoreboard-ui/hooks'
import {
  darkTheme,
  DefaultStyles,
  lightTheme,
  ProvideTheme,
} from '@sthack/scoreboard-ui/styles'
import { App } from 'App'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

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
      <ProvideTheme roles={[UserRole.User]}>
        <App />
      </ProvideTheme>
    </ThemeProvider>
  )
}
