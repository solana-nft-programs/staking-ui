import classNames from 'classnames'

import { BodyElements } from '@/types/index'

type Props = {
  children: React.ReactNode
  className?: string
  el?: BodyElements
}

const { DIV, P } = BodyElements

export const LargeCopy = ({ children, className, el = DIV }: Props) => {
  const combinedClasses = classNames([
    'text-white text-4xl md:min-w-0 min-w-full',
    className,
  ])

  switch (el) {
    case P:
      return <p className={combinedClasses}>{children}</p>
    case DIV:
    default:
      return <div className={combinedClasses}>{children}</div>
  }
}
