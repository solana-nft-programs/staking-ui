import { TextInput } from './TextInput'

export const UnixSecondsInput = ({
  handleChange,
  value,
  ...props
}: Parameters<typeof TextInput>[0] & {
  handleChange: (v: number | null) => void
  value?: number | undefined
}) => {
  return (
    <div className="relative flex gap-2">
      <TextInput
        {...props}
        type="datetime-local"
        value={
          value
            ? new Date(
                value * 1000 + new Date().getTimezoneOffset() * -60 * 1000
              )
                .toISOString()
                .slice(0, 19)
            : undefined
        }
        onChange={(e) => {
          handleChange(new Date(e.target.value).getTime() / 1000)
        }}
      />
      <div className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500">
        {Intl.DateTimeFormat().resolvedOptions().timeZone}
      </div>
    </div>
  )
}
