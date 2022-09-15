import type { TooltipProps } from '@mui/material'
import { Tooltip as MuiTooltip } from '@mui/material'
import React from 'react'

export const Tooltip: React.FC<TooltipProps> = ({ children, ...rest }) => {
  return <MuiTooltip {...rest}>{children}</MuiTooltip>
}
