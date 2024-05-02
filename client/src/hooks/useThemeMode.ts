import { useEffect, useState } from 'react'

export type ThemeMode = 'dark' | 'light'

export function useThemeMode() {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('light')

  useEffect(() => {
    const darkMatcher = window.matchMedia('(prefers-color-scheme: dark)')
    const lightMatcher = window.matchMedia('(prefers-color-scheme: light)')

    const darkHandle = ({ matches }: MediaQueryListEvent) =>
      matches && setCurrentTheme('dark')
    const lightHandle = ({ matches }: MediaQueryListEvent) =>
      matches && setCurrentTheme('dark')

    darkMatcher.addEventListener('change', darkHandle)
    lightMatcher.addEventListener('change', lightHandle)

    return () => {
      darkMatcher.removeEventListener('change', darkHandle)
      lightMatcher.removeEventListener('change', lightHandle)
    }
  }, [])

  return {
    currentTheme,
  }
}
