import { css, useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import {
  Alignment,
  decodeImage,
  Fit,
  ImageAsset,
  Layout,
  Rive,
  useRive,
} from '@rive-app/react-canvas'
import { categoryToImg } from 'components/CategoryImg'
import { Challenge } from 'models/Challenge'
import { ChallengeScore } from 'models/GameScore'
import { useCallback, useEffect, useRef, useState } from 'react'
import { layout, LayoutProps, space, SpaceProps } from 'styled-system'

type ChallengeCardProps = {
  challenge: Challenge
  score: ChallengeScore
  currentTeam?: string
  onClick: () => void
}
export function ChallengeCard({
  challenge,
  currentTeam,
  size = 10,
  score: { score, achievements },
  onClick,
  ...props
}: ChallengeCardProps & LayoutProps) {
  const { name, img, category, isBroken } = challenge
  const isSolved = achievements.some(a => a.teamname === currentTeam)
  const animationToPlay = isSolved ? 'idle exploded' : 'idle'
  const [initialAnimation] = useState(() => animationToPlay)

  const theme = useTheme()

  const riveRef = useRef<Rive>()

  const { rive, setCanvasRef, setContainerRef } = useRive(
    {
      src: '/sthack_2024.riv',
      autoplay: false,
      enableRiveAssetCDN: false,
      automaticallyHandleEvents: false,
      shouldDisableRiveListeners: true,
      animations: initialAnimation,
      assetLoader: (asset, bytes) => {
        // If the asset has a `cdnUuid`, return false to let the runtime handle
        // loading it in from a CDN. Or if there are bytes found for the asset
        // (aka, it was embedded), return false as there's no work needed here
        if (asset.cdnUuid.length > 0 || bytes.length > 0) {
          return false
        }

        if (!asset.isImage && asset.name !== 'ChallengeImagePlaceholder') {
          return false
        }

        setImage(img || categoryToImg(category), asset as ImageAsset)
          .then(() => {
            riveRef.current?.resizeDrawingSurfaceToCanvas()
          })
          .catch((e: unknown) => console.log(e))

        return true
      },
    },
    {
      useDevicePixelRatio: true,
      customDevicePixelRatio: 1,
      useOffscreenRenderer: true,
      // useDevicePixelRatio: true,
    },
  )

  riveRef.current = rive ?? undefined

  const update = useCallback(() => {
    if (!rive) {
      return
    }

    rive.resizeDrawingSurfaceToCanvas()
    rive.setTextRunValue('ChallengeNamePlaceholder', name)

    if (isBroken) {
      rive.setTextRunValue('ScorePlaceholder', '')
      rive.setTextRunValue('SuffixPart', '')
      rive.setTextRunValue('BrokenPlaceholder', 'Broken')
    } else {
      rive.setTextRunValue('ScorePlaceholder', score.toLocaleString())
      rive.setTextRunValue('SuffixPart', ' pts')
      rive.setTextRunValue('BrokenPlaceholder', '')
    }
  }, [isBroken, name, rive, score])

  useEffect(update, [update])

  useEffect(() => {
    if (isSolved) {
      rive?.play('explosion')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSolved])

  return (
    <CardWrapper
      size={size}
      {...props}
      onPointerEnter={() => {
        rive?.resizeDrawingSurfaceToCanvas()
        rive?.play(animationToPlay)
      }}
      onPointerLeave={() => {
        rive?.reset({ animations: animationToPlay })
        update()
      }}
      onClick={onClick}
      type="button"
      title={
        isBroken
          ? 'This challenge is currently broken'
          : isSolved
            ? `✔ Open challenge "${name}"`
            : `Open challenge "${name}"`
      }
      ref={setContainerRef}
    >
      <Canvas ref={setCanvasRef} width="100%" height="100%" />
    </CardWrapper>
  )
}

const CardWrapper = styled.button<LayoutProps & SpaceProps>(
  layout,
  space,
  css`
    cursor: pointer;
    display: flex;
    flex-direction: column;
  `,
)

const Canvas = styled.canvas<LayoutProps>(
  layout,
  css`
    object-fit: contain;
  `,
)

function setImage(src: string, imageAsset: ImageAsset): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const baseImage = new Image()
    baseImage.src = src
    baseImage.onload = () => {
      canvas.width = baseImage.width
      canvas.height = baseImage.height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Context 2D not found'))
        return
      }

      ctx.drawImage(baseImage, 0, 0)

      canvas.toBlob(async blob => {
        if (!blob) {
          reject(new Error('Image failed to be converted'))
          return
        }
        const a = await blob.arrayBuffer()
        const result = await decodeImage(new Uint8Array(a))
        imageAsset.setRenderImage(result)
        result.unref()
        resolve()
      })
    }
    baseImage.onerror = (...rest) => {
      reject(new Error('Image failed to load'))
    }
  })
}
