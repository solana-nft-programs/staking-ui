export type TextInputProps = {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const TextInput = ({ value, onChange }: TextInputProps) => {
  return (
    <input
      onChange={onChange}
      value={value}
      className="w-full rounded-lg bg-gray-800 p-2 outline outline-gray-600 focus:outline-orange-500"
    />
  )
}
