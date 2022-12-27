export const FormInput = (
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > & { className?: string; error?: boolean }
) => (
  <input
    {...{
      ...props,
      className: `${props.error ? 'border-red-500' : 'border-gray-500'}
    ${props.disabled ? 'opacity-30' : ''} ${props.className}`,
    }}
  />
)
