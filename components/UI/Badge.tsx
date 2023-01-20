import classNames from 'classnames'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
}

export const Badge = ({ className, children }: BadgeProps) => {
  return (
    <div
      className={classNames([
        'flex items-center space-x-2 rounded-lg bg-gray-800 p-1 px-2 text-sm',
        className,
      ])}
    >
      {children}
    </div>
  )
}
