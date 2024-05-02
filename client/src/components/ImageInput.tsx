import styled from '@emotion/styled'
import { ChangeEvent, InputHTMLAttributes, useRef } from 'react'
import { Box } from './Box'

export function ImageInput({
  value,
  onChange,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <Box>
      <Hidden
        ref={ref}
        {...props}
        type="file"
        accept="image/png, image/jpeg"
        onChange={async e => {
          const file = e.target.files?.[0]
          const webp = await convertToWebp(file)
          const image = await toBase64(webp)
          onChange?.({
            target: { value: image },
          } as ChangeEvent<HTMLInputElement>)
        }}
      />

      {value && (
        <ImageB
          src={value as string}
          alt=""
          onClickCapture={e => {
            e.preventDefault()
            onChange?.({
              target: { value: undefined },
            } as unknown as ChangeEvent<HTMLInputElement>)
          }}
        />
      )}

      {!value && (
        <Box
          display="flex"
          height="3"
          placeContent="center"
          alignItems="center"
        >
          Upload an image
        </Box>
      )}
    </Box>
  )
}

function toBase64(file?: File): Promise<string | undefined> {
  if (!file) {
    return Promise.resolve(undefined)
  }

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result?.toString() ?? '')
    reader.onerror = () =>
      reject(new Error(reader.error?.message ?? 'Error while reading file'))
  })
}

function convertToWebp(file?: File): Promise<File | undefined> {
  if (!file) {
    return Promise.resolve(undefined)
  }

  return new Promise<File | undefined>((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      canvas.getContext('2d')?.drawImage(image, 0, 0)
      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error())
          return
        }

        resolve(
          new File([blob], 'my-new-name.webp', {
            type: blob.type,
          }),
        )
      }, 'image/webp')
    }

    image.src = URL.createObjectURL(file)
  })
}

const ImageB = styled.img`
  object-fit: contain;
  width: 100%;
  max-height: 20rem;
`

const Hidden = styled.input`
  visibility: hidden;
  height: 0;
  width: 0;
  position: absolute;
`
