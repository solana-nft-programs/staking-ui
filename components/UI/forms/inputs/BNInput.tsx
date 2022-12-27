import { tryFormatInput, tryParseInput } from '@cardinal/common'

import { TextInput } from './TextInput'

export const BNInput = ({
  handleChange,
  value,
  decimals,
  ...props
}: Parameters<typeof TextInput>[0] & {
  handleChange: (v: string) => void
  value?: string
  decimals?: number
}) => {
  return (
    <TextInput
      {...props}
      value={tryFormatInput(value, decimals, value ?? '')}
      onChange={(e) => {
        const v = Number(e.target.value)
        if (Number.isNaN(v)) {
          return
        }
        handleChange(tryParseInput(e.target.value, decimals ?? 0, value ?? ''))
      }}
    />
  )
}
