import React, { forwardRef, ReactNode } from 'react'

type LabelProps = {
  children: ReactNode,
  classes: string,
}

export function Label (props: LabelProps)  {
  const { children, classes } = props
  return (
    <span className={`align-middle font-normal p-2 pb-1 rounded-full cursor-default ${classes}`}>
      {children}
    </span>
  )
}
