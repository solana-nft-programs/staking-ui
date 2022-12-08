import classNames from 'classnames'

export type LabelTextProps = {
  children: React.ReactNode
  className?: string
}

export const LabelText = ({ children, className }: LabelTextProps) => {
  const combinedClasses = classNames(['text-gray-200 text-sm', className])

  return <div className={combinedClasses}>{children}</div>
}
