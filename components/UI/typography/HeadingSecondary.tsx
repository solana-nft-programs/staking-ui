import classNames from 'classnames'

import { HeadingElements } from '@/types/index'

type Props = {
  children: React.ReactNode
  className?: string
  el?: HeadingElements
}

const { H2, DIV } = HeadingElements

export const HeadingSecondary = ({ children, className, el = DIV }: Props) => {
  const combinedClasses = classNames(['text-3xl font-medium', className])

  switch (el) {
    case H2:
      return <h1 className={combinedClasses}>{children}</h1>
    case DIV:
    default:
      return <div className={combinedClasses}>{children}</div>
  }
}
