import { AccountData } from '@cardinal/common'
import { StakePoolData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { getAllStakePools } from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'
import { StakePoolMetadata, stakePoolMetadatas } from 'api/mapping'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'
import { useStakePoolId } from './useStakePoolId'

export type StakePool = {
  stakePoolMetadata?: StakePoolMetadata
  stakePoolData: AccountData<StakePoolData>
}

export const useAllStakePools = () => {
  const { secondaryConnection } = useEnvironmentCtx()
  const stakePoolId = useStakePoolId()
  return useQuery<
    | {
        stakePoolsWithMetadata: StakePool[]
        stakePoolsWithoutMetadata: StakePool[]
      }
    | undefined
  >(['useAllStakePools', stakePoolId?.toString()], async () => {
    const allStakePoolDatas = await getAllStakePools(secondaryConnection)
    const [stakePoolsWithMetadata, stakePoolsWithoutMetadata] =
      allStakePoolDatas.reduce(
        (acc, stakePoolData) => {
          const stakePoolMetadata = stakePoolMetadatas.find(
            (md) =>
              md.stakePoolAddress.toString() === stakePoolData.pubkey.toString()
          )
          if (stakePoolMetadata) {
            return [[...acc[0], { stakePoolMetadata, stakePoolData }], acc[1]]
          }
          return [acc[0], [...acc[1], { stakePoolData }]]
        },
        [[] as StakePool[], [] as StakePool[]]
      )
    return {
      stakePoolsWithMetadata: stakePoolsWithMetadata.sort((a, b) =>
        a
          .stakePoolMetadata!.name.toString()
          .localeCompare(b.stakePoolMetadata!.name.toString())
      ),
      stakePoolsWithoutMetadata: stakePoolsWithoutMetadata,
    }
  })
}
