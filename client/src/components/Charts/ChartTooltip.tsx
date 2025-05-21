import { Box } from 'components/Box'
import { TooltipProps } from 'recharts'

export function ChartTooltip({
  active,
  payload,
  label,
  labelFormatter,
}: TooltipProps<string, string>) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <Box
      as="ul"
      backgroundColor="primary"
      borderColor="primaryText"
      borderWidth="thin"
      borderStyle="solid"
      borderRadius="small"
      p="1"
      fontSize="0"
    >
      <Box as="h4" fontWeight="bold" mb="1">
        {labelFormatter ? labelFormatter(label, payload) : label}
      </Box>
      {payload
        .sort((a, b) => parseInt(b.value ?? '') - parseInt(a.value ?? ''))
        .map((p, i) => (
          <Box key={i} as="li" color={p.color} mb="1">
            {`${p.name}: ${p.value}`}
            {p.unit}
          </Box>
        ))}
    </Box>
  )
}
