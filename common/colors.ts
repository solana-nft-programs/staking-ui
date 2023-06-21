import { darken, getLuminance, lighten } from 'polished'

export const contrastify = (
  amount: number,
  color: string | null | undefined,
  defaultColor?: string
) => {
  if (!color || !/^#[0-9A-F]{6}$/i.test(color)) return defaultColor ?? ''
  return getLuminance(color) > 0.5
    ? darken(amount, color)
    : lighten(amount, color)
}

export const tryColor = (
  color: string | null | undefined,
  defaultColor?: string
): string | undefined => {
  if (!color) return defaultColor ?? undefined
  const validColor = /^#[0-9A-F]{6}$/i.test(color)
  const validColorHash = /^#[0-9A-F]{6}$/i.test(`#${color}`)
  return validColor
    ? color
    : validColorHash
    ? `#${color}`
    : defaultColor ?? undefined
}
