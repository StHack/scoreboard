export function toBase64(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result?.toString() ?? '')
    reader.onerror = () =>
      reject(new Error(reader.error?.message ?? 'Error while reading file'))
  })
}

export function convertToWebp(file: File): Promise<File> {
  return new Promise<File>((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      canvas.getContext('2d')?.drawImage(image, 0, 0)
      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error('conversion to webp failed'))
          return
        }

        resolve(
          new File([blob], `${file.name}.webp`, {
            type: blob.type,
          }),
        )
      }, 'image/webp')
    }

    image.src = URL.createObjectURL(file)
  })
}
