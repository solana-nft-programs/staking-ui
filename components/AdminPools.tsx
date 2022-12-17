import { pubKeyUrl, shortPubKey } from '@cardinal/common'
import type { StakePool } from 'hooks/useAllStakePools'
import { useStakePoolsByAuthority } from 'hooks/useStakePoolsByAuthority'
import { useStakePoolsMetadatas } from 'hooks/useStakePoolsMetadata'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

export const AdminPools = () => {
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

  return (
    <>
      <div className="text-2xl font-medium">My Stake Pools</div>
      <div className="grid grid-cols-3 gap-5 py-10">
        {stakePoolsWithMetadata
          .concat(stakePoolsWithoutMetadata)
          .map((stakePool) => (
            <div
              key={stakePool.stakePoolData.pubkey.toString()}
              className="h-[300px] cursor-pointer rounded-lg bg-white bg-opacity-5 p-10 transition-all duration-100 hover:scale-[1.01]"
              onClick={() => {
                window.open(
                  `/admin/${
                    stakePool.stakePoolMetadata?.name ||
                    stakePool.stakePoolData.pubkey.toString()
                  }${
                    environment.label !== 'mainnet-beta'
                      ? `?cluster=${environment.label}`
                      : ''
                  }`,
                  '_blank',
                  'noopener,noreferrer'
                )
              }}
            >
              {stakePool.stakePoolMetadata?.displayName ? (
                <div className="text-center font-bold">
                  {stakePool.stakePoolMetadata?.displayName}
                </div>
              ) : (
                <div className="text-center font-bold text-white">
                  <a
                    className="text-white"
                    target="_blank"
                    rel="noreferrer"
                    href={pubKeyUrl(
                      stakePool.stakePoolData.pubkey,
                      environment.label
                    )}
                  >
                    {shortPubKey(stakePool.stakePoolData.pubkey)}
                  </a>
                </div>
              )}
              <div className="text-gray text-center">
                <a
                  className="text-xs text-gray-500"
                  target="_blank"
                  rel="noreferrer"
                  href={pubKeyUrl(
                    stakePool.stakePoolData.pubkey,
                    environment.label
                  )}
                >
                  {shortPubKey(stakePool.stakePoolData.pubkey)}
                </a>
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
    </>
  )
}
