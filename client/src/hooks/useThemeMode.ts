import { useEffect, useState } from 'react'

export type ThemeMode = 'dark' | 'light'

export function useThemeMode () {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('dark')

  useEffect(() => {
    const darkMatcher = window.matchMedia('(prefers-color-scheme: dark)')
    const lightMatcher = window.matchMedia('(prefers-color-scheme: light)')

    const darkHandle = ({ matches }: MediaQueryListEvent) =>
      matches && setCurrentTheme('dark')
    const lightHandle = ({ matches }: MediaQueryListEvent) =>
      matches && setCurrentTheme('dark')

    try {
      darkMatcher.addEventListener('change', darkHandle)
      lightMatcher.addEventListener('change', lightHandle)
    } catch (error) {
      try {
        darkMatcher.addListener(darkHandle)
        darkMatcher.addListener(lightHandle)
      } catch (error) {}
    }

    return () => {
      darkMatcher.removeEventListener?.('change', darkHandle)
      lightMatcher.removeEventListener?.('change', lightHandle)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    currentTheme,
  }
}
