import { Theme } from '@emotion/react'
import {
  ThemeBreakpoints,
  ThemeFontSizes,
  ThemeFontWeight,
  ThemeRadii,
  ThemeSizes,
  ThemeSpace,
} from './theme-definition'

const baseColors = {
  black: '#222221',
  white: '#FFFFFF',
  grey: '#EAEAEA',
  greys: ['#CCCCCC', '#808080', '#8C8C8C', '#666666'],

  pink: '#BD408B',
  red: '#E96D63',
  green: '#7FCA9F',
  blue: '#85C1F5',
}

const fontSizes: ThemeFontSizes = [
  '1.4rem',
  '1.6rem',
  '2rem',
  '2.4rem',
  '3.2rem',
]
fontSizes.body = fontSizes[2]
fontSizes.title = fontSizes[5]
fontSizes.subtitle = fontSizes[4]

const fontWeights: ThemeFontWeight = [400, 600]

const space: ThemeSpace = [0, '.4rem', '.8rem', '1.6rem', '3.2rem', '6.4rem']
space.small = space[1]
space.medium = space[2]
space.large = space[3]

const sizes: ThemeSizes = [
  '1rem',
  '2rem',
  '4rem',
  '6rem',
  '8rem',
  '10rem',
  '12rem',
  '14rem',
]
sizes.minimalRequired = '320px'
sizes.maximalCentered = '120rem'

const radii: ThemeRadii = [0, '.4rem', '.8rem', '1.6rem']
radii.small = radii[1]
radii.medium = radii[2]
radii.large = radii[3]

const breakpoints: ThemeBreakpoints = ['768px', '970px', '1024px']

// export const lightTheme: Theme = {
//   colors: {
//     ...baseColors,
//     primary: baseColors.white,
//     secondary: baseColors.black,
//     background: baseColors.grey,
//     popupBackground: baseColors.black,
//     text: baseColors.black,
//     primaryText: baseColors.black,
//     secondaryText: baseColors.white,
//   },
//   fontSizes,
//   fontWeights,
//   borderWidths: {
//     thin: '0.1rem',
//     medium: '0.2rem',
//     thick: '0.3rem',
//   },
//   space,
//   sizes,
//   radii,
//
//   breakpoints,
//   mediaQueries: {
//     tablet: `@media screen and (min-width: ${breakpoints[0]})`,
//     desktop: `@media screen and (min-width: ${breakpoints[1]})`,
//     largeDesktop: `@media screen and (min-width: ${breakpoints[2]})`,
//   },
//   zIndices: {
//     highlight: 1,
//     menu: 10,
//     popin: 20,
//   },
//   shadows: {
//     small: '0 1px 4px rgba(0, 0, 0, .125)',
//     normal: '0px 4px 8px 0px rgba(0, 0, 0, 0.1)',
//   },
//
//   buttons: {
//     primary: {
//       backgroundColor: 'primary',
//       color: 'primaryText',
//       '&:hover:enabled': {
//         filter: 'opacity(0.5)',
//       },
//       '&[href]:hover': {
//         filter: 'opacity(0.5)',
//       },
//       ':disabled': {
//         backgroundColor: 'grey',
//         color: 'greys.1',
//       },
//       textDecoration: 'none',
//     },
//     secondary: {
//       backgroundColor: 'secondary',
//       color: 'secondaryText',
//       ':disabled': {
//         color: 'greys.1',
//       },
//     },
//     link: {
//       background: 'none',
//       color: 'primaryText',
//       border: 'none',
//     },
//     danger: {
//       backgroundColor: 'red',
//       color: 'white',
//       borderColor: 'red',
//       '&:hover:enabled': {
//         filter: 'opacity(0.5)',
//       },
//     },
//   },
// }

// export const darkTheme: Theme = {
//   ...lightTheme,
//   colors: {
//     ...lightTheme.colors,
//     white: '#FAFAFA',
//     secondary: baseColors.black,
//     background: baseColors.black,
//     popupBackground: '#CDCDCD',
//     text: '#FAFAFA',
//   },
// }
