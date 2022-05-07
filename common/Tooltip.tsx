import { Tooltip, TooltipProps } from '@mui/material'
import React from 'react'

export const MouseoverTooltip: React.FC<TooltipProps> = ({
  children,
  ...rest
}) => {
  return <Tooltip {...rest}>{children}</Tooltip>
}
