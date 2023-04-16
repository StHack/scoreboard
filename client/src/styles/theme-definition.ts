import { Property } from 'csstype'

type Radii = Property.BorderRadius<{}>
type Size = Property.Height<{}> | Property.Width<{}>
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

export type ThemeSpace = any[] &
  Partial<{
    small: any
    medium: any
    large: any
  }>

export type ThemeSizes = Size[] &
  Partial<{
    minimalRequired: Size
    maximalCentered: Size
  }>

export type ThemeRadii = Radii[] &
  Partial<{
    small: any
    medium: any
    large: any
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

  primary: Color
  secondary: Color
  background: Color
  popupBackground: Color
  text: Color
  primaryText: Color
  secondaryText: Color
}

// declare module '@emotion/react' {
//   export interface Theme {
//     colors: ThemeColors
//     fontSizes: ThemeFontSizes
//     fontWeights: ThemeFontWeight
//     borderWidths: ThemeBorderWith
//     space: ThemeSpace
//     sizes: ThemeSizes
//     radii: ThemeRadii
//
//     breakpoints: ThemeBreakpoints
//     mediaQueries: ThemeMediaQueries
//     zIndices: ThemeZIndex
//     shadows: ThemeShadow
//
//     buttons: any
//   }
// }
