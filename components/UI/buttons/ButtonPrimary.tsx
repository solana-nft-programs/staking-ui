import classNames from 'classnames'

import { MINIMUM_BUTTON_WIDTH_IN_PX } from '@/constants/index'
import { ButtonColors } from '@/types/index'

const { ORANGE, PURPLE, GREEN, BLUE, MAROON } = ButtonColors

type Props = {
  children: React.ReactNode
  onClick: () => void
  color?: ButtonColors
  className?: string
}

export const ButtonPrimary = ({
  children,
  color = ORANGE,
  onClick,
  className,
}: Props) => {
  return (
    <button
      style={{ minWidth: `${MINIMUM_BUTTON_WIDTH_IN_PX}px` }}
      className={classNames(className, [
        {
          'flex min-w-[230px]  items-center justify-center rounded-lg px-8 py-2':
            true,
          'bg-orange-500 text-black': color === ORANGE,
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
