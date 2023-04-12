import { tryFormatInput, tryParseInput } from '@cardinal/common'

import { TextInput } from './TextInput'

export const BNInput = ({
  handleChange,
  value,
  decimals,
  optional,
  ...props
}: Parameters<typeof TextInput>[0] & {
  handleChange: (v: string | undefined) => void
  value?: string
  optional?: boolean
  decimals?: number
}) => {
  return (
    <TextInput
      {...props}
      value={tryFormatInput(value, decimals, optional ? '' : value ?? '')}
      onChange={(e) => {
        if (optional && e.target.value.length === 0) {
          return handleChange(undefined)
        }
        const v = Number(e.target.value)
        if (Number.isNaN(v)) {
          return
        }
        handleChange(tryParseInput(e.target.value, decimals ?? 0, value ?? ''))
      }}
    />
  )
}
