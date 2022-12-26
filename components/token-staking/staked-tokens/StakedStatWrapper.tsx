import React from 'react'

interface StakedStatWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const StakedStatWrapper = ({ children }: StakedStatWrapperProps) => {
  return (
    <div className="flex w-full flex-row justify-between text-xs font-semibold">
      {children}
    </div>
  )
}
