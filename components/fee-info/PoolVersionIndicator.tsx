import { Tooltip } from 'common/Tooltip'
import { isStakePoolV2, useStakePoolData } from 'hooks/useStakePoolData'
import { BsFillInfoCircleFill } from 'react-icons/bs'
import { twMerge } from 'tailwind-merge'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  stakePoolData?: Parameters<typeof isStakePoolV2>[0]
}

export const PoolVersionIndicator = ({ stakePoolData, className }: Props) => {
  const stakePool = useStakePoolData()
  const pool = stakePoolData ?? stakePool.data?.parsed
  if (!pool) return <></>
  return (
    <div
      className={twMerge(`flex items-center justify-center gap-2`, className)}
    >
      <Tooltip
        title={`This is the version of the stake pool protocol that this stake pool is using. Each version handles fees differently.`}
      >
        <div className="flex cursor-pointer flex-row items-center justify-center gap-2">
          <BsFillInfoCircleFill className="text-medium-4" />
          <div className="text-medium-4">Protocol: </div>
          <div className="text-light-1">
            {isStakePoolV2(pool) ? 'V2' : 'V1'}
          </div>
        </div>
      </Tooltip>
    </div>
  )
}
