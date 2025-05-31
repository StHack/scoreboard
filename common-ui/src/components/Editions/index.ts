import { BaseGameConfig } from '@sthack/scoreboard-common'
import { Edition2021Config, Edition2021Theme } from './2021'
import { Edition2023Config, Edition2023Theme } from './2023'
import { Edition2024Config, Edition2024Theme } from './2024'
import { Edition2025Config, Edition2025Theme } from './2025'
import { EditionTheme } from './types'

export const EditionCurrentTheme = Edition2025Theme
export const EditionCurrentLogo = Edition2025Theme.logo
export const EditionCurrentConfig = Edition2025Config

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

export function getEditionConfig(year: number): BaseGameConfig {
  switch (year) {
    case 2021:
    case 2022:
      return Edition2021Config
    case 2023:
      return Edition2023Config
    case 2024:
      return Edition2024Config
    case 2025:
      return Edition2025Config
    default:
      return EditionCurrentConfig
  }
}
