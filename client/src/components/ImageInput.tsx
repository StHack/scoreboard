import styled from '@emotion/styled'
import { InputHTMLAttributes, useRef } from 'react'
import { Box } from './Box'

export function ImageInput ({
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
          const image = await toBase64(file)
          onChange?.({ target: { value: image } } as any)
        }}
      />

      {value && (
        <Image
          src={value as string}
          alt=""
          onClickCapture={e => {
            e.preventDefault()
            onChange?.({ target: { value: undefined } } as any)
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

function toBase64 (file?: File): Promise<string | undefined> {
  if (!file) {
    return Promise.resolve(undefined)
  }

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result!.toString())
    reader.onerror = error => reject(error)
  })
}

const Image = styled.img`
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
