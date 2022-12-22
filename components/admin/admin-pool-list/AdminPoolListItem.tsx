import { shortPubKey } from '@cardinal/common'
import { withCluster } from 'common/utils'
import type { StakePool } from 'hooks/useAllStakePools'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

export type AdminPoolListItemProps = {
  stakePool: StakePool
}

export const AdminPoolListItem = ({ stakePool }: AdminPoolListItemProps) => {
  const router = useRouter()
  const { environment } = useEnvironmentCtx()

  return (
    <div
      className="h-[300px] cursor-pointer rounded-lg bg-white bg-opacity-5 p-10 transition-all duration-100 hover:scale-[1.01]"
      onClick={() => {
        router.push(
          withCluster(
            `/admin/${
              stakePool.stakePoolMetadata?.name ||
              stakePool.stakePoolData.pubkey.toString()
            }`,
            environment.label
          )
        )
      }}
    >
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
    </div>
  )
}
