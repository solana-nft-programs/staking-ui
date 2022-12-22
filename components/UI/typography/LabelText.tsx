import classNames from 'classnames'

import { OptionalLabelTag } from '@/components/UI/typography/OptionalLabelTag'

export type LabelTextProps = {
  children: React.ReactNode
  className?: string
  isOptional?: boolean
}

export const LabelText = ({
  children,
  className,
  isOptional = false,
}: LabelTextProps) => {
  const combinedClasses = classNames(['text-gray-200 text-sm', className])

  return (
    <>
      <div className={combinedClasses}>{children}</div>
      {isOptional && <OptionalLabelTag />}
    </>
  )
}
