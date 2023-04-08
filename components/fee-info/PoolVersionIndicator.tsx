import { Tooltip } from 'common/Tooltip'
import { isStakePoolV2, useStakePoolData } from 'hooks/useStakePoolData'
import { BsFillInfoCircleFill } from 'react-icons/bs'

export const PoolVersionIndicator: React.FC = () => {
  const stakePool = useStakePoolData()

  return (
    <>
      {!!stakePool.isFetched && stakePool?.data?.parsed && (
        <div className="flex items-center gap-2">
          <Tooltip
            title={`This is the version of the stake pool protocol that this stake pool is using. Each version handles fees differently.`}
          >
            <div className="flex cursor-pointer flex-row items-center justify-center gap-2">
              <BsFillInfoCircleFill className="text-medium-4" />
              <div className="text-medium-4">Protocol: </div>
              <div className="text-light-1">
                {isStakePoolV2(stakePool.data.parsed) ? 'V2' : 'V1'}
              </div>
            </div>
          </Tooltip>
        </div>
      )}
    </>
  )
}
