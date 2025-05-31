import { css, Global, ThemeProvider, useTheme } from '@emotion/react'
import { UserRole } from '@sthack/scoreboard-common'
import { PropsWithChildren } from 'react'
import { EditionTheme } from '../components/Editions/types'
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
  roles?: UserRole[]
  edition: EditionTheme
}
export function ProvideTheme({
  roles = [],
  edition,
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
              edition,
            }
          : { ...theme, edition }
      }
    >
      <Background />
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

function Background() {
  const {
    edition: { background: imgBg },
    colors: { background: colorBg },
  } = useTheme()
  return (
    <Global
      styles={
        imgBg
          ? css`
              body {
                background:
                  linear-gradient(#88888820, #88888820),
                  url(${imgBg}) center / cover no-repeat fixed;
              }
            `
          : css`
              body {
                background-color: ${colorBg};
                background-image:
                  linear-gradient(
                    transparent 0%,
                    transparent 62.5%,
                    #fff 62.5%,
                    #fff 100%
                  ),
                  linear-gradient(
                    to right,
                    transparent 0%,
                    transparent 62.5%,
                    #fff 62.5%,
                    #fff 100%
                  );
                background-size: 8px 8px;
                background-position: center top;
              }
            `
      }
    />
  )
}
