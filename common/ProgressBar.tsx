import React from 'react'

type ProgressBarProps = {
  color: string,
  value: number
}

export function ProgressBar(props: ProgressBarProps) {
  const { color, value } = props

  return (
    <div className="relative">
      <div className="absolute left-0 top-0 w-full h-2 rounded-full bg-neutral-700" />
      <div className="absolute left-0 top-0 h-2 rounded-full" style={{
        background: color,
        width: `${value}%`
      }} />
    </div>
  )
}
