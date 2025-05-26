import { exportAsJson } from '../services'
import { Button } from './Button'
import { IconJson } from './Icon'

type ExportJsonButtonProps = {
  data: unknown
  filename: string
}

export function ExportJsonButton({ data, filename }: ExportJsonButtonProps) {
  return (
    <Button
      type="button"
      onClick={async () => {
        await exportAsJson(data, filename)
      }}
      icon={IconJson}
      responsiveLabel
      title="Export as JSON"
    >
      Export as JSON
    </Button>
  )
}
