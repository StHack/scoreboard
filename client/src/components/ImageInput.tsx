import styled from '@emotion/styled'
import { useAdmin } from 'hooks/useAdmin'
import { ChangeEvent, InputHTMLAttributes, useRef } from 'react'
import { convertToWebp } from 'services/files'
import { Box } from './Box'

export function ImageInput({
  value,
  onChange,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null)
  const { uploadFile } = useAdmin()
  return (
    <Box>
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

      {value && (
        <ImageB
          src={value as string}
          alt="Uploaded picture"
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
