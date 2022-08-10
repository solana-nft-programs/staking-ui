import { useRewardDistributorData } from './useRewardDistributorData'
import { useQuery } from 'react-query'
import { useRewardEntries } from './useRewardEntries'
import { useRewardMintInfo } from './useRewardMintInfo'
import { BN } from '@project-serum/anchor'
import { useStakedTokenDatas } from './useStakedTokenDatas'

export const useRewardsRate = () => {
  const { data: rewardDistributorData } = useRewardDistributorData()
  const { data: stakedTokenData } = useStakedTokenDatas()
  const { data: rewardEntriesData } = useRewardEntries()
  const { data: rewardMintInfoData } = useRewardMintInfo()

  return useQuery<BN | undefined>(
    [
      'useRewardsRate',
      rewardDistributorData?.pubkey?.toString(),
      rewardEntriesData,
    ],
    async () => {
      const rewardDistibutorId = rewardDistributorData?.pubkey
      if (
        !rewardDistributorData ||
        !rewardEntriesData ||
        !rewardDistibutorId ||
        !rewardMintInfoData ||
        !stakedTokenData
      ) {
        return new BN(0)
      }

      let total = 0
      for (const stakedToken of stakedTokenData) {
        const amount = (
          rewardEntriesData
            ? rewardDistributorData.parsed.rewardAmount
                .mul(
                  rewardEntriesData.find((entry) =>
                    entry.parsed.stakeEntry.equals(
                      stakedToken.stakeEntry?.pubkey!
                    )
                  )?.parsed.multiplier ||
                    rewardDistributorData.parsed.defaultMultiplier
                )
                .div(
                  new BN(10).pow(
                    new BN(rewardDistributorData.parsed.multiplierDecimals)
                  )
                )
            : rewardDistributorData.parsed.rewardAmount
        )

          .mul(new BN(86400))
          .mul(rewardDistributorData.parsed.defaultMultiplier)
          .div(new BN(10 ** rewardDistributorData.parsed.multiplierDecimals))
          .div(rewardDistributorData.parsed.rewardDurationSeconds)
        total += Number(amount)
      }

      return total === 0
        ? rewardDistributorData.parsed.rewardAmount.mul(
            new BN(86400).div(
              rewardDistributorData.parsed.rewardDurationSeconds
            )
          )
        : new BN(total)
    }
  )
}
