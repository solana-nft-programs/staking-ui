export * from '@/types/colors'

export type AccordionItem = {
  title: string
  content: string
}

export type PagingItem = {
  title: string
  index: number
}

export enum CardWidths {
  FULL = 'full',
  '1/2' = '1/2',
  '1/3' = '1/3',
  '1/4' = '1/4',
}

export enum HeadingElements {
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  DIV = 'div',
}

export enum BodyElements {
  P = 'p',
  DIV = 'div',
}

export enum BodyTextSizes {
  SMALL = 'small',
  BASE = 'base',
  LARGE = 'large',
}

export enum MarqueeDirections {
  LEFT = 'left',
  RIGHT = 'right',
}

export type ClientListImage = {
  src: string
  alt: string
  height: number
  width: number
}

export enum HeadingTextSizes {
  BASE = 'base',
  LARGE = 'large',
}

export enum ButtonWidths {
  NARROW = 'narrow',
  MID = 'mid',
}

export type InputOption = {
  label: string
  value: string
}

export const booleanOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
]
