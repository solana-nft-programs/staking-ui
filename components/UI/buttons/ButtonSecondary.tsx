import classNames from 'classnames'

import { MINIMUM_BUTTON_WIDTH_IN_PX } from '@/constants/index'
import { ButtonColors } from '@/types/index'

const { ORANGE, GREEN, PURPLE, BLUE } = ButtonColors

type Props = {
  children: React.ReactNode
  onClick: () => void
  color: ButtonColors
}

const ButtonSecondary = ({ children, color = ORANGE, onClick }: Props) => {
  return (
    <button
      style={{ minWidth: MINIMUM_BUTTON_WIDTH_IN_PX }}
      className={classNames({
        'min-w-[230px] rounded-lg px-8 py-3 text-white': true,
        'border border-orange-500': color === ORANGE,
        'border border-green-500': color === GREEN,
        'border border-purple-500': color === PURPLE,
        'border border-blue-500': color === BLUE,
      })}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default ButtonSecondary
