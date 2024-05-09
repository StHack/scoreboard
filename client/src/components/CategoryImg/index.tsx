import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Category } from '@sthack/scoreboard-common'
import {
  gridArea,
  GridAreaProps,
  size,
  SizeProps,
  space,
  SpaceProps,
} from 'styled-system'
import { place, PlaceProps } from 'styles'
import backdoor from './images/backdoor.png'
import crypto from './images/crypto.png'
import d from './images/default.png'
import forensic from './images/forensics.png'
import game from './images/game.png'
import hardware from './images/hardware.png'
import misc from './images/misc.png'
import network from './images/network.png'
import progra from './images/programmation.png'
import pwn from './images/pwn.png'
import recon from './images/recon.png'
import reverse from './images/reverse.png'
import shellcode from './images/shellcode.png'
import web from './images/web.png'

export function categoryToImg(category: Category): string {
  switch (category) {
    case 'backdoor':
      return backdoor
    case 'crypto':
      return crypto
    case 'forensic':
      return forensic
    case 'game':
      return game
    case 'hardware':
      return hardware
    case 'misc':
      return misc
    case 'network':
      return network
    case 'pwn':
      return pwn
    case 'recon':
      return recon
    case 'reverse':
      return reverse
    case 'shellcode':
      return shellcode
    case 'web':
      return web
    case 'progra':
      return progra
    default:
      return d
  }
}

type StyledIconProps = SpaceProps & SizeProps & PlaceProps & GridAreaProps

const Img = styled.img<StyledIconProps>(
  space,
  size,
  place,
  gridArea,
  css`
    object-fit: contain;
  `,
)

export type CategoryImgProps = StyledIconProps & {
  category: Category
}
export function CategoryImg({ category, ...p }: CategoryImgProps) {
  return <Img {...p} src={categoryToImg(category)} title={category} />
}
