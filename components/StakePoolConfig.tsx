import { secondstoDuration } from '@cardinal/common'
import { Tooltip } from 'common/Tooltip'
import { useStakePoolData } from 'hooks/useStakePoolData'
import { BsFillInfoCircleFill } from 'react-icons/bs'

export const StakePoolConfig: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const { data: stakePool } = useStakePoolData()
  return (
    <div className={`flex flex-row gap-8 text-lg ${className}`}>
      {!!stakePool?.parsed?.endDate &&
        stakePool?.parsed.endDate.toNumber() !== 0 && (
          <Tooltip
            title={`Pool will no longer accept staked tokens after this date`}
          >
            <div className="flex cursor-pointer flex-row items-center justify-center gap-2">
              <BsFillInfoCircleFill className="text-medium-4" />
              <div className="text-medium-4">End Date: </div>
              <div className="text-light-1">
                {new Date(
                  stakePool.parsed.endDate?.toNumber() * 1000
                ).toDateString()}{' '}
              </div>
            </div>
          </Tooltip>
        )}
      {!!stakePool?.parsed?.cooldownSeconds &&
        stakePool?.parsed.cooldownSeconds !== 0 && (
          <Tooltip
            title={`Unstaking tokens will initiate a cooldown period until they can be fully unstaked`}
          >
            <div className="flex cursor-pointer flex-row items-center justify-center gap-2">
              <BsFillInfoCircleFill className="text-medium-4" />
              <div className="text-medium-4">Cooldown Period: </div>
              <div className="text-light-1">
                {secondstoDuration(stakePool?.parsed.cooldownSeconds)}{' '}
              </div>
            </div>
          </Tooltip>
        )}
      {!!stakePool?.parsed?.minStakeSeconds &&
        stakePool?.parsed.minStakeSeconds !== 0 && (
          <Tooltip
            title={`Tokens must be staking for this minimum duration before unstaking or claiming rewards`}
          >
            <div className="flex cursor-pointer flex-row items-center justify-center gap-2">
              <BsFillInfoCircleFill className="text-medium-4" />
              <div className="text-medium-4">Minimum Stake Seconds: </div>
              <div className="text-light-1">
                {secondstoDuration(stakePool?.parsed.minStakeSeconds)}{' '}
              </div>
            </div>
          </Tooltip>
        )}
    </div>
  )
}
