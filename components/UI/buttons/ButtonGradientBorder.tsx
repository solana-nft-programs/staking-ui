import classNames from 'classnames'

import { ButtonGradientBorderColors } from '@/types/colors'

const { ORANGE, GREEN, PURPLE, BLUE, MAROON } = ButtonGradientBorderColors

type Props = {
  children: React.ReactNode
  href: string
  color?: ButtonGradientBorderColors
}

const ButtonGradientBorder = ({ children, href, color = ORANGE }: Props) => {
  return (
    <div className="relative mb-16 w-[232px]">
      <div
        className={classNames({
          'absolute top-0 left-0 right-0 bottom-0 rounded-xl bg-gradient-to-br to-black py-7':
            true,
          'from-green-500 via-green-500': color === GREEN,
          'from-orange-500 via-orange-500': color === ORANGE,
          'from-purple-500 via-purple-500': color === PURPLE,
          'from-blue-500 via-blue-500': color === BLUE,
          'from-red-800 via-red-800': color === MAROON,
        })}
      />
      <a
        className={classNames([
          'absolute top-1 left-[1px] right-[1px] bottom-1 mx-auto -mt-[3px] flex items-center justify-center rounded-xl bg-black py-[27px] duration-1000',
          {
            'hover:shadow-green-glow': color === GREEN,
            'hover:shadow-yellow-glow': color === ORANGE,
            'hover:shadow-purple-glow': color === PURPLE,
            'hover:shadow-blue-glow': color === BLUE,
            'hover:shadow-maroon-glow': color === MAROON,
          },
        ])}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    </div>
  )
}

export default ButtonGradientBorder
