import { shortPubKey } from '@cardinal/common'
import type { StakePool } from 'hooks/useAllStakePools'

export type ListViewItemContentProps = {
  stakePool: StakePool
}

export const ListViewItemContent = ({
  stakePool,
}: ListViewItemContentProps) => {
  const { stakePoolMetadata, stakePoolData } = stakePool
  return (
    <div className="flex">
      <div className="mr-8 flex items-center justify-center">
        <img
          className="mx-auto h-[36px] w-[36px] rounded-md"
          src={
            stakePoolMetadata?.imageUrl
              ? stakePoolMetadata.imageUrl
              : '/cardinal-crosshair.svg'
          }
          alt={
            stakePoolMetadata?.name
              ? stakePoolMetadata?.name
              : stakePoolData.pubkey.toString()
          }
        />
      </div>
      <div className="flex flex-col overflow-hidden">
        <div className="mb-1 truncate text-xl">
          {stakePoolMetadata?.displayName
            ? stakePoolMetadata.displayName
            : stakePoolData.pubkey.toString()}
        </div>
        <div className="text-gray text-xs text-gray-500">
          {shortPubKey(stakePoolData.pubkey)}
        </div>
      </div>
    </div>
  )
}
