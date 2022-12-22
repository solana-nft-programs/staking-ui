import classNames from 'classnames'

import { ButtonColors, ButtonWidths } from '@/types/index'

const { ORANGE, PURPLE, GREEN, BLUE, MAROON, TRANSPARENT } = ButtonColors

const { NARROW, MID } = ButtonWidths

type Props = {
  disabled?: boolean
  children: React.ReactNode
  onClick: () => void
  color?: ButtonColors
  className?: string
  width?: ButtonWidths
}

export const ButtonPrimary = ({
  disabled,
  children,
  color = ORANGE,
  onClick,
  className,
  width = MID,
}: Props) => {
  return (
    <button
      disabled={disabled}
      className={classNames(className, [
        width === NARROW ? 'w-auto' : `min-w-[230px]`,
        disabled ? 'opacity-50' : '',
        {
          'flex items-center justify-center rounded-lg px-8 py-2': true,
          'bg-opacity-0 text-gray-400': color === TRANSPARENT,
          'bg-orange-500 text-white transition hover:bg-primary-hover':
            color === ORANGE,
          'bg-green-500 text-black': color === GREEN,
          'bg-purple-500 text-white': color === PURPLE,
          'bg-blue-500 text-black': color === BLUE,
          'bg-red-800 text-white': color === MAROON,
        },
      ])}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
