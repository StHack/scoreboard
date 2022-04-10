import { ThemeProvider } from '@emotion/react'
import { ProvideAuth } from 'hooks/useAuthentication'
import { useThemeMode } from 'hooks/useThemeMode'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import DefaultStyles from 'styles'
import { darkTheme, lightTheme } from 'styles/theme'
import App from './App'
import reportWebVitals from './reportWebVitals'

const root = createRoot(document.getElementById('root')!)
root.render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>,
)

function AppWrapper () {
  const { currentTheme } = useThemeMode()

  return (
    <ThemeProvider theme={currentTheme === 'light' ? lightTheme : darkTheme}>
      <DefaultStyles />
      <ProvideAuth>
        <App />
      </ProvideAuth>
    </ThemeProvider>
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
