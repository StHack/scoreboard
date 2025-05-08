import styled from '@emotion/styled'
import { useAdmin } from 'hooks/useAdmin'
import { ChangeEvent, InputHTMLAttributes, useRef } from 'react'
import { convertToWebp } from 'services/files'
import { Box } from './Box'
import { Button } from './Button'

type ImageInputProps = {
  fallbackImage?: string
}
export function ImageInput({
  value,
  fallbackImage,
  alt,
  onChange,
  ...props
}: ImageInputProps & InputHTMLAttributes<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null)
  const { uploadFile } = useAdmin()
  return (
    <Box display="grid" py="2" gap="2" as="label">
      <Hidden
        ref={ref}
        {...props}
        type="file"
        accept="image/png, image/jpeg"
        onChange={async e => {
          const file = e.target.files?.[0]
          if (!file) {
            return
          }

          const webp = await convertToWebp(file)
          if (webp.size > 15e6) {
            alert(`File ${file.name} is too large (max 15MB)`)
            return
          }

          const image = await uploadFile(webp)
          onChange?.({
            target: { value: image },
          } as ChangeEvent<HTMLInputElement>)
        }}
      />

      <ImageB
        src={value as string ?? fallbackImage}
        alt={alt}
        onClickCapture={e => {
          e.preventDefault()
          onChange?.({
            target: { value: undefined },
          } as unknown as ChangeEvent<HTMLInputElement>)
        }}
      />

      <Button
        type="button"
        placeSelf="center"
        onClick={() => ref.current?.click()}
      >
        {value ? 'Change image' : 'Upload image'}
      </Button>
    </Box>
  )
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
