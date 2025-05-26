import { css, Global, ThemeProvider } from '@emotion/react'
import { UserRole } from '@sthack/scoreboard-common'
import { PropsWithChildren } from 'react'
import { ThemeMode, useThemeMode } from '../hooks'
import { FontCss } from './font'
import { FormsCss } from './forms'
import { ResetCss } from './reset'

export function DefaultStyles() {
  const { currentTheme } = useThemeMode()
  return (
    <>
      <ResetCss />
      <ColorScheme currentTheme={currentTheme} />
      <FontCss />
      <FormsCss />
    </>
  )
}

export type ThemeProviderProps = {
  roles: UserRole[]
}
export function ProvideTheme({
  roles,
  children,
}: PropsWithChildren<ThemeProviderProps>) {
  return (
    <ThemeProvider
      theme={theme =>
        roles.includes(UserRole.Admin)
          ? {
              ...theme,
              colors: {
                ...theme.colors,
                secondary: theme.colors.pink,
                secondaryText: theme.colors.white,
              },
            }
          : theme
      }
    >
      {children}
    </ThemeProvider>
  )
}

type ColorSchemeProps = { currentTheme: ThemeMode }
function ColorScheme({ currentTheme }: ColorSchemeProps) {
  return (
    <Global
      styles={css`
        :root {
          color-scheme: ${currentTheme};
        }
      `}
    />
  )
}
