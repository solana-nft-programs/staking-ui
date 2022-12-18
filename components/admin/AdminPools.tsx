import { shortPubKey } from '@cardinal/common'
import { LoadingSpinner } from 'common/LoadingSpinner'
import { withCluster } from 'common/utils'
import type { StakePool } from 'hooks/useAllStakePools'
import { useStakePoolsByAuthority } from 'hooks/useStakePoolsByAuthority'
import { useStakePoolsMetadatas } from 'hooks/useStakePoolsMetadata'
import { useWalletId } from 'hooks/useWalletId'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

export const AdminPools = () => {
  const router = useRouter()
  const walletId = useWalletId()
  const { environment } = useEnvironmentCtx()
  const stakePoolsByAuthority = useStakePoolsByAuthority()
  const stakePoolsMetadata = useStakePoolsMetadatas(
    stakePoolsByAuthority.data?.map((s) => s.pubkey)
  )
  const [stakePoolsWithMetadata, stakePoolsWithoutMetadata] = (
    stakePoolsByAuthority.data || []
  ).reduce(
    (acc, stakePoolData) => {
      const stakePoolMetadata = (stakePoolsMetadata.data || {})[
        stakePoolData.pubkey.toString()
      ]
      if (stakePoolMetadata) {
        return [[...acc[0], { stakePoolMetadata, stakePoolData }], acc[1]]
      }
      return [acc[0], [...acc[1], { stakePoolData }]]
    },
    [[] as StakePool[], [] as StakePool[]]
  )

  const allPoolds = stakePoolsWithMetadata.concat(stakePoolsWithoutMetadata)
  return (
    <div className="">
      {!walletId ? (
        <div className="my-16 flex items-center justify-center text-gray-500">
          Wallet not connected...
        </div>
      ) : !stakePoolsByAuthority.isFetched ? (
        <div className="my-16 flex items-center justify-center text-gray-500">
          <LoadingSpinner />
        </div>
      ) : allPoolds.length === 0 ? (
        <div className="my-16 flex items-center justify-center text-gray-500">
          No stake pools found...
        </div>
      ) : (
        <div className="grid-grid-cols-1 grid gap-5 py-10 md:grid-cols-3">
          {allPoolds.map((stakePool) => (
            <div
              key={stakePool.stakePoolData.pubkey.toString()}
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
          ))}
        </div>
      )}
    </div>
  )
}
