import { secondsToString } from '@cardinal/common'
import { css } from '@emotion/react'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { useUTCNow } from 'providers/UTCNowProvider'
import { BiRefresh } from 'react-icons/bi'

import { Tooltip } from './Tooltip'

export const refreshSecondsString = (refreshedSeconds: number) => {
  return refreshedSeconds < 3
    ? 'just now'
    : refreshedSeconds > 180
    ? 'a while ago'
    : secondsToString(refreshedSeconds)
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  colorized?: boolean
  isFetching?: boolean
  dataUpdatdAtMs: number
  handleClick?: () => void
}

export const RefreshButton: React.FC<Props> = ({
  colorized,
  isFetching,
  dataUpdatdAtMs,
  handleClick,
}: Props) => {
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  const { UTCNow } = useUTCNow()
  return (
    <Tooltip title="Click to refresh latest data">
      <div
        className="flex cursor-pointer items-center gap-1 rounded-xl px-3 text-xs text-medium-3 transition-colors hover:text-primary"
        onClick={() => handleClick && handleClick()}
        css={
          colorized &&
          css`
            &:hover {
              color: ${stakePoolMetadata?.colors?.secondary} !important;
            }
          `
        }
      >
        <div>
          {dataUpdatdAtMs
            ? refreshSecondsString((Date.now() - dataUpdatdAtMs) / 1000)
            : 'loading'}
        </div>
        <BiRefresh className={`text-2xl ${isFetching && 'animate-spin'}`} />
      </div>
    </Tooltip>
  )
}
