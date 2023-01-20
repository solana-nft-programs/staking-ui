import classNames from 'classnames'
import { HeadingElements, HeadingTextSizes } from 'types/index'

type Props = {
  children: React.ReactNode
  className?: string
  el?: HeadingElements
  textSize?: HeadingTextSizes
}

const { H1, H2, DIV } = HeadingElements
const { BASE, LARGE } = HeadingTextSizes

export const HeadingPrimary = ({
  children,
  className,
  el = DIV,
  textSize = BASE,
}: Props) => {
  const combinedClasses = classNames([
    'font-medium text-left',
    className,
    {
      'text-5xl leading-12': textSize === BASE,
      'text-7xl': textSize === LARGE,
    },
  ])

  switch (el) {
    case H1:
      return <h1 className={combinedClasses}>{children}</h1>
    case H2:
      return <h2 className={combinedClasses}>{children}</h2>
    case DIV:
    default:
      return <div className={combinedClasses}>{children}</div>
  }
}
