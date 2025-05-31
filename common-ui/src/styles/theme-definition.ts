import { Property } from 'csstype'
import { EditionTheme } from '../components/Editions/types'

type Radii = Property.BorderRadius<0>
type Size = Property.Height<0> | Property.Width<0>
type Color = Property.Color
type Font = Property.FontFamily
type Weigth = Property.FontWeight
type BorderWidth = Property.BorderWidth
type ZIndex = Property.ZIndex
type Shadow = Property.BoxShadow

export type ThemeFontSizes = Font[] &
  Partial<{
    body: Font
    title: Font
    subtitle: Font
  }>

export type ThemeFontWeight = [Weigth, Weigth]

export type ThemeSpace = Size[] &
  Partial<{
    small: Size
    medium: Size
    large: Size
  }>

export type ThemeSizes = Size[] &
  Partial<{
    minimalRequired: Size
    maximalCentered: Size
  }>

export type ThemeRadii = Radii[] &
  Partial<{
    small: Radii
    medium: Radii
    large: Radii
  }>

export type ThemeBorderWith = {
  thin: BorderWidth
  medium: BorderWidth
  thick: BorderWidth
}

export type ThemeBreakpoints = [string, string, string]

export type ThemeMediaQueries = {
  tablet: string
  desktop: string
  largeDesktop: string
}

export type ThemeZIndex = {
  highlight: ZIndex
  menu: ZIndex
  popin: ZIndex
}

export type ThemeShadow = {
  small: Shadow
  normal: Shadow
}

export type ThemeColors = {
  black: Color
  white: Color
  grey: Color
  greys: Color[]

  red: Color
  green: Color
  blue: Color
  pink: Color

  gold: Color
  silver: Color
  copper: Color
  beforeLastOne: Color

  charts: Color[]

  primary: Color
  secondary: Color
  background: Color
  popupOuterBackground: Color
  popupBackground: Color
  text: Color
  primaryText: Color
  secondaryText: Color
}

declare module '@emotion/react' {
  export interface Theme {
    colors: ThemeColors
    fontSizes: ThemeFontSizes
    fontWeights: ThemeFontWeight
    borderWidths: ThemeBorderWith
    space: ThemeSpace
    sizes: ThemeSizes
    radii: ThemeRadii

    breakpoints: ThemeBreakpoints
    mediaQueries: ThemeMediaQueries
    zIndices: ThemeZIndex
    shadows: ThemeShadow

    buttons: unknown

    edition: EditionTheme
  }
}
