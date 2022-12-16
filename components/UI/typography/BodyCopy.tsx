import classNames from 'classnames'

import { BodyElements, BodyTextSizes } from '@/types/index'

type Props = {
  children: React.ReactNode
  className?: string
  el?: BodyElements
  textSize?: BodyTextSizes
}

const { DIV, P } = BodyElements
const { BASE, LARGE, SMALL } = BodyTextSizes

export const BodyCopy = ({
  children,
  className,
  el = DIV,
  textSize = BASE,
}: Props) => {
  const combinedClasses = classNames([
    'text-gray-400 md:min-w-0 min-w-full',
    className,
    {
      'text-sm': textSize === SMALL,
      'text-base': textSize === BASE,
      'text-xl': textSize === LARGE,
    },
  ])

  switch (el) {
    case P:
      return <p className={combinedClasses}>{children}</p>
    case DIV:
    default:
      return <div className={combinedClasses}>{children}</div>
  }
}
