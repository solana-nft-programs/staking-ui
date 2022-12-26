import classnames from 'classnames'

import { FloatingBlurryBlobColors } from '@/types/index'

type Props = {
  color?: FloatingBlurryBlobColors
  left?: number
  top?: number
  right?: number
  bottom?: number
  height: number
  width: number
  rotation: number
}

const { ORANGE, PURPLE, GREEN, BLUE, RED } = FloatingBlurryBlobColors

const FloatingBlurryBlob = ({
  color = ORANGE,
  left,
  top,
  right,
  bottom,
  height,
  width,
  rotation,
}: Props) => {
  return (
    <>
      <div
        style={{
          height: `${height}px`,
          width: `${width}px`,
          left,
          top,
          right,
          bottom,
          rotate: `${rotation}deg`,
        }}
        className={classnames([
          {
            'bg-purple-400': color === PURPLE,
            'bg-green-500': color === GREEN,
            'bg-orange-500': color === ORANGE,
            'bg-blue-500': color === BLUE,
            'bg-red-800': color === RED,
            'absolute blur-[100px]': true,
          },
        ])}
      />
    </>
  )
}

export default FloatingBlurryBlob
