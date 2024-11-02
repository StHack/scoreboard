import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Box } from 'components/Box'
import { space, SpaceProps } from 'styled-system'
import { SafariSpecific } from 'styles'
import { BounceIn, FadeIn } from 'styles/animation'
import Bg from './popup-background.svg'

export const PopupBackground = styled.div<SpaceProps>`
  min-width: ${p => p.theme.sizes.minimalRequired};
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: ${p => p.theme.colors.popupOuterBackground};
  z-index: 1;
  ${space}
  display: grid;
  align-content: center;
  justify-items: center;
  animation: 200ms ${FadeIn};

  ${SafariSpecific(css`
    display: flex;
  `)}
`

export const PopupContainer = styled(Box)<SpaceProps & { useBg: boolean }>`
  background: ${p => p.theme.colors.popupBackground};
  padding: ${p => p.theme.space[1]};
  box-shadow: ${p => p.theme.shadows.normal};
  width: 100%;
  max-width: 80rem;
  max-height: 100%;

  transition: all 0.3s;

  ${p =>
    p.useBg &&
    css`
      ${p.theme.mediaQueries.tablet} {
        box-shadow: none;
        background: url(${Bg});
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        max-height: none;
        max-width: none;

        width: 69rem;
        height: 49.9rem;
        padding-right: 20rem;
        padding-left: 8rem;
        padding-top: 6rem;
        padding-bottom: 7rem;
      }

      ${p.theme.mediaQueries.largeDesktop} {
        width: 90rem;
        height: 65rem;
        padding-right: 26rem;
        padding-left: 10rem;
        padding-top: 9rem;
        padding-bottom: 12rem;
      }
    `}

  margin: auto;
  ${space}
  display: flex;
  flex-direction: column;
  place-items: stretch;
  overflow: hidden;
  border: none;
  border-radius: 0.5rem;
  animation: 250ms ${BounceIn};
`

export const PopupPanel = styled(Box)<SpaceProps & { autosize?: boolean }>`
  flex: 1 100%;
  display: flex;
  flex-direction: column;
  place-items: stretch;
  overflow-y: auto;
  ${p => !p.autosize && 'min-height: 60vh;'}
  ${space}
`

export const PopupActionPanel = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: space-evenly;
`

export const PopupTitle = styled.h1`
  font-size: ${p => p.theme.fontSizes[3]};
  text-align: center;
`
