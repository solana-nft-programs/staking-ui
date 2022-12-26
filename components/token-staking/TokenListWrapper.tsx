import { contrastify } from 'common/colors'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { useRef } from 'react'

interface TokenListWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  setPageNum: React.Dispatch<React.SetStateAction<[number, number]>>
}

export const TokenListWrapper = ({
  children,
  setPageNum,
}: TokenListWrapperProps) => {
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  const ref = useRef<HTMLDivElement | null>(null)

  const handlePaging = () => {
    if (!ref.current) return

    const { scrollTop, scrollHeight, clientHeight } = ref.current

    if (scrollHeight - scrollTop <= clientHeight * 1.1) {
      setPageNum(([n, prevScrollHeight]) => {
        return prevScrollHeight !== scrollHeight
          ? [n + 1, scrollHeight]
          : [n, prevScrollHeight]
      })
    }
  }

  return (
    <div
      className="relative my-auto mb-4 h-[60vh] overflow-y-auto overflow-x-hidden rounded-md bg-white bg-opacity-5 p-5"
      style={{
        background:
          stakePoolMetadata?.colors?.backgroundSecondary &&
          contrastify(0.05, stakePoolMetadata?.colors?.backgroundSecondary),
      }}
      ref={ref}
      onScroll={handlePaging}
    >
      {children}
    </div>
  )
}
