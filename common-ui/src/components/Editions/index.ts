import { Edition2021Theme } from './2021'
import { Edition2023Theme } from './2023'
import { Edition2024Theme } from './2024'
import { Edition2025Theme } from './2025'
import { EditionTheme } from './types'

export const EditionCurrentTheme = Edition2025Theme
export const EditionCurrentLogo = Edition2025Theme.logo

export * from './2021'
export * from './2023'
export * from './2024'
export * from './2025'

export function getEditionTheme(year: number): EditionTheme {
  switch (year) {
    case 2021:
    case 2022:
      return Edition2021Theme
    case 2023:
      return Edition2023Theme
    case 2024:
      return Edition2024Theme
    case 2025:
      return Edition2025Theme
    default:
      return EditionCurrentTheme
  }
}
