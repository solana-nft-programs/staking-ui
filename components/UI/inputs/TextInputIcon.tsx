import { twMerge } from 'tailwind-merge'

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  disabled?: boolean
  icon: React.ReactNode
  onIconClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  className?: string
  error?: boolean
}

export const TextInputIcon = ({
  disabled,
  error,
  onIconClick,
  icon,
  className,
  ...props
}: Props) => {
  return (
    <div
      className={twMerge([
        'flex w-full appearance-none items-center justify-between rounded bg-gray-700 py-3 px-4 text-gray-200 placeholder-gray-500 outline',
        !disabled && error ? 'outline outline-red-500' : 'outline-gray-500',
        !disabled && !error && 'focus:bg-gray-800', //focus:outline-orange-500
        disabled && 'opacity-30',
        className,
      ])}
    >
      <input
        className={`mr-5 w-full bg-transparent focus:outline-none`}
        type="text"
        autoComplete="off"
        {...props}
      />
      <div
        className="cursor-pointer text-xs text-gray-400"
        onClick={onIconClick}
      >
        {icon}
      </div>
    </div>
  )
}
