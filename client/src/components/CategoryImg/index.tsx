import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Category } from 'models/Category'
import { size, SizeProps, space, SpaceProps } from 'styled-system'
import { PlaceProps } from 'styles'
import backdoor from './images/backdoor.png'
import crypto from './images/crypto.png'
import forensic from './images/forensic.png'
import game from './images/game.png'
import hardware from './images/hardware.png'
import misc from './images/misc.png'
import network from './images/network.png'
import pwn from './images/pwn.png'
import recon from './images/recon.png'
import reverse from './images/reverse.png'
import shellcode from './images/shellcode.png'
import web from './images/web.png'

function categoryToImg (category: Category) {
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
    default:
      return undefined
  }
}

type StyledIconProps = SpaceProps & SizeProps & PlaceProps

const Img = styled.img<StyledIconProps>(
  space,
  size,
  css`
    object-fit: contain;
  `,
)

export type CategoryImgProps = StyledIconProps & {
  category: Category
}
export function CategoryImg ({ category, ...p }: CategoryImgProps) {
  return <Img {...p} src={categoryToImg(category)} title={category} />
}
