import { secondstoDuration } from '@cardinal/common'
import { useStakePoolData } from 'hooks/useStakePoolData'
import { BsFillInfoCircleFill } from 'react-icons/bs'

export const StakePoolConfig: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const { data: stakePool } = useStakePoolData()
  return (
    <div className={`flex flex-row gap-2 text-lg ${className}`}>
      {!!stakePool?.parsed.endDate &&
        stakePool?.parsed.endDate.toNumber() !== 0 && (
          <div className="flex flex-row items-center justify-center gap-2">
            <BsFillInfoCircleFill className="text-medium-4" />
            <div className="text-medium-4">End Date: </div>
            <div className="text-light-1">
              {new Date(
                stakePool.parsed.endDate?.toNumber() * 1000
              ).toDateString()}{' '}
            </div>
          </div>
        )}
      {!!stakePool?.parsed.cooldownSeconds &&
        stakePool?.parsed.cooldownSeconds !== 0 && (
          <div className="flex flex-row items-center justify-center gap-2">
            <BsFillInfoCircleFill className="text-medium-4" />
            <div className="text-medium-4">Cooldown Period: </div>
            <div className="text-light-1">
              {secondstoDuration(stakePool?.parsed.cooldownSeconds)}{' '}
            </div>
          </div>
        )}
      {!!stakePool?.parsed.minStakeSeconds &&
        stakePool?.parsed.minStakeSeconds !== 0 && (
          <div className="flex flex-row items-center justify-center gap-2">
            <BsFillInfoCircleFill className="text-medium-4" />
            <div className="text-medium-4">Minimum Stake Seconds: </div>
            <div className="text-light-1">
              {secondstoDuration(stakePool?.parsed.minStakeSeconds)}{' '}
            </div>
          </div>
        )}
    </div>
  )
}
