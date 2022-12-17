import classNames from 'classnames'

export type ButtonLargeWithDottedOutlineProps = {
  onClick: () => void
  children: React.ReactNode
  className?: string
}

export const ButtonLargeWithDottedOutline = ({
  onClick,
  children,
  className,
}: ButtonLargeWithDottedOutlineProps) => {
  return (
    <div
      className={classNames([
        'flex cursor-pointer items-center justify-center space-x-2 rounded-2xl border border-dashed border-gray-500 bg-gray-800 p-5 text-gray-500',
        className,
      ])}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
