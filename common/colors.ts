import { darken, getLuminance, lighten } from 'polished'

export const contrastify = (
  amount: number,
  color: string | null | undefined
) => {
  if (!color || !/^#[0-9A-F]{6}$/i.test(color)) return false
  getLuminance(color) > 0.5 ? darken(amount, color) : lighten(amount, color)
}
