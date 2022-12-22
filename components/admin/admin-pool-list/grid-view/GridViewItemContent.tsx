import { shortPubKey } from '@cardinal/common'
import type { StakePool } from 'hooks/useAllStakePools'

export type GridViewItemContentProps = {
  stakePool: StakePool
}

export const GridViewItemContent = ({
  stakePool,
}: GridViewItemContentProps) => {
  return (
    <>
      {stakePool.stakePoolMetadata?.displayName ? (
        <div className="text-center font-bold">
          {stakePool.stakePoolMetadata?.displayName}
        </div>
      ) : (
        <div className="text-center font-bold text-white">
          {shortPubKey(stakePool.stakePoolData.pubkey)}
        </div>
      )}
      <div className="text-gray text-center text-xs text-gray-500">
        {shortPubKey(stakePool.stakePoolData.pubkey)}
      </div>
      {stakePool.stakePoolMetadata?.imageUrl ? (
        <img
          className="mx-auto mt-5 h-[150px] w-[150px] rounded-md"
          src={stakePool.stakePoolMetadata.imageUrl}
          alt={stakePool.stakePoolMetadata.name}
        />
      ) : (
        <div className="flex justify-center align-middle">
          <div className="mt-5 flex h-[100px] w-[100px] items-center justify-center rounded-full text-5xl text-white text-opacity-40">
            <img
              className="mx-auto mt-5 h-[100px] w-[100px] rounded-md"
              src={'/cardinal-crosshair.svg'}
              alt={stakePool.stakePoolData.pubkey.toString()}
            />
          </div>
        </div>
      )}
    </>
  )
}
