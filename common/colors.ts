import { darken, getLuminance, lighten } from 'polished'

export const contrastify = (amount: number, color: string) =>
  getLuminance(color) > 0.5 ? darken(amount, color) : lighten(amount, color)
